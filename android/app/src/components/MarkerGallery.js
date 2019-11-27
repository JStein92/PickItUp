import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  View,
  Animated,
  Image,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import DoubleTap from '../components/DoubleTap';
import moment from 'moment';
import {ThemeContext} from 'react-native-elements';
export default function MarkerGallery(props) {
  const {markers, handleSelectMarker} = props;
  const [selectedMarker, setSelectedMarker] = useState({});
  const [showGallery, setShowGallery] = useState(true);

  function selectMarker(marker) {
    setSelectedMarker(marker);
    handleSelectMarker(marker);
  }

  const {theme} = useContext(ThemeContext);

  if (!markers.length) {
    return null;
  }

  function Item({marker, index}) {
    return (
      <DoubleTap
        onPress={() => selectMarker(marker)}
        onDoubleTap={() =>
          props.navigation.navigate('PostDetails', {post: marker})
        }>
        <View
          style={[
            {
              backgroundColor:
                index % 2 === 0 ? theme.colors.primary : theme.colors.secondary,
            },

            styles.container,
          ]}>
          <View style={styles.containerInner}>
            <Image
              style={styles.userImage}
              source={{
                uri: marker.pickupData.photoURL,
              }}
            />
            <Text style={styles.text}>{marker.pickupData.displayName}</Text>
          </View>
          <Text style={styles.text}>
            {moment
              .unix(marker.pickupData.timestamp.seconds)
              .format('MM/DD/YYYY')}
          </Text>
          <Image
            style={styles.image}
            source={{
              uri: marker.pickupData.image,
            }}
          />
        </View>
      </DoubleTap>
    );
  }

  return (
    <View
      style={[styles.markerListContainer, {maxHeight: showGallery ? 220 : 38}]}>
      <View
        style={{
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            elevation: 5,
            position: 'absolute',
            top: -20,
            justifyContent: 'center',
            alignItems: 'center',
            height: 35,
            width: 35,
            borderRadius: 100,
            zIndex: 3,
            backgroundColor: 'lightgrey',
          }}
          onPress={() => {
            setShowGallery(!showGallery);
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut,
            );
          }}>
          <Text>{showGallery ? 'V' : '^'}</Text>
        </TouchableOpacity>
        <FlatList
          data={markers}
          renderItem={({item, index}) => <Item marker={item} index={index} />}
          keyExtractor={item => item.id}
          extraData={selectedMarker}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
  container: {
    height: 61,
    width: Dimensions.get('screen').width,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 61,
  },
  userImage: {
    width: 50,
    marginHorizontal: 5,
    height: 50,
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
