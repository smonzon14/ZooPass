/* @flow */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DefaultStyles from '../styles/Default.js';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import CustomMultiSelectCalendar from '../pageComponents/CustomMultiSelectCalendar.js';
import CustomPromptModal from '../pageComponents/CustomPromptModal.js';
import {selectImageFile} from '../SystemImage.js';
import Fire from '../FirebaseHelper';
import CheckBox from '@react-native-community/checkbox';
import {Modalize} from 'react-native-modalize';
import {format, isSameDay} from 'date-fns';
import CustomHeader from '../pageComponents/CustomHeader.js';
import Swiper from 'react-native-swiper';
import {userItem} from '../pageComponents/ListItems.js';
import Friends from '../data/Friends.js';

function formatStartEndDate(startDate, endDate) {
  if (isSameDay(startDate, endDate)) {
    return (
      format(startDate, 'eeee, MMMM dd · h:mm a - ') + format(endDate, 'h:mm a')
    );
  }
  return (
    format(startDate, 'eee, MMMM dd · h:mm a - ') +
    format(endDate, 'eee, MMMM dd · h:mm a')
  );
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
    isOnline: false,
    editTimeSpan: false,
    editAddress: false,
    page: 0,
    resourcePath: {},
    friendsList: [],
    invitedUsersList: [],
  };
  constructor(props) {
    super(props);
    this.swiperRef = React.createRef(null);
  }
  // componentDidMount(){
  //   this.setState({friendsList: Friends.retrieveList()});
  // }
  render() {
    const pageChanged = (index) => {
      this.setState({page: index});
      if (index === 1) {
        this.setState({friendsList: Friends.retrieveList()});
      }
    };
    const RenderShareButton = () => (
      <TouchableOpacity
        onPress={() => {
          if (this.state.title === '' || this.state.description === '') {
            return alert('Must have a Title and Message.');
          }
          const event = {
            title: this.state.title,
            description: this.state.description,
            start: combinedDates(this.state.startDate, this.state.startTime),
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
    );
    const toggleInviteUser = (user) => console.log('inviting: ' + user.id);
    const RenderActionButtons = () => {
      return (
        <View
          style={{
            zIndex: 9999,
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            height: 100,
            padding: 5,
            backgroundColor: 'transparent',
          }}>
          {this.state.page === 0 && (
            <TouchableOpacity
              style={[
                DefaultStyles.openModalButton,
                {backgroundColor: 'white', alignSelf: 'flex-end'},
              ]}
              onPress={() => {
                this.swiperRef.current.scrollBy(1);
                this.setState({page: 1});
              }}>
              <Text style={[DefaultStyles.boldText, {color: 'red'}]}>Next</Text>
            </TouchableOpacity>
          )}
          {this.state.page === 1 && (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity
                style={[
                  DefaultStyles.openModalButton,
                  {backgroundColor: 'transparent', padding: 0},
                ]}
                onPress={() => {
                  this.swiperRef.current.scrollBy(-1);
                  this.setState({page: 0});
                }}>
                <Text style={DefaultStyles.regularText}>Go Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  DefaultStyles.openModalButton,
                  {backgroundColor: 'white', alignSelf: 'flex-end'},
                ]}
                onPress={() => {
                  this.swiperRef.current.scrollBy(1);
                  this.setState({page: 1});
                }}>
                <Text style={[DefaultStyles.boldText, {color: 'red'}]}>
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {this.state.page === 2 && (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity
                style={[
                  DefaultStyles.openModalButton,
                  {backgroundColor: 'transparent', padding: 0},
                ]}
                onPress={() => {
                  this.swiperRef.current.scrollBy(-1);
                  this.setState({page: 0});
                }}>
                <Text style={DefaultStyles.regularText}>Go Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={DefaultStyles.openModalButton}
                onPress={() => this.swiperRef.current.scrollBy(-1)}>
                <Text style={DefaultStyles.boldText}>Share</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    };
    return (
      <Modalize
        ref={this.props.r}
        modalStyle={{backgroundColor: '#222'}}
        handleStyle={{backgroundColor: 'white'}}
        onOpen={() => this.setState({page: 0})}
        scrollViewProps={{scrollEnabled: false}}
        HeaderComponent={
          <CustomHeader
            title="New Event"
            top={50}
            buttonComponent={
              <TouchableOpacity
                onPress={() => {
                  this.props.r.current?.close();
                }}>
                <Text style={DefaultStyles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
            }
          />
        }
        FloatingComponent={RenderActionButtons}>
        <Swiper
          ref={this.swiperRef}
          showsButtons={false}
          loadMinimal={true}
          showsPagination={false}
          index={0}
          loop={false}
          onIndexChanged={pageChanged}>
          <View style={{height: '100%'}}>
            {/*Text Input fields*/}
            <View
              style={{
                padding: 10,
              }}>
              <View>
                <Text style={styles.textInputLabelText}>Title</Text>
                <TextInput
                  style={DefaultStyles.textInput}
                  placeholder="Title of the event"
                  placeholderTextColor="gray"
                  maxLength={50}
                  onChangeText={(text) => this.setState({title: text})}
                />

                <Text style={styles.textInputLabelText}>Where</Text>
                <View style={{flexDirection: 'row'}}>
                  <TouchableWithoutFeedback
                    disabled={this.state.isOnline}
                    onPress={() => this.setState({editAddress: true})}>
                    <View style={[DefaultStyles.textInput, {flex: 1}]}>
                      <Text
                        style={[
                          DefaultStyles.regularText,
                          {
                            padding: 0,
                            color: 'gray',
                            position: 'absolute',
                            bottom: 10,
                          },
                        ]}>
                        {this.state.isOnline
                          ? 'Online Event'
                          : this.state.address}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                  {/*Is online checkbox*/}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 15,
                    }}>
                    <Text
                      style={{...DefaultStyles.regularText, paddingRight: 10}}>
                      Online:
                    </Text>
                    <CheckBox
                      boxType="square"
                      tintColor="gray"
                      onTintColor="yellow"
                      onCheckColor="yellow"
                      disabled={false}
                      value={this.state.isOnline}
                      onValueChange={(newValue) =>
                        this.setState({isOnline: newValue})
                      }
                    />
                  </View>
                </View>
                <Text style={styles.textInputLabelText}>When</Text>
                <TouchableWithoutFeedback
                  onPress={() => this.setState({editTimeSpan: true})}>
                  <View style={DefaultStyles.textInput}>
                    <Text
                      style={[
                        DefaultStyles.regularText,
                        {
                          padding: 0,
                          color: 'gray',
                          position: 'absolute',
                          bottom: 10,
                        },
                      ]}>
                      {formatStartEndDate(
                        this.state.startDate,
                        this.state.endDate,
                      )}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <CustomPromptModal
                title="Find Address"
                closeText="Close"
                visible={this.state.editAddress}
                onClose={() => this.setState({editAddress: false})}>
                <View
                  style={{
                    width: 400,
                    height: 400,
                  }}>
                  <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={StyleSheet.absoluteFillObject}
                    initialRegion={{
                      latitude: 37.78825,
                      longitude: -122.4324,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                  />
                </View>
              </CustomPromptModal>
              {/* calendar modal*/}
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
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
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
          </View>

          <View>
            <TouchableHighlight
              style={{
                backgroundColor: 'black',
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
                    bottom: 100,
                  }}>
                  Add Image
                </Text>
                <Image
                  source={{uri: this.state.resourcePath.uri}}
                  resizeMode="cover"
                  style={{
                    height: Dimensions.get('window').width,
                    width: '100%',
                  }}
                />
              </View>
            </TouchableHighlight>
          </View>
          <View>
            <View style={{padding: 10}}>
              <TextInput
                style={[DefaultStyles.textInput, {height: 120}]}
                placeholder="Comment something extra..."
                multiline={true}
                numberOfLines={4}
                maxLength={300}
                placeholderTextColor="gray"
                onChangeText={(text) => this.setState({description: text})}
              />
            </View>
            {/* is public check box */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 15,
                justifyContent: 'flex-end',
              }}>
              <Text style={{...DefaultStyles.regularText, paddingRight: 10}}>
                Invite Only:
              </Text>
              <CheckBox
                boxType="square"
                tintColor="gray"
                onTintColor="red"
                onCheckColor="red"
                disabled={false}
                value={!this.state.isPublic}
                onValueChange={(newValue) =>
                  this.setState({isPublic: !newValue})
                }
              />
            </View>

            <FlatList
              data={this.state.friendsList}
              renderItem={(item) => userItem(item, toggleInviteUser)}
              ListEmptyComponent={
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                  }}>
                  {this.state.isPublic ? (
                    <Text style={DefaultStyles.regularText}>
                      Anyone is invited!
                    </Text>
                  ) : (
                    <Text style={DefaultStyles.regularText}>
                      No friends to invite yet
                    </Text>
                  )}
                </View>
              }
              keyExtractor={(item) => item.id}
            />
          </View>
        </Swiper>
      </Modalize>
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
  textInputLabelText: {
    padding: 0,
    fontSize: 12,
    color: 'white',
  },
});
