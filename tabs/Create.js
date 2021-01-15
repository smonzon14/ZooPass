/* @flow */

import React, {Component, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, TextInput} from 'react-native';
import {Calendar} from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomHeader from '../pageComponents/CustomHeader.js';
import DefaultStyles from '../styles/Default.js';
import DaySelectionCalendar from '../pageComponents/CustomCalendar.js';
export default class Create extends Component {
  state = {
    title: '',
    desc: '',
    startDateTime: null,
    endDateTime: null,
    location: '',
  };
  render() {
    return (
      <View style={DefaultStyles.container}>
        <CustomHeader title="Create" />
        <SafeAreaView>
          <TextInput
            style={DefaultStyles.textInput}
            placeholder="Title"
            placeholderTextColor="gray"
            onChangeText={(text) => (this.state.title = text)}
          />
          <TextInput
            style={DefaultStyles.textInput}
            placeholder="Description"
            placeholderTextColor="gray"
            onChangeText={(text) => (this.state.desc = text)}
          />

          <DaySelectionCalendar />
          <View style={styles.timesContainer}>
            <DateTimePicker
              style={styles.timePicker}
              value={new Date()}
              mode="time"
            />
            <DateTimePicker
              style={styles.timePicker}
              value={new Date()}
              mode="time"
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: 'white',
    backgroundColor: 'black',
    alignItems: 'center',
  },
  timesContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  timePicker: {
    width: '40%',
    right: 0,
  },
});
