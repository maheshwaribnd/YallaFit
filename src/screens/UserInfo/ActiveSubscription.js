import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../config/color.json';
import {useNavigation} from '@react-navigation/native';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import {
  FONTSIZE,
  HEIGHT,
  NotoSans_Bold,
  NotoSans_Medium,
  WIDTH,
} from '../../config/AppConst';
import {Calendar} from 'react-native-calendars';
import CustomBtn from '../../components/CustomBtn';
import ApiManager from '../../API/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicatorBase} from 'react-native';

const ActiveSubscription = () => {
  const navigation = useNavigation();

  var todayDate = new Date().toISOString().slice(0, 10);

  const [allFridays, setallFridays] = useState('');
  const [selectedDates, setselectedDates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState('');
  const [userresponse, setUserResponse] = useState('');
  const [count, setcount] = useState(0);
  const [loader, setLoader] = useState(false);

  const [allDates, setallDates] = useState([]);
  const [addDates, setaddDates] = useState([]);
  const [removeDates, setremoveDates] = useState([]);

  useEffect(() => {
    activeSubscriptionAPI();
  }, []);

  useEffect(() => {
    if (selectedDates) {
      formatDates();
    }
  }, [selectedDates]);

  const activeSubscriptionAPI = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const userIdd = JSON.parse(userId)
    await ApiManager.activeSubscription(userIdd)
    .then(res => {
        setLoader(true);
        if (res?.data?.status == 200) {
          setLoader(false);
          const response = res?.data?.response;
          setUserResponse(response);
          setselectedDates(response?.ordDate);
          setallDates(response?.ordDate);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const updateSubscriptionDates = () => {
    if (addDates.length == removeDates.length) {
      params = {
        userId: userresponse.userId,
        ordId: userresponse?.orderId,
        orderDates: removeDates,
        cancleOrderDates: addDates,
      };

      ApiManager.updateSubscription(params).then(resp => {
        if (resp?.data?.status == 200) {
          setShowModal(false);
          ToastAndroid.show('Updated!', ToastAndroid.SHORT);
        }
      });
    } else {
      ToastAndroid.show('Select new dates for plan', ToastAndroid.SHORT);
    }
  };

  // get all fridays
  useEffect(() => {
    const startDate = new Date(2020, 0, 1);
    const endDate = new Date(2040, 11, 31);
    const fridays = [];
    let markedDatesObject = [];

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      if (d.getDay() === 5) {
        fridays.push(new Date(d));
      }
    }

    const formattedFridays = fridays.map(friday => {
      const year = friday.getFullYear();
      const month = (friday.getMonth() + 1).toString().padStart(2, '0');
      const day = friday.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    });

    formattedFridays.forEach(date => {
      markedDatesObject[date] = {
        inactive: true,
        color: '#FF4D4D',
      };
    });

    setallFridays(markedDatesObject);
  }, []);

  // edit selected dates
  const formatDates = data => {
    let markedDatesObject = [];
    const allDates = data == undefined ? selectedDates : data;

    allDates.forEach(date => {
      markedDatesObject[date] = {
        selected: true,
        selectedColor: colors.AuroraGreen,
      };
    });
    setSelected(markedDatesObject);
  };

  const manageSelectedDates1 = date => {
    const countDates = selectedDates.length;
    if (selectedDates.includes(date)) {
      // remove date by user
      const isDateSelected = selectedDates.includes(date);
      const filteredData = isDateSelected
        ? selectedDates.filter(item => item !== date)
        : [...selectedDates, date];

      // add/remove last date
      if (filteredData.length < countDates) {
        const lastDateString = selectedDates[selectedDates.length - 1];
        const lastDate = new Date(lastDateString);
        lastDate.setDate(lastDate.getDate() + 1);

        if (lastDate.getDay() === 5) {
          lastDate.setDate(lastDate.getDate() + 1);
        }

        const newDate = lastDate.toISOString().split('T')[0];
        filteredData.push(newDate);
      } else if (filteredData.length >= countDates) {
        filteredData.sort();
        filteredData.pop();
      }

      setselectedDates(filteredData);
      formatDates(filteredData);
    }
  };

  const manageSelectedDates = date => {
    if (selectedDates.includes(date)) {
      const isDateSelected = selectedDates.includes(date);
      const filteredData = isDateSelected
        ? selectedDates.filter(d => d !== date)
        : [...selectedDates, date];
      setcount(count + 1);
      setselectedDates(filteredData);
    } else {
      if (count > 0) {
        setselectedDates([...selectedDates, date]);
        setcount(count - 1);
      } else {
        console.log('not able to add dates');
      }
    }

    if (allDates.includes(date)) {
      if (removeDates.includes(date)) {
        setremoveDates(removeDates.filter(d => d !== date));
      } else {
        setremoveDates([...removeDates, date]);
      }
    } else {
      if (addDates.includes(date)) {
        setaddDates(addDates.filter(d => d !== date));
      } else {
        if (addDates.length < removeDates.length) {
          setaddDates([...addDates, date]);
        }
      }
    }
  };

  const disabledDates = () => {
    const today = new Date();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const tomorrowDateString = tomorrow.toISOString().split('T')[0];
    return tomorrowDateString;
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.White}}>
      <View style={styles.header}>
        <FontAwesome6Icon
          name="arrow-left-long"
          color="black"
          onPress={() => navigation.goBack()}
          size={20}
        />
        <Text style={styles.headerText}>Active subscription</Text>
      </View>

      {loader ? (
        <ActivityIndicator
          size={45}
          color={colors.Black}
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        />
      ) : userresponse ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{flex: 1, paddingHorizontal: WIDTH(4), paddingBottom: 20}}>
            <View style={styles.mealPlan}>
              <Text style={styles.mealPlanText}>Meal Plan</Text>
              <Text style={styles.mealPlanText}>
                {userresponse?.ordDuration}
              </Text>
            </View>

            <View style={{marginTop: HEIGHT(2)}}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Image
                  source={require('../../Images/Plans/backgroundImg.png')}
                  style={styles.imageBox}
                />
                <View style={styles.mainView}>
                  <View
                    style={{
                      height: HEIGHT(18),
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.planName}>
                      {userresponse?.packageName}
                    </Text>
                    <View style={styles.mealPriceView}>
                      <Text style={styles.mealPrice}>
                        {userresponse?.packagePrice} OMR
                      </Text>
                      <Text style={styles.forMonth}>
                        /{userresponse?.ordDuration}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.imgView}>
                    <Image
                      source={{uri: userresponse?.packageImage}}
                      style={styles.img}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </View>
              <Text style={styles.cancelOrder}>Update Order</Text>

              <View>
                <Calendar
                  minDate={disabledDates()}
                  hideExtraDays={true}
                  onDayPress={day => manageSelectedDates(day.dateString)}
                  markedDates={{...selected, ...allFridays}}
                  theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    selectedDayBackgroundColor: '#BFFFF3',
                    selectedDayTextColor: '#000000',
                    todayTextColor: '#000000',
                    todayBackgroundColor: '#78D4C3',
                    // dayTextColor: '#2d4150',
                    textDisabledColor: '#000000',
                  }}
                />
              </View>
            </View>

            <CustomBtn
              onPress={() => setShowModal(true)}
              name={'Update Order'}
            />
          </View>
        </ScrollView>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.noActiveSubText}>No Active Subscription</Text>
        </View>
      )}

      {showModal ? (
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            // onBackdropPress={() => setShowModal(false)}
            onRequestClose={() => {
              setShowModal(!showModal);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>
                  Are you sure you want to Update this order ?
                </Text>
                {/* <Text style={styles.modalSubtitle}>
                  Note : This order will be carryforward to the 1 Feb 2024
                </Text> */}

                <TouchableOpacity
                  onPress={() => updateSubscriptionDates()}
                  style={styles.Savebtn}>
                  <Text style={styles.btnText}>Update Order</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      ) : null}
    </View>
  );
};

export default ActiveSubscription;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: WIDTH(4),
    borderColor: colors.Gray,
    borderWidth: 0.2,
    shadowOffset: {width: 1, height: 1.5},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    backgroundColor: colors.White,
    elevation: 10,
  },

  headerText: {
    marginTop: -2,
    marginLeft: 14,
    fontSize: FONTSIZE(2.4),
    fontFamily: NotoSans_Bold,
    color: colors.Black,
  },

  mealPlan: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: HEIGHT(1),
  },

  mealPlanText: {
    fontFamily: NotoSans_Bold,
    color: colors.Black,
    fontSize: FONTSIZE(2.4),
  },

  imageBox: {
    width: WIDTH(92),
    height: HEIGHT(21),
    padding: WIDTH(1),
    borderRadius: 16,
    // margin: WIDTH(2),
  },

  mainView: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: WIDTH(2),
  },

  planName: {
    width: WIDTH(40),
    marginLeft: WIDTH(2),
    fontSize: FONTSIZE(2.6),
    color: colors.White,
    fontFamily: NotoSans_Bold,
  },

  mealPriceView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: WIDTH(2),
  },

  mealPrice: {
    color: colors.AuroraGreen,
    fontFamily: NotoSans_Bold,
    fontSize: FONTSIZE(2.4),
  },

  forMonth: {
    color: '#BBBBBB',
    textAlign: 'center',
    fontSize: FONTSIZE(2.2),
    paddingTop: HEIGHT(0.5),
    marginRight: WIDTH(4),
  },

  imgView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: WIDTH(2),
  },

  img: {
    height: HEIGHT(8),
    width: WIDTH(22),
  },

  backImage: {
    width: WIDTH(92),
    height: HEIGHT(20),
    borderRadius: 10,
  },

  titleText: {
    color: colors.White,
    fontFamily: NotoSans_Bold,
    fontSize: FONTSIZE(2.4),
  },

  priceText: {
    fontFamily: NotoSans_Bold,
    color: colors.AuroraGreen,
    fontSize: FONTSIZE(4),
  },

  cancelOrder: {
    fontFamily: NotoSans_Bold,
    fontSize: FONTSIZE(2.4),
    color: colors.Black,
    marginTop: HEIGHT(1),
  },

  noActiveSubText: {
    fontFamily: NotoSans_Medium,
    fontSize: FONTSIZE(2.3),
    color: colors.Gray9,
  },

  //modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
  },

  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalTitle: {
    fontFamily: NotoSans_Bold,
    fontSize: FONTSIZE(2),
    color: colors.Black,
    width: WIDTH(60),
    textAlign: 'center',
  },

  modalSubtitle: {
    fontFamily: NotoSans_Bold,
    fontSize: FONTSIZE(1.6),
    color: colors.Gray,
    width: WIDTH(60),
    textAlign: 'center',
  },

  Savebtn: {
    backgroundColor: colors.AuroraGreen,
    marginTop: HEIGHT(4),
    padding: 8,
    width: WIDTH(64),
    borderRadius: 10,
    alignItems: 'center',
  },

  btnText: {
    fontFamily: NotoSans_Medium,
    fontSize: FONTSIZE(2.4),
    color: colors.Black,
  },
});
