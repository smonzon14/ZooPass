/* @flow */

import React, {Component} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';

import DefaultStyles from '../styles/Default.js';
import CustomCalendar from '../pageComponents/CustomCalendar.js';
import CustomHeader from '../pageComponents/CustomHeader.js';

export default class Calendar extends Component {
  render() {
    return (
      <View style={DefaultStyles.container}>
        <CustomHeader title="Calendar" />
        <CustomCalendar />
      </View>
    );
  }
}

const styles = StyleSheet.create({});
