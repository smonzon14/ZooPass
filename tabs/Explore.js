/* @flow */

import React, {Component, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import CustomMapView from '../pageComponents/CustomMapView.js';
import DefaultStyles, {accentColors} from '../styles/Default.js';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Heatmap,
  Circle,
} from 'react-native-maps';
import CustomHeader from '../pageComponents/CustomHeader.js';
import CategoriesSelection from '../pageComponents/CategoriesSelection.js';
import GetLocation from 'react-native-get-location';
import functions from '@react-native-firebase/functions';
const findEventsInRange = functions().httpsCallable('findEventsInRange');
import {Modalize} from 'react-native-modalize';

import {Portal} from 'react-native-portalize';
import {eventItem} from '../pageComponents/ListItems.js';
import Slider from '@react-native-community/slider';
import Fire from '../FirebaseHelper.js';
export default class Explore extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef(null);
    //this.modalRef = React.createRef(null);
    const startRegion = {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.09,
      longitudeDelta: 0.04,
    };
    this.state = {
      userLocation: startRegion,
      region: startRegion,
      radius: 2000,
      events: [],
      heatmapPoints: [],
    };
    this.categories = ['All'];
    this.userIsLocated = false;
  }
  updateHeatmapPoints = () => {
    Fire.getHeatmap().then((points) => this.setState({heatmapPoints: points}));
  };
  updateMapPins = () => {
    console.log(
      'Updating map pins. Search radius = ' + this.state.radius + ' meters',
    );
    const center = [this.state.region.latitude, this.state.region.longitude];
    findEventsInRange({
      center: center,
      radiusInM: this.state.radius,
      categories: this.categories,
    })
      .then((res) => {
        const events = res.data;
        events.forEach((e, i) => {
          ['posted', 'start', 'end'].forEach((key) => {
            events[i][key] = new Date(events[i][key]._seconds * 1000);
          });
        });
        console.log('events: ' + events);
        this.setState({events});
        //alert('found ' + events.length + ' events in your area.');
      })
      .catch((err) => {
        console.log(err);
      });
  };
  updateUserLocation = () => {
    return GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    }).then((location) => {
      this.userIsLocated = true;
      this.setState({
        userLocation: {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: this.state.region.latitudeDelta,
          longitudeDelta: this.state.region.longitudeDelta,
        },
      });
    });
  };
  setViewAndSearchRegion = (coordinate) => {
    const region = {
      ...coordinate,
      latitudeDelta: this.state.region.latitudeDelta,
      longitudeDelta: this.state.region.longitudeDelta,
    };
    this.setState({region});
    this.mapRef.current?.animateToRegion(region);
  };
  render() {
    return (
      <View style={DefaultStyles.container}>
        <View style={StyleSheet.absoluteFillObject}>
          <MapView
            onUserLocationChange={(res) => {
              const coordinate = res.nativeEvent.coordinate;
              if (coordinate === null) {
                return;
              }
              if (!this.state.userIsLocated) {
                this.setViewAndSearchRegion(coordinate);
                this.setState({userIsLocated: true});
              }
              this.setState({userLocation: coordinate});
            }}
            ref={this.mapRef}
            onMapReady={() => {
              this.circle.setNativeProps({
                strokeColor: accentColors.secondary,
                strokeWidth: 4,
                geodesic: true,
              });
              this.updateUserLocation()
                .then(() =>
                  this.setViewAndSearchRegion(this.state.userLocation),
                )
                .then(this.updateHeatmapPoints)
                .then(this.updateMapPins);
            }}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={[StyleSheet.absoluteFillObject, {bottom: 400}]}
            showsUserLocation={true}
            cacheEnabled={true}
            loadingEnabled={true}
            tintColor={accentColors}
            showsMyLocationButton={true}
            initialRegion={this.state.region}
            onRegionChangeComplete={(region) => {
              //this.setState({region});
            }}
            onPress={(press) => {
              const coordinate = press.nativeEvent.coordinate;
              console.log(coordinate);
              this.setViewAndSearchRegion(coordinate);
              this.updateMapPins();
              //this.updateMapPins();
            }}
            maxZoomLevel={15}
            minZoomLevel={9}>
            {/*this.state.userLocation && (
              <Circle
                ref={(ref) => {
                  this.circle = ref;
                }}
                center={this.state.userLocation}
                radius={this.state.radius}
              />
            )*/}

            <Heatmap
              points={this.state.heatmapPoints.map((e) => {
                return {latitude: e[0], longitude: e[1]};
              })}
              radius={50}
              opacity={0.5}
              gradient={{
                colors: ['#0db', 'yellow', 'red'],
                startPoints: [0.1, 0.6, 0.9],
                colorMapSize: 256,
              }}
            />
            {this.state.events.map((marker, index) => {
              return (
                <Marker
                  image={{
                    uri: 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAQAAAC0NkA6AAAALElEQVR42u3NMQEAAAwCoNm/9DL4eEEBcgORSCQSiUQikUgkEolEIpFIJJ0HCt8AM0IRFnUAAAAASUVORK5CYII=',
                  }}
                  key={marker.id}
                  coordinate={{
                    latitude: marker.location[0],
                    longitude: marker.location[1],
                  }}
                  title={marker.title}
                  description={marker.owner}
                />
              );
            })}
            <Marker
              key={'-1'}
              pinColor={accentColors.secondaryLight}
              coordinate={this.state.region}
              title={'Search Here'}
            />
            <Circle
              ref={(ref) => {
                this.circle = ref;
              }}
              center={this.state.region}
              radius={this.state.radius}
            />
          </MapView>

          <CustomHeader
            style={{position: 'absolute', top: 0, left: 0}}
            color="black"
            title="Explore"
          />
          <Slider
            style={{
              position: 'absolute',
              top: 200,
              right: -80,
              transform: [{rotate: '270deg'}],
              width: 200,
              height: 40,
            }}
            minimumValue={2000}
            maximumValue={10000}
            minimumTrackTintColor={accentColors.primaryLight}
            maximumTrackTintColor={accentColors.primaryDark}
            onValueChange={(val) => this.setState({radius: val})}
          />
          <View
            style={{
              backgroundColor: 'black',
              position: 'absolute',
              height: 400,
              bottom: 0,
              left: 0,
              right: 0,
            }}>
            <View
              style={{
                paddingTop: 5,
                borderBottomColor: 'gray',
                borderBottomWidth: 1,
              }}>
              <CategoriesSelection
                all={true}
                onSelectCategory={(newCategories) =>
                  (this.categories = newCategories)
                }
              />
            </View>

            <FlatList
              style={styles.eventsFlatList}
              data={this.state.events}
              renderItem={(item) =>
                eventItem(item, (e) => {
                  console.log(e.title);
                })
              }
              keyExtractor={(item) => item.id}
              ListFooterComponent={() => <View style={{height: 120}} />}
            />
          </View>
        </View>
      </View>
    );
  }
}

//Party
//Club
//Academic
//Recreation
//Outdoors
//Indoors
//Virtual
//Concert
//Festival
//Study
//Sports

// <View style={{position: 'absolute', top: 50, right: 10}}>
//   <TouchableOpacity onPress={() => this.modalRef.current?.open()}>
//     <Text>Open</Text>
//   </TouchableOpacity>
//   <TouchableOpacity onPress={() => this.modalRef.current?.close()}>
//     <Text>Close</Text>
//   </TouchableOpacity>
// </View>
// <View
//   style={{
//     position: 'absolute',
//     bottom: 300,
//     right: 0,
//     width: '100%',
//     backgroundColor: 'blue',
//   }}>
//   <Modalize
//     modalStyle={{backgroundColor: '#333'}}
//     handleStyle={{backgroundColor: 'white'}}
//     ref={this.modalRef}
//     alwaysOpen={true}
//     modalHeight={100}>
//     <Text style={{height: 300}}> hello world </Text>
//   </Modalize>
// </View>
const styles = StyleSheet.create({
  eventsFlatList: {},
});
