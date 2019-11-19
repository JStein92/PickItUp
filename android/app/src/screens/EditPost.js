import React, {useState} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import appActions from '../redux/actions/app';
import {addOrUpdatePickup} from '../redux/actions/appAsyncActions';
import Image from 'react-native-scalable-image';
import {Dimensions} from 'react-native';
export default function EditPost(props) {
  const {currentImage} = useSelector(state => state.app);

  const dispatch = useDispatch();

  const retake = () => {
    props.navigation.navigate('Home');
    dispatch(appActions.setShowCamera(true));
    dispatch(appActions.setCurrentImage(null));
  };
  const cancel = () => {
    props.navigation.navigate('Home');
    dispatch(appActions.setShowCamera(false));
    dispatch(appActions.setCurrentImage(null));
  };
  const post = () => {
    props.navigation.navigate('Home');
    dispatch(appActions.setShowCamera(false));
    dispatch(addOrUpdatePickup());
  };

  return currentImage ? (
    <View style={styles.root}>
      <Text>Edit Post</Text>
      <Image source={{uri: currentImage.uri}} width={300} height={300} />
      <Button title={'Retake'} onPress={() => retake()} />
      <Button title={'Cancel'} onPress={() => cancel()} />
      <Button title={'Post'} onPress={() => post()} />
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  root: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
