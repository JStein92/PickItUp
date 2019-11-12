import React, {useEffect, useState} from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Home from './android/app/src/screens/Home';
import Profile from './android/app/src/screens/Profile';
import List from './android/app/src/screens/List';
// we will use these two screens later in our AppNavigator
import {Provider} from 'react-redux';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBar,
} from 'react-navigation-tabs';
import store from './android/app/src/redux';

import {Button, View, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import auth from '@react-native-firebase/auth';
import appActions from './android/app/src/redux/actions/app';
import userActions from './android/app/src/redux/actions/user';
import {
  loginFB,
  logoutFB,
} from './android/app/src/redux/actions/userAsyncActions';
import yargsParser from 'yargs-parser';

let {setinitializing} = appActions;
let {setUser} = userActions;

const TabBarComponent = props => <MaterialTopTabBar {...props} />;

const NavHome = createMaterialTopTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: () => ({
        title: 'Home',
      }),
    },
    List: {
      screen: List,
      navigationOptions: () => ({
        title: 'Activity',
      }),
    },
    Profile: {
      screen: Profile,
      navigationOptions: () => ({
        title: 'Profile',
      }),
    },
  },
  {
    tabBarComponent: props => <TabBarComponent {...props} />,
    tabBarOptions: {
      style: {
        backgroundColor: '#6b52ae',
      },
    },
  },
);

const AppContainer = createAppContainer(NavHome);

function App(props) {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user);
  const {initializing} = useSelector(state => state.app);

  // Handle user state changes
  function onAuthStateChanged(newUser) {
    dispatch(setUser(newUser));
    if (initializing) {
      dispatch(setinitializing(false));
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null; // TODO add loader

  if (user && user.email) {
    return <AppContainer {...props} />;
  } else {
    return (
      <View>
        <Button
          title={'Log in with Facebook'}
          onPress={() => dispatch(loginFB())}
        />
      </View>
    );
  }
}

function Wrapper(props) {
  return (
    <Provider store={store}>
      <App {...props} />
    </Provider>
  );
}

export default Wrapper;
