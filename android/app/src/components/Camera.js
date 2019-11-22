import React, {useState} from 'react';
import {
  Button,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RNCamera} from 'react-native-camera';
import appActions from '../redux/actions/app';
import ImagePicker from 'react-native-image-crop-picker';

export default function CameraComponent(props) {
  let camera;
  const dispatch = useDispatch();
  let [type, setType] = useState(RNCamera.Constants.Type.back);

  const flipCamera = () => {
    if (type === RNCamera.Constants.Type.back) {
      setType(RNCamera.Constants.Type.front);
    } else {
      setType(RNCamera.Constants.Type.back);
    }
  };

  const cropData = {
    offset: {x: 0, y: 0},
    size: {width: 300, height: 300},
    displaySize: {width: 300, height: 300},
    resizeMode: 'cover',
  };

  const takePicture = async () => {
    const options = {quality: 0.5, base64: false};
    const data = await camera.takePictureAsync(options);

    ImagePicker.openCropper({
      path: data.uri,
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      console.log(image);
      image.uri = image.path;
      dispatch(appActions.setShowCamera(false));
      dispatch(appActions.setCurrentImage(image));
      props.navigation.navigate('EditPost');
    });
  };

  // TODO add way to crop image

  return (
    <View style={styles.container}>
      <View style={styles.topButtons}>
        <TouchableOpacity style={styles.flipButton}>
          <Button onPress={() => flipCamera()} title={'flip'} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <RNCamera
          ref={ref => {
            camera = ref;
          }}
          style={styles.preview}
          type={type}
          flashMode={RNCamera.Constants.FlashMode.auto}
        />
        <TouchableOpacity
          onPress={() => takePicture()}
          title={'SNAP'}
          style={styles.capture}>
          <Text>Snap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: 'white',
  },
  preview: {
    width: Dimensions.get('screen').width,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topButtons: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  capture: {
    zIndex: 1,
    bottom: -80,
    height: 90,
    width: 90,
    color: 'white',
    borderRadius: 100,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButton: {
    zIndex: 1,
  },
});
