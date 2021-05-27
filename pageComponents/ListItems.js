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
import {format, formatDistance, isSameDay} from 'date-fns';

function formatPostedDate(date) {
  return formatDistance(date, new Date(), {addSuffix: true});
}

function formatStartEndDate(startDate, endDate) {
  if (isSameDay(startDate, endDate)) {
    return (
      format(startDate, 'eeee, MMMM dd · h:mm a - ') + format(endDate, 'h:mm a')
    );
  }
  return (
    format(startDate, 'eee, MMMM dd · h:mm a - ') +
    format(endDate, 'eee, MMMM dd · h:mm a')
  );
}
const eventItem = ({item}, onPress) => {
  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <Text style={eventStyles.postedText}>
        {formatPostedDate(item.posted)}
      </Text>
      <View style={eventStyles.eventBubble}>
        <Text style={eventStyles.timeText}>
          {formatStartEndDate(item.start, item.end)}
        </Text>
        <Text style={eventStyles.titleText}>{item.title}</Text>
        <Text style={eventStyles.addressText}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );
};

export {userItem, eventItem};
const eventStyles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    color: 'white',
  },
  addressText: {
    fontSize: 15,
    color: 'gray',
  },
  timeText: {
    fontSize: 15,
    color: '#DDDD00',
  },
  postedText: {
    fontSize: 13,
    color: 'gray',
    fontStyle: 'italic',
    alignSelf: 'flex-end',
  },
  eventBubble: {
    height: 100,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#111',
    justifyContent: 'space-around',
  },
});
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
