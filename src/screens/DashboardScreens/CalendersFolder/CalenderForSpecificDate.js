import {StyleSheet, Text, View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import colors from '../../../config/color.json';
import React from 'react';
import {useRoute} from '@react-navigation/native';
import {HEIGHT, NotoSans_Medium, WIDTH} from '../../../config/AppConst';

const CalenderForSpecificDate = ({
  showDateArray,
  generateAllFridays,
  selectSpecificDates,
  markedDatesObject,
  colorAddOns,
}) => {
  const routes = useRoute();
  const selectedOption = routes.params.selectedOption;

  return (
    <View style={{marginTop: HEIGHT(1)}}>
      <View style={styles.colorIndicateView}>
        <View style={styles.colorBox1}></View>
        <Text style={{color: colors.Black, fontFamily: NotoSans_Medium}}>
          Plan dates
        </Text>
      </View>
      <View style={styles.colorIndicateView}>
        <View style={styles.colorBox2}></View>
        <Text style={{color: colors.Black, fontFamily: NotoSans_Medium}}>
          Add on's specific dates
        </Text>
      </View>
      <Calendar
        style={{borderRadius: 12}}
        onDayPress={day => selectSpecificDates(day.dateString)}
        markedDates={
          selectedOption > 7
            ? {
                ...showDateArray,
                ...generateAllFridays,
                ...colorAddOns,
              }
            : {...markedDatesObject, ...generateAllFridays, ...colorAddOns}
        }
        markingType="dot"
        hideExtraDays={true}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          selectedDayBackgroundColor: 'orange',
          selectedDayTextColor: '#000000',
          todayTextColor: '#000000',
          todayBackgroundColor: '#78D4C3',
          dotColor: 'orange',
          textDisabledColor: '#000000',
        }}
      />
    </View>
  );
};

export default CalenderForSpecificDate;

const styles = StyleSheet.create({
  calenderStyle: {
    borderRadius: 12,
    height: 335,
  },

  colorIndicateView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: WIDTH(4),
    gap: 12,
  },

  colorBox1: {
    width: 28,
    height: 14,
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#BFFFF3',
    backgroundColor: '#BFFFF3',
  },

  colorBox2: {
    width: 28,
    height: 14,
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#31917f',
    backgroundColor: '#31917f',
  },
});
