import {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import store from '../index';
import uuid from 'uuid/v4'; // Import UUID to generate UUID
import {ToastAndroid} from 'react-native';
import appActions from '../actions/app';

export function getPickups() {
  return async function(dispatch) {
    const pickups = firestore().collection('pickups');

    const snapshot = await pickups.get();
    let newMarkers = [];

    snapshot.forEach(doc => {
      let pickupData = doc.data();
      let newMarker = {
        pickupData,
        id: doc.id,
      };

      newMarkers.push(newMarker);
    });

    let uniq = {};
    // For dev only - remove identical markers so hot module refresh doesn't show key value warnings
    var arrFiltered = newMarkers.filter(
      obj => !uniq[obj.id] && (uniq[obj.id] = true),
    );

    dispatch(appActions.setMarkers(arrFiltered));
    dispatch(appActions.setSelectedMarker(null));
  };
}

export function likePickup(id) {
  return async function(dispatch) {
    let {user} = store.getState().user;

    try {
      let doc = firestore()
        .collection('pickups')
        .doc(id);

      await doc.get().then(snapshot => {
        let data = snapshot.data();

        if (data.likes && data.likes.find(like => like.uid === user.uid)) {
          doc.update(
            'likes',
            firestore.FieldValue.arrayRemove({
              displayName: user.displayName,
              image: user.photoURL,
              uid: user.uid,
            }),
          );
        } else {
          doc.update(
            'likes',
            firestore.FieldValue.arrayUnion({
              displayName: user.displayName,
              image: user.photoURL,
              uid: user.uid,
            }),
          );
        }
      });
    } catch (err) {
      console.warn(err, 'pickup like failed');
    }
  };
}

export function deletePickup(id) {
  return async function(dispatch) {
    // let {user} = store.getState().user;

    try {
      firestore()
        .collection('pickups')
        .doc(id)
        .delete()
        .then(() => {
          ToastAndroid.show('Pickup deleted!', ToastAndroid.SHORT);
          dispatch(getPickups());
        });
    } catch (err) {
      console.warn('could not delete', err);
      dispatch(getPickups());
    }
  };
}

export function addOrUpdatePickup() {
  return async function(dispatch) {
    let {user} = store.getState().user;
    let {currentImage} = store.getState().app;

    const ext = currentImage.uri.split('.').pop(); // Extract image extension
    const filename = `${uuid()}.${ext}`; // Generate unique name

    var metadata = {
      contentType: 'image/jpeg',
    };

    let storageRef = storage().ref();

    let uploadTask = storageRef
      .child(`pickupImages/${filename}`)
      .putFile(currentImage.uri, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            break;
        }
      },
      function(error) {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;

          case 'storage/canceled':
            // User canceled the upload
            break;

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      function() {
        // Upload completed successfully, now we can get the download URL
        storageRef
          .child(`pickupImages/${filename}`)
          .getDownloadURL()
          .then(function(downloadURL) {
            addToDB(downloadURL);
            dispatch(getPickups());
          });
      },
    );

    async function addToDB(downloadURL) {
      try {
        let globalKey = uuid();

        const globalPickupsRef = firestore()
          .collection('pickups')
          .doc(globalKey);

        globalPickupsRef.set(
          {
            image: downloadURL,
            timestamp: firestore.Timestamp.fromDate(new Date(Date.now())),
            displayName: user.displayName,
            photoURL: user.photoURL,
            id: globalKey,
            uid: user.uid,
            description: currentImage.description,
            types: currentImage.types,
            amount: currentImage.amount,
            flagged: currentImage.flagged,
            location: new firestore.GeoPoint(
              currentImage.location.latitude,
              currentImage.location.longitude,
            ),
          },
          {merge: true},
        );
      } catch (err) {
        console.warn('User could not be added', err);
      }
    }
  };
}
