import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableHighlight} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import appActions from '../redux/actions/app';
import {Marker} from 'react-native-maps';
import FastImage from 'react-native-fast-image';

export default function MapMarker(props) {
  const {marker} = props;
  const dispatch = useDispatch();

  const [initialRender, setInitialRender] = useState(true);
  const [isSelected, setIsSelected] = useState(true);
  const {selectedMarker} = useSelector(state => state.app);

  function selectMarker() {
    dispatch(appActions.setSelectedMarker(marker));
    dispatch(appActions.setFollowUserLocation(false));
  }

  useEffect(() => {
    if (selectedMarker && selectedMarker.id === marker.id) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [selectedMarker, marker.id]);

  return (
    <Marker
      tracksViewChanges={false}
      key={`${marker.id} ${isSelected}`}
      onPress={() => selectMarker(marker)}
      coordinate={{
        latitude: marker.pickupData.location.latitude,
        longitude: marker.pickupData.location.longitude,
      }}>
      <TouchableHighlight
        style={[
          {
            borderColor: isSelected ? 'green' : 'black',
          },
          styles.markerContainer,
        ]}>
        <FastImage
          source={{
            uri: marker.pickupData.image,
          }}
          onLoadEnd={() => setInitialRender(false)}
          key={initialRender}
          fallback={marker.pickupData.image}
          style={styles.markerImage}
        />
      </TouchableHighlight>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    borderRadius: 100,
    borderWidth: 2,
    elevation: 3,
  },
  markerImage: {
    height: 30,
    width: 30,
    borderRadius: 100,
  },
});
