import {StyleSheet, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import Signup from './Signup.js';
import MasterTabView from './tabs/MasterTabView.js';
import Geocoder from 'react-native-geocoding';

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [user, setUser] = useState(null);
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
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((u) => {
      console.log('Auth changed: ' + u?.uid);
      setUser(u);
    });
    return subscriber; // unsubscribe on unmount
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
