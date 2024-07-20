import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  FONTSIZE,
  HEIGHT,
  NotoSans_Bold,
  NotoSans_Medium,
  WIDTH,
} from '../../config/AppConst';
import colors from '../../config/color.json';
import {useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';
import ApiManager from '../../API/Api';
import CustomHeader from '../../components/CustomHeader';
import Snackbar from 'react-native-snackbar';
import CustomBtn from '../../components/CustomBtn';
import OTPModalComponent from '../../components/OtpComponent';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [inputValue, setInputValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [InputType, setInputType] = useState('');
  const [currentOTP, setCurrentOTP] = useState('');
  const [storedOTP, setStoredOTP] = useState([]);
  const [isInvalidInput, setisInvalidInput] = useState(false);
  const [error, setError] = useState(false);

  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (showModal) {
      let interval;

      if (timer > 0) {
        interval = setInterval(() => {
          setTimer(prevTimer => prevTimer - 1);
        }, 1000);
      } else {
        clearInterval(interval);
      }

      return () => clearInterval(interval);
    }
  }, [showModal || timer]);

  const handleResendOTP = async () => {
    const params = {
      username: inputValue,
      type: InputType,
    };
    await ApiManager.forgotPassword(params)
      .then(res => {
        if (res?.data?.success == true) {
          setStoredOTP(res?.data);
        } else {
          Snackbar.show({
            text: 'Invalid Creadential...',
            backgroundColor: '#D1264A',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
    setTimer(30);
  };

  const handleOTPChange = otp => {
    setCurrentOTP(otp);
  };

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var isEmailValid = emailRegex.test(inputValue);
  // var phoneRegex = /^((\+|00)968)?\d{8}$/;
  // var isValidNumber = phoneRegex.test(inputValue);

  const inputOnChange = text => {
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

  const forgotEmailAPI = async type => {
    setInputType(type);
    const params = {
      username: inputValue,
      type: type,
    };

    await ApiManager.forgotPassword(params)
      .then(res => {
        if (res?.data?.success == true) {
          setStoredOTP(res?.data);
          setShowModal(!showModal);
        } else {
          Snackbar.show({
            text: 'Invalid Creadential...',
            backgroundColor: '#D1264A',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const Continue = () => {
    if (inputValue.length > 1 && isEmailValid) {
      forgotEmailAPI('emailid');
    }
    // else if (inputValue.length > 1 && isValidNumber) {
    //   forgotEmailAPI('mobile_no');
    // }
    else {
      Snackbar.show({
        text: 'Please enter a valid email.',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  const verifyOTP = () => {
    if (currentOTP == storedOTP.otp) {
      navigation.navigate('NewEmail', {
        username: storedOTP.username,
        InputType,
      });
    } else {
      Snackbar.show({
        text: 'Incorrect OTP. Please enter the correct OTP.',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
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

      <View style={{paddingHorizontal: WIDTH(4), paddingTop: HEIGHT(2)}}>
        <Text style={styles.subheadline}>Email Id </Text>

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

        <CustomBtn name={'Continue'} onPress={() => Continue()} />

        {showModal ? (
          <Modal
            isVisible={showModal}
            onBackdropPress={() => setShowModal(false)}
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.modalWrap}>
              <Text style={styles.subheadline}>Verify OTP</Text>

              <OTPModalComponent
                otp={currentOTP}
                setcurrentOTP={handleOTPChange}
              />

              <View style={styles.recentText}>
                {timer > 0 ? (
                  <Text>Resend OTP in: {timer} seconds</Text>
                ) : (
                  <TouchableOpacity onPress={() => handleResendOTP()}>
                    <Text style={{color: 'orange'}}>Resend OTP</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => verifyOTP()}
                  style={styles.verifyButton}>
                  <Text
                    style={{
                      fontFamily: NotoSans_Bold,
                      fontSize: 16,
                      color: colors.Black,
                    }}>
                    Verify
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        ) : null}
      </View>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.White,
  },

  forgotHeadline: {
    backgroundColor: colors.White,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: WIDTH(2),
    width: WIDTH(100),
    height: HEIGHT(9),
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },

  subheadline: {
    fontSize: FONTSIZE(2),
    color: colors.Gray9,
    fontFamily: NotoSans_Medium,
  },

  InputField: {
    height: HEIGHT(7),
    marginTop: HEIGHT(2),
    borderRadius: 9,
    borderWidth: 1,
    paddingLeft: 12,
    borderColor: colors.Gray,
  },

  support: {
    position: 'absolute',
    fontSize: 12,
    right: 14,
    top: HEIGHT(16),
    color: colors.Gray,
  },

  inputContainer: {
    flexDirection: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginRight: WIDTH(1),
    marginLeft: WIDTH(1),
    paddingLeft: 8,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.Gray,
    width: WIDTH(15),
    height: HEIGHT(8),
  },

  recentText: {
    alignItems: 'flex-start',
    width: WIDTH(80),
    marginTop: HEIGHT(4),
    marginVertical: 10,
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH(94),
    height: HEIGHT(7),
    borderRadius: 8,
    backgroundColor: colors.AuroraGreen,
    color: colors.ButtonNameColor,
    marginTop: HEIGHT(3),
  },

  verifyButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH(85),
    height: HEIGHT(7),
    borderRadius: 8,
    backgroundColor: colors.AuroraGreen,
    color: colors.ButtonNameColor,
  },

  modalWrap: {
    padding: WIDTH(2),
    alignItems: 'center',
    backgroundColor: 'white',
    width: WIDTH(92),
    height: HEIGHT(32),
    borderWidth: 1,
    borderColor: colors.Gray,
    borderRadius: 20,
  },
});
