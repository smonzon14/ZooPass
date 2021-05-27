import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {accentColors} from '../styles/Default.js';
function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }

  return [year, month, day].join('-');
}

export default ({}) => {
  let today = new Date();
  const [day, setDay] = useState(formatDate(new Date()));
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
          calendarBackground: 'transparent',
          selectedDayBackgroundColor: accentColors.primaryDark,
          dayTextColor: 'white',
          monthTextColor: 'white',
          arrowColor: accentColors.primary,
          todayTextColor: accentColors.primary,
          textDisabledColor: '#002171',
        }}
        markedDates={{
          [day]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: accentColors.primaryLight,
            selectedTextColor: 'black',
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    marginTop: 20,
    marginBottom: 15,
    width: 350,
    justifyContent: 'center',
  },
  calendar: {
    width: '100%',
    backgroundColor: accentColors.secondaryDark,
    borderRadius: 20,
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
