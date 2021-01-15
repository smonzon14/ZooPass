/* @flow */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';
import DefaultStyles from '../styles/Default.js';
let InvitesList = [
  {
    title: 'hello world',
    id: '123456',
    desc: 'bring your own booze. Pizza will be here.',
    numPpl: 0,
    addr: '214 Lynn Fells Parkway, Melrose MA, 02176',
    public: false,
    entryFee: 0,
    numComments: 0,
    posted: '1/12/21, 11:11 PM',
    startTime: '1/13/21, 9:00 PM',
    endTime: '1/13/21, 11:59 PM',
  },
];

const renderInvite = ({item}) => (
  <Text style={{color: 'red'}}>Title: {item.title}</Text>
);

export default class Invites extends Component {
  state = {refreshing: false};
  onRefresh() {
    this.setState({refreshing: true});
    this.setState({refreshing: false});
  }
  // retrieveInvites() {
  //   this.setState({fetching: false});
  // }
  render() {
    return (
      <View style={DefaultStyles.container}>
        <SafeAreaView>
          <FlatList
            data={[{title: 'hello world', id: '123456'}]}
            renderItem={renderInvite}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh.bind(this)}
              />
            }
          />
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
