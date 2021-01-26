import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import functions from '@react-native-firebase/functions';

const usersCollection = firestore().collection('users');
const exploreCollection = firestore().collection('explore');

function authUser() {
  return auth().currentUser;
}

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
      ...(await FirebaseHelper.getUserPublicInfoWithUID(user.uid)),
      ...(await FirebaseHelper.getUserBaseInfoWithUID(user.uid)),
    };
  }
  static getUserBaseInfoWithUID(uid) {
    return firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then((snap) => {
        if (snap.exists) {
          return snap.data();
        }
        return {
          first: '',
          last: '',
          photoURL: null,
          username: null,
          invalidUser: true,
        };
      })
      .catch((err) => console.log(err));
  }
  static getUserPublicInfoWithUID(uid) {
    return firestore()
      .collection('users/' + uid + '/info')
      .doc('public')
      .get()
      .then((snap) => {
        if (snap.exists) {
          return snap.data();
        }
        return {bio: '', gender: 0, birthday: null, invalidUser: true};
      })
      .catch((err) => console.log(err));
  }
  static async getUsersMatching(text) {
    return await usersCollection
      .where('first', '>=', text)
      .where('first', '<=', text + '\uf8ff')
      .orderBy('first')
      .limit(10)
      .get();
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
      .doc('public')
      .set(
        {
          bio: bio,
          birthday: bday.toDateString(),
          gender: gender,
        },
        {merge: true},
      );
  }
  static sendFriendRequest(sendTo) {
    let sendReq = functions().httpsCallable('sendFriendRequest');
    return sendReq({sendTo})
      .then((res) => {
        console.log(res.data.message);
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        return;
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
