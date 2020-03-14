import React, {useState} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import appActions from '../redux/actions/app';
import {addOrUpdatePickup} from '../redux/actions/appAsyncActions';
import {Dimensions} from 'react-native';
import {Button} from 'react-native-elements';
import moment from 'moment';
import Like from '../components/Like';
export default function PostDetails(props) {
  const {navigation} = props;
  let post = navigation.getParam('post');

  return (
    <View style={styles.root}>
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
            height: 50,
            width: 50,
            borderRadius: 100,
            marginHorizontal: 20,
            marginVertical: 10,
          }}
        />
        <View>
          <Text>{post.pickupData.displayName}</Text>
          <Text>
            {moment
              .unix(post.pickupData.timestamp.seconds)
              .format('MM/DD/YYYY')}
          </Text>
        </View>
      </View>
      <Image
        source={{uri: post.pickupData.image}}
        resizeMode="cover"
        style={{width: null, height: 300}}
      />
      <Like pickup={post} style={{marginVertical: 10, marginHorizontal: 10}} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-start',
  },
});
