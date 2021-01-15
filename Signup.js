import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
//import auth from 'firebase/auth';

async function CreateUser(email, password, first, last) {
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then((response) => {
      const uid = response.user.uid;
      const data = {
        id: uid,
        email,
        first,
        last,
      };
      const usersRef = firestore().collection('users');
      usersRef
        .doc(uid)
        .set(data)
        .then(() => {
          console.log('logged in.');
        });
    })
    .catch((error) => {
      alert(error);
    });
}
async function LoginUser(email, password) {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then((response) => {
      const uid = response.user.uid;
      const data = {
        id: uid,
        email,
      };
      const usersRef = firestore().collection('users');
      usersRef
        .doc(uid)
        .get()
        .then((doc) => {
          console.log('Got user data: ' + doc.data());
        });
    })
    .catch((error) => {
      alert(error);
    });
}
export default class Signup extends React.Component {
  state = {email: '', password: '', first: '', last: '', signingUp: true};

  render() {
    return (
      <View>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.background}>
          <View style={this.state.signingUp ? styles.inputView : styles.hidden}>
            <TextInput
              style={styles.inputText}
              placeholder="First Name"
              placeholderTextColor="white"
              onChangeText={(text) => this.setState({first: text})}
            />
          </View>
          <View style={this.state.signingUp ? styles.inputView : styles.hidden}>
            <TextInput
              style={styles.inputText}
              placeholder="Last Name"
              placeholderTextColor="white"
              onChangeText={(text) => this.setState({last: text})}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Email"
              placeholderTextColor="white"
              onChangeText={(text) => this.setState({email: text})}
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Password"
              secureTextEntry={true}
              textContentType={'oneTimeCode'}
              password={true}
              placeholderTextColor="white"
              onChangeText={(text) => this.setState({password: text})}
            />
          </View>
          <View style={this.state.signingUp ? styles.inputView : styles.hidden}>
            <TextInput
              style={styles.inputText}
              placeholder="Re-Type Password"
              secureTextEntry={true}
              password={true}
              placeholderTextColor="white"
            />
          </View>

          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              this.state.signingUp ? styles.signupBtn : styles.signUpBtnOff
            }
            onPress={() => {
              return this.state.signingUp
                ? CreateUser(
                    this.state.email,
                    this.state.password,
                    this.state.first,
                    this.state.last,
                  )
                : this.setState({signingUp: true});
            }}>
            <Text style={styles.loginText}>
              {this.state.signingUp ? 'SIGN UP' : 'sign up'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={this.state.signingUp ? styles.loginBtnOff : styles.loginBtn}
            onPress={() => {
              return this.state.signingUp
                ? this.setState({signingUp: false})
                : LoginUser(this.state.email, this.state.password);
            }}>
            <Text style={styles.loginText}>
              {this.state.signingUp ? 'log in' : 'LOG IN'}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  forgotText: {
    color: 'white',
    fontSize: 11,
  },
  loginText: {
    color: 'white',
    fontSize: 18,
  },
  signupBtn: {
    width: '80%',
    backgroundColor: '#ff0000',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 40,
  },
  signUpBtnOff: {
    width: '80%',
    backgroundColor: '#000000',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 40,
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#ff0000',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 0,
  },
  loginBtnOff: {
    width: '80%',
    backgroundColor: '#000000',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 0,
  },
  hidden: {
    display: 'none',
  },
  background: {
    backgroundColor: '#000000',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputText: {
    height: 40,
    color: 'white',
    borderBottomColor: 'red',
    borderBottomWidth: 2,
  },
  inputView: {
    width: '80%',
    height: 40,
    marginBottom: 20,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',
  },
});
