import React, {useState, useContext, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Picker} from 'react-native';
import {useSelector} from 'react-redux';

import PickupCard from '../components/PickupCard';
import {ThemeContext} from 'react-native-elements';
export default function Activity(props) {
  const [pickups, setPickups] = useState([]);
  const {theme} = useContext(ThemeContext);
  const {markers} = useSelector(state => state.app);

  const sortOpts = ['Newest', 'Oldest'];
  const [sort, setSort] = useState(sortOpts[0]);

  useEffect(() => {
    setPickups(markers);
  }, [markers]);

  function sortPickups(pickups, opt) {
    let sortedPickups;

    if (opt === 'Newest') {
      sortedPickups = pickups.sort((a, b) =>
        a.pickupData.timestamp.seconds > b.pickupData.timestamp.seconds
          ? -1
          : 1,
      );
    } else if (opt === 'Oldest') {
      sortedPickups = pickups.sort((a, b) =>
        a.pickupData.timestamp.seconds > b.pickupData.timestamp.seconds
          ? 1
          : -1,
      );
    }
    setSort(opt);
    setPickups(sortedPickups);
  }

  return (
    <View>
      <View
        style={{
          backgroundColor: theme.colors.header,
        }}>
        <Picker
          selectedValue={sort}
          style={{height: 50, width: 150}}
          onValueChange={opt => sortPickups(pickups, opt)}>
          {sortOpts.map(opt => {
            return <Picker.Item key={opt} label={opt} value={opt} />;
          })}
        </Picker>
      </View>
      <ScrollView>
        {pickups.map(pickup => {
          return (
            <PickupCard
              key={pickup.id}
              pickup={pickup}
              containerStyle={styles.containerStyle}
              {...props}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    height: 150,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
    elevation: 5,
  },
});
