/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import React from 'react';
// import firebase from '@react-native-firebase/app';
// import {
//   API_KEY,
//   AUTH_DOMAIN,
//   DATABASE_URL,
//   PROJECT_ID,
//   STORAGE_BUCKET,
//   MESSAGING_SENDER_ID,
//   APP_ID,
//   MEASUREMENT_ID,
// } from '@env';
//
// var firebaseConfig = {
//   apiKey: API_KEY,
//   authDomain: AUTH_DOMAIN,
//   databaseURL: DATABASE_URL,
//   projectId: PROJECT_ID,
//   storageBucket: STORAGE_BUCKET,
//   messagingSenderId: MESSAGING_SENDER_ID,
//   appId: APP_ID,
//   measurementId: MEASUREMENT_ID,
// };
//firebase.initializeApp(firebaseConfig);
//background messaging
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('background notification handled');
  // TODO: change in app parameters to show notification icons for invites/
  // friend requests.
});

function HeadlessCheck({isHeadless}) {
  return isHeadless ? null : <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
