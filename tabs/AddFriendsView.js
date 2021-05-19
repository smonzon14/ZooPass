import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import DefaultStyles from '../styles/Default.js';
import {userItem} from '../pageComponents/ListItems.js';
import Fire from '../FirebaseHelper.js';
import {Portal} from 'react-native-portalize';
import CustomHeader from '../pageComponents/CustomHeader.js';
import {Modalize} from 'react-native-modalize';
import OtherUserInfoView from '../tabs/OtherUserInfoView.js';
//Fire.sendFriendRequest(item.id)
const renderButtonComponent = () => (
  <TouchableOpacity onPress={() => console.log('Pressed')}>
    <Text style={DefaultStyles.headerText}>Scan</Text>
  </TouchableOpacity>
);

export default (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selected, setSelected] = useState({});
  const userInfoViewModalRef = useRef();
  const openOtherUserInfoView = (user) => {
    setSelected(user);
    userInfoViewModalRef.current?.open();
  };
  const renderHeader = () => (
    <View>
      <CustomHeader
        title="Add Friends"
        top={10}
        buttonComponent={renderButtonComponent()}
      />
      <TextInput
        style={DefaultStyles.textInput}
        placeholder="Search"
        placeholderTextColor="white"
        onChangeText={(text) => {
          setSearchQuery(text);
        }}
      />
      <Portal>
        <Modalize
          ref={userInfoViewModalRef}
          modalStyle={{backgroundColor: '#333'}}
          handleStyle={{backgroundColor: 'white'}}>
          <OtherUserInfoView userBase={selected} />
        </Modalize>
      </Portal>
    </View>
  );

  useEffect(() => {
    const timeOutId = setTimeout(() => getUsers(searchQuery), 500);
    return () => clearTimeout(timeOutId);
  }, [searchQuery]);
  function getUsers(text) {
    if (text === '') {
      return;
    }
    Fire.getUsersMatching(text).then((results) => {
      console.log(results);
      setSearchResults(results);
    });
  }
  return (
    <Modalize
      ref={props.r}
      modalStyle={{backgroundColor: '#333'}}
      handleStyle={{backgroundColor: 'white'}}
      modalHeight={800}
      HeaderComponent={renderHeader}
      flatListProps={{
        data: searchResults,
        renderItem: (item) => userItem(item, openOtherUserInfoView),
        keyExtractor: (item) => item.id,
      }}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'gray',
    padding: 5,
    marginVertical: 7,
    marginHorizontal: 15,
  },
});
