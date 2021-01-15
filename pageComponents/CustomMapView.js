import MapView from 'react-native-maps';
import React from 'react';
export default class CustomMapView extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <MapView
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    );
  }
}
