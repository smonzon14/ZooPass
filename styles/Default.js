import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
export default StyleSheet.create({
  container: {
    backgroundColor: 'black',
    color: 'white',
    flex: 1,
  },
  cancelButton: {
    textDecorationLine: 'underline',
    color: '#dd0000',
    fontSize: 15,
    padding: 5,
  },
  regularText: {
    color: 'white',
    fontSize: 15,
    padding: 5,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 15,
    padding: 5,
    color: 'white',
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
    left: 15,
    color: 'white',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    padding: 5,
  },
  textInput: {
    fontSize: 15,
    minHeight: 25,
    color: 'white',
    margin: 10,
    borderBottomColor: 'gray',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
  },
  openModalButton: {
    margin: 15,
    marginBottom: 15,
    backgroundColor: 'red',
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
