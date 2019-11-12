import React from 'react';
import {Button, View, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {logoutFB} from '../redux/actions/userAsyncActions';

function Home(props) {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user);

  return (
    <View>
      <Text>Welcome {user.email}</Text>
      <Button title={'Log out'} onPress={() => dispatch(logoutFB())} />

      <Button
        title="Add an Item"
        onPress={() => props.navigation.navigate('Profile')}
      />
      <Button
        title="List of Items"
        color="green"
        onPress={() => props.navigation.navigate('List')}
      />
    </View>
  );
}

export default class HomeComponent extends React.Component {
  render() {
    return <Home {...this.props} />;
  }
}
