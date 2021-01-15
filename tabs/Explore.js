/* @flow */

import React, {Component} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import CustomMapView from '../pageComponents/CustomMapView.js';
import DefaultStyles from '../styles/Default.js';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
export default class Explore extends Component {
  render() {
    return (
      <View style={DefaultStyles.container}>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            top: 0,
            bottom: 120,
            width: '100%',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={{...StyleSheet.absoluteFillObject}}
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

const styles = StyleSheet.create({});
