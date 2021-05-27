import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {subDays, format} from 'date-fns';
import {accentColors} from '../styles/Default.js';

function formatDate(date) {
  return date ? format(date, 'Y-MM-dd') : null;
}

export default (props) => {
  let today = new Date();
  const [day, setDay] = useState(props.startDate);
  const [dayLast, setDayLast] = useState(props.endDate);
  function updateStartDay(date) {
    setDay(date);
    return props.startDayHandler ? props.startDayHandler(date) : null;
  }
  function updateEndDay(date) {
    setDayLast(date);
    return props.endDayHandler ? props.endDayHandler(date) : null;
  }
  return (
    <View style={styles.calendarContainer}>
      <Calendar
        minDate={today.toDateString()}
        onDayPress={(d) => {
          const date = subDays(new Date(d.timestamp), -1);
          console.log('Selected: ' + date);
          if (day === null) {
            updateStartDay(date);
          } else {
            if (dayLast === null) {
              if (d.timestamp < Date.parse(day)) {
                updateStartDay(date);
              } else {
                updateEndDay(date);
              }
            } else {
              updateEndDay(null);
              updateStartDay(date);
            }
          }
        }}
        style={styles.calendar}
        enableSwipeMonths={true}
        theme={{
          calendarBackground: 'transparent',
          selectedDayBackgroundColor: accentColors.primary,
          dayTextColor: 'white',
          monthTextColor: 'white',
          arrowColor: accentColors.primary,
          todayTextColor: accentColors.primary,
          textDisabledColor: '#777777',
        }}
        markedDates={{
          [formatDate(day)]: {
            selected: true,
            disableTouchEvent: false,
            selectedColor: accentColors.primary,
            startingDay: true,
            endingDay: dayLast === null,
            selectedTextColor: 'black',
            color: accentColors.primary,
          },
          [formatDate(dayLast)]: {
            selected: true,
            disableTouchEvent: false,
            selectedColor: accentColors.primary,
            endingDay: true,
            selectedTextColor: 'black',
            color: accentColors.primary,
          },
        }}
        markingType={'period'}
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
    backgroundColor: '#404040',
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
