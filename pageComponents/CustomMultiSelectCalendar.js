import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Calendar} from 'react-native-calendars';

function formatDate(date) {
  if (date === null) {
    return null;
  }
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

function formatStringToDate(dateString) {
  if (dateString === null) {
    return null;
  }
  const d = new Date(
    dateString.substring(0, 4),
    dateString.substring(5, 7) - 1,
    dateString.substring(8, 10),
  );
  return d;
}

export default (props) => {
  let today = new Date();
  const [day, setDay] = useState(props.startDate);
  const [dayLast, setDayLast] = useState(props.endDate);
  function updateStartDay(date) {
    date = date ? formatStringToDate(date.dateString) : null;
    setDay(date);
    return props.startDayHandler ? props.startDayHandler(date) : null;
  }
  function updateEndDay(date) {
    date = date ? formatStringToDate(date.dateString) : null;
    setDayLast(date);
    return props.endDayHandler ? props.endDayHandler(date) : null;
  }
  return (
    <View style={styles.calendarContainer}>
      <Calendar
        minDate={today.toDateString()}
        onDayPress={(d) => {
          if (day === null) {
            updateStartDay(d);
          } else {
            if (dayLast === null) {
              if (d.timestamp < Date.parse(day)) {
                updateStartDay(d);
              } else {
                updateEndDay(d);
              }
            } else {
              updateEndDay(null);
              updateStartDay(d);
            }
          }
        }}
        style={styles.calendar}
        enableSwipeMonths={true}
        theme={{
          calendarBackground: 'transparent',
          selectedDayBackgroundColor: 'red',
          dayTextColor: 'white',
          monthTextColor: 'white',
          arrowColor: 'red',
          todayTextColor: 'red',
          textDisabledColor: '#777777',
        }}
        markedDates={{
          [formatDate(day)]: {
            selected: true,
            disableTouchEvent: false,
            selectedColor: 'red',
            startingDay: true,
            endingDay: dayLast === null,
            selectedTextColor: 'black',
            color: 'red',
          },
          [formatDate(dayLast)]: {
            selected: true,
            disableTouchEvent: false,
            selectedColor: 'red',
            endingDay: true,
            selectedTextColor: 'black',
            color: 'red',
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
