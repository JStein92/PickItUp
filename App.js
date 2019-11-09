import React, {useState} from 'react';
import {Alert, Button, StyleSheet, Text, View, Image} from 'react-native';
import Auth0 from 'react-native-auth0';

var credentials = {
  domain: 'dev-v0arz9b4.auth0.com',
  clientId: 'HlEarWtEobv8CICyhofX9DjJzguN9coe',
};
const auth0 = new Auth0(credentials);

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  async function getUserInfo(token) {
    let userInfo = await auth0.auth.userInfo({token});
    return userInfo;
  }
  async function _onLogin() {
    let res = await auth0.webAuth.authorize({
      scope: 'openid profile email',
    });
    setAccessToken(res.accessToken);
    let info = await getUserInfo(res.accessToken);
    setUserProfile(info);
  }

  const _onLogout = () => {
    auth0.webAuth
      .clearSession({})
      .then(() => {
        Alert.alert('Logged out!');
        setAccessToken(null);
      })
      .catch(error => {
        console.log('Log out cancelled', error);
      });
  };

  let loggedIn = accessToken === null ? false : true;
  return (
    <View style={styles.container}>
      {loggedIn && userProfile ? (
        <View>
          <Text style={styles.header}>Welcome, {userProfile.givenName} </Text>
          <Image
            style={styles.profileImg}
            source={{uri: userProfile.picture}}
          />
        </View>
      ) : null}
      <Button
        onPress={loggedIn ? _onLogout : _onLogin}
        title={loggedIn ? 'Log Out' : 'Log In'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  profileImg: {
    width: 70,
    height: 70,
    margin: 5,
    alignSelf: 'center',
    borderRadius: 150 / 2,
    overflow: 'hidden',
  },
});

export default App;
