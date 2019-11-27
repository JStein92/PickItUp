import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
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
import CameraComponent from './Camera';
import MarkerGallery from '../components/MarkerGallery';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/dist/Feather';
import {ThemeContext} from 'react-native-elements';

export default function Home(props) {
  const dispatch = useDispatch();
  const [markers, setMarkers] = useState([]);
  const [markersInBounds, setMarkersInBounds] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [currentRegion, setCurrentRegion] = useState(null);
  const {theme} = useContext(ThemeContext);

  useEffect(() => {
    let doc = firestore().collection('pickups');
    doc.onSnapshot(querySnapshot => {
      querySnapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
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
      setMarkersInBounds(foundMarkers);
    }
  }, [currentRegion, markers]);

  const handleSelectMarker = marker => {
    setSelectedMarker(marker);
  };

  return (
    <View style={styles.container}>
      <Map
        markers={markers}
        selectedMarker={selectedMarker}
        onRegionChangeComplete={newRegion => setCurrentRegion(newRegion)}
        delesectMarkers={() => setSelectedMarker(null)}
        currentRegion={currentRegion}
        {...props}
      />
      <MarkerGallery
        markers={markersInBounds}
        handleSelectMarker={handleSelectMarker}
        {...props}
      />
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Camera')}
        style={[
          styles.bottomRightBtn,
          {backgroundColor: theme.colors.primary},
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
  image: {
    width: 48,
    height: 48,
  },
  bottomRightBtn: {
    bottom: 250,
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
