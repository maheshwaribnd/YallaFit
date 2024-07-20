import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/native';
import {Calendar} from 'react-native-calendars';

const CalenderOriginal = ({
  handleWeeksCalender,
  handleDaysCalender,
  generateAllFridays,
  showDateArray,
  existingEndDate,
  markedDatesObject,
}) => {
  const routes = useRoute();
  const selectedOption = routes.params.selectedOption;
  var todayDate = new Date().toISOString().slice(0, 10);

  const disabledDates = () => {
    const today = new Date();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const tomorrowDateString = tomorrow.toISOString().split('T')[0];
    return tomorrowDateString;
  };

  return (
    <View>
      <Calendar
        onDayPress={day =>
          selectedOption < 7
            ? handleDaysCalender(day.dateString)
            : handleWeeksCalender(day.dateString)
        }
        markedDates={
          selectedOption > 7
            ? {...showDateArray, ...generateAllFridays}
            : {...markedDatesObject, ...generateAllFridays}
        }
        disabledTextColor="#FF4D4D"
        minDate={disabledDates()}
        hideExtraDays={true}
        style={styles.calendarStyle}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          selectedDayBackgroundColor: '#BFFFF3',
          selectedDayTextColor: '#000000',
          todayTextColor: '#000000',
          todayBackgroundColor: '#78D4C3',
          // dayTextColor: '#2d4150',
          dayTextColor: '#000000',
          textDisabledColor: '#2d4150',
        }}
      />
    </View>
  );
};

export default CalenderOriginal;

const styles = StyleSheet.create({
  calendarStyle: {
    day: {
      width: 40,
      height: 40,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
});
