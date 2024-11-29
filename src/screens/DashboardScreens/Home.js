import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  TextInput,
} from 'react-native';
import {
  useSharedValue,
  withTiming,
  useDerivedValue,
  useAnimatedProps,
  interpolateColor,
} from 'react-native-reanimated';
import colors from '../../config/color.json';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import {
  FONTSIZE,
  HEIGHT,
  NotoSans_Bold,
  NotoSans_Medium,
  WIDTH,
} from '../../config/AppConst';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ApiManager from '../../API/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { userInfoDetails } from '../../Redux/Reducers/userInfo';
import PieChart from 'react-native-pie-chart';
import { ActivityIndicator, Badge } from 'react-native-paper';
import { Circle, Svg } from 'react-native-svg';
import { createAnimatableComponent } from 'react-native-animatable';
import { ProgressBar } from '@react-native-community/progress-bar-android';

const Home = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const AnimatedCircle = Animated.createAnimatedComponent(Circle)
  const AnimatedText = Animated.createAnimatedComponent(TextInput)

  const [progress, setProgress] = useState(0);
  const [notificationCount, setNotificationCount] = useState('');
  const [userresponse, setUserResponse] = useState([]);
  const [loader, setLoader] = useState(false);
  const widthAndHeight = 185;
  const series = [
    userresponse?.fats,
    userresponse?.carbs,
    userresponse?.protein,
  ];

  const sliceColor = ['#F0DE3E', '#F55F5F', '#00973C']

  const radius = 45;
  const circumference = radius * Math.PI * 2;
  const duration = 6000;

  const strokeOffset = useSharedValue(circumference)

  const percentage = useDerivedValue(() => {
    const number = ((circumference - strokeOffset.value) / circumference) * 100;
    return withTiming(number, { duration: duration })
  })

  const strokeColor = useDerivedValue(() => {
    return interpolateColor(
      percentage.value,
      [0, 50, 100],
      ['red', 'green', 'yellow']
    )
  })

  const animatedCircleProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: withTiming(strokeOffset.value, { duration: duration }),
      stroke: strokeColor.value
    }
  })

  const animatedTextProps = useAnimatedProps(() => {
    return {
      text: `${Math.round(percentage.value)} %`
    }
  })

  useEffect(() => {
    strokeOffset.value = 0
  }, [])

  // For Progressbar

  const processProps = {
    styleAttr: 'Horizontal',
    indeterminate: false,
  };

  useEffect(() => {
    function updateProgress() {
      setProgress(currentProgress => {
        const newProgress = currentProgress + 0.01;
        if (newProgress < 1) {
          setTimeout(updateProgress, 50);
        }
        return Math.min(newProgress, 1);
      });
    }

    updateProgress();
  }, []);

  // Get Token

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    let token = await messaging().getToken();
    setDeviceToken(token);
  };

  useFocusEffect(
    React.useCallback(() => {
      dashboardAPI();
    }, []),
  );

  const dashboardAPI = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const userIdd = JSON.parse(userId)
    setLoader(true);
    await ApiManager.userDetails(userIdd)
      .then(res => {
        if (res?.data?.status == 200) {
          setLoader(false);
          let response = res?.data?.respone;
          setUserResponse(response[0]);
          let findData = response.find(e => e);
          dispatch(userInfoDetails({ data: findData }));
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  // Notification API

  useEffect(() => {
    NotificationAPI();
  }, []);

  const NotificationAPI = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const userIdd = JSON.parse(userId)

    await ApiManager.notification(userIdd)
      .then(res => {
        if (res?.data?.status == 200) {
          let response = res?.data?.response;
          const filterdata = response.filter(
            item => item.isNotifyCustomer === 0,
          );
          setNotificationCount(filterdata.length);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.forgotHeadline}>
        <View style={styles.forUserView}>
          <TouchableOpacity onPress={() => navigation.navigate('UserSetting')}>
            <Image
              style={styles.userImg}
              source={
                userresponse?.length == []
                  ? require('../../Images/Profile/user.png')
                  : { uri: userresponse?.profileImg }
              }
            />
          </TouchableOpacity>
          <View style={{ paddingHorizontal: 10 }}>
            <Text style={styles.nameText}>{userresponse?.name}</Text>
            <Text>{userresponse?.city}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('notification')}
          style={styles.iconNotication}>
          <Ionicons name="notifications-outline" size={27} color={'black'} />
          <View style={{ position: 'absolute', top: 5, right: 5 }}>
            <Badge size={15} style={{ color: colors.White }}>
              {notificationCount}
            </Badge>
          </View>
        </TouchableOpacity>
      </View>

      {loader ? (
        <ActivityIndicator
          size={45}
          color={colors.Black}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.forBMIText}>Your BMI Result</Text>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {/* <AnimatedText style={{ color: 'yellow', position: 'absolute', top: 25 }} animatedProps={animatedTextProps} />
            <Svg style={styles.caloryView}>

              <Circle
                cx={50}
                cy={50}
                r={45}
                stroke="#E7E7E7"
                strokeWidth={10}
                fill="transparent"
              />

              <AnimatedCircle
                cx={155}
                cy={100}
                r={95}
                strokeDasharray={`${radius * Math.PI * 2}`}
                strokeWidth={20}
                animatedProps={animatedCircleProps}

              />
            </Svg> */}
            <View style={styles.caloryView}>
              <PieChart
                widthAndHeight={widthAndHeight}
                series={series}
                sliceColor={sliceColor}
                coverRadius={0.87}
                labelPosition="inside"
                style={{ shadowOffset: { height: 2, width: 2 }, elevation: 5 }}
              />

              <View style={styles.caloriesPerDayText}>
                <Text style={styles.caloryText}>{userresponse?.caloriesPerDay}</Text>
                <Text style={styles.calorySubText}>Calories a day</Text>
              </View>
            </View>
          </View>
          <Text style={styles.forStatisticsText}>
            This statistics are based on data you provided
          </Text>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.progressView}>
              <View>
                <Text style={styles.text}>Protein</Text>
                <View style={styles.progressInnerView}>
                  {/* <View style={styles.progresssty1}></View> */}
                  <ProgressBar
                    {...processProps}
                    progress={progress}
                    color="#00973C"
                    style={styles.progresssty1}
                  />
                  <Text style={styles.progressbarText}>
                    {/* {userresponse?.protein}g */}
                    {Math.round(progress * userresponse?.protein)}g
                  </Text>
                </View>
                <Text style={styles.text}>Carbs</Text>
                <View style={styles.progressInnerView}>
                  {/* <View style={styles.progresssty2}></View> */}
                  <ProgressBar
                    {...processProps}
                    progress={progress}
                    color="#F55F5F"
                    style={styles.progresssty2}
                  />
                  <Text style={styles.progressbarText}>
                    {/* {userresponse?.carbs}g */}
                    {Math.round(progress * userresponse?.carbs)}g
                  </Text>
                </View>
                <Text style={styles.text}>Fats</Text>
                <View style={styles.progressInnerView}>
                  {/* <View style={styles.progresssty3}></View> */}
                  <ProgressBar
                    {...processProps}
                    progress={progress}
                    color="#F0DE3E"
                    style={styles.progresssty3}
                  />
                  <Text style={styles.progressbarText}>
                    {Math.round(progress * userresponse?.fats)}g
                    {/* {userresponse?.fats}g */}
                  </Text>
                </View>
              </View>

              <View style={styles.weightHeightBox}>
                <Text style={styles.textWrap}>
                  {userresponse?.gender}: {userresponse?.age} yrs
                </Text>
                <Text style={styles.textWrap}>
                  Weight: {userresponse?.weight} kg
                </Text>
                <Text style={styles.textWrap}>
                  Height: {userresponse?.height} cm
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('MyPlans')}>
              <Text style={styles.myPlanText}>My Plans</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.White,
  },

  forgotHeadline: {
    backgroundColor: colors.White,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: WIDTH(4),
    width: WIDTH(100),
    height: HEIGHT(10),
    shadowColor: colors.Gray9,
    shadowOffset: { width: 3, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 7,
  },

  forUserView: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 7,
  },

  userImg: {
    height: WIDTH(13),
    width: WIDTH(13),
    borderWidth: 1,
    borderRadius: 50,
  },

  nameText: {
    fontSize: FONTSIZE(2.2),
    fontFamily: NotoSans_Medium,
    color: colors.Black,
  },

  iconNotication: {
    marginRight: WIDTH(5),
    height: WIDTH(12),
    width: WIDTH(12),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9CEFDF',
    borderRadius: 45,
    color: colors.Black,
    borderColor: 'gray',
  },

  forBMIText: {
    fontSize: FONTSIZE(2),
    fontFamily: NotoSans_Medium,
    color: colors.Black,
    margin: HEIGHT(1),
    paddingLeft: WIDTH(4),
    textShadowOffset: {
      height: 1,
      width: 1
    },
    textShadowRadius: 4
  },

  forStatisticsText: {
    fontSize: FONTSIZE(2),
    fontFamily: NotoSans_Medium,
    color: colors.Black,
    marginTop: HEIGHT(1.5),
    marginBottom: HEIGHT(1),
    paddingLeft: WIDTH(5),
    textShadowOffset: {
      height: 1,
      width: 1
    },
    textShadowRadius: 4
  },

  caloryView: {
    width: WIDTH(92),
    height: HEIGHT(30),
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderColor: colors.Black,
    backgroundColor: '#FFD9D9',
    ShadowOffset: {
      height: 1,
      width: 1
    },
    elevation: 5
  },

  caloriesPerDayText: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },

  caloryText: {
    color: colors.Black,
    fontFamily: NotoSans_Bold,
    fontSize: FONTSIZE(3),
    textShadowOffset: {
      height: 1,
      width: 1
    },
    textShadowRadius: 4
  },

  calorySubText: {
    color: colors.Gray,
    fontFamily: NotoSans_Bold,
    textShadowOffset: {
      height: 1,
      width: 1
    },
    textShadowRadius: 4
  },

  progressView: {
    width: WIDTH(92),
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      height: 2,
      width: 2
    },
    elevation: 5,
    backgroundColor: colors.White,
    borderRadius: 10,
  },

  text: {
    fontSize: 16,
    fontFamily: NotoSans_Medium,
    color: colors.Black,
    textShadowOffset: {
      height: 1,
      width: 1
    },
    textShadowRadius: 4
  },

  progressInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  progressbarText: {
    color: colors.Black,
    fontFamily: NotoSans_Medium,
    textShadowOffset: {
      height: 1,
      width: 1
    },
    textShadowRadius: 4
  },

  progresssty1: {
    width: WIDTH(68),
    height: HEIGHT(1.2),
    borderRadius: 50,
    // backgroundColor: '#00973C',
    shadowOffset: {
      height: 2,
      width: 2
    },
    elevation: 6
  },

  progresssty2: {
    width: WIDTH(68),
    height: HEIGHT(1.2),
    borderRadius: 50,
    // backgroundColor: '#F55F5F',
    shadowOffset: {
      height: 2,
      width: 2
    },
    elevation: 6
  },

  progresssty3: {
    width: WIDTH(68),
    height: HEIGHT(1.2),
    borderRadius: 50,
    // backgroundColor: '#F0DE3E',
    shadowOffset: {
      height: 2,
      width: 2
    },
    elevation: 6
  },

  weightHeightBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: WIDTH(1),
  },

  textWrap: {
    height: HEIGHT(5),
    width: WIDTH(28),
    fontSize: FONTSIZE(1.8),
    marginTop: WIDTH(2),
    marginBottom: HEIGHT(1),
    paddingTop: HEIGHT(1),
    textAlign: 'center',
    borderRadius: 5,
    borderColor: '#616161',
    color: '#616161',
    ShadowOffset: {
      height: 1,
      width: 1
    },
    elevation: 4,
    backgroundColor: colors.White
  },

  myPlanText: {
    fontFamily: NotoSans_Bold,
    fontSize: FONTSIZE(2.1),
    color: colors.ButtonNameColor,
    textShadowOffset: {
      height: 1,
      width: 1
    },
    textShadowRadius: 4
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH(92),
    height: HEIGHT(7),
    borderRadius: 8,
    backgroundColor: colors.AuroraGreen,
    color: colors.ButtonNameColor,
    ShadowOffset: {
      height: 1,
      width: 1
    },
    elevation: 4
  },
});
