import {StyleSheet, Text, View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {useRoute} from '@react-navigation/native';
import React from 'react';

const CalenderForAllDate = ({
  showDateArray,
  generateAllFridays,
  markedDatesObject,
}) => {
  const routes = useRoute();
  const selectedOption = routes.params.selectedOption;

  return (
    <View>
      <Calendar
        style={{borderRadius: 12}}
        markedDates={
          selectedOption > 7
            ? {...showDateArray, ...generateAllFridays}
            : {...markedDatesObject, ...generateAllFridays}
        }
        hideExtraDays={true}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          selectedDayBackgroundColor: '#BFFFF3',
          selectedDayTextColor: '#000000',
          todayTextColor: '#000000',
          todayBackgroundColor: '#78D4C3',
          // dayTextColor: '#2d4150',
          textDisabledColor: '#000000',
        }}
      />
    </View>
  );
};

export default CalenderForAllDate;

const styles = StyleSheet.create({});
