import {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import store from '../index';
import uuid from 'uuid/v4'; // Import UUID to generate UUID

export function addOrUpdatePickup() {
  return async function(dispatch) {
    let {user} = store.getState().user;
    let {currentImage} = store.getState().app;
    const userPickupsRef = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('pickups')
      .doc();

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
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
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
            console.log('File available at', downloadURL);
            addToDB(downloadURL);
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
            id: user.uid,
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
