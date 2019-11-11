import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {firebase} from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import appActions from './app';

export function logoutFB() {
  return async function(dispatch) {
    firebase.auth().signOut();
  };
}

export function loginFB() {
  return async function(dispatch) {
    let {setInitializing} = appActions;
    try {
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

      dispatch(setInitializing(false));
    } catch (err) {
      dispatch(setInitializing(false));
    }
  };
}

//TODO add/update user data to firestore on log in

// TODO allow registration with email
const register = async (email, password) => {
  try {
    await auth().createUserWithEmailAndPassword(email, password);
  } catch (e) {
    console.error(e.message);
  }
};
