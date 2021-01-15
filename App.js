import {StyleSheet, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import Signup from './Signup.js';
import MasterTabView from './tabs/MasterTabView.js';
export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
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

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  });

  if (initializing) {
    return <View style={styles.loadingScreen} />;
  }

  if (!user) {
    return <Signup />;
  }

  return (
    <MasterTabView />
    // <SafeAreaView style={styles.background}>
    //   <Text style={styles.basicText}>Welcome {user.email}</Text>
    //   <TouchableOpacity
    //     style={styles.logoutBtn}
    //     onPress={() =>
    //       auth()
    //         .signOut()
    //         .then(() => console.log('logged out.'))
    //     }>
    //     <Text style={styles.logout}>Logout</Text>
    //   </TouchableOpacity>
    // </SafeAreaView>
  );
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
