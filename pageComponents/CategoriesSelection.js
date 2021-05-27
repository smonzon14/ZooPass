/* @flow weak */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import categories from '../enums/Categories.js';
import {accentColors} from '../styles/Default.js';
const CategoriesSelection = (props) => {
  const [catSelectedArray, setArray] = useState(
    Array(categories.length).fill(false),
  );
  useEffect(() => {
    if (props.all && catSelectedArray[0]) {
      props.onSelectCategory(['All']);
    } else {
      const listOfCategories = categories.filter(
        (cat, i) => catSelectedArray[i],
      );

      props.onSelectCategory(listOfCategories);
    }
  }, [catSelectedArray]);
  return (
    <ScrollView
      style={styles.categoryContainer}
      horizontal={true}
      indicatorStyle={'white'}>
      {categories.map((cat, i) => {
        if (i === 0 && !props.all) {
          return;
        }
        return (
          <TouchableOpacity
            key={i}
            onPress={() => {
              let newArray = [...catSelectedArray];

              if (props.all && i === 0) {
                newArray = catSelectedArray.map(() => !catSelectedArray[0]);
              } else {
                if (props.all && catSelectedArray[0] === catSelectedArray[i]) {
                  if (
                    catSelectedArray.reduce((acc, e, ind) => {
                      if (ind === 0 || ind === i) return acc;

                      return acc && e;
                    }, true)
                  ) {
                    newArray[0] = !catSelectedArray[0];
                  }
                }
              }
              newArray[i] = !catSelectedArray[i];
              setArray(newArray);
            }}
            style={
              catSelectedArray[i]
                ? styles.categorySelected
                : styles.categoryUnselected
            }>
            <Text
              style={
                catSelectedArray[i]
                  ? styles.categorySelectedText
                  : styles.categoryUnselectedText
              }>
              {cat}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default CategoriesSelection;

const styles = StyleSheet.create({
  categoryContainer: {
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    height: 50,
  },
  categorySelected: {
    margin: 5,
    borderRadius: 15,
    borderColor: accentColors.primary,
    borderWidth: 2,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  categoryUnselected: {
    margin: 5,
    color: 'white',
    borderRadius: 15,
    borderColor: 'white',
    borderWidth: 2,

    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    paddingLeft: 15,
    paddingRight: 15,
  },
  categorySelectedText: {
    color: accentColors.primary,
    fontSize: 18,
  },
  categoryUnselectedText: {
    color: 'white',
    fontSize: 18,
  },
});
