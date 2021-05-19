/* @flow */

import React, {forwardRef, useState, useRef, useEffect} from 'react';
import {View, Animated, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Friends from '../data/Friends.js';
import DefaultStyles from '../styles/Default.js';
import {Modalize} from 'react-native-modalize';
import CustomHeader from '../pageComponents/CustomHeader.js';
import {Portal} from 'react-native-portalize';
import AddFriendsView from '../tabs/AddFriendsView.js';
import OtherUserInfoView from '../tabs/OtherUserInfoView.js';
import {userItem} from '../pageComponents/ListItems.js';
const NoFriendsComponent = () => {
  return <Text style={styles.text}>No Friends Yet!</Text>;
};
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(
  TouchableOpacity,
);
export default forwardRef((_, ref) => {
  const modalizeRef = ref;
  const contentRef = useRef(null);
  const addFriendsModalRef = useRef(null);
  const userInfoViewModalRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState({});
  // const updateData = (list) => {
  //   this.setState({users: list});
  // };

  const onOpen = () => {
    modalizeRef.current?.open();
  };
  const onClose = () => {
    modalizeRef.current?.close();
  };
  useEffect(() => {
    Friends.listen(setUsers);
    return Friends.detatch;
  }, []);
  const openAddFriendsView = () => {
    addFriendsModalRef.current?.open();
  };
  const openOtherUserInfoView = (user) => {
    setSelected(user);

    userInfoViewModalRef.current?.open();
  };
  const renderFloatingComponent = () => (
    <AnimatedTouchableOpacity
      style={[
        s.floating,
        {
          opacity: scrollY.interpolate({
            inputRange: [100, 200],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
          transform: [
            {
              scale: scrollY.interpolate({
                inputRange: [100, 150],
                outputRange: [0.6, 1],
                extrapolate: 'clamp',
              }),
            },
          ],
        },
      ]}
      onPress={() => {}}
      activeOpacity={0.75}>
      <Text style={s.floating__text}>Top</Text>
    </AnimatedTouchableOpacity>
  );

  const renderHeader = () => (
    <View>
      <CustomHeader
        title="Friends"
        top={10}
        buttonComponent={
          <TouchableOpacity onPress={() => openAddFriendsView()}>
            <Text style={DefaultStyles.headerText}>+</Text>
          </TouchableOpacity>
        }
      />
      <Portal>
        <AddFriendsView r={addFriendsModalRef} />
        <Modalize
          ref={userInfoViewModalRef}
          modalStyle={{backgroundColor: '#333'}}
          handleStyle={{backgroundColor: 'white'}}>
          {selected.id && <OtherUserInfoView userBase={selected} />}
        </Modalize>
      </Portal>
    </View>
  );
  return (
    <Modalize
      ref={modalizeRef}
      contentRef={contentRef}
      modalStyle={{backgroundColor: '#333'}}
      handleStyle={{backgroundColor: 'white'}}
      HeaderComponent={renderHeader}
      modalHeight={800}
      snapPoint={500}
      flatListProps={{
        data: users,
        renderItem: (item) => userItem(item, openOtherUserInfoView),
        onScroll: Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {
            useNativeDriver: true,
          },
        ),
        ListEmptyComponent: NoFriendsComponent(),
        keyExtractor: (item) => item.id,
        scrollEventThrottle: 16,
      }}
    />
    // <Modal r={this.props.r} flatListProps={this.flatListProps} />
    // <SafeAreaView style={styles.container}>
    //   <FlatList
    //     data={this.state.users}
    //     renderItem={userItem}
    //     ListEmptyComponent={NoFriendsComponent()}
    //     keyExtractor={(item) => item.id}
    //   />
    // </SafeAreaView>
    // </Modal>
  );
});
const s = StyleSheet.create({
  item: {
    alignItems: 'flex-start',

    padding: 15,

    borderBottomColor: '#f9f9f9',
    borderBottomWidth: 1,
  },

  item__name: {
    fontSize: 16,

    marginBottom: 5,
  },

  item__email: {
    fontSize: 14,
    fontWeight: '200',
    color: '#666',
  },

  floating: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,

    position: 'absolute',
    right: 20,
    bottom: 20,

    width: 60,
    height: 60,

    borderRadius: 30,
    backgroundColor: '#333',
  },

  floating__text: {
    fontSize: 16,
    color: '#fff',
  },
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  nameText: {
    marginLeft: 10,
    color: 'white',
    fontSize: 18,
  },
  usernameText: {
    marginLeft: 10,
    color: 'gray',
    fontSize: 12,
  },
});
