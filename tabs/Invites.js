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
  ActivityIndicator,
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
    this.state = {invites: [], nearbyPublicEvents: [], loading: true};
    //this.modalRef = React.createRef();
  }

  componentDidMount() {
    this.mounted = true;
    this.updateUserLocation().then(this.updateNearby);
  }
  componentWillUnmount() {
    this.mounted = false;
  }

  updateNearby = () => {
    console.log('Updating nearbyInvites');
    this.setState({loading: true});
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
        if (this.mounted) {
          this.setState({nearbyPublicEvents});
        }
        //alert('found ' + nearbyPublicEvents.length + ' nearbyPublicEvents in your area.');
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => this.setState({loading: false}));
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
            renderSectionFooter={this.renderNoEvents}
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
  renderNoEvents = ({section}) => {
    if (section.data.length === 0) {
      let text = 'No nearby events.';
      if (section.title === 'Invites') {
        text = 'No private event invites.';
      }
      return (
        <View style={styles.noEventsContainer}>
          {this.state.loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.noEventsText}>{text}</Text>
          )}
        </View>
      );
    }
    return null;
  };
}

const styles = StyleSheet.create({
  noEventsText: {
    color: 'gray',
    fontSize: 14,
    padding: 10,
  },
  noEventsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    color: 'white',
    padding: 15,
    fontSize: 18,
  },
});
