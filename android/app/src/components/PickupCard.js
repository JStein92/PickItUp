import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import moment from 'moment';
import {Icon, Button} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {likePickup, deletePickup} from '../redux/actions/appAsyncActions';
import {useDispatch, useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

export default function PickupCard(props) {
  const {pickup, containerStyle} = props;
  const [fadeAnim] = useState(new Animated.Value(0));
  const [yValue] = useState(new Animated.ValueXY({x: 0, y: -300}));
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user);

  const [liked, setLiked] = useState(null);

  const handleLikePickup = () => {
    setLiked(!liked);
    dispatch(likePickup(pickup.pickupData.id));
  };

  const handleDeletePickup = () => {
    dispatch(deletePickup(pickup.pickupData.id));
  };

  useEffect(() => {
    setLiked(null);
    let doc = firestore()
      .collection('pickups')
      .doc(pickup.pickupData.id);

    doc.get().then(snapshot => {
      let data = snapshot.data();
      if (data) {
        setLiked(data.likes && data.likes.find(like => like.uid === user.uid));
      }
    });
  }, [pickup, user.uid]);

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
        style={[styles.image, {width: containerStyle.height}]}
        source={{
          uri: pickup.pickupData.image,
        }}
      />
      {liked !== null ? (
        <Icon
          type="material-community"
          name={'heart'}
          size={28}
          onPress={handleLikePickup}
          color={liked ? '#b23a48' : 'grey'}
          underlayColor="rgba(0,0,0,0)"
          containerStyle={styles.likedIcon}
        />
      ) : (
        <View style={styles.likedIcon}>
          <ActivityIndicator size="large" color="grey" />
        </View>
      )}
      <View
        style={{
          flex: 1,
          padding: 2,
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginVertical: 3,
          }}>
          <FastImage
            style={styles.userImage}
            source={{
              uri: pickup.pickupData.photoURL,
            }}
          />
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.text}>{pickup.pickupData.displayName}</Text>
            </View>
            <Text style={styles.dateText}>
              {moment
                .unix(pickup.pickupData.timestamp.seconds)
                .format('MM/DD/YYYY')}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('PostDetails', {
                post: pickup,
              })
            }>
            {/* <Icon type="material-community" name={'dots-vertical'} size={28} /> */}
            <Menu>
              <MenuTrigger text="..." customStyles={triggerStyles} />
              <MenuOptions>
                <MenuOption
                  onSelect={() =>
                    props.navigation.navigate('PostDetails', {
                      post: pickup,
                    })
                  }
                  text="Details"
                />
                {user.id !== pickup.uid ? (
                  <MenuOption
                    onSelect={() => alert(`Reported`)}
                    text="Report"
                  />
                ) : null}
                {user.id === pickup.uid ? (
                  <MenuOption
                    onSelect={() =>
                      Alert.alert(
                        'Really delete this pickup?',
                        'You cannot undo this action',
                        [
                          {
                            text: 'Cancel',
                            onPress: () => {},
                          },
                          {
                            text: 'Delete',
                            onPress: handleDeletePickup,
                            style: 'negative',
                          },
                        ],
                        {cancelable: true},
                      )
                    }>
                    <Text style={{color: 'red'}}>Delete</Text>
                  </MenuOption>
                ) : null}
              </MenuOptions>
            </Menu>
          </TouchableOpacity>
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
                      marginVertical: 2,
                      marginHorizontal: 3,
                    }}
                    size={22}
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
      </View>
    </Animated.View>
  );
}

const triggerStyles = {
  triggerText: {
    color: 'black',
    fontSize: 24,
  },
  triggerWrapper: {
    padding: 5,
    paddingTop: 0,
  },
  triggerTouchable: {
    activeOpacity: 100,
  },
};

const styles = StyleSheet.create({
  text: {
    color: 'black',
    fontWeight: 'bold',
    flexWrap: 'wrap',
    flex: 1,
  },
  likedIcon: {
    position: 'absolute',
    top: 5,
    left: 5,
    borderRadius: 100,
    padding: 5,
    backgroundColor: 'white',
    elevation: 6,
  },
  dateText: {
    color: 'grey',
  },
  descriptionText: {
    alignItems: 'flex-start',
    marginTop: 5,
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trashTypes: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  image: {
    height: '100%',
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
