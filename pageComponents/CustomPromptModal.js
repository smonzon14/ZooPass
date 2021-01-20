import React, {Picker, Component, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';

import OptionList from '../pageComponents/OptionList.js';
import Genders from '../enums/Genders.js';
import DefaultStyles from '../styles/Default.js';
export default (props) => {
  // const [visible, setVisible] = useState(false);
  // props.open(setVisible);
  return (
    <Modal animationType="fade" transparent={true} visible={props.visible}>
      <View style={{...styles.centeredView, backgroundColor: 'transparent'}}>
        <Pressable
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#000000b0',
          }}
          onPress={props.onClose}
        />
        <View style={styles.modalView}>
          <View>
            <Text
              style={{
                ...DefaultStyles.headerText,
                position: 'absolute',
                left: 0,
                top: 0,
                textAlign: 'left',
              }}>
              {props.title}
            </Text>
            <TouchableOpacity onPress={props.onClose}>
              <Text
                style={{
                  ...DefaultStyles.regularText,
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  color: 'red',
                  textAlign: 'right',
                  textDecorationLine: 'underline',
                }}>
                {props.closeText}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              zIndex: -1,
              paddingRight: 5,
              paddingTop: 20,
            }}>
            {props.children}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'black',
  },
  modalView: {
    zIndex: 5,
    minWidth: 200,
    maxWidth: 400,
    backgroundColor: '#303030',
    borderRadius: 20,
    padding: 15,
  },
});
