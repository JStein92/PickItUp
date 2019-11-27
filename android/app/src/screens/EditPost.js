import React, {useState} from 'react';
import {
  AppRegistry,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import appActions from '../redux/actions/app';
import {addOrUpdatePickup} from '../redux/actions/appAsyncActions';
import Image from 'react-native-scalable-image';
import {Dimensions} from 'react-native';
import {Formik} from 'formik';
import {Button} from 'react-native-elements';

export default function EditPost(props) {
  const {currentImage} = useSelector(state => state.app);

  const dispatch = useDispatch();

  const retake = () => {
    props.navigation.navigate('Camera');
    dispatch(appActions.setCurrentImage(null));
  };
  const cancel = () => {
    props.navigation.navigate('Home');
    dispatch(appActions.setCurrentImage(null));
  };
  const post = () => {
    props.navigation.navigate('Home');
    dispatch(addOrUpdatePickup());
  };

  const onPress = () => {
    console.log('press');
  };

  return currentImage ? (
    <View style={styles.container}>
      <Text>Edit Post</Text>
      <Image source={{uri: currentImage.uri}} width={300} height={300} />
      <Formik
        initialValues={{title: 'My Pickup'}}
        onSubmit={values => console.log(values)}>
        {({handleChange, handleBlur, handleSubmit, values}) => (
          <View>
            <TextInput
              placeholder={'Enter a title (ex. "My Pickup")'}
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              value={values.title}
            />
            <Button onPress={handleSubmit} title="Submit" />
          </View>
        )}
      </Formik>

      <Button title={'Retake'} onPress={() => retake()} />
      <Button title={'Cancel'} onPress={() => cancel()} />
      <Button title={'Post'} onPress={() => post()} />
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});
