import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {likePickup} from '../redux/actions/appAsyncActions';
import {useDispatch, useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';

export default function Like(props) {
  const {pickup, style} = props;
  const [liked, setLiked] = useState(null);
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user);

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

  const handleLikePickup = () => {
    setLiked(!liked);
    dispatch(likePickup(pickup.pickupData.id));
  };

  return (
    <View>
      {liked !== null ? (
        <TouchableOpacity
          onPress={handleLikePickup}
          style={{...style, ...styles.likedIcon}}>
          <Icon
            type="material-community"
            name={'heart'}
            size={28}
            color={liked ? '#b23a48' : 'grey'}
            underlayColor="rgba(0,0,0,0)"
          />
        </TouchableOpacity>
      ) : (
        <View style={{...style, ...styles.likedIcon}}>
          <ActivityIndicator size="large" color="grey" />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  likedIcon: {
    borderRadius: 100,
    padding: 5,
    width: 40,
    height: 40,
    backgroundColor: 'white',
    elevation: 1,
  },
});
