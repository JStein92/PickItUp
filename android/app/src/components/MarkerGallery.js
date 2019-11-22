import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Button,
  TouchableOpacity,
  Text,
  FlatList,
  Dimensions,
  View,
  Image,
} from 'react-native';
import DoubleTap from '../components/DoubleTap';
export default function MarkerGallery(props) {
  const {markers, handleSelectMarker} = props;
  const [selectedMarker, setSelectedMarker] = useState({});

  function selectMarker(marker) {
    setSelectedMarker(marker);
    handleSelectMarker(marker);
  }

  if (!markers.length) {
    return null;
  }

  function Item({marker}) {
    return (
      <DoubleTap
        onPress={() => selectMarker(marker)}
        onDoubleTap={() =>
          props.navigation.navigate('PostDetails', {post: marker})
        }>
        <View
          style={{
            height: 60,
            backgroundColor: '#e8e8e8',
            width: Dimensions.get('screen').width,
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              style={styles.userImage}
              source={{uri: marker.pickupData.photoURL}}
            />
            <Text style={styles.title}>{marker.pickupData.displayName}</Text>
          </View>
          <Text style={styles.title}>
            {new Date(marker.pickupData.timestamp.nanoseconds * 1000).getDate()}
          </Text>
          <Image style={styles.image} source={{uri: marker.pickupData.image}} />
        </View>
      </DoubleTap>
    );
  }

  return (
    <View style={styles.markerListContainer}>
      <FlatList
        data={markers}
        renderItem={({item}) => <Item marker={item} />}
        keyExtractor={item => item.id}
        extraData={selectedMarker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: 60,
    height: 60,
  },
  userImage: {
    width: 50,
    marginHorizontal: 5,
    height: 50,
    borderRadius: 100,
  },
  markerListContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    maxHeight: 110,
    bottom: 0,
  },
});
