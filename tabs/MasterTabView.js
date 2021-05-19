import React, {Component} from 'react';
import {StyleSheet, Text, View, StatusBar, SafeAreaView} from 'react-native';
import Tabs from 'react-native-tabs';
import Invites from './Invites.js';
import Calendar from './Calendar.js';
import Create from './Create.js';
import Explore from './Explore.js';
import Profile from './Profile.js';
import {Host} from 'react-native-portalize';

export default class MasterTabView extends Component {
  constructor(props) {
    super(props);
    this.invites = <Invites />;
    this.calendar = <Calendar />;
    this.explore = <Explore />;
    this.profile = <Profile />;
  }
  state = {page: 'Invites', createShowing: false};
  createModalRef = React.createRef();

  openCreateModal = () => {
    this.createModalRef.current?.open();
  };

  render() {
    return (
      <Host>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" />
          <Create r={this.createModalRef} />

          <View style={styles.selectedPage}>
            {this.state.page === 'Invites' && this.invites}
            {this.state.page === 'Calendar' && this.calendar}
            {this.state.page === 'Explore' && this.explore}
            {this.state.page === 'Profile' && this.profile}
          </View>

          <Tabs
            selected={this.state.page}
            style={{backgroundColor: 'black'}}
            selectedStyle={{color: 'red'}}
            onSelect={(el) => {
              if (el.props.name === 'Create') {
                this.openCreateModal();
              } else {
                this.setState({page: el.props.name});
              }
            }}>
            <Text name="Invites" style={styles.tab}>
              Invites
            </Text>
            <Text name="Calendar" style={styles.tab}>
              Calendar
            </Text>
            <Text name="Create" style={styles.tab}>
              Create
            </Text>
            <Text name="Explore" style={styles.tab}>
              Explore
            </Text>
            <Text name="Profile" style={styles.tab}>
              Profile
            </Text>
          </Tabs>
        </SafeAreaView>
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
  tab: {
    color: 'white',
  },
  createModal: {
    backgroundColor: 'gray',
  },
});
