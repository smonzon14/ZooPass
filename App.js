import {StyleSheet, View, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import Signup from './Signup.js';
import MasterTabView from './tabs/MasterTabView.js';
import Geocoder from 'react-native-geocoding';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';

async function requestUserNotificationPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  return enabled;
}

async function saveTokenToFirestore(token, uid) {
  return await firestore()
    .collection('tokens')
    .doc(uid)
    .update({tokens: firestore.FieldValue.arrayUnion(token)});
}

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [user, setUser] = useState(null);
  const [subscribersFCM, setSubscribersFCM] = useState([]);
  // this.options = {
  //   topBar: {
  //     visibility: 'none',
  //     title: {
  //       text: 'Hello World',
  //       color: 'white',
  //     },
  //     background: {
  //       color: 'black',
  //     },
  //   },
  // };
  // Handle user state changes
  async function checkUserNotificationPermission() {
    const enabled = await requestUserNotificationPermission();
    if (enabled) {
      console.log('notifications enabled; subscribing listeners');
      const messagingUnsubscribe = messaging().onMessage(
        async (remoteMessage) => {
          Alert.alert('In App Notification:', JSON.stringify(remoteMessage));
        },
      );
      const tokenUnsubscribe = messaging().onTokenRefresh(async (token) => {
        console.log('token: ' + token);
        return await saveTokenToFirestore(token, user.uid);
      });
      setSubscribersFCM([messagingUnsubscribe, tokenUnsubscribe]);
      messaging()
        .getToken()
        .then((token) => {
          console.log(token);
        });
    }
    return enabled;
  }

  useEffect(() => {
    const authUnsubscribe = auth().onAuthStateChanged((u) => {
      setUser(u);
      if (u) {
        checkUserNotificationPermission();
      } else {
        subscribersFCM.forEach((s, i) => {
          console.log('Unsubscribing messaging listener ' + i);
          s();
        });
        messaging().deleteToken();
      }
    });
    return authUnsubscribe;
  }, []);

  if (user) {
    console.log('Logged in as user: ' + user.uid);
    return <MasterTabView />;
  } else {
    console.log('SIGNUP');
    return <Signup />;
  }
}

const styles = StyleSheet.create({
  loadingScreen: {
    backgroundColor: 'blue',
    width: '100%',
    height: '100%',
  },
  background: {
    backgroundColor: '#000000',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  basicText: {
    color: 'white',
    fontSize: 20,
  },
  logout: {
    color: 'white',
    fontSize: 18,
  },
  logoutBtn: {
    width: '80%',
    backgroundColor: '#ff0000',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 40,
  },
});
