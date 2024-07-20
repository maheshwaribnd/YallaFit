import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  FONTSIZE,
  HEIGHT,
  NotoSans_Bold,
  NotoSans_Medium,
  WIDTH,
} from '../../config/AppConst';
import {useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';
import COLOR from '../../config/color.json';
import ApiManager from '../../API/Api';
import Entypo from 'react-native-vector-icons/Entypo';
import OTPModalComponent from '../../components/OtpComponent';
import Snackbar from 'react-native-snackbar';
import CustomBtn from '../../components/CustomBtn';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import GoogleLogo from '../../assets/googlelogo.svg';
import Fblogo from '../../assets/fblogo.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

const SignUpDetails = () => {
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [NumberInput, setNumberInput] = useState('');
  const [phoneNoError, setphoneNoError] = useState(false);
  const [isInvalidInput, setisInvalidInput] = useState(false);
  const [nameerror, setnameError] = useState(false);
  const [emailerror, setemailError] = useState(false);
  const [numbererror, setnumberError] = useState(false);
  const [otpShowModal, setotpShowModal] = useState(false);
  const [storedOTP, setStoredOTP] = useState();
  const [currentOTP, setCurrentOTP] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setpasswordError] = useState(false);
  const [passwordError2, setpasswordError2] = useState(false);
  const [confirmpasswordError, setconfirmpasswordError] = useState(false);
  const [DeviceToken, setDeviceToken] = useState('');

  const [TndC, setTndC] = useState([]);
  const [TndCshowModal, setTndCShowModal] = useState(false);
  const [timer, setTimer] = useState(59);
  const navigation = useNavigation();

  var minLength = 8;

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    let token = await messaging().getToken();
    setDeviceToken(token);
  };

  useEffect(() => {
    if (otpShowModal) {
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
  }, [otpShowModal || timer]);

  const handleResendOTP = () => {
    singUpAPI();
    // Reset timer
    setTimer(30);
  };

  useEffect(() => {
    GoogleSignin.configure();
  }, []);

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      SocialSignInAPI(userInfo?.user);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('errror', error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('errror', error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('errror', error);
      } else {
        console.log('errror', error);
      }
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  const SocialSignInAPI = async userData => {
    const params = {
      name: userData.name,
      email: userData.email,
      google_id: userData.id,
    };

    ApiManager.socialLogin(params)
      .then(res => {
        if (res?.data?.status == 200) {
          const userIdValue = JSON.stringify(res?.data?.userId);
          AsyncStorage.setItem('userid', userIdValue);

          AsyncStorage.setItem('userData', JSON.stringify(userData));
          if (userData?.question_status == true) {
            navigation.navigate('Dashboard');
          } else {
            navigation.navigate('LocationScreens');
          }

          navigation.navigate('LocationScreens');
          signOut();
        } else {
          signOut();
          console.log('SignOut');
        }
      })
      .catch(error => console.error(error));
  };

  var nameRegex = /^[^\s]+$/;
  var isNameValid = nameRegex.test(nameInput);

  const nameOnChange = text => {
    setnameError(false);
    const formattedName = text.replace(/\s/g, '');

    if (text.length === 1 && text.trim() === '') {
      setNameInput(formattedName);
    } else {
      setNameInput(text);
    }
  };

  const emailOnChange = text => {
    setemailError(false);
    const formattedEmail = text.replace(/\s/g, '');
    setEmailInput(formattedEmail);
  };

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var isEmailValid = emailRegex.test(emailInput);

  // var phoneRegex = /^((\+|00)968)?\d{8}$/;
  // var isValidNumber = phoneRegex.test(NumberInput);

  // const onChangeInput = inputValue => {
  //   setnumberError(false);
  //   var phoneRegex = /^((\+|00)968)?\d{8}$/;
  //   var isValidNumber = phoneRegex.test(inputValue);
  //   const formattedEmail = inputValue.replace(/\s/g, '');

  //   if (!isValidNumber) {
  //     setisInvalidInput(true);
  //   } else {
  //     setisInvalidInput(false);
  //   }
  //   setNumberInput(formattedEmail);
  // };

  const nameValidationFunction = () => {
    if (nameInput.length > 0 && nameInput.length < 3 && isNameValid) {
      setnameError(true);
    }
  };

  const emailValidationFunction = () => {
    if (emailInput.length > 0 && !isEmailValid) {
      setemailError(true);
    }
  };

  const handleOTPChange = otp => {
    setCurrentOTP(otp);
  };

  const showPasswordFunction = () => {
    setShowPassword(!showPassword);
  };

  const showConfirmPasswordFunction = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onChangePassword = text => {
    const formattedText = text.replace(/\s/g, '');
    setPassword(formattedText);
    setpasswordError(false);
  };

  const onChangeConfirmPassword = text => {
    const formattedText = text.replace(/\s/g, '');
    setConfirmPassword(formattedText);
    setconfirmpasswordError(false);
  };

  const validatePassword = () => {
    const strongPassword = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])/;
    if (strongPassword.test(password) == false) {
      setpasswordError(true);
    } else if (password.length < 8) {
      setpasswordError2(true);
    } else {
      setpasswordError(false);
      setpasswordError2(false);
    }
  };

  const singUpAPI = async () => {
    const params = {
      name: nameInput,
      email: emailInput,
      password: password,
      cpassword: confirmpassword,
      // mobile_no: NumberInput,
    };

    ApiManager.userSignUp(params)
      .then(resp => {
        if (resp?.data?.status == 200) {
          setStoredOTP(resp.data);
          setotpShowModal(true);
        } else {
          setotpShowModal(false);
          Snackbar.show({
            text: 'Email already exist.',
            backgroundColor: '#D1264A',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch(err => {
        console.log('error', err);
      });
  };

  const Continue = () => {
    if (
      nameInput == '' ||
      emailInput == '' ||
      // NumberInput == '' ||
      password == '' ||
      confirmpassword == ''
    ) {
      Snackbar.show({
        text: 'Please enter all the fields. ',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else if (!nameerror && !emailerror) {
      // if (NumberInput.length > 0 && isValidNumber == false) {
      //   setnumberError(true);
      // }

      if (password.length < minLength) {
        Snackbar.show({
          text: 'Enter 8 digit Password',
          backgroundColor: '#D1264A',
          duration: Snackbar.LENGTH_SHORT,
        });
      } else if (confirmpassword.length == 0) {
        Snackbar.show({
          text: 'Enter confirm Password',
          backgroundColor: '#D1264A',
          duration: Snackbar.LENGTH_SHORT,
        });
      } else if (!passwordError) {
        if (password == confirmpassword) {
          singUpAPI();
        } else {
          setconfirmpasswordError(true);
        }
      }
    }
  };

  const handleOTPVerify = () => {
    if (currentOTP == storedOTP.otp) {
      Snackbar.show({
        text: 'OTP verified successfully. ',
        backgroundColor: '#27cc5d',
        duration: Snackbar.LENGTH_SHORT,
      });
      setotpShowModal(false);
      userStatusUpdateAPI();
    } else {
      Snackbar.show({
        text: 'Incorrect OTP. Please enter the correct OTP. ',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  const userStatusUpdateAPI = () => {
    const body = {
      name: nameInput,
      email: emailInput,
      password: password,
      cpassword: confirmpassword,
      // mobile_no: NumberInput,
    };

    ApiManager.userCompleteRegister(body)
      .then(async resp => {
        const data = resp?.data;
        console.log('signUp', data);
        if (data?.status == 200) {
          await AsyncStorage.setItem('userData', JSON.stringify(data?.user));
          await AsyncStorage.setItem('userid', JSON.stringify(data?.user?.id));

          postNotificationAPI(data?.user?.id);
          navigation.navigate('LocationScreens');
        }
      })
      .catch(err => {
        console.log('error', err);
      });
  };

  // Notification API
  const postNotificationAPI = async item => {
    const params = {
      deviceToken: DeviceToken,
      userId: item,
    };

    ApiManager.postNotificationEvents(params)
      .then(async res => {
        console.log('token status', res.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  // Term and Condition API
  const termsAndConditionAPI = () => {
    ApiManager.termsAndCondition()
      .then(res => {
        if (res.status == 200) {
          const response = res?.data?.respone[0];
          setTndC(response?.description);
          setTndCShowModal(true);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Text style={styles.title}>Sign Up</Text>
      </View>
      <Text style={styles.subheadline}>Name</Text>
      <TextInput
        style={styles.InputField}
        placeholder="Enter Name"
        keyboardType="text"
        value={nameInput}
        onChangeText={nameOnChange}
        onBlur={nameValidationFunction}
      />

      {nameerror ? (
        <Text style={{fontSize: 12, color: 'red'}}>
          Name must be 3 character
        </Text>
      ) : null}

      <Text style={styles.subheadline}>Email Id</Text>
      <TextInput
        style={styles.InputField}
        placeholder="Enter Email"
        keyboardType="email"
        value={emailInput}
        onChangeText={emailOnChange}
        onBlur={emailValidationFunction}
      />
      {emailerror ? (
        <Text style={{fontSize: 12, color: 'red'}}>Invalid email</Text>
      ) : null}

      {/* <Text style={styles.subheadline}>Phone Number</Text>
      <TextInput
        style={styles.InputField}
        placeholder="Enter Number"
        keyboardType="numeric"
        value={NumberInput}
        onChangeText={numeric => onChangeInput(numeric)}
      />
      {numbererror ? (
        <Text style={{fontSize: 12, color: 'red'}}>
          Please Enter Valid Phone Number
        </Text>
      ) : null} */}

      <Text style={styles.subheadline}>Password</Text>
      <View style={styles.inputView}>
        <TextInput
          placeholder="Enter Password"
          value={password}
          style={styles.PassInputField}
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
        <Text style={{fontSize: 12, color: 'red'}}>
          Use small, capital, numeric, alpha numeric letter.
        </Text>
      ) : passwordError2 ? (
        <Text style={{fontSize: 12, color: 'red'}}>
          password must be 8 character
        </Text>
      ) : null}

      <Text style={styles.subheadline}>Confirm Password</Text>

      <View style={styles.inputView}>
        <TextInput
          placeholder="Enter Confirm Password"
          style={styles.PassInputField}
          value={confirmpassword}
          secureTextEntry={!showConfirmPassword}
          onChangeText={onChangeConfirmPassword}
        />

        <Entypo
          name={showConfirmPassword ? 'eye' : 'eye-with-line'}
          onPress={showConfirmPasswordFunction}
          size={20}
          style={{paddingRight: WIDTH(3)}}
        />
      </View>

      {confirmpasswordError ? (
        <Text style={{fontSize: 12, color: 'red'}}>
          Password does not match
        </Text>
      ) : null}

      <CustomBtn
        name={'Continue'}
        onPress={() => Continue()}
        style={styles.button}
      />

      <View style={styles.horizontalWrap}>
        <View style={styles.horizontalLine} />
        <View>
          <Text style={{width: 35, textAlign: 'center', color: COLOR.Gray9}}>
            Or
          </Text>
        </View>
        <View style={styles.horizontalLine} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: WIDTH(6),
          marginTop: HEIGHT(1),
        }}>
        <TouchableOpacity onPress={() => googleLogin()}>
          <GoogleLogo />
        </TouchableOpacity>
        <TouchableOpacity>
          <Fblogo />
        </TouchableOpacity>
      </View>

      <View style={styles.forAskAccount}>
        <Text style={{color: COLOR.Gray}}>Already have an account? </Text>
        <Text
          style={{color: COLOR.MollyRobins}}
          onPress={() => navigation.navigate('SignIn')}>
          Sign In
        </Text>
      </View>
      <View style={{marginTop: HEIGHT(1), justifyContent: 'center'}}>
        <Text style={{textAlign: 'center', color: COLOR.Gray}}>
          By signing up you agree to{' '}
        </Text>
        <TouchableOpacity
          style={{alignSelf: 'center'}}
          onPress={termsAndConditionAPI}>
          <Text
            style={{
              textAlign: 'center',
              color: COLOR.MollyRobins,
              fontSize: 13,
            }}>
            terms and conditions
          </Text>
        </TouchableOpacity>

        {TndCshowModal ? (
          <Modal
            isVisible={true}
            onBackdropPress={() => setTndCShowModal(false)}
            style={styles.TndCmodalWrap}>
            <Text style={styles.tNdcHeading}>Terms & Conditions</Text>
            <ScrollView>
              <Text
                style={{
                  color: COLOR.Black,
                  fontFamily: NotoSans_Medium,
                }}>
                {TndC}
              </Text>

              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styles.okayBtn}
                  onPress={() => setTndCShowModal(false)}>
                  <Text style={styles.okayTxt}>Okay</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Modal>
        ) : null}
      </View>

      {otpShowModal ? (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <Modal
            isVisible={otpShowModal}
            // onBackdropPress={() => setotpShowModal(false)}
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.otpmodalWrap}>
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
                  onPress={() => handleOTPVerify()}
                  style={styles.verifyButton}>
                  <Text style={styles.btnText}>Verify</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      ) : null}
    </View>
  );
};

export default SignUpDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    paddingHorizontal: WIDTH(4),
  },

  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontFamily: NotoSans_Bold,
    color: COLOR.Black,
  },

  subheadline: {
    fontSize: 14,
    marginTop: HEIGHT(0.5),
    color: COLOR.Gray9,
    fontFamily: NotoSans_Medium,
  },

  InputField: {
    height: HEIGHT(6.2),
    marginTop: HEIGHT(0.2),
    borderRadius: 6,
    borderWidth: 1,
    paddingLeft: 12,
    borderColor: COLOR.Gray,
    color: COLOR.black,
  },

  inputView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLOR.Gray,
    marginTop: HEIGHT(0.5),
  },

  PassInputField: {
    paddingLeft: 12,
    color: COLOR.Black,
    width: WIDTH(80),
    height: HEIGHT(6.5),
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH(94.5),
    height: HEIGHT(7),
    borderRadius: 8,
    backgroundColor: COLOR.AuroraGreen,
    color: COLOR.ButtonNameColor,
    marginTop: HEIGHT(4),
  },

  horizontalWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: HEIGHT(1.8),
  },

  horizontalLine: {
    height: 1,
    width: WIDTH(30),
    backgroundColor: COLOR.Black,
  },

  logo: {
    marginLeft: HEIGHT(1),
    marginRight: HEIGHT(1),
    marginTop: HEIGHT(2),
  },

  forAskAccount: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: HEIGHT(1.2),
  },

  TndCmodalWrap: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: COLOR.White,
    padding: WIDTH(2),
    paddingTop: HEIGHT(3),
    width: WIDTH(90),
    height: HEIGHT(30),
    borderWidth: 1,
    borderColor: COLOR.Gray,
    borderRadius: 20,
  },

  otpmodalWrap: {
    padding: WIDTH(2),
    alignItems: 'center',
    backgroundColor: 'white',
    width: WIDTH(92),
    height: HEIGHT(32),
    borderWidth: 1,
    borderColor: COLOR.Gray,
    borderRadius: 20,
  },

  recentText: {
    alignItems: 'flex-start',
    width: WIDTH(80),
    marginTop: HEIGHT(6),
    marginVertical: 10,
  },

  verifyButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH(85),
    height: HEIGHT(7),
    borderRadius: 8,
    backgroundColor: COLOR.AuroraGreen,
    color: COLOR.ButtonNameColor,
  },

  btnText: {
    fontFamily: NotoSans_Bold,
    fontSize: 16,
    color: COLOR.ButtonNameColor,
  },

  tNdcHeading: {
    color: COLOR.Black,
    fontFamily: NotoSans_Bold,
    fontSize: FONTSIZE(3),
    textAlign: 'center',
  },

  okayBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH(16),
    height: HEIGHT(5),
    borderRadius: 6,
    textAlign: 'center',
    backgroundColor: COLOR.AuroraGreen,
  },

  okayTxt: {
    textAlign: 'center',
    color: COLOR.Black,
  },
});
