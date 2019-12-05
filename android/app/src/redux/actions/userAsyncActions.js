import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {firebase} from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import appActions from './app';
import firestore from '@react-native-firebase/firestore';
import store from '../index';
import {PermissionsAndroid} from 'react-native';
import {throwError} from 'rxjs';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';

let {setInitializing} = appActions;

export function logoutFB() {
  return async function(dispatch) {
    firebase.auth().signOut();
  };
}

export function loginGoogle() {
  return async function(dispatch) {
    try {
      dispatch(requestPermissions());
      dispatch(setInitializing(true));

      await GoogleSignin.configure({
        webClientId:
          '539818365480-kg4kss2s19jfinqu32otkum0vsphv0s6.apps.googleusercontent.com',
      });

      const {accessToken, idToken} = await GoogleSignin.signIn();
      const credential = firebase.auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );
      await firebase.auth().signInWithCredential(credential);
      dispatch(addOrUpdateUser());
      dispatch(setInitializing(false));
    } catch (error) {
      dispatch(setInitializing(false));
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // TODO: Error toast
        // user has not signed in yet
      } else {
        // some other error
        console.warn(error, 'google sign in failed');
      }
    }
  };
}

export function requestPermissions() {
  return async function(dispatch) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'PickItUp needs permission to use your location',
          message:
            'PickItUp needs access to your location so we can show your trash pickups on the map!',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return;
      } else {
        throwError('Location permission denied');
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
const registerWithEmail = async (email, password) => {
  try {
    await auth().createUserWithEmailAndPassword(email, password);
  } catch (e) {
    console.error(e.message);
  }
};
