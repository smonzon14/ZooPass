/* @flow weak */

import React, {useRef, useEffect} from 'react';
import {View, Text, StyleSheet, Animated, Easing} from 'react-native';

class QRBorder extends React.Component {
  constructor(props) {
    super(props);
    this.spinValue = new Animated.Value(0);
    this.spin();
  }
  spin() {
    this.spinValue.setValue(0);
    Animated.loop(
      Animated.timing(this.spinValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
        Easing: Easing.Linear,
      }),
    ).start();
  }

  render() {
    const val = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.spinner,
            {
              transform: [
                {
                  rotate: val,
                },
              ],
            },
          ]}
        />
      </View>
    );
  }
}

export default QRBorder;

const styles = StyleSheet.create({
  container: {
    borderWidth: 20,
    borderColor: 'gray',
    width: 100,
    height: 100,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  spinner: {
    width: 100,
    height: 100,
    backgroundColor: 'transparent',
    borderRadius: 50,
    borderColor: 'gray',
    borderBottomColor: 'red',
    borderWidth: 20,
  },
});
