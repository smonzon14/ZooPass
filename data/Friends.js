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
    return this.list;
  }
  static retrieveList() {
    this.list.length = 0;
    friendsCollection.get().then((snap) => {
      snap.forEach((doc) => {
        this.list.push({id: doc.id, ...doc.data()});
      });
    });
    return this.list;
  }
}

export default Friends;
