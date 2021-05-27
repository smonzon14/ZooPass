import React, {Component} from 'react';
import {StyleSheet, Text, View, StatusBar, SafeAreaView} from 'react-native';
import Tabs from 'react-native-tabs';
import Invites from './Invites.js';
import Calendar from './Calendar.js';
import Create from './Create.js';
import Explore from './Explore.js';
import Profile from './Profile.js';
import {Host} from 'react-native-portalize';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {accentColors} from '../styles/Default.js';
import {
  faHome,
  faCalendarAlt,
  faPlus,
  faEnvelope,
  faUser,
  faCircle,
} from '@fortawesome/free-solid-svg-icons';
export default class MasterTabView extends Component {
  constructor(props) {
    super(props);
    this.createModalRef = React.createRef();
    this.invites = <Invites />;
    this.calendar = <Calendar />;
    this.explore = <Explore />;
    this.profile = <Profile />;
    this.create = <Create r={this.createModalRef} />;
    this.state = {page: 'Invites'};
  }

  openCreateModal = () => {
    this.createModalRef.current?.open();
  };

  render() {
    return (
      <Host>
        <View style={styles.container}>
          <StatusBar
            animated={true}
            barStyle={
              this.state.page === 'Explore' ? 'dark-content' : 'light-content'
            }
          />
          {true && this.create}

          <View style={styles.selectedPage}>
            {this.state.page === 'Invites' && this.invites}
            {this.state.page === 'Calendar' && this.calendar}
            {this.state.page === 'Explore' && this.explore}
            {this.state.page === 'Profile' && this.profile}
          </View>
          <Tabs
            selected={this.state.page}
            style={styles.tabBar}
            selectedStyle={{
              shadowColor: accentColors.secondaryDark,
              shadowOffset: {width: 0, height: 5},
              shadowOpacity: 0.9,
              shadowRadius: 5,

              borderBottomWidth: 2,
              marginBottom: -2,
              borderBottomColor: accentColors.secondary,
            }}
            onSelect={(el) => {
              if (el.props.name === 'Create') {
                this.openCreateModal();
              } else {
                this.setState({page: el.props.name});
              }
            }}>
            <View name="Invites" style={styles.tab}>
              <FontAwesomeIcon icon={faEnvelope} size={23} color="white" />
            </View>
            <View name="Calendar" style={styles.tab}>
              <FontAwesomeIcon icon={faCalendarAlt} size={23} color="white" />
            </View>
            <View name="Create" style={styles.createTab}>
              <FontAwesomeIcon
                icon={faPlus}
                size={23}
                mask={['fa', faCircle]}
                color="white"
              />
            </View>
            <View name="Explore" style={styles.tab}>
              <FontAwesomeIcon icon={faHome} size={23} color="white" />
            </View>
            <View name="Profile" style={styles.tab}>
              <FontAwesomeIcon icon={faUser} size={23} color="white" />
            </View>
          </Tabs>
        </View>
      </Host>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  selectedPage: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
  },
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: 'black',
    height: 70,
    shadowColor: 'red',
    opacity: 0.9,
  },
  tab: {
    padding: 5,
    bottom: 10,
    color: 'white',
  },
  selectedTab: {
    shadowColor: 'blue',
    shadowOffset: {width: 5, height: 5},
    shadowOpacity: 0.4,
    shadowRadius: 5,
    bottom: 5,
    color: 'white',
  },
  createTab: {
    backgroundColor: accentColors.primary,
    width: 40,
    height: 30,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 10,
    shadowColor: accentColors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  createModal: {
    backgroundColor: 'gray',
  },
});
