import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

const usersCollection = firestore().collection('users');
const exploreCollection = firestore().collection('explore');

function authUser() {
  const user = auth().currentUser;
  return {
    name: user.displayName,
    email: user.email,
    photoUrl: user.photoUrl,
    emailVerified: user.emailVerified,
    uid: user.uid,
  };
}

class FirebaseHelper {
  constructor() {
    this.user = authUser();
  }
  //Create
  async shareEvent(event, image = null) {
    return await usersCollection
      .doc(this.user.uid)
      .collection('events')
      .add(event)
      .then(async (e) => {
        console.log(e);
        if (image) {
          const reference = storage().ref(
            'events/' + this.user.uid + '/' + e.id,
          );
          return await reference.putFile(image).then(async () => {
            return usersCollection
              .doc(this.user.uid)
              .collection('events')
              .doc(e.id)
              .update({imageReference: await reference.getDownloadURL()});
          });
        }
      });
  }

  //Read
  async getCurrentUserInfo() {
    return await {
      ...(await FirebaseHelper.getUserPublicInfoWithUID(this.user.uid)),
      ...this.user,
    };
  }
  static async getUserPublicInfoWithUID(uid) {
    let doc = await usersCollection.doc(uid).get();
    if (!doc.exists) {
      return {};
    } else {
      return doc.data();
    }
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
  updateEmail(email) {
    return this.user
      .updateEmail(email)
      .then(() => 'successfully changed email to ' + email)
      .catch((e) => e);
  }
  async updateUserInfo(bio, gender, bday) {
    return await usersCollection.doc(this.user.uid).update({
      bio: bio,
      birthday: bday.toDateString(),
      gender: gender,
    });
  }
}

export default new FirebaseHelper();
export {FirebaseHelper};
