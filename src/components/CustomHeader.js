import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import COLOR from '../config/color.json';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {HEIGHT, NotoSans_Medium, WIDTH} from '../config/AppConst';

const CustomHeader = ({name, onPress}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: HEIGHT(1.5),
      }}>
      <Ionicons
        style={{marginTop: 4}}
        name="arrow-back"
        color="black"
        size={25}
        onPress={() => onPress()}
      />
      <Text
        style={{
          fontSize: 16,
          fontFamily: NotoSans_Medium,
          color: COLOR.Black,
          paddingLeft: WIDTH(2),
        }}>
        {name}
      </Text>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({});
