import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import {ThemeContext, Icon, Image, Button} from 'react-native-elements';
import appActions from '../redux/actions/app';
import {useDispatch, useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';

export default function MarkerGallery(props) {
  const {selectedMarker} = useSelector(state => state.app);
  const {theme} = useContext(ThemeContext);

  if (!selectedMarker) {
    return null;
  }

  return (
    <View style={styles.containerInner}>
      <FastImage
        style={styles.image}
        source={{
          uri: selectedMarker.pickupData.image,
        }}
      />
      <View style={{}}>
        <Text style={styles.text}>{selectedMarker.pickupData.displayName}</Text>
        <Text style={styles.text}>{selectedMarker.pickupData.description}</Text>
        <FastImage
          style={styles.userImage}
          source={{
            uri: selectedMarker.pickupData.photoURL,
          }}
        />
        <Text style={styles.text}>
          {moment
            .unix(selectedMarker.pickupData.timestamp.seconds)
            .format('MM/DD/YYYY')}
        </Text>
      </View>
      <View style={{alignSelf: 'center'}}>
        <Button
          title={'Details ->'}
          onPress={() =>
            props.navigation.navigate('PostDetails', {
              post: selectedMarker,
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: 'black',
    fontWeight: 'bold',
  },
  containerInner: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'space-between',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    height: '30%',
    elevation: 10,
  },
  image: {
    width: '45%',
    height: '100%',
    alignSelf: 'center',
    elevation: 5,
  },
  userImage: {
    width: 75,
    marginHorizontal: 5,
    height: 75,
    elevation: 4,
    borderRadius: 100,
  },
  markerListContainer: {
    position: 'absolute',
    bottom: 0,
    paddingTop: 20,
    right: 0,
    left: 0,
    flex: 1,
    backgroundColor: 'rgba(244, 244, 244, .4)',
  },
});
