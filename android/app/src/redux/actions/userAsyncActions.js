import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {firebase} from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import appActions from './app';
import firestore from '@react-native-firebase/firestore';
import store from '../index';
import {PermissionsAndroid} from 'react-native';
import {throwError} from 'rxjs';

export function logoutFB() {
  return async function(dispatch) {
    firebase.auth().signOut();
  };
}

export function requestPermissions() {
  return async function(dispatch) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: 'PickItUp needs permission to use your location',
          message:
            'PickItUp needs access to your location so we can show your trash pickups on the map!',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        return;
      } else {
        console.log('Camera permission denied');
        throwError('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
}

export function addOrUpdateUser() {
  return async function(dispatch) {
    let {user} = store.getState().user;
    const ref = firestore()
      .collection('users')
      .doc(user.uid);
    try {
      await ref.set(
        {
          displayName: user.displayName,
          email: user.email,
          image: user.photoURL + '?height=400',
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime,
        },
        {merge: true},
      );
    } catch (err) {
      console.warn('User could not be added', err);
    }
  };
}

export function loginFB() {
  return async function(dispatch) {
    let {setInitializing} = appActions;
    try {
      dispatch(requestPermissions());
      dispatch(setInitializing(true));

      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        throw new Error('User cancelled the login process');
      }

      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw new Error('Something went wrong obtaining access token');
      }

      const credential = firebase.auth.FacebookAuthProvider.credential(
        data.accessToken,
      );
      await firebase.auth().signInWithCredential(credential);
      dispatch(addOrUpdateUser());

      dispatch(setInitializing(false));
    } catch (err) {
      dispatch(setInitializing(false));
    }
  };
}

// TODO allow registration with email
const register = async (email, password) => {
  try {
    await auth().createUserWithEmailAndPassword(email, password);
  } catch (e) {
    console.error(e.message);
  }
};
