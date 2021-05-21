/* @flow weak */

import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

const userItem = ({item}, onPress) => {
  return (
    <TouchableOpacity
      style={styles.userItemContainer}
      onPress={() => {
        onPress(item);
      }}>
      <Image
        source={{uri: item.photoURL}}
        resizeMode="cover"
        style={styles.profileImage}
      />
      <View style={{alignSelf: 'center'}}>
        <Text style={styles.nameText}>{item.first + ' ' + item.last}</Text>
        <Text style={styles.usernameText}>{item.username}</Text>
      </View>
    </TouchableOpacity>
  );
};

const eventItem = () => {};

export {userItem, eventItem};

const styles = StyleSheet.create({
  userItemContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  profileImage: {
    height: 60,
    width: 60,
    backgroundColor: 'black',
    borderRadius: 30,
  },
  container: {
    flex: 1,
    backgroundColor: 'blue',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  nameText: {
    marginLeft: 10,
    color: 'white',
    fontSize: 18,
  },
  usernameText: {
    marginLeft: 10,
    color: 'gray',
    fontSize: 12,
  },
});
