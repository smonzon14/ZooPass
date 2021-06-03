/* @flow weak */

import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {faBookmark, faShareSquare} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {accentColors} from '../styles/Default.js';

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
    format(startDate, 'eee, MMMM dd - ') + format(endDate, 'eee, MMMM dd')
    // format(startDate, 'eee, MMMM dd · h:mm a - ') +
    // format(endDate, 'eee, MMMM dd · h:mm a')
  );
}
const eventItem = ({item}, onPress) => {
  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View>
        <Text style={eventStyles.postedText}>
          {'posted ' + formatPostedDate(item.posted)}
        </Text>
        <View style={eventStyles.eventBubble}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}>
            <Image
              style={{
                marginRight: 10,
                borderRadius: 10,
                width: 100,
                height: 100,
              }}
              resizeMode="cover"
              source={{uri: item.photoURL}}
            />
            <View
              style={{
                width: 300,
                justifyContent: 'space-between',
                flex: 1,
                flexDirection: 'column',
              }}>
              <Text style={eventStyles.timeText}>
                {formatStartEndDate(item.start, item.end)}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={eventStyles.titleText}>
                {item.title}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={eventStyles.addressText}>
                {item.address}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                <FontAwesomeIcon
                  style={{margin: 5}}
                  icon={faShareSquare}
                  size={18}
                  color="white"
                />
                <FontAwesomeIcon
                  style={{margin: 5}}
                  icon={faBookmark}
                  size={18}
                  color="white"
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export {userItem, eventItem};
const eventStyles = StyleSheet.create({
  titleText: {
    fontSize: 18,
    color: 'white',
  },
  addressText: {
    fontSize: 12,
    color: 'gray',
  },
  timeText: {
    fontSize: 14,
    color: accentColors.secondaryLight,
  },
  postedText: {
    fontSize: 11,
    padding: 5,
    color: 'gray',
    fontStyle: 'italic',
  },
  eventBubble: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'black',
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
