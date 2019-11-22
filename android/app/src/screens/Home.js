import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Button,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  Dimensions,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import appActions from '../redux/actions/app';
import Map from './Map';
import firestore from '@react-native-firebase/firestore';
import getBoundsByRegion from '../Util/getBoundsByRegion';
import CameraComponent from '../components/Camera';
import MarkerGallery from '../components/MarkerGallery';

export default function Home(props) {
  const {showCamera} = useSelector(state => state.app);
  const dispatch = useDispatch();
  const [markers, setMarkers] = useState([]);
  const [markersInBounds, setMarkersInBounds] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [currentRegion, setCurrentRegion] = useState(null);

  useEffect(() => {
    let doc = firestore().collection('pickups');
    doc.onSnapshot(querySnapshot => {
      querySnapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          // new markers is added, so we append it to the array
          let pickupData = change.doc.data();
          let newMarkers = markers;
          let newMarker = {pickupData, id: change.doc.id};
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

  useEffect(() => {
    if (currentRegion) {
      let bounds = getBoundsByRegion(currentRegion);

      let foundMarkers = markers.filter(marker => {
        let {location} = marker.pickupData;
        return (
          location.latitude < bounds.maxLat &&
          location.latitude > bounds.minLat &&
          location.longitude < bounds.maxLng &&
          location.longitude > bounds.minLng
        );
      });
      // todo: check why this is being called when user is standing still
      console.log('SETTING MARKERS IN BOUNDS');
      setMarkersInBounds(foundMarkers);
    }
  }, [currentRegion, markers]);

  const handleSelectMarker = marker => {
    setSelectedMarker(marker);
  };

  return (
    <View style={styles.container}>
      {!showCamera ? (
        <Map
          markers={markers}
          selectedMarker={selectedMarker}
          onRegionChangeComplete={newRegion => setCurrentRegion(newRegion)}
          delesectMarkers={() => setSelectedMarker(null)}
          currentRegion={currentRegion}
          {...props}
        />
      ) : null}
      <MarkerGallery
        markers={markersInBounds}
        handleSelectMarker={handleSelectMarker}
        {...props}
      />
      {/* TODO MAKE CAMERA COMPONENT A MODAL THAT DRAWS OVER MAP */}
      {showCamera ? <CameraComponent {...props} /> : null}
      {!showCamera ? (
        <View style={styles.bottomRightBtn}>
          <Button
            onPress={() => dispatch(appActions.setShowCamera(true))}
            title={'Take pic'}
          />
        </View>
      ) : (
        <View style={styles.bottomLeftBtn}>
          <Button
            onPress={() => dispatch(appActions.setShowCamera(false))}
            title={'Cancel'}
          />
        </View>
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
  image: {
    width: 48,
    height: 48,
  },
  markerListContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    maxHeight: 110,
    bottom: 0,
  },
  bottomRightBtn: {
    bottom: 150,
    right: 10,
    position: 'absolute',
  },
  bottomLeftBtn: {
    bottom: 10,
    left: 10,
    position: 'absolute',
  },
});

{
  /* <Button
  title="Add an Item"
  onPress={() => props.navigation.navigate('Profile')}
/>
<Button
  title="List of Items"
  color="green"
  onPress={() => props.navigation.navigate('List')}
/> */
}
