import React, {Component, useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
} from 'react-native';
import DefaultStyles from '../styles/Default.js';

import Modal from '../pageComponents/PageModal.js';
import Fire from '../FirebaseHelper.js';
import {Portal} from 'react-native-portalize';
import UserInfoView from '../tabs/UserInfoView.js';

//Fire.sendFriendRequest(item.id)
export default (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const userInfoModalRef = useRef();
  const onSearchItemPress = (item) => {
    setSelectedUser(item);
    userInfoModalRef.current?.open();
  };
  const userSearchItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onSearchItemPress(item);
        }}>
        <Text style={DefaultStyles.headerText}>
          {item.first + ' ' + item.last}
        </Text>
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    const timeOutId = setTimeout(() => getUsers(searchQuery), 500);
    return () => clearTimeout(timeOutId);
  }, [searchQuery]);
  function getUsers(text) {
    if (text === '') {
      return;
    }
    Fire.getUsersMatching(text).then((res) => {
      const results = [];
      res.forEach((user, i) => {
        console.log(user.id + ' => ' + user.data().first);
        results.push({...user.data(), id: user.id});
      });
      console.log(results);
      setSearchResults(results);
      // searchResults = res.map((user) => {
      //   console.log(user.id);
      //   return {...user.data(), id: user.id};
      // });
    });
  }
  return (
    <Modal r={props.r}>
      <View style={DefaultStyles.container}>
        <Text style={DefaultStyles.titleText}>Add Friends</Text>
        <TextInput
          style={DefaultStyles.textInput}
          placeholder="Search"
          placeholderTextColor="white"
          onChangeText={(text) => {
            setSearchQuery(text);
          }}
        />
        <FlatList
          data={searchResults}
          renderItem={userSearchItem}
          keyExtractor={(item) => item.id}
        />
      </View>
      <Portal>
        <Modal r={userInfoModalRef}>
          <UserInfoView
            getSelectedUser={() => {
              return selectedUser;
            }}
          />
        </Modal>
      </Portal>
    </Modal>
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
