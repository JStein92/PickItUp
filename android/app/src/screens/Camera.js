import React, {useState} from 'react';
import {TouchableOpacity, View, StyleSheet, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RNCamera} from 'react-native-camera';
import appActions from '../redux/actions/app';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import MatIcon from 'react-native-vector-icons/dist/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';

export default function CameraComponent(props) {
  let camera;
  const dispatch = useDispatch();
  let [type, setType] = useState(RNCamera.Constants.Type.back);
  const {isWalking} = useSelector(state => state.app);

  const flipCamera = () => {
    if (type === RNCamera.Constants.Type.back) {
      setType(RNCamera.Constants.Type.front);
    } else {
      setType(RNCamera.Constants.Type.back);
    }
  };

  const takePicture = async () => {
    const options = {quality: 0.75, base64: false};
    const data = await camera.takePictureAsync(options);

    Geolocation.getCurrentPosition(
      async position => {
        try {
          const image = await ImagePicker.openCropper({
            path: data.uri,
            width: 300,
            height: 300,
            cropping: true,
          });
          image.uri = image.path;
          image.location = position.coords;
          dispatch(appActions.setCurrentImage(image));
          props.navigation.navigate('EditPost');
        } catch (err) {
          console.log('crop error', err);
          // cancelling image crop throws an error, so we handle it here
        }
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  console.log(isWalking);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.flipButton} onPress={() => flipCamera()}>
        <Icon name="md-reverse-camera" size={40} color={'white'} />
      </TouchableOpacity>

      <RNCamera
        ref={ref => {
          camera = ref;
        }}
        style={styles.preview}
        type={type}
        captureAudio={false}
        flashMode={RNCamera.Constants.FlashMode.auto}
      />
      <View style={{alignItems: 'center'}}>
        {isWalking && (
          <Text style={styles.walkingText}>
            Take a picture to go with your walk!
          </Text>
        )}
      </View>
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity onPress={() => takePicture()} style={styles.capture}>
          <MatIcon name="camera" size={70} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    position: 'absolute',
    bottom: 40,
    elevation: 3,
    borderRadius: 100,
    backgroundColor: 'rgba(144,144,144, .5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  walkingText: {
    position: 'absolute',
    bottom: 0,
    textAlign: 'center',
    elevation: 1,
    padding: 7,
    width: '100%',
    backgroundColor: 'rgba(250,250,250, .5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});
