/* @flow */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';
import CustomPromptModal from '../pageComponents/CustomPromptModal.js';
import {Portal} from 'react-native-portalize';
import DatePicker from 'react-native-date-picker';
import OptionList from '../pageComponents/OptionList.js';
import DefaultStyles from '../styles/Default.js';
import {Modalize} from 'react-native-modalize';
import CustomHeader from '../pageComponents/CustomHeader.js';
import Fire from '../FirebaseHelper.js';
import {GendersEnum} from '../enums/Genders.js';
import {selectImageFile} from '../SystemImage.js';

export default class EditProfileView extends React.Component {
  constructor(props) {
    super(props);
    this.modalizeRef = props.r;
    this.state = {
      first: '',
      last: '',
      username: '',
      bio: '',
      gender: 0,
      birthday: new Date(),
      editGender: false,
      editBday: false,
      profilePhotoResourcePath: {},
      newPhoto: false,
    };
  }
  onOpen() {
    this.modalizeRef.current?.open();
  }
  onClose() {
    this.modalizeRef.current?.close();
  }

  componentDidMount() {
    this.getUserInfo();
  }
  getUserInfo() {
    return Fire.getCurrentUserInfo()
      .then((res) => {
        console.log(res);
        this.setState({
          first: res.first,
          last: res.last,
          username: res.username,
          bio: res.bio,
          gender: res.gender,
          profilePhotoResourcePath: res.photoURL ? {uri: res.photoURL} : {},
          birthday: res.birthday === null ? new Date() : new Date(res.birthday),
        });
        return res;
      })
      .catch(() => {
        return alert('Error', 'Error Retrieving User Information.');
      });
  }
  saveUserInfo() {
    return Fire.updateUserInfo(
      this.state.bio,
      this.state.gender,
      this.state.birthday,
    )
      .then((res) => {
        return this.state.profilePhotoResourcePath.uri && this.state.newPhoto
          ? Fire.updateUserProfileImage(this.state.profilePhotoResourcePath.uri)
          : false;
      })
      .then((res) => {
        //alert('Saved!', 'Successfully saved new user info.');
        return res;
      })
      .catch((err) => {
        console.log(err);
        alert(
          'Error',
          'There was an error saving your information. Please try again.',
        );
        return null;
      });
    //TODO: implement save user data
  }
  // const updateData = (list) => {
  //   this.setState({users: list});
  // };

  render() {
    return (
      <Portal>
        <Modalize
          ref={this.modalizeRef}
          modalStyle={{backgroundColor: '#333'}}
          handleStyle={{backgroundColor: 'white'}}
          HeaderComponent={
            <CustomHeader
              title="Edit Profile"
              top={10}
              buttonComponent={
                <TouchableOpacity onPress={() => this.onClose()}>
                  <Text style={DefaultStyles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
              }
            />
          }>
          <Image
            source={this.state.profilePhotoResourcePath}
            resizeMode="cover"
            style={{
              height: 100,
              width: 100,
              borderRadius: 50,
            }}
          />
          <TouchableOpacity
            onPress={() => {
              selectImageFile((source) => {
                this.setState({
                  profilePhotoResourcePath: source,
                  newPhoto: true,
                });
              });
            }}>
            <Text style={DefaultStyles.regularText}>Edit Photo</Text>
          </TouchableOpacity>
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
              this.setState({editBday: !this.state.editBday});
            }}>
            <Text style={DefaultStyles.regularText}>Edit Birthday</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (this.saveUserInfo() !== null) {
                this.onClose();
              }
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
              values={Object.keys(GendersEnum)}
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
            visible={this.state.editBday}
            onClose={() => {
              this.setState({editBday: false});
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
          <TouchableOpacity
            style={{backgroundColor: 'red', borderRadius: 5, padding: 10}}
            onPress={() => Fire.signOutUser()}>
            <Text style={DefaultStyles.boldText}>Sign Out</Text>
          </TouchableOpacity>
        </Modalize>
      </Portal>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  nameText: {
    marginLeft: 10,
    color: 'white',
    fontSize: 18,
  },
  usernameText: {
    marginLeft: 10,
    color: 'gray',
    fontSize: 12,
  },
});
