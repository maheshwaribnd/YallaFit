import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  FONTSIZE,
  HEIGHT,
  NotoSans_Bold,
  NotoSans_Medium,
  WIDTH,
} from '../../config/AppConst';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../config/color.json';
import ApiManager from '../../API/Api';
import EmailSignIn from './EmailSignIn';
import PasswordSignIn from './PasswordSignIn';
import Modal from 'react-native-modal';
import Snackbar from 'react-native-snackbar';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import messaging from '@react-native-firebase/messaging';
import CustomBtn from '../../components/CustomBtn';
import COLOR from '../../config/color.json';
import GoogleLogo from '../../assets/googlelogo.svg';
import Fblogo from '../../assets/fblogo.svg';
import OTPModalComponent from '../../components/OtpComponent';

const SignIn = () => {
  const navigation = useNavigation();

  const [inputValue, setInputValue] = useState('');
  const [password, setPassword] = useState('');
  const [page, setPage] = useState(1);
  const [userOTP, setuserOTP] = useState('');
  const [isContinue, setisContinue] = useState(false);
  const [currentOTP, setCurrentOTP] = useState('');
  const [userDetails, setUserDetails] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [DeviceToken, setDeviceToken] = useState('');
  const [timer, setTimer] = useState(59);

  // Get Token

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    let token = await messaging().getToken();
    setDeviceToken(token);
  };

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

  const handleResendOTP = type => {
    signInAPI('mobile_no');
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
      name: userData?.name,
      email: userData?.email,
      google_id: userData?.id,
    };

    ApiManager.socialLogin(params)
      .then(res => {
        if (res?.data?.status == 200) {
          const userIdValue = JSON.stringify(res?.data?.userId);
          AsyncStorage.setItem('userid', userIdValue);
          AsyncStorage.setItem('userData', JSON.stringify(res?.data));
          if (res?.data?.question_status == true) {
            navigation.navigate('Dashboard');
          } else {
            navigation.navigate('LocationScreens');
          }
          signOut();
        } else {
          signOut();
          console.log('SignOut');
        }
      })
      .catch(error => console.error(error));
  };

  const handleOTPChange = async otp => {
    setCurrentOTP(otp);
    if (currentOTP == userOTP && otp.length == 5) {
      Snackbar.show({
        text: 'OTP verified successfully. ',
        fontFamily: NotoSans_Medium,
        backgroundColor: '#19cf55',
        duration: Snackbar.LENGTH_SHORT,
      });
      await AsyncStorage.setItem('userData', JSON.stringify(userDetails));
      navigation.navigate('LocationScreens');
    }
  };

  const handleOTPSubmit = async () => {
    if (currentOTP == userOTP) {
      Snackbar.show({
        text: 'OTP verified successfully. ',
        fontFamily: NotoSans_Medium,
        backgroundColor: '#19cf55',
        duration: Snackbar.LENGTH_SHORT,
      });
      postNotificationAPI();
      await AsyncStorage.setItem('userData', JSON.stringify(userDetails));
      if (userDetails?.question_status == true) {
        setShowModal(false);
        navigation.navigate('Dashboard');
        setPage(1);
      } else {
        setShowModal(false);
        navigation.navigate('LocationScreens');
        setPage(1);
      }
    } else {
      Snackbar.show({
        text: 'Incorrect OTP. Please enter the correct OTP. ',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
    setInputValue('');
  };

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var isEmailValid = emailRegex.test(inputValue);

  // var phoneRegex = /^((\+|00)968)?\d{8}$/;
  // var isValidNumber = phoneRegex.test(inputValue);

  const signInAPI = async type => {
    const params = {
      // username: type === typeof number ? Number(inputValue) : inputValue,
      username: inputValue,
      type: type,
    };

    await ApiManager.userLogin(params)
      .then(async res => {
        if (res?.data?.status == 200) {
          const response = res?.data;
          if (response.success == true) {
            const userIdValue = JSON.stringify(response?.userId);
            await AsyncStorage.setItem('userid', userIdValue);
            setUserDetails(response);
            if (type == 'emailid') {
              setPage(2);
              setisContinue(false);
            } else {
              setShowModal(true);
              setuserOTP(response?.otp);
              setisContinue(true);
            }
          } else {
            Snackbar.show({
              text: 'Enter Registered Email-id!.',
              backgroundColor: '#D1264A',
              duration: Snackbar.LENGTH_SHORT,
            });
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const signInPasswordAPI = type => {
    const params = {
      username: inputValue,
      password: password,
    };

    ApiManager.checkPassword(params)
      .then(async res => {
        if (res?.data?.success == true) {
          await AsyncStorage.setItem(
            'userid',
            JSON.stringify(userDetails?.userId),
          );
          await AsyncStorage.setItem('userData', JSON.stringify(userDetails));
          if (userDetails?.question_status == true) {
            postNotificationAPI(userDetails?.userId);
            navigation.navigate('Dashboard');
            setPage(1);
          } else {
            postNotificationAPI(userDetails?.userId);
            navigation.navigate('LocationScreens');
            setPage(1);
          }
        } else {
          Snackbar.show({
            text: 'Please enter a valid Password!.',
            backgroundColor: '#D1264A',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const onChangePass = password => {
    setPassword(password);
  };

  const renderComponent = () => {
    switch (page) {
      case 1:
        return (
          <EmailSignIn inputValue={inputValue} setInputValue={setInputValue} />
        );
      case 2:
        return (
          <PasswordSignIn
            password={password}
            setPassword={txt => onChangePass(txt)}
          />
        );
    }
  };

  const ContinueButton = () => {
    if (page == 1) {
      if (inputValue.length > 1 && isEmailValid) {
        signInAPI('emailid');
      }
      // else if (inputValue.length > 1 && isValidNumber) {
      //   signInAPI('mobile_no');
      // }
      else {
        Snackbar.show({
          text: 'Invalid Input , Please enter a valid email.',
          backgroundColor: '#D1264A',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } else if (page == 2) {
      if (password.length >= 6) {
        signInPasswordAPI();
      } else if (password.length > 0) {
        Snackbar.show({
          text: 'Invalid Input, Wrong Password',
          backgroundColor: '#D1264A',
          duration: Snackbar.LENGTH_SHORT,
        });
      } else if (password.length == 0) {
        Snackbar.show({
          text: 'Please Enter Password',
          backgroundColor: '#D1264A',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
      setInputValue('');
    }
  };

  // Notification API
  const postNotificationAPI = async item => {
    const params = {
      userId: item,
      deviceToken: DeviceToken,
    };
    ApiManager.postNotificationEvents(params).then(async res => {
      if (res?.data?.status == 200) {
        console.log('token response', res?.data);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 24,
          fontFamily: NotoSans_Bold,
          color: colors.Black,
          marginTop: HEIGHT(2),
        }}>
        Sign In
      </Text>
      {renderComponent()}

      {/* {isContinue ? (
        <CustomBtn name={'Verify'} onPress={handleOTPSubmit} />
      ) : ( */}
      <CustomBtn name={'Continue'} onPress={() => ContinueButton()} />
      {/* )} */}

      <View style={{alignItems: 'flex-end'}}>
        <Text
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgot}>
          Forgot Password ?
        </Text>
      </View>
      <View style={styles.horizontalWrap}>
        <View style={styles.horizontalLine} />
        <View>
          <Text style={{width: 35, textAlign: 'center', color: colors.Gray}}>
            Or
          </Text>
        </View>
        <View style={styles.horizontalLine} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: WIDTH(8),
          marginTop: HEIGHT(2),
        }}>
        <TouchableOpacity onPress={() => googleLogin()}>
          <GoogleLogo />
        </TouchableOpacity>
        <TouchableOpacity>
          <Fblogo />
        </TouchableOpacity>
      </View>

      <View style={styles.forAskAccount}>
        <Text style={{color: COLOR.Gray}}>Don't have an account? </Text>
        <Text
          onPress={() => navigation.navigate('SignUpDetails')}
          style={{
            color: colors.MollyRobins,
            fontFamily: NotoSans_Medium,
            paddingBottom: HEIGHT(0.5),
          }}>
          Sign Up
        </Text>
      </View>

      <View style={styles.signInImage}>
        <Image
          source={require('../../Images/SignIn/SigninImg.png')}
          resizeMode="contain"
        />
      </View>

      {showModal ? (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <Modal
            isVisible={showModal}
            // onBackdropPress={() => setShowModal(false)}
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
                  onPress={() => handleOTPSubmit()}
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
export default SignIn;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: HEIGHT(2),
    backgroundColor: colors.White,
  },

  subheadline: {
    fontSize: FONTSIZE(1.8),
    marginTop: HEIGHT(1),
    color: colors.Gray9,
    fontFamily: NotoSans_Medium,
  },

  InputField: {
    marginTop: HEIGHT(2),
    borderRadius: 12,
    borderWidth: 1,
    paddingLeft: 12,
    color: colors.Black,
    borderColor: colors.Gray,
  },

  recentText: {
    alignItems: 'flex-start',
    width: WIDTH(80),
    marginTop: HEIGHT(4),
    marginVertical: 10,
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

  btnText: {
    fontFamily: NotoSans_Medium,
    fontSize: FONTSIZE(2.1),
    color: colors.ButtonNameColor,
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

  forgot: {
    fontSize: FONTSIZE(1.8),
    fontFamily: NotoSans_Medium,
    right: 3,
    color: colors.MollyRobins,
  },

  horizontalWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: HEIGHT(4),
  },
  horizontalLine: {
    height: 1,
    width: WIDTH(30),
    backgroundColor: colors.Black,
  },

  forAskAccount: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: HEIGHT(2),
  },

  signInImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
