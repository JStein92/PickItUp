import React, {useState} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import appActions from '../redux/actions/app';
import {addOrUpdatePickup} from '../redux/actions/appAsyncActions';
import {Dimensions} from 'react-native';
export default function PostDetails(props) {
  const {navigation} = props;
  let post = navigation.getParam('post');

  console.log(post);

  return (
    <View style={styles.root}>
      <Text>Pickup Details!</Text>
      <View
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          source={{uri: post.pickupData.photoURL}}
          style={{
            height: 60,
            width: 60,
            borderRadius: 100,
            marginHorizontal: 5,
          }}
        />
        <Text>Pickup by {post.pickupData.displayName}</Text>
      </View>
      <Image
        source={{uri: post.pickupData.image}}
        style={{height: 200, width: 200}}
      />
      <Button title={'Thanks!'} />
      <Button title={'Back'} onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 30,
  },
});
