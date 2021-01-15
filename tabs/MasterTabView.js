import React, {Component, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Tabs from 'react-native-tabs';
import Invites from './Invites.js';
import Calendar from './Calendar.js';
import Create from './Create.js';
import Explore from './Explore.js';
import Profile from './Profile.js';
//import Sheet from 'react-modal-sheet';
import {Modalize} from 'react-native-modalize';
import DefaultStyles from '../styles/Default.js';
import CustomHeader from '../pageComponents/CustomHeader.js';
export default class MasterTabView extends Component {
  state = {page: 'Invites', createShowing: false};
  modalRef = React.createRef();
  views = {
    Invites: <Invites />,
    Calendar: <Calendar />,
    Explore: <Explore />,
    Profile: <Profile />,
  };
  onOpen = () => {
    this.modalRef.current?.open();
  };
  getTabComponent() {
    return this.views[this.state.page];
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Modal r={this.modalRef} />
        <CustomHeader title={this.state.page} />
        <View style={styles.selectedPage}>{this.getTabComponent()}</View>

        <Tabs
          selected={this.state.page}
          style={{backgroundColor: 'black'}}
          selectedStyle={{color: 'red'}}
          onSelect={(el) => {
            if (el.props.name === 'Create') {
              this.onOpen();
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
      </View>
    );
  }
}
export const Modal = (props) => {
  const onOpen = () => {
    props.r.current?.open();
  };
  const onClose = () => {
    props.r.current?.close();
  };
  return (
    <>
      <Modalize ref={props.r}>
        <TouchableOpacity
          onPress={onClose}
          style={{height: 100, width: 100, backgroundColor: 'blue'}}>
          <Text>Close the modal</Text>
        </TouchableOpacity>
        <Create />
      </Modalize>
    </>
  );
};
// <button onClick={() => this.setState({createShowing: true})}>
//   Open sheet
// </button>
//
// <Sheet
//   isOpen={this.state.createShowing}
//   onClose={() => this.setState({createShowing: false})}>
//   <Sheet.Container>
//     <Sheet.Header />
//     <Sheet.Content>{/* Your sheet content goes here */}</Sheet.Content>
//   </Sheet.Container>
//
//   <Sheet.Backdrop />
// </Sheet>
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
