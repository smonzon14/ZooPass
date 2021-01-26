import React, {Component} from 'react';
import {StyleSheet, Text, View, StatusBar, SafeAreaView} from 'react-native';
import Tabs from 'react-native-tabs';
import Invites from './Invites.js';
import Calendar from './Calendar.js';
import Create from './Create.js';
import Explore from './Explore.js';
import Profile from './Profile.js';
import CustomHeader from '../pageComponents/CustomHeader.js';
import {Host} from 'react-native-portalize';
export default class MasterTabView extends Component {
  state = {page: 'Invites', createShowing: false};
  modalRef = React.createRef();
  views = {
    Invites: <Invites />,
    Calendar: <Calendar />,
    Explore: <Explore />,
    Profile: <Profile />,
  };
  openCreateModal = () => {
    this.modalRef.current?.open();
  };
  getTabComponent() {
    return this.views[this.state.page];
  }
  render() {
    return (
      <Host>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" />
          <Create r={this.modalRef} />
          <CustomHeader title={this.state.page} />
          <View style={styles.selectedPage}>{this.getTabComponent()}</View>

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
