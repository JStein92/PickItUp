import React, {useEffect} from 'react';
import {PROVIDER_GOOGLE} from 'react-native-maps';
import {View, StyleSheet, Text, Animated} from 'react-native';
import userActions from '../redux/actions/user';
let {setLocation} = userActions;
import {useDispatch, useSelector} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import appActions from '../redux/actions/app';
import MapView from 'react-native-map-clustering';
import {Polyline} from 'react-native-maps';
import {getPickups} from '../redux/actions/appAsyncActions';

export default function Map(props) {
  let {onRegionChangeComplete, markers, delesectMarkers, coordinates} = props;
  const dispatch = useDispatch();

  const {location} = useSelector(state => state.user);
  const {selectedMarker} = useSelector(state => state.app);
  const {followUserLocation} = useSelector(state => state.app);

  let map; // map ref
  const defaultZoom = 0.0025;

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        dispatch(
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            longitudeDelta: defaultZoom,
            latitudeDelta: defaultZoom,
          }),
        );
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  }, []);

  function goToRegion(region) {
    map.animateToRegion(
      {
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: defaultZoom,
        longitudeDelta: defaultZoom,
      },
      50,
    );
  }

  useEffect(() => {
    if (selectedMarker) {
      const newRegion = selectedMarker.pickupData.location;
      map.animateToRegion({
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
        latitudeDelta: location.latitudeDelta,
        longitudeDelta: location.longitudeDelta,
      });
      dispatch(appActions.setFollowUserLocation(false));
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
    if (followUserLocation) {
      goToRegion(newRegion);
    }
  }

  function centerOnUser() {
    Geolocation.getCurrentPosition(position => {
      if (map) {
        goToRegion(position.coords);
      }
      delesectMarkers();
      dispatch(appActions.setFollowUserLocation(true));
    });
  }

  function onDrag() {
    dispatch(appActions.setFollowUserLocation(false));
  }

  // TODO: CUSTOM MARKERS WITH FADEIN ANIMATION

  return (
    <Animated.View style={styles.container}>
      {location ? (
        <MapView
          showsUserLocation
          showsMyLocationButton={false}
          loadingEnabled
          minZoom={0}
          onUserLocationChange={event =>
            followUserLocation && userLocationChanged(event)
          }
          followUserLocation={followUserLocation}
          mapRef={ref => (map = ref)}
          clusteringEnabled={true}
          onMoveShouldSetResponder={onDrag}
          onPanDrag={delesectMarkers}
          onPress={delesectMarkers}
          onRegionChangeComplete={region => {
            onRegionChangeComplete(region);
            dispatch(
              setLocation({
                latitude: region.latitude,
                longitude: region.longitude,
                longitudeDelta: region.longitudeDelta,
                latitudeDelta: region.latitudeDelta,
              }),
            );
          }}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          showsCompass={true}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: defaultZoom,
            longitudeDelta: defaultZoom,
          }}>
          {markers}
          <Polyline
            strokeWidth={2}
            lineCap="square"
            strokeColor={'green'}
            coordinates={coordinates}
          />
        </MapView>
      ) : (
        // TODO: show loader
        <Text>getting location...</Text>
      )}
      <View style={styles.refresh}>
        <Button
          buttonStyle={{
            backgroundColor: 'white',
            borderRadius: 100,
            elevation: 2,
          }}
          onPress={() => dispatch(getPickups())}
          icon={<Icon name="refresh" size={25} color={'black'} />}
        />
      </View>
      {location && !followUserLocation ? (
        <View style={styles.resetLocation}>
          <Button
            buttonStyle={{
              backgroundColor: 'white',
              borderRadius: 100,
              elevation: 2,
            }}
            onPress={() => centerOnUser()}
            icon={<Icon name="my-location" size={25} color={'black'} />}
          />
        </View>
      ) : null}
    </Animated.View>
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
    right: 15,
    top: 15,
  },
  refresh: {
    position: 'absolute',
    left: '48%',
    bottom: 15,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
  },
});
