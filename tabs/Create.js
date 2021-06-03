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
  Animated,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DefaultStyles, {accentColors} from '../styles/Default.js';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import CustomMultiSelectCalendar from '../pageComponents/CustomMultiSelectCalendar.js';
import CustomPromptModal from '../pageComponents/CustomPromptModal.js';
import {selectImageFile} from '../SystemImage.js';
import Fire from '../FirebaseHelper';
import CheckBox from '@react-native-community/checkbox';
import {Modalize} from 'react-native-modalize';
import {
  format,
  isSameDay,
  setHours,
  setMinutes,
  getHours,
  subDays,
  subHours,
  getMinutes,
} from 'date-fns';
import CustomHeader from '../pageComponents/CustomHeader.js';
import Swiper from 'react-native-swiper';
import {userItem} from '../pageComponents/ListItems.js';
import Friends from '../data/Friends.js';
import Geocoder from 'react-native-geocoding';
import GetLocation from 'react-native-get-location';
import CategoriesSelection from '../pageComponents/CategoriesSelection.js';

Geocoder.init('AIzaSyBFXlfZ7jSlpu9VyV7u2deC7EwkjPQgS8I');
let userLocation = null;

function formatStartEndDate(startDate, endDate) {
  if (isSameDay(startDate, endDate)) {
    return (
      format(startDate, 'eeee, MMMM dd · h:mm a - ') + format(endDate, 'h:mm a')
    );
  }
  console.log('start: ' + startDate);
  console.log('end: ' + endDate);
  return (
    format(startDate, 'eee, MMMM dd · h:mm a - ') +
    format(endDate, 'eee, MMMM dd · h:mm a')
  );
}
function combinedDates(date, time) {
  return setHours(setMinutes(date, getMinutes(time)), getHours(time));
}
function nextDay() {
  return subDays(new Date(), -1);
}

export default class Create extends Component {
  constructor(props) {
    super(props);

    this.swiperRef = React.createRef(null);
    this.baseState = {
      startDate: new Date(),
      endDate: nextDay(),
      address: '',
      isPublic: false,
      isOnline: false,
      editTimeSpan: false,
      editAddress: false,
      page: 0,
      resourcePath: {},
      friendsList: [],
      guestList: [],
      addressSearches: [],
      searchQuery: '',
    };
    this.state = {
      ...this.baseState,
      location: {longitude: -71.0589, latitude: 42.3601},
      mapAnim: new Animated.Value(0),
    };
    this.categories = ['All'];
    this.title = '';
    this.message = '';
  }

  resetState() {
    this.setState(this.baseState);
  }

  componentDidMount() {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    })
      .then((location) => {
        return Geocoder.from(location);
      })
      .then((json) => {
        var addressComponent = json.results[0].address_components.reduce(
          (acc, e) => {
            return acc + e.short_name.toString() + ' ';
          },
          '',
        );
        const coordinates = {
          latitude: json.results[0].geometry.location.lat,
          longitude: json.results[0].geometry.location.lng,
        };
        this.setState({location: coordinates});
        userLocation = {
          id: '-1',
          address: addressComponent,
          location: coordinates,
        };
      })
      .catch((err) => {
        console.log('get current position error:');
        console.log(err);
      });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery) {
      this.handleSearch();
    }
  }
  handleSearch = () => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.searchForLocations();
    }, 250);
  };
  searchForLocations = () => {
    let list = [];
    if (userLocation) {
      list.push(userLocation);
    }
    if (this.state.searchQuery !== '') {
      Geocoder.from(this.state.searchQuery)
        .then((json) => {
          json.results.forEach((res, i) => {
            res.address_components = res.address_components.filter(
              (_, x) => x < 6,
            );
            list.push({
              id: i.toString(),
              location: {
                latitude: res.geometry.location.lat,
                longitude: res.geometry.location.lng,
              },
              address: res.address_components.reduce((acc, e) => {
                return acc + e.short_name.toString() + ' ';
              }, ''),
            });
          });
        })
        .catch((error) => console.log(error));
    }

    this.setState({addressSearches: list});
  };
  growMap = () => {
    Animated.timing(this.state.mapAnim, {
      toValue: 250,
      duration: 750,
      useNativeDriver: false,
    }).start();
  };
  shrinkMap = () => {
    Animated.timing(this.state.mapAnim, {
      toValue: 0,
      duration: 750,
      useNativeDriver: false,
    }).start();
  };
  shareEvent = () => {
    if (this.state.title === '') {
      return alert('Event needs to have a title.');
    }
    if (this.state.address === '') {
      return alert('Event needs an address.');
    }
    let event = {
      title: this.title,
      message: this.message,
      start: this.state.startDate,
      end: this.state.endDate,
      address: this.state.address,
      location: [this.state.location.latitude, this.state.location.longitude],
      isOnline: this.state.isOnline,
      categories: this.categories,
    };
    if (!this.state.isPublic) {
      event['guestList'] = this.state.guestList;
    }
    const uri = this.state.resourcePath.uri;
    return Fire.shareEvent(
      event,
      this.state.isPublic,
      uri,
      this.state.guestList,
    )
      .then((msg) => {
        console.log('SUCCESS: ' + msg);
        alert('Successfully Shared!');

        this.props.r.current.close();
        this.resetState();
      })
      .catch((err) => {
        alert(err);
        console.log('error sharing event: ' + err);
      });
  };
  pageChanged = (index) => {
    this.setState({page: index});
    if (index === 2) {
      this.setState({friendsList: Friends.retrieveList()});
    }
  };
  // componentDidMount(){
  //   this.setState({friendsList: Friends.retrieveList()});
  // }
  render() {
    if (this.state.editAddress || this.state.isOnline) {
      this.shrinkMap();
    } else {
      this.growMap();
    }
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
                DefaultStyles.button,
                {backgroundColor: 'white', alignSelf: 'flex-end'},
              ]}
              onPress={() => {
                this.swiperRef.current.scrollBy(1);
                this.setState({page: 1});
              }}>
              <Text style={[DefaultStyles.boldText, {color: accentColors}]}>
                Next
              </Text>
            </TouchableOpacity>
          )}
          {this.state.page === 1 && (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity
                style={[
                  DefaultStyles.button,
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
                  DefaultStyles.button,
                  {backgroundColor: 'white', alignSelf: 'flex-end'},
                ]}
                onPress={() => {
                  this.swiperRef.current.scrollBy(1);
                  this.setState({page: 1});
                }}>
                <Text style={[DefaultStyles.boldText, {color: accentColors}]}>
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
                  DefaultStyles.button,
                  {backgroundColor: 'transparent', padding: 0},
                ]}
                onPress={() => {
                  this.swiperRef.current.scrollBy(-1);
                  this.setState({page: 0});
                }}>
                <Text style={DefaultStyles.regularText}>Go Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={DefaultStyles.button}
                onPress={this.shareEvent}>
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
                  Alert.alert(
                    'Delete Event',
                    'Are you sure you want to delete your new event?',
                    [
                      {
                        text: 'Delete',
                        onPress: () => {
                          this.props.r.current?.close();
                          this.resetState();
                        },
                      },
                      {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                    ],
                    {cancelable: true},
                  );
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
          loadMinimal={false}
          showsPagination={true}
          index={0}
          scrollEnabled={false}
          loop={false}
          onIndexChanged={this.pageChanged}>
          <View style={{height: '100%'}}>
            {/*Text Input fields*/}
            <View
              style={{
                padding: 0,
              }}>
              <View>
                <Text style={styles.textInputLabelText}>Categories</Text>
                <CategoriesSelection
                  all={false}
                  onSelectCategory={(newCategories) =>
                    (this.categories = newCategories)
                  }
                />
                <Text style={styles.textInputLabelText}>Title</Text>
                <TextInput
                  style={DefaultStyles.textInput}
                  placeholder="Title of the event"
                  placeholderTextColor="gray"
                  maxLength={50}
                  onChangeText={(text) => (this.title = text)}
                />

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
                <Text style={styles.textInputLabelText}>Where</Text>
                <View style={{padding: 10}}>
                  <View
                    style={{
                      width: '100%',
                      height: 250,
                      position: 'absolute',
                      margin: 10,
                    }}>
                    <MapView
                      pitchEnabled={false}
                      rotateEnabled={false}
                      scrollEnabled={false}
                      provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                      style={[
                        StyleSheet.absoluteFillObject,
                        {borderRadius: 20, width: 300},
                      ]}
                      initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      }}
                      region={{
                        ...this.state.location,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                    />
                  </View>
                </View>
                <Animated.FlatList
                  style={{
                    top: this.state.mapAnim,
                    backgroundColor: '#222',
                    height: '100%',
                  }}
                  data={
                    this.state.editAddress && !this.state.isOnline
                      ? this.state.addressSearches
                      : []
                  }
                  keyExtractor={(item) => item.id}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({editAddress: false});
                        this.setState({
                          address: item.address,
                          location: item.location,
                        });
                      }}
                      style={{height: 50, flexDirection: 'row', width: '100%'}}>
                      <Text
                        style={[
                          {flexWrap: 'wrap', flex: 1},
                          DefaultStyles.boldText,
                        ]}>
                        {item.address}
                      </Text>
                    </TouchableOpacity>
                  )}
                  ListHeaderComponent={
                    <View
                      style={{
                        height: 70,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          backgroundColor: '#222',
                        }}>
                        <View style={[{flex: 1}]}>
                          <TextInput
                            style={[DefaultStyles.textInput]}
                            onChangeText={(text) => {
                              this.setState({searchQuery: text});
                            }}
                            editable={!this.state.isOnline}
                            placeholder="Start typing..."
                            placeholderTextColor="gray"
                            onSubmitEditing={() =>
                              this.setState({editAddress: false})
                            }
                            onFocus={() => {
                              this.setState({editAddress: true});
                              this.searchForLocations();
                            }}>
                            {this.state.isOnline
                              ? 'Online Event'
                              : this.state.address}
                          </TextInput>
                        </View>
                        {/*Is online checkbox*/}
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 15,
                          }}>
                          <Text
                            style={{
                              ...DefaultStyles.regularText,
                              paddingRight: 10,
                            }}>
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
                    </View>
                  }
                />
              </View>

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
                    this.setState({
                      startDate: combinedDates(date, this.state.startDate),
                    });
                  }}
                  endDate={this.state.endDate}
                  endDayHandler={(date) => {
                    if (date === null) {
                      date = subHours(this.state.startDate, -1);
                    }
                    this.setState({
                      endDate: combinedDates(date, this.state.endDate),
                    });
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
                      value={this.state.startDate}
                      mode="time"
                      onChange={(event, time) => {
                        this.setState({
                          startDate: combinedDates(this.state.startDate, time),
                        });
                      }}
                    />
                  </View>
                  <View style={styles.timePicker}>
                    <Text style={DefaultStyles.regularText}>End Time</Text>
                    <DateTimePicker
                      value={this.state.endDate}
                      mode="time"
                      textColor="red"
                      onChange={(event, time) => {
                        this.setState({
                          endDate: combinedDates(this.state.endDate, time),
                        });
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
                margin: 15,
                borderWidth: 1,
                borderColor: 'gray',
                borderRadius: 20,
                width: 200,
                height: 200,
              }}
              onPress={() => {
                selectImageFile((source) => {
                  this.setState({resourcePath: source});
                });
              }}>
              <View>
                <Text
                  style={{
                    position: 'absolute',
                    alignSelf: 'center',
                    bottom: 100,
                    color: 'gray',
                    fontSize: 15,
                  }}>
                  Add an Image
                </Text>
                <Image
                  source={{uri: this.state.resourcePath.uri}}
                  resizeMode="cover"
                  style={{
                    borderRadius: 20,
                    height: '100%',
                    width: '100%',
                  }}
                />
              </View>
            </TouchableHighlight>
            <View style={{padding: 10}}>
              <TextInput
                style={[DefaultStyles.textInput, {height: 120}]}
                placeholder="Comment something extra..."
                multiline={true}
                numberOfLines={4}
                maxLength={300}
                placeholderTextColor="gray"
                onChangeText={(text) => (this.message = text)}
              />
            </View>
          </View>
          <View>
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
    padding: 5,
    fontSize: 12,
    color: 'white',
  },
});
