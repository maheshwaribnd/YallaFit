import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {FONTSIZE, HEIGHT, NotoSans_Medium, WIDTH} from '../config/AppConst';
import COLOR from '../config/color.json';

const CustomBtn = ({name, onPress, disabled}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.4}
      disabled={disabled}
      onPress={() => onPress()}
      style={styles.button}>
      <Text style={styles.txtBtn}>{name}</Text>
    </TouchableOpacity>
  );
};

export default CustomBtn;

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH(92),
    height: HEIGHT(7),
    borderRadius: 8,
    backgroundColor: COLOR.AuroraGreen,
    color: COLOR.ButtonNameColor,
    marginTop: HEIGHT(3),
  },
  txtBtn: {
    fontFamily: NotoSans_Medium,
    fontSize: FONTSIZE(2.4),
    color: COLOR.ButtonNameColor,
  },
});
