import {StyleSheet, Text, View, TextInput} from 'react-native';
import React, {useState} from 'react';
import {FONTSIZE, HEIGHT, NotoSans_Medium, WIDTH} from '../../config/AppConst';
import COLOR from '../../config/color.json';

const EmailSignIn = ({inputValue, setInputValue}) => {
  const [isInvalidInput, setisInvalidInput] = useState(false);
  const [error, setError] = useState(false);

  const inputOnChange = text => {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var isEmailValid = emailRegex.test(inputValue);
    // var phoneRegex = /^[6-9]\d{9}$/;
    // var isValidNumber = phoneRegex.test(inputValue);

    // let validate = isEmailValid || isValidNumber;
    if (!isEmailValid) {
      setisInvalidInput(true);
    } else {
      setisInvalidInput(false);
    }
    setInputValue(inputValue);
    setError(false);

    const formattedInpt = text.replace(/\s/g, '');
    setInputValue(formattedInpt);
  };

  const validationFunction = () => {
    if (inputValue.length > 0 && isInvalidInput == true) {
      setError(true);
    }
  };

  return (
    <View>
      <Text style={styles.subheadline}>Enter Email</Text>

      <TextInput
        style={styles.InputField}
        value={inputValue}
        onChangeText={inputOnChange}
        onBlur={validationFunction}
      />

      {error ? (
        <Text style={{fontSize: 12, color: 'red'}}>
          Please Enter Valid Email
        </Text>
      ) : null}
    </View>
  );
};

export default EmailSignIn;

const styles = StyleSheet.create({
  subheadline: {
    fontSize: FONTSIZE(1.8),
    marginTop: HEIGHT(1),
    color: COLOR.Gray9,
    fontFamily: NotoSans_Medium,
  },

  InputField: {
    marginTop: HEIGHT(2),
    paddingLeft: WIDTH(4),
    borderRadius: 12,
    borderWidth: 1,
    color: COLOR.Black,
    borderColor: COLOR.Gray,
  },
});
