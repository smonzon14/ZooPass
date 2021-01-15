/* @flow */

import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
//import LinearGradient from 'react-native-linear-gradient';

export default class CustomHeader extends Component {
  render() {
    return (
      <View
        statusBarProps={{barStyle: 'light-content'}}
        style={{width: '100%', height: 200, backgroundColor: 'black', top: 0}}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            top: 150,
            left: 15,
            color: 'white',
          }}>
          {this.props.title}
        </Text>
      </View>
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
