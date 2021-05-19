/* @flow */

import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import Fire from '../FirebaseHelper.js';
import FriendsView from '../tabs/FriendsView.js';
import EditProfileView from '../tabs/EditProfileView.js';
import UserQR from '../qrcode/UserQR.js';
import CustomHeader from '../pageComponents/CustomHeader.js';
import auth from '@react-native-firebase/auth';
import {format, formatDistance, isSameDay} from 'date-fns';
function formatPostedDate(date) {
  return formatDistance(date, new Date(), {addSuffix: true});
}

function formatStartEndDate(startDate, endDate) {
  if (isSameDay(startDate, endDate)) {
    return (
      format(startDate, 'eeee, MMMM dd · h:mm a - ') + format(endDate, 'h:mm a')
    );
  }
  return (
    format(startDate, 'eee, MMMM dd · h:mm a - ') +
    format(endDate, 'eee, MMMM dd · h:mm a')
  );
}
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
          addr: '214 Lynn Fells Parkway Melrose MA',
          startTime: new Date(),
          endTime: new Date(),
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
                uid={auth().currentUser.uid}
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
        <Text style={styles.nameText}>
          {this.state.first + ' ' + this.state.last}
        </Text>
        <Text style={styles.bio}>{this.state.bio}</Text>
        <View style={styles.divider} />
      </View>
    );
    return (
      <View style={styles.container}>
        <CustomHeader
          title="Profile"
          buttonComponent={
            <TouchableOpacity onPress={() => this.openEditProfileModal()}>
              <Text style={styles.editButton}>Edit Profile</Text>
            </TouchableOpacity>
          }
        />
        <FlatList
          ListHeaderComponent={userInfoView}
          renderItem={renderEventItem}
          data={this.state.userEvents}
          keyExtractor={(item) => item.id}
        />
        <EditProfileView r={this.editProfileModalRef} />
        <FriendsView ref={this.friendsModalRef} />
      </View>
    );
  }
}
const eventStyles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    color: 'white',
  },
  addressText: {
    fontSize: 15,
    color: 'gray',
  },
  timeText: {
    fontSize: 15,
    color: '#DDDD00',
  },
  postedText: {
    fontSize: 13,
    color: 'gray',
    fontStyle: 'italic',
    alignSelf: 'flex-end',
  },
  eventBubble: {
    height: 100,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#111',
    justifyContent: 'space-around',
  },
});
const renderEventItem = ({item}) => {
  return (
    <View>
      <Text style={eventStyles.postedText}>
        {formatPostedDate(item.posted)}
      </Text>
      <View style={eventStyles.eventBubble}>
        <Text style={eventStyles.timeText}>
          {formatStartEndDate(item.startTime, item.endTime)}
        </Text>
        <Text style={eventStyles.titleText}>{item.title}</Text>
        <Text style={eventStyles.addressText}>{item.addr}</Text>
      </View>
    </View>
  );
};
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
