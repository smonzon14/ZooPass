import {Modalize} from 'react-native-modalize';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Animated,
} from 'react-native';
import React, {Component} from 'react';
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(
  TouchableOpacity,
);

export default (props) => {
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
      onPress={handleScrollToTop}
      activeOpacity={0.75}>
      <Text style={s.floating__text}>Top</Text>
    </AnimatedTouchableOpacity>
  );
  const onOpen = () => {
    props.r.current?.open();
  };
  const onClose = () => {
    props.r.current?.close();
  };
  //
  // snapPoint={600}
  return (
    <Modalize
      ref={props.r}
      modalStyle={{backgroundColor: 'black'}}
      handleStyle={{backgroundColor: 'white'}}
      flatListProps={props.flatListProps}
    />
    // <View style={{backgroundColor: 'black'}}>
    //   <TouchableOpacity
    //     onPress={onClose}
    //     style={{
    //       backgroundColor: 'black',
    //       alignSelf: 'flex-end',
    //       borderRadius: 10,
    //     }}>
    //     <Text
    //       style={{
    //         textAlign: 'center',
    //         padding: 10,
    //         textDecorationLine: 'underline',
    //         color: 'red',
    //       }}>
    //       Cancel
    //     </Text>
    //   </TouchableOpacity>
    //   {props.children}
    // </View>
    // </Modalize>
  );
};
