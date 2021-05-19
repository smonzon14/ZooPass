/* @flow weak */

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import DefaultStyles from '../styles/Default.js';
import Fire from '../FirebaseHelper.js';
import Friends from '../data/Friends.js';
import CustomHeader from '../pageComponents/CustomHeader.js';
const OtherUserInfoView = (props) => {
  const [userPublicInfo, setUserPublicInfo] = useState({
    bio: '',
    numEvents: 0,
    numFriends: 0,
  });
  const [isFriend, setIsFriend] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let isMounted = true;
    console.log('list: ' + Friends.getList());
    Fire.getFriendAndRequestStatus(props.userBase.id).then((status) => {
      if (status.error) {
      } else {
        if (isMounted) {
          setIsFriend(status.isFriend);
          setIsRequested(status.isRequested);

          setLoaded(true);
        }
      }
    });

    setUserPublicInfo(Fire.getUserPublicInfoWithUID(props.userBase.id));
    return () => (isMounted = false);
  }, [props.userBase.id]);

  return (
    <View>
      <CustomHeader title={props.userBase.first + ' ' + props.userBase.last} />
      <SafeAreaView style={styles.container}>
        <Image
          source={{uri: props.userBase.photoURL}}
          resizeMode="cover"
          style={{
            height: 150,
            width: 150,
            backgroundColor: 'black',
            borderRadius: 75,
            alignSelf: 'center',
          }}
        />
        <Text style={DefaultStyles.headerText}>
          {props.userBase.first + ' ' + props.userBase.last}
        </Text>
        {loaded && !isFriend && !isRequested && (
          <TouchableOpacity style={styles.addFriend}>
            <Text
              style={styles.friendButtonText}
              onPress={() => {
                Fire.sendFriendRequest(props.userBase.id).then((status) => {
                  if (status.error) {
                    alert('Error', 'could not send request');
                  } else {
                    setIsFriend(status.isFriend);
                    setIsRequested(status.isRequested);
                  }
                });
              }}>
              Add Friend
            </Text>
          </TouchableOpacity>
        )}
        {loaded && isFriend && (
          <TouchableOpacity style={styles.unfriend}>
            <Text
              style={styles.friendButtonText}
              onPress={() => {
                Fire.unfriend(props.userBase.id).then((status) => {
                  if (status.error) {
                    alert('Error', 'please try again.');
                  } else {
                    setIsFriend(status.isFriend);
                    setIsRequested(status.isRequested);
                  }
                });
              }}>
              Unfriend
            </Text>
          </TouchableOpacity>
        )}
        {loaded && isRequested && !isFriend && (
          <TouchableOpacity style={styles.unfriend}>
            <Text
              style={styles.friendButtonText}
              onPress={() => {
                Fire.unfriend(props.userBase.id).then((status) => {
                  if (status.error) {
                    alert('Error', 'please try again.');
                  } else {
                    setIsFriend(status.isFriend);
                    setIsRequested(status.isRequested);
                  }
                });
              }}>
              Requested
            </Text>
          </TouchableOpacity>
        )}

        <Text style={DefaultStyles.regularText}>{props.userBase.username}</Text>
        <Text style={DefaultStyles.regularText}>Bio: {userPublicInfo.bio}</Text>
      </SafeAreaView>
    </View>
  );
};

export default OtherUserInfoView;

const styles = StyleSheet.create({
  addFriend: {
    backgroundColor: '#0DD',
    borderRadius: 10,
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  unfriend: {
    backgroundColor: 'gray',
    borderRadius: 10,
    padding: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  friendButtonText: {
    color: 'white',
    fontSize: 15,
  },
  container: {
    alignItems: 'center',
    flex: 1,
  },
});
