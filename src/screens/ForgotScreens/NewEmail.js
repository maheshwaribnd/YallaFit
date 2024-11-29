import {
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {
  FONTSIZE,
  HEIGHT,
  NotoSans_Bold,
  NotoSans_Medium,
  WIDTH,
} from '../../config/AppConst';
import colors from '../../config/color.json';
import {useNavigation, useRoute} from '@react-navigation/native';
import ApiManager from '../../API/Api';
import Snackbar from 'react-native-snackbar';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomHeader from '../../components/CustomHeader';

const NewEmail = () => {
  const navigation = useNavigation();
  const routes = useRoute();

  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setpasswordError] = useState(false);
  const [confirmpasswordError, setconfirmpasswordError] = useState(false);

  var minLength = 6;

  const showPasswordFunction = () => {
    setShowPassword(!showPassword);
  };

  const showConfirmPasswordFunction = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onChangePassword = text => {
    const formattedText = text.replace(/\s/g, '');
    setPassword(formattedText);
  };

  const onChangeConfirmPassword = text => {
    const formattedText = text.replace(/\s/g, '');
    setConfirmPassword(formattedText);
    setconfirmpasswordError(false);
  };

  const validatePassword = () => {
    const strongPassword =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (strongPassword.test(password) == false) {
      setpasswordError(true);
    } else {
      setpasswordError(false);
    }
  };

  const confirmPasswordFunction = () => {
    if (confirmpassword.length > 0 && password !== confirmpassword) {
      setconfirmpasswordError(true);
    }
  };

  const resetPasswordAPI = () => {
    const body = {
      type: routes.params.InputType,
      username: routes.params.username,
      password: password,
      cpassword: confirmpassword,
    };

    ApiManager.setNewPassword(body)
      .then(res => {
        if (res.data.success == true) {
          navigation.navigate('SignIn');
        } else {
          Snackbar.show({
            text: res.data.message,
            backgroundColor: '#D1264A',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const ResetPassword = () => {
    if (password.length < minLength) {
      Snackbar.show({
        text: 'Enter Password',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (!passwordError && !confirmpasswordError) {
      resetPasswordAPI();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.forgotHeadline}>
        <CustomHeader
          name={'Forget Password'}
          onPress={() => navigation.goBack()}
        />
      </View>
      <View style={{padding: HEIGHT(1.5)}}>
        <Text style={styles.subheadline}>Enter new password</Text>
        <View style={styles.inputView}>
          <TextInput
            placeholder="Enter Password"
            style={styles.InputField}
            value={password}
            secureTextEntry={!showPassword}
            onChangeText={onChangePassword}
            onBlur={() => validatePassword()}
          />
          <Entypo
            name={showPassword ? 'eye' : 'eye-with-line'}
            onPress={showPasswordFunction}
            size={20}
            style={{paddingRight: WIDTH(3)}}
          />
        </View>
        {passwordError ? (
          <Text tyle={{fontSize: 12, color: 'red'}}>
            password must contain character, digit and special character
          </Text>
        ) : null}

        <Text style={styles.subheadline}>Confirm password</Text>
        <View style={styles.inputView}>
          <TextInput
            placeholder="Enter Confirm Password"
            style={styles.InputField}
            value={confirmpassword}
            secureTextEntry={!showConfirmPassword}
            onChangeText={onChangeConfirmPassword}
            onBlur={confirmPasswordFunction}
          />
          <Entypo
            name={showConfirmPassword ? 'eye' : 'eye-with-line'}
            onPress={showConfirmPasswordFunction}
            size={20}
            style={{paddingRight: WIDTH(3)}}
          />
        </View>
        {confirmpasswordError ? (
          <Text style={{fontSize: 12, color: 'red'}}>Password not match</Text>
        ) : null}

        <TouchableOpacity onPress={() => ResetPassword()} style={styles.button}>
          <Text
            style={{
              fontFamily: NotoSans_Bold,
              color: colors.ButtonNameColor,
              fontSize: 16,
            }}>
            Reset Password
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.White,
  },

  forgotHeadline: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: WIDTH(2),
    backgroundColor: colors.White,
    width: WIDTH(100),
    height: HEIGHT(9),
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },

  subheadline: {
    fontSize: 14,
    marginTop: HEIGHT(1),
    fontSize: FONTSIZE(2.2),
    fontFamily: NotoSans_Medium,
    color: colors.Gray9,
    fontWeight: '400',
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
    width: WIDTH(95),
    height: HEIGHT(7),
    borderRadius: 8,
    backgroundColor: colors.AuroraGreen,
    color: colors.ButtonNameColor,
    marginTop: HEIGHT(4),
  },
});
