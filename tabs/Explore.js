/* @flow */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import CustomMapView from '../pageComponents/CustomMapView.js';
import DefaultStyles from '../styles/Default.js';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
export default class Explore extends Component {
  render() {
    return (
      <View style={DefaultStyles.container}>
        <View style={styles.categoryContainer}>
          <TouchableOpacity style={styles.toggleCategoryButtonOn}>
            <Text style={{...DefaultStyles.regularText, color: 'red'}}>
              Hello
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleCategoryButtonOff}>
            <Text style={DefaultStyles.regularText}>World</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            bottom: 80,
          }}>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={{...StyleSheet.absoluteFillObject, top: 80}}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  categoryContainer: {
    flexDirection: 'row',
    paddingLeft: 15,
  },
  toggleCategoryButtonOn: {
    margin: 5,
    borderRadius: 15,
    borderColor: 'red',
    borderWidth: 1,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
    paddingRight: 4,
    backgroundColor: 'black',
  },
  toggleCategoryButtonOff: {
    margin: 5,
    color: 'white',
    borderRadius: 15,
    borderColor: 'white',
    borderWidth: 1,

    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    paddingLeft: 4,
    paddingRight: 4,
    backgroundColor: 'black',
  },
});
