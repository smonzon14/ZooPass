/* @flow */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DefaultStyles from '../styles/Default.js';

import CustomMultiSelectCalendar from '../pageComponents/CustomMultiSelectCalendar.js';
import CustomPromptModal from '../pageComponents/CustomPromptModal.js';
import {selectImageFile} from '../SystemImage.js';
import Fire from '../FirebaseHelper';
import Modal from '../pageComponents/PageModal.js';
import CheckBox from '@react-native-community/checkbox';
function parseTime(dateTime) {
  let hours = dateTime.getHours();
  let meridian = hours < 12 ? 'AM' : 'PM';
  hours = hours % 12;
  if (hours === 0) {
    hours = 12;
  }
  let minutes = dateTime.getMinutes();
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutes + ' ' + meridian;
}
function combinedDates(date, time) {
  const dateTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  dateTime.setHours(time.getHours());
  dateTime.setMinutes(time.getMinutes());
  return dateTime;
}
function getDefaultTime() {
  const dateTime = new Date();
  dateTime.setTime(new Date().getTime() + 1 * 60 * 60 * 1000);
  return dateTime;
}
export default class Create extends Component {
  defaultTime = getDefaultTime();
  state = {
    title: '',
    description: '',
    startDate: this.defaultTime,
    endDate: this.defaultTime,
    startTime: this.defaultTime,
    endTime: this.defaultTime,
    address: '',
    isPublic: false,
    editTimeSpan: false,

    resourcePath: {},
  };
  render() {
    return (
      <Modal r={this.props.r}>
        <View style={{...DefaultStyles.container}}>
          <Text style={DefaultStyles.titleText}>Create</Text>
          <TouchableHighlight
            style={{
              width: 150,
              flex: 1,
              margin: 15,

              borderRadius: 20,
              backgroundColor: 'gray',
            }}
            onPress={() => {
              selectImageFile((source) => {
                this.setState({resourcePath: source});
              });
            }}>
            <View>
              <Text
                style={{
                  ...DefaultStyles.regularText,
                  position: 'absolute',
                  alignSelf: 'center',
                  bottom: 20,
                }}>
                Add Image
              </Text>
              <Image
                source={{uri: this.state.resourcePath.uri}}
                resizeMode="cover"
                style={{
                  height: 200,
                  width: 150,

                  borderRadius: 20,
                }}
              />
            </View>
          </TouchableHighlight>

          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                marginTop: 15,
                marginLeft: 15,
                width: '30%',
                alignItems: 'center',
                borderRadius: 15,
                backgroundColor: '#404040',
              }}>
              <TouchableOpacity
                style={DefaultStyles.openModalButton}
                onPress={() => {
                  this.setState({editTimeSpan: true});
                }}>
                <Text
                  style={{...DefaultStyles.regularText, fontWeight: 'bold'}}>
                  Edit Date(s)
                </Text>
              </TouchableOpacity>
              {this.state.startDate === null && <Text>Need edit</Text>}
              {this.state.startDate !== null && this.state.endDate !== null && (
                <View>
                  <Text>
                    {this.state.startDate.toDateString() +
                      ' at ' +
                      parseTime(this.state.startTime)}
                  </Text>
                  <Text>-</Text>
                  <Text>
                    {this.state.endDate.toDateString() +
                      ' at ' +
                      parseTime(this.state.endTime)}
                  </Text>
                </View>
              )}
            </View>
            <View style={{width: '65%'}}>
              <TextInput
                style={DefaultStyles.textInput}
                placeholder="Title *"
                placeholderTextColor="white"
                onChangeText={(text) => this.setState({title: text})}
              />
              <TextInput
                style={DefaultStyles.textInput}
                placeholder="Address"
                placeholderTextColor="gray"
                onChangeText={(text) => this.setState({address: text})}
              />
              <TextInput
                style={DefaultStyles.textInput}
                placeholder="Message"
                multiline={true}
                numberOfLines={4}
                placeholderTextColor="gray"
                onChangeText={(text) => this.setState({description: text})}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 15,
            }}>
            <CheckBox
              boxType="square"
              tintColor="white"
              onTintColor="red"
              onCheckColor="red"
              disabled={false}
              value={this.state.isPublic}
              onValueChange={(newValue) => this.setState({isPublic: newValue})}
            />
            <Text style={{...DefaultStyles.regularText, paddingLeft: 10}}>
              Public
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (this.state.title === '' || this.state.description === '') {
                return alert('Must have a Title and Message.');
              }
              const event = {
                title: this.state.title,
                description: this.state.description,
                start: combinedDates(
                  this.state.startDate,
                  this.state.startTime,
                ),
                end: combinedDates(this.state.endDate, this.state.endTime),
                address: this.state.address,
                isPublic: this.state.isPublic,
              };
              return Fire.shareEvent(event, this.state.resourcePath.uri)
                .then((msg) => {
                  console.log('SUCCESS: ' + msg);
                  alert('Successfully Shared!');
                  this.props.r.current.close();
                })
                .catch((err) => {
                  alert('Error Sharing Event... Please Try Again');
                  console.log('error sharing event: ' + err);
                });
            }}
            style={DefaultStyles.openModalButton}>
            <Text style={{...DefaultStyles.regularText, fontWeight: 'bold'}}>
              Share
            </Text>
          </TouchableOpacity>
          <CustomPromptModal
            title="Start and End Date/Time"
            closeText="Close"
            visible={this.state.editTimeSpan}
            onClose={() => {
              this.setState({editTimeSpan: false});
            }}>
            <CustomMultiSelectCalendar
              startDate={this.state.startDate}
              startDayHandler={(date) => {
                console.log('create: ' + date);
                this.setState({startDate: date});
              }}
              endDate={this.state.endDate}
              endDayHandler={(date) => {
                this.setState({endDate: date});
              }}
            />
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <View style={styles.timePicker}>
                <Text style={DefaultStyles.regularText}>Start Time</Text>
                <DateTimePicker
                  value={this.state.startTime}
                  mode="time"
                  onChange={(event, time) => {
                    console.log(time);
                    this.setState({startTime: time});
                  }}
                />
              </View>
              <View style={styles.timePicker}>
                <Text style={DefaultStyles.regularText}>End Time</Text>
                <DateTimePicker
                  value={this.state.endTime}
                  mode="time"
                  textColor="red"
                  onChange={(event, time) => {
                    this.setState({endTime: time});
                  }}
                />
              </View>
            </View>
          </CustomPromptModal>
        </View>
      </Modal>
    );
  }
}

// <Image
//   source={{
//     uri:
//       'data:image/jpeg;base64,' +
//       this.state.resourcePath.data,
//   }}
//   style={{width: '100%'}}
// />

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: 'white',
    backgroundColor: 'black',
    alignItems: 'center',
  },
  timePicker: {
    width: '50%',
    alignSelf: 'center',
  },
});
