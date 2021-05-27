/* @flow */

import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import Fire from '../FirebaseHelper.js';
import FriendsView from '../tabs/FriendsView.js';
import EditProfileView from '../tabs/EditProfileView.js';
import UserQR from '../qrcode/UserQR.js';
import CustomHeader from '../pageComponents/CustomHeader.js';
import auth from '@react-native-firebase/auth';
import {eventItem} from '../pageComponents/ListItems.js';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.friendsModalRef = React.createRef();
    this.editProfileModalRef = React.createRef();
    this.state = {
      first: '',
      last: '',
      username: '',
      bio: '',
      gender: 0,
      birthday: new Date(),
      editGender: false,
      editBDay: false,
      profilePhotoResourcePath: {uri: ''},
    };
  }
  componentDidMount() {
    this.getUserInfo();
    this.getUserEvents();
  }
  getUserInfo() {
    return Fire.getCurrentUserInfo()
      .then((res) => {
        console.log(res.photoURL);

        this.setState({
          first: res.first,
          last: res.last,
          username: res.username,
          bio: res.bio,
          gender: res.gender,
          profilePhotoURI: res.photoURL,
          birthday: res.birthday === null ? new Date() : new Date(res.birthday),
        });
        return res;
      })
      .catch(() => {
        return alert('Error', 'Error Retrieving User Information.');
      });
  }
  getUserEvents() {
    this.setState({
      userEvents: [
        {
          id: '12345678910',
          title: 'Hello World',
          address: '214 Lynn Fells Parkway Melrose MA',
          start: new Date(),
          end: new Date(),
          posted: new Date(),
        },
      ],
    });
  }

  openEditProfileModal() {
    this.editProfileModalRef.current?.open();
  }
  openFriendsModal() {
    this.friendsModalRef.current?.open();
  }
  render() {
    const userInfoView = (
      <View>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.qrcontainer}>
            {this.state.profilePhotoURI && (
              <UserQR
                style={styles.qrcode}
                uid={auth().currentUser?.uid}
                logo={{uri: this.state.profilePhotoURI}}
              />
            )}
          </View>
          <View
            style={{
              alignItems: 'center',
              flex: 1,
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity onPress={() => this.openFriendsModal()}>
              <Text style={styles.friendsButton}>Friends</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.openFriendsModal()}>
              <Text style={styles.friendsButton}>Events</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.bio}>{this.state.bio}</Text>
        <View style={styles.divider} />
      </View>
    );
    return (
      <View style={styles.container}>
        <CustomHeader
          fontSize={22}
          title={this.state.first + ' ' + this.state.last}
          buttonComponent={
            <TouchableOpacity onPress={() => this.openEditProfileModal()}>
              <Text style={styles.editButton}>Edit Profile</Text>
            </TouchableOpacity>
          }
        />
        <FlatList
          ListHeaderComponent={userInfoView}
          renderItem={(item) => eventItem(item, () => {})}
          data={this.state.userEvents}
          keyExtractor={(item) => item.id}
        />
        <EditProfileView r={this.editProfileModalRef} />
        <FriendsView ref={this.friendsModalRef} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  nameText: {
    padding: 5,
    marginTop: 10,
    color: 'white',
    fontSize: 25,
  },
  container: {
    flexDirection: 'column',
    backgroundColor: 'black',
    flex: 1,
  },
  qrcode: {
    alignSelf: 'center',
  },
  qrcontainer: {
    width: 200,
    height: 200,
    padding: 5,
  },
  friendsButton: {
    borderRadius: 5,
    borderColor: 'gray',
    color: 'white',
    fontSize: 20,
  },
  editButton: {
    color: 'white',
    borderRadius: 5,
    borderWidth: 2,
    alignSelf: 'center',
    borderColor: 'gray',
    fontSize: 15,
    padding: 5,
  },
  bio: {
    fontSize: 15,
    padding: 5,
    color: 'gray',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    margin: 5,
    width: '100%',
  },
});
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
