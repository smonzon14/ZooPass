/* @flow */

import React, {Component} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
//import LinearGradient from 'react-native-linear-gradient';
import DefaultStyles from '../styles/Default.js';
export default class CustomHeader extends Component {
  render() {
    return (
      <SafeAreaView
        statusBarProps={{barStyle: 'light-content'}}
        style={{
          width: '100%',
          backgroundColor: 'black',
          marginBottom: 15,
          marginTop: 75,
        }}>
        <Text style={DefaultStyles.titleText}>{this.props.title}</Text>
      </SafeAreaView>
    );
    // return (
    //   <Header
    //     ViewComponent={LinearGradient}
    //     linearGradientProps={{
    //       colors: ['red', 'black'],
    //       start: {x: 0, y: 0.5},
    //       end: {x: 1, y: 0.5},
    //     }}
    //     statusBarProps={{barStyle: 'light-content'}}
    //     centerComponent={{
    //       text: this.props.title,
    //       style: {color: '#fff', fontSize: 25},
    //     }}
    //   />
    // );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
