/* @flow weak */

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const uid = auth().currentUser.uid;
const friendsCollection = firestore()
  .collection('users')
  .doc(uid)
  .collection('friends');

let observer;
class Friends {
  static list = [];
  static listen(callback) {
    if (observer !== undefined) {
      return;
    }
    observer = friendsCollection.onSnapshot((collSnapshot) => {
      this.list.length = 0;
      console.log(this.list);
      collSnapshot.docs.map((doc) => {
        this.list.push({id: doc.id, ...doc.data()});
      });

      callback(this.list);
    });
  }
  static detatch() {
    if (observer === undefined) {
      return;
    }
    console.log('observer: ' + observer);
    observer();
    observer = undefined;
    console.log('Friends observer detatched.');
  }
  static getList() {
    console.log('FRIENDS: ' + this.list);
    return this.list;
  }
}

export default Friends;
