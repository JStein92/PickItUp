import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import appActions from '../redux/actions/app';
import Map from './Map';
import firestore from '@react-native-firebase/firestore';
import getBoundsByRegion from '../Util/getBoundsByRegion';
import PickupCard from '../components/PickupCard';
import Icon from 'react-native-vector-icons/dist/Feather';
import {ThemeContext, Button} from 'react-native-elements';
import MapMarker from '../components/MapMarker';

export default function Home(props) {
  const dispatch = useDispatch();
  const [markers, setMarkers] = useState([]);
  const [markerNodes, setMarkerNodes] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const {theme} = useContext(ThemeContext);
  const {selectedMarker} = useSelector(state => state.app);

  useEffect(() => {
    let doc = firestore().collection('pickups');

    doc.onSnapshot(querySnapshot => {
      querySnapshot.docChanges().forEach(change => {
        if (change.type === 'added' || change.type === 'removed') {
          // new markers is added, so we append it to the array
          let pickupData = change.doc.data();
          let newMarkers = markers;
          let newMarker = {
            pickupData,
            id: change.doc.id,
          };
          newMarkers.push(newMarker);
          let uniq = {};
          // For dev only - remove identical markers so hot module refresh doesn't show key value warnings
          var arrFiltered = newMarkers.filter(
            obj => !uniq[obj.id] && (uniq[obj.id] = true),
          );

          setMarkers(arrFiltered);
        }
      });
    });
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
  }, [markers]);

  return (
    <View style={styles.container}>
      <Map
        markers={markerNodes}
        onRegionChangeComplete={newRegion => setCurrentRegion(newRegion)}
        delesectMarkers={() => dispatch(appActions.setSelectedMarker(null))}
        currentRegion={currentRegion}
        {...props}
      />
      <PickupCard
        {...props}
        containerStyle={styles.pickupCardContainer}
        pickup={selectedMarker}
      />
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Camera')}
        style={[
          {
            backgroundColor: theme.colors.secondary,
            elevation: 10,
          },
          styles.bottomRightBtn,
        ]}>
        <Icon name="camera" size={30} color={'white'} />
      </TouchableOpacity>
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
    height: 200,
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
    padding: 20,
    borderRadius: 100,
  },
  bottomLeftBtn: {
    bottom: 10,
    left: 10,
    position: 'absolute',
  },
});
