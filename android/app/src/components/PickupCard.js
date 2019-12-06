import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Animated, Easing} from 'react-native';
import moment from 'moment';
import {Icon, Button} from 'react-native-elements';
import FastImage from 'react-native-fast-image';

export default function PickupCard(props) {
  const {pickup, containerStyle} = props;
  const [fadeAnim] = useState(new Animated.Value(0));
  const [yValue] = useState(new Animated.ValueXY({x: 0, y: -300}));

  useEffect(() => {
    Animated.timing(
      // Animate value over time
      fadeAnim, // The value to drive
      {
        duration: 600,
        toValue: 1, // Animate to final value of 1
      },
    ).start(); // Start the animation
    Animated.timing(
      // Animate value over time
      yValue, // The value to drive
      {
        duration: 250,
        easing: Easing.quad,
        toValue: 0, // Animate to final value of 1
      },
    ).start(); // Start the animation
  }, []);

  return (
    <Animated.View
      style={[containerStyle, {opacity: fadeAnim, bottom: yValue.y}]}>
      <FastImage
        style={styles.image}
        source={{
          uri: pickup.pickupData.image,
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
                uri: pickup.pickupData.photoURL,
              }}
            />
            <View>
              <Text style={styles.text}>{pickup.pickupData.displayName}</Text>
              <Text style={styles.dateText}>
                {moment
                  .unix(pickup.pickupData.timestamp.seconds)
                  .format('MM/DD/YYYY')}
              </Text>
            </View>
          </View>

          <Icon type="material-community" name={'heart-outline'} size={30} />
        </View>
        <View style={styles.trashTypes}>
          {pickup.pickupData.types
            ? pickup.pickupData.types.map(type => {
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
            {pickup.pickupData.description
              ? `"${pickup.pickupData.description}"`
              : 'No description provided'}
          </Text>
        </View>
        <Button
          title={'View Details'}
          onPress={() =>
            props.navigation.navigate('PostDetails', {
              post: pickup,
            })
          }
        />
      </View>
    </Animated.View>
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
  image: {
    height: '100%',
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
