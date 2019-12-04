import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import moment from 'moment';
import {ThemeContext, Icon, Image, Button} from 'react-native-elements';
import appActions from '../redux/actions/app';
import {useDispatch, useSelector} from 'react-redux';
import FastImage from 'react-native-fast-image';

export default function MarkerGallery(props) {
  const {selectedMarker} = useSelector(state => state.app);
  const {theme} = useContext(ThemeContext);

  if (!selectedMarker) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FastImage
        style={styles.image}
        source={{
          uri: selectedMarker.pickupData.image,
        }}
      />
      <View
        style={{
          flex: 1,
          padding: 5,
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FastImage
              style={styles.userImage}
              source={{
                uri: selectedMarker.pickupData.photoURL,
              }}
            />
            <View>
              <Text style={styles.text}>
                {selectedMarker.pickupData.displayName}
              </Text>
              <Text style={styles.dateText}>
                {moment
                  .unix(selectedMarker.pickupData.timestamp.seconds)
                  .format('MM/DD/YYYY')}
              </Text>
            </View>
          </View>

          <Icon type="material-community" name={'heart-outline'} size={30} />
        </View>
        <View style={styles.trashTypes}>
          {selectedMarker.pickupData.types
            ? selectedMarker.pickupData.types.map(type => {
                return (
                  <Icon
                    key={type.label}
                    type={type.iconType}
                    name={type.icon}
                    containerStyle={{
                      elevation: 3,
                      backgroundColor: 'white',
                      borderRadius: 100,
                      padding: 5,
                      marginHorizontal: 5,
                    }}
                    size={20}
                    color={type.color}
                  />
                );
              })
            : null}
        </View>
        <View style={styles.descriptionText}>
          <Text>
            {selectedMarker.pickupData.description
              ? `"${selectedMarker.pickupData.description}"`
              : 'No description provided'}
          </Text>
        </View>
        <Button
          title={'View Details'}
          onPress={() =>
            props.navigation.navigate('PostDetails', {
              post: selectedMarker,
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: 'black',
    fontWeight: 'bold',
  },
  dateText: {
    color: 'grey',
  },
  descriptionText: {
    justifyContent: 'center',
  },
  trashTypes: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  container: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    height: 200,
    elevation: 15,
  },
  image: {
    height: 200,
    width: 200,
    alignSelf: 'center',
    elevation: 5,
  },
  userImage: {
    width: 50,
    marginHorizontal: 5,
    height: 50,
    elevation: 4,
    borderRadius: 100,
  },
  markerListContainer: {
    position: 'absolute',
    bottom: 0,
    paddingTop: 20,
    right: 0,
    left: 0,
    flex: 1,
    backgroundColor: 'rgba(244, 244, 244, .4)',
  },
});
