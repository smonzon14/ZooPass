import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import DefaultStyles, {accentColors} from '../styles/Default.js';

//props:
//values : []
//selected: number
//callback: (item, i)=>void
export default (props) => {
  const [selected, setSelected] = useState(props.selected);

  return (
    <View>
      {props.values.map((item, i) => {
        return (
          <TouchableOpacity
            key={i}
            style={{flexDirection: 'row', marginTop: 20}}
            onPress={() => {
              props.callback(item, i);
              setSelected(i);
            }}>
            <Text style={DefaultStyles.regularText}>{item}</Text>
            <View
              style={
                i === selected ? styles.circleSelected : styles.circleUnselected
              }
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  circleUnselected: {
    position: 'absolute',
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'gray',
    alignSelf: 'center',
  },
  circleSelected: {
    position: 'absolute',
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderWidth: 5,
    borderColor: accentColors.primary,
  },
});
