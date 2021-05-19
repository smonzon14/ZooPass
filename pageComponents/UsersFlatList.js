/* @flow */

import React, {Component, useState} from 'react';
import {View, Text, StyleSheet, FlatList, SafeAreaView} from 'react-native';

//TODO: style component
const userItem = ({item}) => {
  return (
    <View>
      <Text style={styles.text}>{item.first}</Text>
      <Text style={styles.text}>{item.last}</Text>
      <Text style={styles.text}>{item.username}</Text>
    </View>
  );
};

const emptyListComponent = () => {
  return <Text style={styles.text}>No Users</Text>;
};
/* @flow weak */
/* @flow */

export default class UsersFlatList extends Component {
  state = {users: []};
  setData(list) {
    this.setState({users: list});
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={this.state.users}
          renderItem={userItem}
          ListEmptyComponent={emptyListComponent()}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
  },
  text: {
    color: 'white',
    fontSize: 25,
  },
});
