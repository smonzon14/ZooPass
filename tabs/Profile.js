/* @flow */

import React, {Picker, Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Modal,
  TouchableOpacity,
} from 'react-native';
import OptionList from '../pageComponents/OptionList.js';
import DefaultStyles from '../styles/Default.js';
import CustomPicker from '../pageComponents/CustomPicker.js';
import Genders from '../enums/Genders.js';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import CustomPromptModal from '../pageComponents/CustomPromptModal.js';
import Fire, {FirebaseHelper} from '../FirebaseHelper.js';
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.userInfo = this.getUserInfo();
    this.state = {
      bio: '',
      gender: 0,
      birthday: new Date(),
      editGender: false,
      editBDay: false,
    };
  }
  getUserInfo() {
    return Fire.getCurrentUserInfo()
      .then((res) => {
        console.log(res);
        this.setState({
          bio: res.bio,
          gender: res.gender,
          birthday: res.birthday === null ? new Date() : new Date(res.birthday),
        });
        return res;
      })
      .catch(() => {
        return alert('Error', 'Error Retrieving User Information.');
      });
  }
  saveUserInfo() {
    return new FirebaseHelper()
      .updateUserInfo(this.state.bio, this.state.gender, this.state.birthday)
      .then((res) => {
        alert('Saved!', 'Successfully saved new user info.');
        return res;
      })
      .catch(() => {
        return alert('Error', 'Error Saving User Information.');
      });
    //TODO: implement save user data
  }
  componentWillUnmount() {
    console.log('unmount');
  }
  render() {
    return (
      <View style={DefaultStyles.container}>
        <TextInput
          style={DefaultStyles.textInput}
          placeholder="bio"
          defaultValue={this.state.bio}
          onChangeText={(text) => this.setState({bio: text})}
        />
        <TouchableOpacity
          onPress={() => {
            this.setState({editGender: !this.state.editGender});
          }}>
          <Text style={DefaultStyles.regularText}>Edit Gender</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.setState({editBDay: !this.state.editBDay});
          }}>
          <Text style={DefaultStyles.regularText}>Edit Birthday</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            this.saveUserInfo();
          }}>
          <Text style={DefaultStyles.headerText}>SAVE</Text>
        </TouchableOpacity>
        <CustomPromptModal
          title="Gender"
          closeText="Close"
          visible={this.state.editGender}
          onClose={() => {
            this.setState({editGender: false});
          }}>
          <OptionList
            values={Object.keys(Genders)}
            selected={this.state.gender}
            callback={(item, i) => {
              console.log(item);
              this.setState({gender: i});
            }}
          />
        </CustomPromptModal>
        <CustomPromptModal
          title="Birthday"
          closeText="Close"
          visible={this.state.editBDay}
          onClose={() => {
            this.setState({editBDay: false});
          }}>
          <DatePicker
            date={this.state.birthday}
            onDateChange={(d) => {
              this.setState({birthday: d});
              console.log(d);
            }}
            textColor="white"
            mode="date"
            maximumDate={new Date(2008, 0, 0)}
          />
        </CustomPromptModal>
      </View>
    );
  }
}
// <CustomPicker
//   title="Gender"
//   values={Object.keys(Genders)}
//   callback={(item, i) => {
//     this.setState({gender: i});
//     console.log(i);
//   }}
// />

// <DropDownPicker
//   items={Object.keys(Genders).map((k, i) => {
//     return {label: k, value: k, key: i};
//   })}
//   itemStyle={{justifyContent: 'flex-start'}}
//   placeholder="hello world"
//   defaultValue={Genders[this.state.gender]}
//   onChangeItem={(item) => {
//     console.log(item.value);
//     this.setState({gender: item.key});
//   }}
// />
