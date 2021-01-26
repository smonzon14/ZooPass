import {Modalize} from 'react-native-modalize';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Image,
} from 'react-native';
import React, {Component} from 'react';
export default (props) => {
  const onOpen = () => {
    props.r.current?.open();
  };
  const onClose = () => {
    props.r.current?.close();
  };
  //
  // snapPoint={600}
  return (
    <>
      <Modalize
        ref={props.r}
        modalStyle={{backgroundColor: 'black'}}
        handleStyle={{backgroundColor: 'white'}}>
        <View style={{backgroundColor: 'black'}}>
          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: 'black',
              alignSelf: 'flex-end',
              borderRadius: 10,
            }}>
            <Text
              style={{
                textAlign: 'center',
                padding: 10,
                textDecorationLine: 'underline',
                color: 'red',
              }}>
              Cancel
            </Text>
          </TouchableOpacity>
          {props.children}
        </View>
      </Modalize>
    </>
  );
};
