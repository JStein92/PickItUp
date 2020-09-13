import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import appActions from '../redux/actions/app';
import Map from './Map';

export default function PostDetails(props) {
  const [currentRegion, setCurrentRegion] = useState(null);
  const dispatch = useDispatch();

  return (
    <View style={styles.root}>
      <Map
        onRegionChangeComplete={newRegion => setCurrentRegion(newRegion)}
        delesectMarkers={() => dispatch(appActions.setSelectedMarker(null))}
        currentRegion={currentRegion}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-start',
  },
});
