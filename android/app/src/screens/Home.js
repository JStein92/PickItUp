import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, TouchableOpacity, View, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import appActions from '../redux/actions/app';
import userActions from '../redux/actions/user';
import {getPickups} from '../redux/actions/appAsyncActions';
import Map from './Map';
import PickupCard from '../components/PickupCard';
import Icon from 'react-native-vector-icons/dist/Feather';
import FAIcons from 'react-native-vector-icons/dist/FontAwesome5';
import {ThemeContext} from 'react-native-elements';
import MapMarker from '../components/MapMarker';
import Geolocation from 'react-native-geolocation-service';

export default function Home(props) {
  const dispatch = useDispatch();
  const [markerNodes, setMarkerNodes] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const {theme} = useContext(ThemeContext);
  const {selectedMarker} = useSelector(state => state.app);
  const {markers} = useSelector(state => state.app);
  const {isWalking} = useSelector(state => state.app);
  const {coordinates} = useSelector(state => state.user);

  useEffect(() => {
    dispatch(getPickups());
  }, []);

  // let bounds = getBoundsByRegion(currentRegion);
  // .filter(
  //   obj =>
  //     obj.pickupData.location.latitude < bounds.maxLat &&
  //     obj.pickupData.location.latitude > bounds.minLat &&
  //     obj.pickupData.location.longitude < bounds.maxLng &&
  //     obj.pickupData.location.longitude > bounds.minLng,
  // );

  useEffect(() => {
    let m = markers.map(marker => {
      return (
        <MapMarker
          key={marker.id}
          marker={marker}
          {...props}
          coordinate={{
            latitude: marker.pickupData.location.latitude,
            longitude: marker.pickupData.location.longitude,
          }}
        />
      );
    });

    setMarkerNodes(m);
  }, [markers, props]);

  useEffect(() => {
    let timer;
    if (isWalking) {
      timer = setInterval(() => {
        addCoordinate();
      }, 5000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [isWalking]);

  function addCoordinate() {
    Geolocation.getCurrentPosition(
      position => {
        // If position is different enough from previous, add it to array
        dispatch(
          userActions.addCoordinate({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
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
  }

  return (
    <View style={styles.container}>
      <Map
        coordinates={coordinates}
        markers={markerNodes}
        onRegionChangeComplete={newRegion => setCurrentRegion(newRegion)}
        delesectMarkers={() => dispatch(appActions.setSelectedMarker(null))}
        currentRegion={currentRegion}
        {...props}
      />
      {selectedMarker ? (
        <PickupCard
          {...props}
          containerStyle={styles.pickupCardContainer}
          pickup={selectedMarker}
        />
      ) : null}
      {!isWalking ? (
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Camera')}
          style={[
            {
              backgroundColor: theme.colors.secondary,
              elevation: 10,
            },
            styles.bottomRightBtn,
          ]}>
          <Icon name="camera" size={24} color={'white'} />
        </TouchableOpacity>
      ) : null}
      {!isWalking ? (
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Start a Pickup Walk?',
              'Record your walk and take a picture of your Pickups at the end!',
              [
                {
                  text: 'Cancel',
                  onPress: () => {},
                },
                {
                  text: 'Start',
                  onPress: () => {
                    dispatch(appActions.setIsWalking(true));
                    addCoordinate();
                  },
                  style: 'positive',
                },
              ],
              {cancelable: true},
            );
          }}
          style={[
            {
              backgroundColor: theme.colors.secondary,
              elevation: 10,
            },
            styles.bottomRightBtn2,
          ]}>
          <FAIcons name="walking" size={24} color={'white'} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Done walking?',
              'You can take a picture once you are done!',
              [
                {
                  text: 'Discard this walk',
                  onPress: () => {
                    dispatch(appActions.setIsWalking(false));
                  },
                  style: 'cancel',
                },
                {
                  text: 'Not yet',
                  onPress: () => {},
                },
                {
                  text: 'Yep, all done!',
                  onPress: () => {
                    addCoordinate();
                    props.navigation.navigate('Camera');
                    // TODO: Record a "walk", display a card for the walk, get walk distance
                  },
                  style: 'positive',
                },
              ],
            );
          }}
          style={[
            {
              backgroundColor: theme.colors.secondary,
              elevation: 10,
            },
            styles.bottomRightBtn2,
          ]}>
          <FAIcons name="check" size={30} color={'white'} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: 'white',
  },
  pickupCardContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    height: 150,
    elevation: 15,
  },
  image: {
    width: 48,
    height: 48,
  },
  bottomRightBtn: {
    bottom: '40%',
    right: 10,
    position: 'absolute',
    padding: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  bottomRightBtn2: {
    bottom: '55%',
    right: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    padding: 5,
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  bottomLeftBtn: {
    bottom: 10,
    left: 10,
    position: 'absolute',
  },
});
