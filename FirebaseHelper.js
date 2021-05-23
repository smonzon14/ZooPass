import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import functions from '@react-native-firebase/functions';

const usersCollection = firestore().collection('users');
const exploreCollection = firestore().collection('explore');

function authUser() {
  return auth().currentUser;
}
const sendReq = functions().httpsCallable('sendFriendRequest');
const removeFriend = functions().httpsCallable('removeFriend');
const getStatus = functions().httpsCallable('getFriendAndRequestStatus');
class FirebaseHelper {
  //Create
  static async shareEvent(event, image = null) {
    const user = authUser();
    return await usersCollection
      .doc(user.uid)
      .collection('events')
      .add(event)
      .then(async (e) => {
        console.log(e);
        if (image) {
          const reference = storage().ref('events/' + user.uid + '/' + e.id);
          return await reference.putFile(image).then(async () => {
            return usersCollection
              .doc(user.uid)
              .collection('events')
              .doc(e.id)
              .update({imageReference: await reference.getDownloadURL()});
          });
        }
      });
  }
  static async updateUserProfileImage(resourcePath) {
    const reference = storage().ref('users/' + authUser().uid);
    return await reference.putFile(resourcePath);
  }
  //Read
  static async getCurrentUserInfo() {
    const user = authUser();
    return {
      email: user.email,
      created: new Date(user.metadata.creationTime),
      ...(await FirebaseHelper.getUserPrivateInfoWithUID(user.uid)),
      ...(await FirebaseHelper.getUserBaseInfoWithUID(user.uid)),
      ...(await FirebaseHelper.getUserPublicInfoWithUID(user.uid)),
    };
  }
  // Returns:{
  // first
  // last
  // photoURL
  // username }
  static getUserBaseInfoWithUID(uid) {
    return firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then((snap) => {
        if (snap.exists) {
          return {...snap.data(), invalidUser: false};
        }
        return {
          invalidUser: true,
        };
      })
      .catch((err) => console.log(err));
  }
  // Returns: {
  // bio
  // numEvents
  // numFriends }
  static getUserPublicInfoWithUID(uid) {
    return firestore()
      .collection('users/' + uid + '/info')
      .doc('public')
      .get()
      .then((snap) => {
        if (snap.exists) {
          return {...snap.data(), invalidUser: false};
        }
        return {invalidUser: true};
      })
      .catch((err) => console.log(err));
  }
  // Returns:
  // {numRequests
  // Gender
  // birthday
  // usernameUpdate}
  static getUserPrivateInfoWithUID(uid) {
    return firestore()
      .collection('users/' + uid + '/info')
      .doc('private')
      .get()
      .then((snap) => {
        if (snap.exists) {
          return {...snap.data(), invalidUser: false};
        }
        return {invalidUser: true};
      })
      .catch((err) => console.log(err));
  }
  static getUsersMatching(text) {
    return usersCollection
      .where('first', '>=', text)
      .where('first', '<=', text + '\uf8ff')
      .orderBy('first')
      .limit(20)
      .get()
      .then((snap) => {
        const results = [];
        console.log('Hello');
        snap.docs.map((user) => {
          results.push({...user.data(), id: user.id});
        });
        return results;
      });
  }
  //Update
  static updateEmail(email) {
    return authUser()
      .updateEmail(email)
      .then(() => 'successfully changed email to ' + email)
      .catch((e) => e);
  }
  static async updateUserInfo(bio, gender, bday) {
    return await firestore()
      .collection('users/' + authUser().uid + '/info')
      .doc('private')
      .set(
        {
          birthday: bday.toDateString(),
          gender: gender,
        },
        {merge: true},
      )
      .then(async () => {
        return await firestore()
          .collection('users/' + authUser().uid + '/info')
          .doc('public')
          .set({bio: bio}, {merge: true});
      });
  }
  static getFriendAndRequestStatus(friend) {
    return getStatus({friend}).then((res) => {
      return res.data;
    });
  }
  static sendFriendRequest(sendTo) {
    return sendReq({sendTo}).then((res) => {
      console.log(res.data.message);
      return res.data;
    });
  }
  static unfriend(friend) {
    return removeFriend({friend}).then((res) => {
      console.log(res.data.message);
      return res.data;
    });
  }
  static signOutUser() {
    return auth()
      .signOut()
      .then(() => {
        console.log('user signed out');
      })
      .catch((err) => {
        console.log('error signing user out: ' + err);
      });
  }
}

export default FirebaseHelper;
