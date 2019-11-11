import React, {useEffect} from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Home from './android/app/src/screens/Home';
import Profile from './android/app/src/screens/Profile';
import List from './android/app/src/screens/List';
import {View, Text, Button} from 'react-native';
// we will use these two screens later in our AppNavigator
import {Provider} from 'react-redux';
import {useDispatch, useSelector} from 'react-redux';
import auth from '@react-native-firebase/auth';
import store from './android/app/src/redux';
import appActions from './android/app/src/redux/actions/app';
import userActions from './android/app/src/redux/actions/user';
import {
  loginFB,
  logoutFB,
} from './android/app/src/redux/actions/userAsyncActions';

let {setinitializing} = appActions;
let {setUser} = userActions;

const AppNavigator = createStackNavigator(
  {
    Home,
    Profile,
    List,
  },
  {
    initialRouteName: 'Home',
  },
);

// TODO implement navigation
const AppContainer = createAppContainer(AppNavigator);

function App() {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user);
  const {initializing} = useSelector(state => state.app);

  // Handle user state changes
  function onAuthStateChanged(user) {
    dispatch(setUser(user));
    if (initializing) {
      dispatch(setinitializing(false));
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <View>
      {!user ? (
        <View>
          <Button
            title={'Log in with Facebook'}
            onPress={() => dispatch(loginFB())}
          />
        </View>
      ) : (
        <View>
          <Text>Welcome {user.email}</Text>
          <Button title={'Log out'} onPress={() => dispatch(logoutFB())} />
        </View>
      )}
    </View>
  );
}

function Wrapper(props) {
  return (
    <Provider store={store}>
      <App {...props} />
    </Provider>
  );
}

export default Wrapper;
