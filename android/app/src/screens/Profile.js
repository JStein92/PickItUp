import React from 'react';
import {StyleSheet, Button, View, Text, Image} from 'react-native';
import {logoutFB} from '../redux/actions/userAsyncActions';
import {useDispatch, useSelector} from 'react-redux';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/auth';

const styles = StyleSheet.create({
  profileImage: {
    borderRadius: 100,
    height: 200,
    width: 200,
    borderWidth: 5,
    marginVertical: 10,
    borderColor: 'silver',
  },
  center: {
    alignItems: 'center',
  },
});

export default function Profile() {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user);
  return (
    <View>
      <View style={styles.center}>
        <Text>Welcome, {user.displayName}</Text>
        <Image
          source={{uri: `${user.photoURL}?height=400`}}
          style={styles.profileImage}
        />
      </View>
      <Button title={'Log out'} onPress={() => dispatch(logoutFB())} />
    </View>
  );
}
