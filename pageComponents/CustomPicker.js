import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {Picker} from '@react-native-community/picker';
import DefaultStyles from '../styles/Default.js';
export default (props) => {
  const [selected, setSelected] = useState(props.values[0]);
  return (
    <View
      style={{
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
      }}>
      <Picker
        selectedValue={selected}
        itemStyle={{color: 'white'}}
        style={{height: 50, width: 100}}
        onValueChange={(item, i) => {
          props.callback(item, i);
          setSelected(item);
        }}>
        {props.values.map((item, i) => {
          return <Picker.Item label={item} value={item} key={i} />;
        })}
      </Picker>
    </View>
  );
};
