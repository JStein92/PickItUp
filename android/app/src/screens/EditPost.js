import React, {useState} from 'react';
import {
  AppRegistry,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import appActions from '../redux/actions/app';
import {addOrUpdatePickup} from '../redux/actions/appAsyncActions';
import Image from 'react-native-scalable-image';
import Ionicon from 'react-native-vector-icons/dist/Ionicons';
import MatCommunityIcon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {
  Button,
  Header,
  Input,
  ButtonGroup,
  CheckBox,
  Icon,
  Text,
  Divider,
} from 'react-native-elements';

function HeaderLeft({onPress}) {
  return (
    <Ionicon
      name="md-arrow-round-back"
      size={30}
      style={{color: 'white'}}
      onPress={onPress}
    />
  );
}
function HeaderMiddle() {
  return (
    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
      Edit Pickup
    </Text>
  );
}

export function EditPostDetails(props) {
  const trashTypes = [
    {
      label: 'Paper',
      icon: 'newspaper',
      iconType: 'material-community',
      color: '#ef476f',
    },
    {
      label: 'Plastic',
      icon: 'food-fork-drink',
      iconType: 'material-community',
      color: '#ffd166',
    },
    {
      label: 'Carboard',
      icon: 'box',
      iconType: 'entypo',
      color: '#06d6a0',
    },
    {
      label: 'Glass',
      icon: 'glass-cocktail',
      iconType: 'material-community',
      color: '#118ab2',
    },
    {
      label: 'Can',
      icon: 'local-drink',
      iconType: 'material',
      color: 'purple',
    },
    {
      label: 'Other',
      icon: 'broom',
      iconType: 'material-community',
      color: 'black',
    },
  ];
  const trashAmounts = ['One piece', 'A few pieces', 'A whole bag'];
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState();
  const [flagged, setFlagged] = useState(false);
  const dispatch = useDispatch();

  const post = () => {
    props.navigation.navigate('Home');
    dispatch(addOrUpdatePickup());
  };

  const back = () => {
    props.navigation.navigate('EditPost');
  };

  const addOrRemoveType = type => {
    let types = Array.from(selectedTypes);
    if (!selectedTypes.find(trashType => type.label === trashType.label)) {
      types.push(type);
    } else {
      types = types.filter(trashType => type.label !== trashType.label);
    }
    setSelectedTypes(types);
  };

  const trashTypeButtons = trashTypes.map(trashType => {
    return (
      <CheckBox
        size={40}
        title={trashType.label}
        iconType={trashType.iconType}
        checkedIcon={trashType.icon}
        uncheckedIcon={trashType.icon}
        checkedColor={trashType.color}
        onPress={() => addOrRemoveType(trashType)}
        containerStyle={{
          width: Dimensions.get('screen').width * 0.45,
          borderColor: selectedTypes.find(
            type => trashType.label === type.label,
          )
            ? trashType.color
            : 'grey',
          borderWidth: 3,
          elevation: selectedTypes.find(type => trashType.label === type.label)
            ? 5
            : 0,
        }}
        checked={selectedTypes.find(type => trashType.label === type.label)}
      />
    );
  });

  const trashAmountButtons = trashAmounts.map(type => {
    return <Text>{type}</Text>;
  });

  return (
    <View style={styles.container}>
      <Header>
        <HeaderLeft onPress={back} />
        <HeaderMiddle />
      </Header>

      <Text
        style={{
          marginVertical: 10,
          paddingVertical: 10,
          marginHorizontal: 30,
          borderBottomWidth: 1,
        }}>
        Trash Type
      </Text>

      <View
        style={{
          justifyContent: 'center',
          flexWrap: 'wrap',
          flexDirection: 'row',
        }}>
        {trashTypeButtons}
      </View>

      <Text
        style={{
          marginVertical: 10,
          paddingVertical: 10,
          marginHorizontal: 30,
          borderBottomWidth: 1,
        }}>
        Pickup Size
      </Text>

      <ButtonGroup
        onPress={amount => setSelectedAmount(amount)}
        selectedIndex={selectedAmount}
        buttons={trashAmountButtons}
        containerStyle={{height: 30}}
      />

      <View>
        <CheckBox
          center
          title={
            flagged
              ? 'Pickup is flagged - click to unflag'
              : 'Click to flag for somebody else to pick up'
          }
          checkedIcon={
            <MatCommunityIcon name="flag-minus" size={30} color={'#ff9933'} />
          }
          uncheckedIcon={
            <MatCommunityIcon name="flag" size={30} color={'#ff9933'} />
          }
          checked={flagged}
          onPress={() => setFlagged(!flagged)}
        />
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: Dimensions.get('screen').width,
        }}>
        <Button title={'All Done!'} onPress={post} />
      </View>
    </View>
  );
}

export default function EditPost(props) {
  const {currentImage} = useSelector(state => state.app);

  const dispatch = useDispatch();

  const retake = () => {
    props.navigation.navigate('Camera');
    dispatch(appActions.setCurrentImage(null));
  };
  const cancel = () => {
    props.navigation.navigate('Home');
    dispatch(appActions.setCurrentImage(null));
  };

  const next = () => {
    props.navigation.navigate('EditPostDetails');
  };

  const onPress = () => {
    console.log('press');
  };

  /*
    TODO
    Make this a multi screen process
    1. Confirm picture or retake/cancel
    2. Enter a brief description (optional)
    3. Enter how much trash it is
    4. Share via social media (optional)
    5. Post
  */

  return currentImage ? (
    <View style={styles.container}>
      <Header>
        <HeaderLeft onPress={cancel} />
        <HeaderMiddle />
      </Header>
      <View>
        <TouchableOpacity
          onPress={retake}
          style={{position: 'absolute', top: 10, right: 10, zIndex: 1}}>
          <MatCommunityIcon name="camera-retake" size={50} />
        </TouchableOpacity>
        <Image
          source={{uri: currentImage.uri}}
          width={Dimensions.get('screen').width}
          style={{alignSelf: 'center'}}
        />
      </View>

      <Input
        onChangeText={onPress}
        label={'Say something about this pickup!'}
        placeholder={'Cleaning up my community!'}
        maxLength={144}
      />

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: Dimensions.get('screen').width,
        }}>
        <Button title={'Next'} onPress={next} />
      </View>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
