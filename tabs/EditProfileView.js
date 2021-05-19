/* @flow */

import React, {Component, forwardRef, useState, useRef, useEffect} from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  Image,
} from 'react-native';
import CustomPromptModal from '../pageComponents/CustomPromptModal.js';
import {Portal} from 'react-native-portalize';
import DatePicker from 'react-native-date-picker';
import OptionList from '../pageComponents/OptionList.js';
import Friends from '../data/Friends.js';
import UsersFlatList from '../pageComponents/UsersFlatList.js';
import Modal from '../pageComponents/PageModal.js';
import DefaultStyles from '../styles/Default.js';
import {Modalize} from 'react-native-modalize';
import CustomHeader from '../pageComponents/CustomHeader.js';
import Fire from '../FirebaseHelper.js';
import Genders, {GendersEnum} from '../enums/Genders.js';
import {selectImageFile} from '../SystemImage.js';

const userItem = ({item}) => {
  return (
    <View style={{flexDirection: 'row', padding: 10}}>
      <Image
        source={{uri: item.photoURL}}
        resizeMode="cover"
        style={{
          height: 60,
          width: 60,
          backgroundColor: 'black',
          borderRadius: 30,
        }}
      />
      <View style={{alignSelf: 'center'}}>
        <Text style={styles.nameText}>{item.first + ' ' + item.last}</Text>
        <Text style={styles.usernameText}>{item.username}</Text>
      </View>
    </View>
  );
};
const NoFriendsComponent = () => {
  return <Text style={styles.text}>No Friends Yet!</Text>;
};
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(
  TouchableOpacity,
);

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
        </Modalize>
      </Portal>
    );
  }

  // <Modal r={this.props.r} flatListProps={this.flatListProps} />
  // <SafeAreaView style={styles.container}>
  //   <FlatList
  //     data={this.state.users}
  //     renderItem={userItem}
  //     ListEmptyComponent={NoFriendsComponent()}
  //     keyExtractor={(item) => item.id}
  //   />
  // </SafeAreaView>
  // </Modal>
}

// export default forwardRef((_, ref) => {
//   const modalizeRef = ref;
//   const contentRef = useRef(null);
//   const scrollY = useRef(new Animated.Value(0)).current;
//   const [users, setUsers] = useState([]);
//   const [first, setFirst] = useState('');
//   const [last, setLast] = useState('');
//   const [username, setUsername] = useState('');
//   const [bio, setBio] = useState('');
//   const [birthday, setBirthday] = useState(null);
//   const [gender, setGender] = useState(0);
//   const [editBday, setEditBday] = useState(false);
//   const [editGender, setEditGender] = useState(false);
//   const [profilePhotoResourcePath, setProfilePhotoResourcePath] = useState({});
//   function getUserInfo() {
//     return Fire.getCurrentUserInfo()
//       .then((res) => {
//         console.log(res);
//         setFirst(res.first);
//         setLast(res.last);
//         setUsername(res.username);
//         setBio(res.bio);
//         setGender(res.gender);
//         setProfilePhotoResourcePath(res.photoURL ? {uri: res.photoURL} : {});
//         setBirthday(
//           res.birthday === null ? new Date() : new Date(res.birthday),
//         );
//         return res;
//       })
//       .catch(() => {
//         return alert('Error', 'Error Retrieving User Information.');
//       });
//   }
//   // const updateData = (list) => {
//   //   this.setState({users: list});
//   // };
//
//   const onOpen = () => {
//     modalizeRef.current?.open();
//   };
//   const onClose = () => {
//     modalizeRef.current?.close();
//   };
//   const renderButtonComponent = () => (
//     <TouchableOpacity onPress={() => console.log('Pressed')}>
//       <Text style={DefaultStyles.headerText}>+</Text>
//     </TouchableOpacity>
//   );
//   const renderHeader = () => (
//     <CustomHeader
//       title="Edit Profile"
//       top={10}
//       buttonComponent={renderButtonComponent()}
//     />
//   );
//   return (
//     <Portal>
//       <Modalize
//         ref={modalizeRef}
//         modalStyle={{backgroundColor: '#333'}}
//         handleStyle={{backgroundColor: 'white'}}
//         HeaderComponent={renderHeader}>
//         <Image
//           source={profilePhotoResourcePath}
//           resizeMode="cover"
//           style={{
//             height: 100,
//             width: 100,
//             borderRadius: 50,
//           }}
//         />
//         <TouchableOpacity
//           onPress={() => {
//             selectImageFile((source) => {
//               setProfilePhotoResourcePath(source);
//             });
//           }}>
//           <Text style={DefaultStyles.regularText}>Edit Photo</Text>
//         </TouchableOpacity>
//         <TextInput
//           style={DefaultStyles.textInput}
//           placeholder="bio"
//           defaultValue={bio}
//           onChangeText={(text) => setBio(text)}
//         />
//         <TouchableOpacity
//           onPress={() => {
//             setEditGender(!editGender);
//           }}>
//           <Text style={DefaultStyles.regularText}>Edit Gender</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => {
//             setEditBday(!editBday);
//           }}>
//           <Text style={DefaultStyles.regularText}>Edit Birthday</Text>
//         </TouchableOpacity>
//
//         <TouchableOpacity
//           onPress={() => {
//             saveUserInfo();
//           }}>
//           <Text style={DefaultStyles.headerText}>SAVE</Text>
//         </TouchableOpacity>
//         <CustomPromptModal
//           title="Gender"
//           closeText="Close"
//           visible={editGender}
//           onClose={() => {
//             setEditGender(false);
//           }}>
//           <OptionList
//             values={Object.keys(GendersEnum)}
//             selected={gender}
//             callback={(item, i) => {
//               console.log(item);
//               setGender(i);
//             }}
//           />
//         </CustomPromptModal>
//         <CustomPromptModal
//           title="Birthday"
//           closeText="Close"
//           visible={editBday}
//           onClose={() => {
//             setEditBday(false);
//           }}>
//           <DatePicker
//             date={birthday}
//             onDateChange={(d) => {
//               setBirthday(d);
//               console.log(d);
//             }}
//             textColor="white"
//             mode="date"
//             maximumDate={new Date(2008, 0, 0)}
//           />
//         </CustomPromptModal>
//       </Modalize>
//     </Portal>
//     // <Modal r={this.props.r} flatListProps={this.flatListProps} />
//     // <SafeAreaView style={styles.container}>
//     //   <FlatList
//     //     data={this.state.users}
//     //     renderItem={userItem}
//     //     ListEmptyComponent={NoFriendsComponent()}
//     //     keyExtractor={(item) => item.id}
//     //   />
//     // </SafeAreaView>
//     // </Modal>
//   );
// });
const s = StyleSheet.create({
  item: {
    alignItems: 'flex-start',

    padding: 15,

    borderBottomColor: '#f9f9f9',
    borderBottomWidth: 1,
  },

  item__name: {
    fontSize: 16,

    marginBottom: 5,
  },

  item__email: {
    fontSize: 14,
    fontWeight: '200',
    color: '#666',
  },

  floating: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,

    position: 'absolute',
    right: 20,
    bottom: 20,

    width: 60,
    height: 60,

    borderRadius: 30,
    backgroundColor: '#333',
  },

  floating__text: {
    fontSize: 16,
    color: '#fff',
  },
});
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
