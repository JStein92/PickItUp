<script src="http://localhost:8097" />;

import React, {useEffect} from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Home from './android/app/src/screens/Home';
import EditPost, {EditPostDetails} from './android/app/src/screens/EditPost';
import PostDetails from './android/app/src/screens/PostDetails';
import Camera from './android/app/src/screens/Camera';
import Profile from './android/app/src/screens/Profile';
import Activity from './android/app/src/screens/Activity';
// we will use these two screens later in our AppNavigator
import {Provider} from 'react-redux';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBar,
} from 'react-navigation-tabs';
import store from './android/app/src/redux';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  UIManager,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import auth from '@react-native-firebase/auth';
import appActions from './android/app/src/redux/actions/app';
import userActions from './android/app/src/redux/actions/user';
import {
  loginFB,
  loginGoogle,
} from './android/app/src/redux/actions/userAsyncActions';
import {ThemeProvider} from 'react-native-elements';
import {GoogleSigninButton} from '@react-native-community/google-signin';
let {setinitializing} = appActions;
let {setUser} = userActions;
const TabBarComponent = props => <MaterialTopTabBar {...props} />;

const NavStack = createMaterialTopTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: () => ({
        title: 'Home',
      }),
    },
    Activity: {
      screen: Activity,
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
        backgroundColor: '#1b3542',
      },
    },
  },
);

const RootStack = createStackNavigator(
  {
    NavStack: {
      screen: NavStack,
    },
    EditPost: {
      screen: EditPost,
    },
    EditPostDetails: {
      screen: EditPostDetails,
    },
    PostDetails: {
      screen: PostDetails,
    },
    Camera: {
      screen: Camera,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  },
);

const AppContainer = createAppContainer(RootStack);

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
    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null; // TODO add loader

  if (user && user.email) {
    return <AppContainer {...props} />;
  } else {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.loginButton, styles.facebookButton]}
          onPress={() => dispatch(loginFB())}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>
            Sign in with Facebook
          </Text>
        </TouchableOpacity>
        <GoogleSigninButton
          style={styles.loginButton}
          color={GoogleSigninButton.Color.Dark}
          onPress={() => dispatch(loginGoogle())}
          disabled={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loginButton: {
    height: 50,
    width: 300,
  },
  facebookButton: {
    color: 'white',
    borderRadius: 3,
    backgroundColor: '#4267B2',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 4,
    height: 45,
    width: 291,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const theme = {
  colors: {
    primary: '#1a936f',
    secondary: '#114b5f',
    tertiary: '#f3e9d2',
    header: '#779cab',
  },
  Button: {
    titleStyle: {
      color: 'white',
    },
    raised: true,
  },
};

function Wrapper(props) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App {...props} />
      </ThemeProvider>
    </Provider>
  );
}

export default Wrapper;
