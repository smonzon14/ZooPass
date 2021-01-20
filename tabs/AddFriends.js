import React, {Component, useState, useEffect} from 'react';
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
import Fire, {FirebaseHelper} from '../FirebaseHelper.js';

const userSearchItem = ({item}) => {
  return (
    <View>
      <Text style={DefaultStyles.headerText}>
        {item.first + ' ' + item.last}
      </Text>
    </View>
  );
};
export default (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    const timeOutId = setTimeout(() => getUsers(searchQuery), 500);
    return () => clearTimeout(timeOutId);
  }, [searchQuery]);
  function getUsers(text) {
    if (text === '') {
      return;
    }
    FirebaseHelper.getUsersMatching(text).then((res) => {
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
