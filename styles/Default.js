import React, {Component} from 'react';
import {StyleSheet} from 'react-native';

const accentColors = {
  primary: '#d81b60',
  primaryLight: '#ff5c8d',
  primaryDark: '#a00037',
  secondary: '#1976d2',
  secondaryLight: '#63a4ff',
  secondaryDark: '#004ba0',
};

export {accentColors};
export default StyleSheet.create({
  container: {
    backgroundColor: 'black',
    color: 'white',
    flex: 1,
  },
  cancelButton: {
    textDecorationLine: 'underline',
    color: accentColors.primary,
    fontSize: 18,
    padding: 5,
  },
  regularText: {
    color: 'white',
    fontSize: 18,
    padding: 5,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 18,
    padding: 5,
    color: 'white',
  },
  titleText: {
    fontSize: 35,
    fontWeight: 'bold',
    left: 15,
    color: 'white',
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    padding: 5,
  },
  textInput: {
    fontSize: 18,
    minHeight: 25,
    color: 'white',
    margin: 10,
    borderBottomColor: 'gray',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
  },
  button: {
    margin: 15,
    marginBottom: 15,
    backgroundColor: accentColors.secondary,
    color: 'white',
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    height: 40,
    justifyContent: 'center',
  },
});
