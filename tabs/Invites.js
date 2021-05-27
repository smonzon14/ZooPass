import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  SectionList,
} from 'react-native';
import DefaultStyles, {accentColors} from '../styles/Default.js';
import {eventItem} from '../pageComponents/ListItems.js';
import CustomHeader from '../pageComponents/CustomHeader.js';
import GetLocation from 'react-native-get-location';
import functions from '@react-native-firebase/functions';
const findEventsInRange = functions().httpsCallable('findEventsInRange');
export default class Invites extends Component {
  constructor(props) {
    super(props);
    this.state = {invites: [], nearbyPublicEvents: []};
    //this.modalRef = React.createRef();
  }

  componentDidMount() {
    this.updateUserLocation().then(this.updateNearby);
  }

  updateNearby = () => {
    console.log('Updating nearbyInvites');
    const center = [
      this.state.userLocation.latitude,
      this.state.userLocation.longitude,
    ];
    findEventsInRange({
      center: center,
      radiusInM: 1600,
      categories: ['All'],
    })
      .then((res) => {
        const nearbyPublicEvents = res.data;
        nearbyPublicEvents.forEach((e, i) => {
          ['posted', 'start', 'end'].forEach((key) => {
            nearbyPublicEvents[i][key] = new Date(
              nearbyPublicEvents[i][key]._seconds * 1000,
            );
          });
        });
        console.log('nearbyPublicEvents: ' + nearbyPublicEvents);
        this.setState({nearbyPublicEvents});
        //alert('found ' + nearbyPublicEvents.length + ' nearbyPublicEvents in your area.');
      })
      .catch((err) => {
        console.log(err);
      });
  };
  updateUserLocation = () => {
    return GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    })
      .then((location) => {
        this.userIsLocated = true;
        this.setState({
          userLocation: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        });
        return this.state.userLocation;
      })
      .catch((err) => {
        return null;
      });
  };
  render() {
    return (
      <View style={DefaultStyles.container}>
        <SafeAreaView>
          <SectionList
            sections={[
              {title: 'Invites', data: this.state.invites},
              {title: 'In the area.', data: this.state.nearbyPublicEvents},
            ]}
            keyExtractor={(e) => e.id}
            renderItem={eventItem}
            renderSectionHeader={({section: {title}}) => {
              return <CustomHeader title={title} />;
            }}
          />
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    color: 'white',
    padding: 15,
    fontSize: 18,
  },
});
