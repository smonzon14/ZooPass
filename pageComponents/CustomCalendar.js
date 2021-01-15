import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Calendar} from 'react-native-calendars';

export default ({}) => {
  let today = new Date();
  const [day, setDay] = useState(today.getDate());
  return (
    <View style={styles.calendarContainer}>
      <Calendar
        minDate={today.toDateString()}
        onDayPress={(d) => {
          setDay(d.dateString);
        }}
        style={styles.calendar}
        enableSwipeMonths={true}
        theme={{
          backgroundColor: 'black',
          calendarBackground: 'black',
          selectedDayBackgroundColor: 'red',
          dayTextColor: 'white',
          monthTextColor: 'white',
          arrowColor: 'red',
          todayTextColor: 'red',
          textDisabledColor: '#444444',
        }}
        markedDates={{
          [day]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: 'red',
            selectedTextColor: 'black',
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: 'white',
    backgroundColor: 'black',
    alignItems: 'center',
  },
  calendarContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  calendar: {
    width: '100%',
  },
  timesContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  timePicker: {
    width: '40%',
    right: 0,
  },
});
