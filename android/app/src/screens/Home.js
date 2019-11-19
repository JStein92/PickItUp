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
import {RNCamera} from 'react-native-camera';
import appActions from '../redux/actions/app';
import Map from './Map';
import firestore from '@react-native-firebase/firestore';
import getBoundsByRegion from '../Util/getBoundsByRegion';
export function CameraComponent(props) {
  let camera;
  const dispatch = useDispatch();
  let [type, setType] = useState(RNCamera.Constants.Type.back);

  const flipCamera = () => {
    if (type === RNCamera.Constants.Type.back) {
      setType(RNCamera.Constants.Type.front);
    } else {
      setType(RNCamera.Constants.Type.back);
    }
  };

  const takePicture = async () => {
    const options = {quality: 0.5, base64: true};
    const data = await camera.takePictureAsync(options);
    dispatch(appActions.setShowCamera(false));
    dispatch(appActions.setCurrentImage(data));
    props.navigation.navigate('EditPost');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topButtons}>
        <TouchableOpacity style={styles.flipButton}>
          <Button onPress={() => flipCamera()} title={'flip'} />
        </TouchableOpacity>
      </View>

      <RNCamera
        ref={ref => {
          camera = ref;
        }}
        style={styles.preview}
        type={type}
        flashMode={RNCamera.Constants.FlashMode.auto}
      />
      <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
        <TouchableOpacity style={styles.capture}>
          <Button onPress={() => takePicture()} title={'SNAP'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function MarkerGallery(props) {
  const {markers, handleSelectMarker} = props;
  const [selectedMarker, setSelectedMarker] = useState({});

  useEffect(() => {
    if (markers[0]) {
    }
  }, [markers]);

  function selectMarker(marker) {
    setSelectedMarker(marker);
    handleSelectMarker(marker);
  }

  if (!markers.length) {
    return null;
  }

  function Item({marker}) {
    return (
      <TouchableOpacity
        onPress={() => selectMarker(marker)}
        style={{
          height: 65,
          backgroundColor: 'silver',
          width: Dimensions.get('screen').width,
          display: 'flex',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.title}>{marker.pickupData.displayName}</Text>
        <Image style={styles.image} source={{uri: marker.pickupData.image}} />
      </TouchableOpacity>
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
    getMakersInBounds();
  }, [currentRegion]);

  function getMakersInBounds() {
    // TODO: Also call when new markers are added
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
  }

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
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  topButtons: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  capture: {
    zIndex: 1,
    position: 'absolute',
    bottom: 10,
  },

  flipButton: {
    zIndex: 1,
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
