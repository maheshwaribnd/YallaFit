import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import colors from '../../config/color.json';
import React, {useEffect, useState} from 'react';
import {
  FONTSIZE,
  HEIGHT,
  NotoSans_Bold,
  NotoSans_Medium,
  Rochester,
  WIDTH,
} from '../../config/AppConst';
import {useNavigation} from '@react-navigation/native';
import FoodImage from '../../assets/FoodImage.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  const navigation = useNavigation();

  const [changeColor, setChangeColor] = useState(false);
  const [userData, setuserData] = useState('');

  const GetStarted = () => {
    setChangeColor(!changeColor);
    setTimeout(() => {
      navigation.replace('SwiperScreen');
    }, 200);
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    const userData1 = await AsyncStorage.getItem('userData');
    setuserData(JSON.parse(userData1));
  };

  setTimeout(() => {
    if (userData) {
      if (userData?.question_status) {
        navigation.navigate('Dashboard');
      } else {
        navigation.replace('LocationScreens');
      }
    }
  }, 2000);

  return (
    <View style={styles.container}>
      {userData == '' || userData == null ? (
        <ImageBackground
          source={require('../../Images/Logo/splashscreenBack.png')}
          style={styles.backgroungImg}
          blurRadius={4}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="white">
          <View style={styles.wrap}>
            <Image
              source={require('../../Images/Logo/logo.png')}
              style={{marginTop: HEIGHT(2)}}
            />
            <FoodImage width={300} height={350} />
            <Text style={styles.text}>Eat Healthy Stay Fit</Text>
            <TouchableOpacity
              onPress={() => GetStarted()}
              style={styles.button}>
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      ) : (
        <ImageBackground
          source={require('../../Images/Logo/splashscreenBack.png')}
          style={styles.backgroungImg}
          blurRadius={4}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor="white">
          <View style={styles.wrap}>
            <Image
              source={require('../../Images/Logo/logo.png')}
              style={{marginTop: HEIGHT(12)}}
            />
            <FoodImage width={300} height={350} />
            <Text style={styles.text}>Eat Healthy Stay Fit</Text>
          </View>
        </ImageBackground>
      )}
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backgroungImg: {
    flex: 1,
    backgroundColor: colors.Black,
    height: HEIGHT(100),
    width: WIDTH(100),
  },

  wrap: {
    height: HEIGHT(100),
    width: WIDTH(100),
    backgroundColor: 'rgba( 0, 0, 0, 0.6 )',

    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    marginTop: HEIGHT(6),
    marginBottom: HEIGHT(7),
  },

  text: {
    color: colors.White,
    width: WIDTH(45),
    fontFamily: Rochester,
    fontSize: FONTSIZE(4.5),
    textAlign: 'center',
    marginBottom: HEIGHT(12),
  },

  button: {
    justifyContent: 'center',
    padding: HEIGHT(0.5),
    alignItems: 'center',
    textAlign: 'center',
    width: WIDTH(85),
    height: HEIGHT(8),
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.AuroraGreen,
    position: 'absolute',
    bottom: HEIGHT(5),
  },

  changeButtonClr: {
    justifyContent: 'center',
    padding: HEIGHT(0.5),
    alignItems: 'center',
    textAlign: 'center',
    width: WIDTH(85),
    height: HEIGHT(8),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.AuroraGreen,
    backgroundColor: 'rgb(65, 130, 112)',
    opacity: 0.7,
    position: 'absolute',
    bottom: HEIGHT(5),
  },

  buttonText: {
    fontSize: 16,
    fontFamily: NotoSans_Medium,
    textAlign: 'center',
    color: colors.White,
  },

  changeButtonTextClr: {
    fontSize: 16,
    color: colors.Black,
    fontFamily: NotoSans_Bold,
    textAlign: 'center',
  },
});
