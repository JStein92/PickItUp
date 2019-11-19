import React, {useState, useEffect, forwardRef, useRef} from 'react';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  CalloutSubview,
} from 'react-native-maps';
import {View, StyleSheet, Text, Button, Image} from 'react-native';
import userActions from '../redux/actions/user';
let {setLocation} = userActions;
import {useDispatch, useSelector} from 'react-redux';
import RNLocation from 'react-native-location';

export default function Map(props) {
  let {
    onRegionChangeComplete,
    markers,
    selectedMarker,
    currentRegion,
    delesectMarkers,
  } = props;
  const dispatch = useDispatch();
  const {location} = useSelector(state => state.user);
  const [followUserLocation, setFollowUserLocation] = useState(true);

  let markerRefs = {};
  let map; // map ref
  const defaultZoom = 0.0015;

  useEffect(() => {
    RNLocation.configure({
      desiredAccuracy: {
        ios: 'best',
        android: 'highAccuracy',
      },
      interval: 2000,
      maxWaitTime: 2000,
    });

    RNLocation.getLatestLocation({timeout: 50000}).then(firstLocation => {
      dispatch(
        setLocation({
          latitude: firstLocation.latitude,
          longitude: firstLocation.longitude,
          longitudeDelta: defaultZoom,
          latitudeDelta: defaultZoom,
        }),
      );
    });
  }, []);

  useEffect(() => {
    if (selectedMarker && markerRefs[selectedMarker.id]) {
      markerRefs[selectedMarker.id].showCallout();
      const newRegion = selectedMarker.pickupData.location;
      dispatch(
        setLocation({
          latitude: newRegion.latitude,
          longitude: newRegion.longitude,
          longitudeDelta: defaultZoom,
          latitudeDelta: defaultZoom,
        }),
      );
      map.animateToRegion(
        {
          latitude: newRegion.latitude,
          longitude: newRegion.longitude,
          latitudeDelta: currentRegion.latitudeDelta,
          longitudeDelta: currentRegion.longitudeDelta,
        },
        100,
      );
    } else {
      Object.values(markerRefs).forEach(ref => {
        ref.hideCallout();
      });
    }
  }, [selectedMarker]);

  // TODO: Write firestore cloud function that watches all user pickup collections
  // on delete, delete the global pickup

  function userLocationChanged(event) {
    const newRegion = event.nativeEvent.coordinate;
    dispatch(
      setLocation({
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
        longitudeDelta: defaultZoom,
        latitudeDelta: defaultZoom,
      }),
    );
    animateToRegion();
  }

  function animateToRegion() {
    if (map) {
      map.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: defaultZoom,
        longitudeDelta: defaultZoom,
      });
    }
  }

  function onDrag() {
    setFollowUserLocation(false);
  }

  function selectMarker(marker, e) {
    setFollowUserLocation(false);
  }

  function pressCallout() {
    console.log('press callout');
  }
  // TODO: CUSTOM MARKERS WITH FADEIN ANIMATION

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          showsUserLocation
          showsMyLocationButton={true}
          loadingEnabled
          onUserLocationChange={event =>
            followUserLocation && userLocationChanged(event)
          }
          followUserLocation={followUserLocation}
          ref={ref => (map = ref)}
          onMoveShouldSetResponder={onDrag}
          onPanDrag={delesectMarkers}
          onRegionChangeComplete={onRegionChangeComplete}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: defaultZoom,
            longitudeDelta: defaultZoom,
          }}>
          {markers.map(marker => (
            <Marker
              tracksInfoWindowChanges={false}
              tracksViewChanges={false}
              centerOffset={{x: 10, y: 0}}
              ref={ref => (markerRefs[marker.id] = ref)}
              key={marker.id}
              onPress={e => selectMarker(marker)}
              coordinate={{
                latitude: marker.pickupData.location.latitude,
                longitude: marker.pickupData.location.longitude,
              }}>
              <Image
                style={styles.markerImage}
                source={{uri: marker.pickupData.image}}
              />
              <Callout
                style={{flex: 1, width: 125, height: 50, position: 'absolute'}}
                tooltip={true}>
                <Button title={'View details'} />
              </Callout>
              {/* TODO: Show modal here instead of native callout */}
            </Marker>
          ))}
        </MapView>
      ) : (
        // TODO: show loader
        <Text>getting location...</Text>
      )}
      {location && !followUserLocation ? (
        <View style={styles.resetLocation}>
          <Button
            onPress={() => {
              setFollowUserLocation(true);
            }}
            title={'Me'}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  markerImage: {
    height: 36,
    width: 36,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'green',
  },
  selectedMarkerImage: {
    height: 38,
    width: 38,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'purple',
  },
  profileImage: {
    height: 50,
    width: 50,
  },
  resetLocation: {
    position: 'absolute',
    width: 50,
    height: 50,
    right: 10,
    top: 10,
    opacity: 0.75,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
  },
});
