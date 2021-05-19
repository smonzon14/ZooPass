/* @flow */

import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default class UserQR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: props.uid,
      logo: props.logo,
    };
  }
  render() {
    return (
      <QRCode
        value={this.state.uid}
        color="white"
        backgroundColor="black"
        size={200}
        ecl={'H'}
        logo={this.state.logo}
        logoBackgroundColor={'black'}
        logoSize={80}
        logoBorderRadius={40}
        logoMargin={5}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
