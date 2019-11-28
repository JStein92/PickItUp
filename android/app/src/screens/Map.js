import React, {useState, useEffect, useContext} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import {View, StyleSheet, Text, Image} from 'react-native';
import userActions from '../redux/actions/user';
let {setLocation} = userActions;
import {useDispatch, useSelector} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Geolocation from 'react-native-geolocation-service';
import {Button} from 'react-native-elements';
import {ThemeContext} from 'react-native-elements';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

export default function Map(props) {
  const {theme} = useContext(ThemeContext);

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

  useEffect(() => {
    if (selectedMarker && markerRefs[selectedMarker.id]) {
      markerRefs[selectedMarker.id].showCallout();
      const newRegion = selectedMarker.pickupData.location;
      setFollowUserLocation(false);
      map.animateToRegion(
        {
          latitude: newRegion.latitude,
          longitude: newRegion.longitude,
          latitudeDelta: defaultZoom,
          longitudeDelta: defaultZoom,
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

  function centerOnUser() {
    Object.values(markerRefs).forEach(ref => {
      ref.hideCallout();
    });

    Geolocation.getCurrentPosition(position => {
      if (map) {
        map.animateToRegion(
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: defaultZoom,
            longitudeDelta: defaultZoom,
          },
          50,
        );
      }
      setFollowUserLocation(true);
    });
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
          showsMyLocationButton={false}
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
          showsCompass={true}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: defaultZoom,
            longitudeDelta: defaultZoom,
          }}>
          {markers.map(marker => (
            <Marker
              onCalloutPress={() =>
                props.navigation.navigate('PostDetails', {post: marker})
              }
              tracksInfoWindowChanges={false}
              tracksViewChanges={false}
              ref={ref => (markerRefs[marker.id] = ref)}
              key={marker.id}
              onPress={e => selectMarker(marker)}
              coordinate={{
                latitude: marker.pickupData.location.latitude,
                longitude: marker.pickupData.location.longitude,
              }}>
              <Callout tooltip={true} style={{width: 150}}>
                <Button style={{width: 150}} title={'Details -> '} />
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
            buttonStyle={{
              backgroundColor: 'rgba(144,144,144, .2)',
              borderRadius: 100,
              elevation: 1,
            }}
            onPress={() => centerOnUser()}
            icon={
              <Icon
                name="my-location"
                size={25}
                color={'black'}
                style={{padding: 2}}
              />
            }
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
    right: 15,
    top: 15,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
  },
});
