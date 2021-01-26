/* @flow weak */

import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import DefaultStyles from '../styles/Default.js';
import Fire from '../FirebaseHelper.js';
import Genders from '../enums/Genders.js';
const UserInfoView = (props) => {
  const [user, setUser] = useState(undefined);
  const [userPublicInfo, setUserPublicInfo] = useState({
    bio: '',
    gender: 0,
    birthday: null,
    invalidUser: false,
  });
  const setSelectedUser = (u) => {
    if (!u) {
      return;
    }
    console.log('nbadfhbswowfiwbfiosbdis: ' + u.id);
    setUser(u);
    Fire.getUserPublicInfoWithUID(u.id).then((info) => {
      console.log(info);
      setUserPublicInfo(info);
    });
  };

  useEffect(() => {
    setSelectedUser(props.getSelectedUser());
  }, [props]);

  const getUserAge = () => {
    if (userPublicInfo.birthday?.seconds) {
      const birthday = userPublicInfo.birthday.toDate();
      const ageDate = new Date(Date.now() - birthday);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    return 'N/A';
  };
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={DefaultStyles.titleText}>Profile</Text>
        <Text style={DefaultStyles.headerText}>
          {user?.first + ' ' + user?.last}
        </Text>
        <Text style={DefaultStyles.regularText}>{user?.username}</Text>
        <Text style={DefaultStyles.regularText}>
          Bio: {userPublicInfo?.bio}
        </Text>
        <Text style={DefaultStyles.regularText}>
          Gender: {Genders.valueToKey(userPublicInfo?.gender)}
        </Text>
        <Text style={DefaultStyles.regularText}>Age: {getUserAge()}</Text>
      </SafeAreaView>
    </View>
  );
};

export default UserInfoView;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    alignItems: 'center',
    flex: 1,
  },
});
