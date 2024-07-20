import {StyleSheet, Text, View, TextInput, Alert} from 'react-native';
import React, {useState} from 'react';
import {FONTSIZE, HEIGHT, NotoSans_Medium, WIDTH} from '../../config/AppConst';
import Entypo from 'react-native-vector-icons/Entypo';
import colors from '../../config/color.json';

const PasswordSignIn = ({password, setPassword}) => {
  const [showPassword, setShowPassword] = useState(false);

  const showPasswordFunction = () => {
    setShowPassword(!showPassword);
  };

  const onChangePassword = text => {
    const formattedText = text.replace(/\s/g, '');
    setPassword(formattedText);
  };

  return (
    <View>
      <Text style={styles.subheadline}>Password</Text>
      <View style={styles.inputView}>
        <TextInput
          onChangeText={onChangePassword}
          secureTextEntry={!showPassword}
          value={password}
          style={styles.InputField}
        />
        <Entypo
          name={showPassword ? 'eye' : 'eye-with-line'}
          onPress={showPasswordFunction}
          size={20}
          style={{paddingRight: WIDTH(3)}}
        />
      </View>
    </View>
  );
};

export default PasswordSignIn;

const styles = StyleSheet.create({
  subheadline: {
    fontSize: 14,
    marginTop: HEIGHT(1),
    color: colors.Gray9,
    fontFamily: NotoSans_Medium,
  },

  inputView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: HEIGHT(1),
  },

  InputField: {
    paddingLeft: 12,
    color: colors.Black,
    width: WIDTH(80),
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH(93),
    height: HEIGHT(7),
    borderRadius: 8,
    backgroundColor: colors.AuroraGreen,
    color: colors.ButtonNameColor,
    marginTop: HEIGHT(3),
  },
});
