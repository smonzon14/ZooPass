/* @flow */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
//import LinearGradient from 'react-native-linear-gradient';
import DefaultStyles from '../styles/Default.js';
export default class CustomHeader extends Component {
  render() {
    return (
      <SafeAreaView
        statusBarProps={{barStyle: 'light-content'}}
        style={{
          width: '100%',
          backgroundColor:
            this.props.backgroundColor == null
              ? 'transparent'
              : this.props.backgroundColor,
          marginBottom: 15,
          marginTop: this.props.top == null ? 30 : this.props.top,
          flexDirection: 'row',
        }}>
        <Text style={DefaultStyles.titleText}>{this.props.title}</Text>
        {this.props.buttonComponent && (
          <View
            style={{
              position: 'absolute',
              right: 10,
              alignSelf: 'center',
              visible: this.props.buttonComponent,
            }}>
            {this.props.buttonComponent}
          </View>
        )}
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
