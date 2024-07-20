import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ToastAndroid,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  FONTSIZE,
  HEIGHT,
  NotoSans_Bold,
  NotoSans_Medium,
  NotoSans_SemiBold,
  WIDTH,
} from '../../config/AppConst';
import colors from '../../config/color.json';
import Modal from 'react-native-modal';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import CalenderForAllDate from './CalendersFolder/CalenderForAllDate';
import CalenderOriginal from './CalendersFolder/CalenderOriginal';
import ApiManager from '../../API/Api';
import CalenderForSpecificDate from './CalendersFolder/CalenderForSpecificDate';
import {useDispatch, useSelector} from 'react-redux';
import {showSelectedWeeks} from '../../Redux/Reducers/calenderDates';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChooseDateCalender = () => {
  const routes = useRoute();
  const dispatch = useDispatch();
  const selectorforStartDate = useSelector(state => state.calenderDates);

  const [showModal, setShowModal] = useState(false);
  const [showCalenderModal1, setShowCalenderModal1] = useState(false);
  const [showCalenderModal2, setShowCalenderModal2] = useState(false);
  const [showDateArray, setshowDateArray] = useState([]);
  const [weekDated, setweekDated] = useState([]);
  const [userSubscrption, setUserSubscrption] = useState([]);
  const [showButton, setShowButton] = useState([]);
  const [addonPrice, setAddonPrice] = useState(0);
  const [passDates, setPassdates] = useState();
  const [passstartDate, setPassstartdate] = useState();
  const [passsEndDate, setPassEnddate] = useState();
  const [passAddon, setPassAddon] = useState();
  const [addOns, setAddOns] = useState([]);
  const [colorAddOns, setcolorAddOns] = useState([]);
  const [addOnsWithDate, setaddOnsWithDate] = useState([]);

  const [existingEndDate, setExistingEndDate] = useState('');

  const [allFridays, setallFridays] = useState('');
  let markedDatesObject = {};
  const navigation = useNavigation();

  const selectedOption = routes.params.selectedOption;
  const multiplyAddonPrice = addonPrice * passAddon;
  const multiplyAddonPriceforSpecific = addonPrice * addOnsWithDate;

  useEffect(() => {
    AddOnAPIFunction();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      selectorforStartDate?.addOn == undefined
        ? setShowButton([])
        : setShowButton(selectorforStartDate?.addOn);
      setcolorAddOns([]);
      setaddOnsWithDate([]);
    }, [selectorforStartDate]),
  );

  useEffect(() => {
    if (showButton !== '') {
      setPassAddon(showButton);
    }
  }, [showButton]);

  const AddOnAPIFunction = () => {
    try {
      ApiManager.addonsInCalender().then(res => {
        if (res.data.status == 200) {
          const response = res?.data?.respone;
          const modifiedResponse = response.map(item => ({
            ...item,
            isSelected: false,
          }));
          setAddOns(modifiedResponse);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    activeSubscriptionAPI();
  }, []);

  // Check user have an Active Subscription of not
  const activeSubscriptionAPI = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const userIdd = JSON.parse(userId)

    await ApiManager.activeSubscription(userIdd)
      .then(res => {
        if (res?.data?.status == 200) {
          const response = res?.data?.response;
          setUserSubscrption(response);
          let dates = response.ordDate;
          setExistingEndDate(dates[dates.length - 1]);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  // const compareDatesFunctions = () => {
  //   const newDates = userSubscrption?.ordDate

  //   // for (let i = 0; i < newDates.length; i++) {
  //   //   let date1 = new Date(newDates[i])
  //   //   let date2 = new Date(passDates[i])

  //   //   if (date1 !== date2) {
  //   //     console.log('different Dates');
  //   //   }
  //   //   else {
  //   //     console.log('same Dates');
  //   //   }
  //   // }

  //   // if (userSubscrption?.ordDate == passDates) {
  //   //   console.log('same Dates');
  //   // }
  //   // else {
  //   //   console.log('different Dates');
  //   // }
  // }

  const goBackFunction = () => {
    setShowModal(false);
    setShowCalenderModal1(false);
    setShowCalenderModal2(false);
    navigation.goBack();
  };

  const Continue = () => {
    setShowCalenderModal1(false);
    setShowCalenderModal2(false);
    if (selectedOption == 1) {
      if (showDateArray.length == 1) {
        addOnDoneFunction();
        navigation.navigate('Plans');
      } else {
        ToastAndroid.show(
          `Please select ${selectedOption} days !`,
          ToastAndroid.SHORT,
        );
      }
    } else {
      if (showDateArray.length < 7) {
        if (showDateArray.length == selectedOption) {
          if (passAddon == '') {
            addOnDoneFunction1();
            setShowModal(false);
            navigation.navigate('Plans');
          } else {
            setShowModal(true);
          }
        } else if (weekDated.length > 0) {
          if (passAddon == '') {
            addOnDoneFunction1();
            navigation.navigate('Plans');
          } else {
            setShowModal(true);
          }
        } else {
          ToastAndroid.show(
            `Please select ${selectedOption} days !`,
            ToastAndroid.SHORT,
          );
        }
      }
    }
  };

  const addOnDoneFunction = () => {
    dispatch(
      showSelectedWeeks({
        date: passDates,
        startDate: passstartDate,
        endDate: passsEndDate,
        addOn: passAddon,
        datesforAddon: addOnsWithDate == '' ? passDates : addOnsWithDate,
        multiplayprice: multiplyAddonPrice,
      }),
    );
    navigation.navigate('Plans');
  };

  const addOnDoneFunction1 = () => {
    dispatch(
      showSelectedWeeks({
        date: passDates,
        startDate: passstartDate,
        endDate: passsEndDate,
        addOn: passAddon,
        datesforAddon: [],
        multiplayprice: multiplyAddonPrice,
      }),
    );
    navigation.navigate('Plans');
  };

  const addOnSpecificDoneFunction = () => {
    if (addOnsWithDate == '') {
      ToastAndroid.show(`Please select atleast one day !`, ToastAndroid.SHORT);
    } else {
      setShowCalenderModal2(false);
      navigation.navigate('Plans');
      dispatch(
        showSelectedWeeks({
          date: passDates,
          startDate: passstartDate,
          endDate: passsEndDate,
          addOn: passAddon,
          datesforAddon: addOnsWithDate == '' ? passDates : addOnsWithDate,
          multiplayprice: multiplyAddonPriceforSpecific,
        }),
      );
    }
  };

  const FunctionShowCalender1 = () => {
    setShowCalenderModal1(!showCalenderModal1);
    setShowModal(false);
    let markedDatesObject2 = [];
    // add ons dated
    passDates.forEach(date => {
      markedDatesObject2[date] = {
        selected: true,
        selectedColor: '#31917f',
      };
    });
    setcolorAddOns(markedDatesObject2);
  };

  const FunctionShowCalender2 = () => {
    setShowCalenderModal2(!showCalenderModal2);
    setShowModal(false);
  };

  const handleButtonPress = item => {
    const price = parseFloat(item.price);
    setAddonPrice(addonPrice + price); // set price for addOn array
    setShowButton(prev => [...prev, item]);
  };

  const showButtonFunction1 = item => {
    let filtered = [];
    filtered = showButton.filter(e => e.id !== item.id);
    setShowButton(filtered);
  };

  const ShowAddOns = ({item}) => {
    return (
      <View style={styles.addOnBox}>
        <View style={{flexDirection: 'row'}}>
          <View>
            <Image source={{uri: item.image}} style={styles.img} />
          </View>
          <View>
            <Text style={styles.foraddOnTitle}>{item.title}</Text>
            <Text style={styles.foraddOnPrice}>{item.price} OMR</Text>
          </View>
        </View>

        {showButton.includes(item) ? (
          <TouchableOpacity
            onPress={() => showButtonFunction1(item)}
            style={styles.addRemoveButton}>
            <Text style={styles.addonaddremovebtnText}>Remove</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => handleButtonPress(item)}
            style={styles.addRemoveButton}>
            <Text style={styles.addonaddremovebtnText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Function for Weeks
  const handleWeeksCalender = date => {
    setPassstartdate(date);
    let dateRangeArray = [];
    let markedDatesObject = [];
    let formattedDates = [];
    let StartselectedDate = new Date(date);
    let newDate = JSON.parse(selectedOption);

    const endDate1 = new Date(
      StartselectedDate.getTime() + (newDate - 1) * 24 * 60 * 60 * 1000,
    );

    let planEndDate = new Date(endDate1);
    let year = planEndDate.getUTCFullYear();
    let month = String(planEndDate.getUTCMonth() + 1).padStart(2, '0');
    let day = String(planEndDate.getUTCDate()).padStart(2, '0');

    // Format plan End Date
    let formattedEndDate = `${year}-${month}-${day}`;

    setPassEnddate(formattedEndDate);

    while (StartselectedDate <= endDate1) {
      dateRangeArray.push(new Date(StartselectedDate));
      StartselectedDate.setDate(StartselectedDate.getDate() + 1);
    }

    let filteredDated = dateRangeArray.filter(e => getWeekday(e) !== 'Friday');

    formattedDates = filteredDated.map(isoDateString => {
      const date = new Date(isoDateString);
      return `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    });
    setweekDated(formattedDates);

    formattedDates.forEach(date => {
      markedDatesObject[date] = {
        selected: true,
        selectedColor: '#BFFFF3',
      };
    });

    setPassdates(formattedDates);
    setshowDateArray(markedDatesObject);

    function getWeekday(dateString) {
      const daysOfWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      const date = new Date(dateString);
      const weekdayIndex = date.getUTCDay();
      return daysOfWeek[weekdayIndex];
    }
  };

  // Function for Single Days
  const handleDaysCalender = date => {
    let startSelectedDate = new Date(date);
    let newDate = JSON.parse(selectedOption);

    setPassstartdate(date);

    const endDate1 = new Date(
      startSelectedDate.getTime() + (newDate - 1) * 24 * 60 * 60 * 1000,
    );

    let currentDate = new Date(startSelectedDate);
    let formattedDates = [];
    let fridays = [];

    while (currentDate <= endDate1) {
      const dayOfWeek = currentDate.getUTCDay();
      const isoDateString = currentDate.toISOString().split('T')[0];

      if (dayOfWeek === 5) {
        fridays.push(isoDateString);
      } else {
        formattedDates.push(isoDateString);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (newDate > formattedDates.length) {
      let lastDate = new Date(formattedDates[formattedDates.length - 1]);
      let nextDate = new Date(lastDate);

      do {
        nextDate.setDate(lastDate.getDate() + 1);
        lastDate = nextDate;
      } while (nextDate.getDay() === 5);

      let nextDateString = nextDate.toISOString().split('T')[0];
      formattedDates.push(nextDateString);
    }

    let markedDatesObject = {};
    formattedDates.forEach(date => {
      markedDatesObject[date] = {
        selected: true,
        selectedColor: '#BFFFF3',
      };
    });
    setPassdates(formattedDates);
    setshowDateArray(formattedDates);
  };

  // function for random date selection
  // const handleDaysCalender = date => {
  //   const date1 = new Date(date);
  //   setPassstartdate(date);
  //   const dayOfWeek = date1.getUTCDay();
  //   const daysOfWeek = [
  //     'Sunday',
  //     'Monday',
  //     'Tuesday',
  //     'Wednesday',
  //     'Thursday',
  //     'Friday',
  //     'Saturday',
  //   ];
  //   const dayName = daysOfWeek[dayOfWeek];

  //   if (dayName == 'Friday') {
  //     null;
  //   } else {
  //     let formattedDates = [];
  //     let markedDatesObject = [];
  //     let DatesArray = showDateArray;
  //     if (DatesArray.find(item => item == date)) {
  //       DatesArray = DatesArray.filter(item => item !== date);
  //     } else {
  //       if (DatesArray.length < selectedOption) {
  //         DatesArray.push(date);
  //         DatesArray.sort();
  //       } else {
  //         null;
  //       }
  //     }
  //     formattedDates = DatesArray.map(isoDateString => {
  //       const date = new Date(isoDateString);
  //       return `${date.getFullYear()}-${(date.getMonth() + 1)
  //         .toString()
  //         .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  //     });

  //     formattedDates.forEach(date => {
  //       markedDatesObject[date] = {
  //         selected: true,
  //         selectedColor: '#BFFFF3',
  //       };
  //     });

  //     setPassdates(formattedDates);
  //     setshowDateArray(formattedDates);
  //   }
  // };

  showDateArray.forEach(date => {
    markedDatesObject[date] = {
      selected: true,
      selectedColor: '#BFFFF3',
    };
  });

  // get all fridays
  useEffect(() => {
    const startDate = new Date(2020, 1, 1);
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
        selectedColor: '#FF4D4D',
      };
    });

    setallFridays(markedDatesObject);
  }, []);

  const selectSpecificDates = day => {
    if (passDates.includes(day)) {
      let markedDatesObject = [];
      let updatedColorAddOns = [...addOnsWithDate];
      if (addOnsWithDate.includes(day)) {
        updatedColorAddOns = updatedColorAddOns.filter(item => item !== day);
      } else {
        updatedColorAddOns.push(day);
      }
      setaddOnsWithDate(updatedColorAddOns);

      updatedColorAddOns.forEach(date => {
        markedDatesObject[date] = {
          selected: true,
          selectedColor: '#31917f',
        };
      });

      setcolorAddOns(markedDatesObject);
    }
  };

  return (
    <View style={styles.container}>
      {/* header  */}
      <View style={styles.header}>
        <FontAwesome6
          name="arrow-left-long"
          color="black"
          onPress={() => goBackFunction()}
          size={20}
        />
        <Text style={styles.headerText}>Select start date</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
        <View style={{paddingHorizontal: HEIGHT(2)}}>
          <Text style={styles.forText}>Select delivery date</Text>
          <CalenderOriginal
            handleWeeksCalender={handleWeeksCalender}
            existingEndDate={existingEndDate}
            handleDaysCalender={handleDaysCalender}
            generateAllFridays={allFridays}
            showDateArray={showDateArray}
            markedDatesObject={markedDatesObject}
          />
        </View>
        <View style={{borderTopWidth: 1, borderColor: colors.LightGray}} />

        {/* add on's list  */}
        <View
          style={{
            flex: 1,
            paddingHorizontal: HEIGHT(2),
            paddingBottom: HEIGHT(11),
          }}>
          <View style={styles.selectAddonView}>
            <Text style={styles.forText}>Select add on</Text>
            <Text style={styles.forText}>(optional)</Text>
          </View>

          <View style={{flex: 1, flexDirection: 'row'}}>
            <FlatList
              data={addOns}
              renderItem={({item}) => <ShowAddOns item={item} />}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonWrap}>
        <TouchableOpacity style={styles.button} onPress={() => Continue()}>
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* modals  */}
      <Modal
        isVisible={showModal}
        onBackdropPress={() => setShowModal(false)}
        style={{justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.modalWrap}>
          <Text style={styles.modalHeading}>
            1. Select for how many days you want the add on for
          </Text>

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              style={styles.buttonInModal}
              onPress={() => FunctionShowCalender1()}>
              <Text style={styles.allDaysmodalText}>Add for all days</Text>
            </TouchableOpacity>
          </View>

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              style={styles.buttonInModal}
              onPress={() => FunctionShowCalender2()}>
              <Text style={styles.allDaysmodalText}>Choose specific days</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={showCalenderModal1}
        onBackdropPress={() => setShowCalenderModal1(false)}
        style={{justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.CalendarWrap}>
          <CalenderForAllDate
            showDateArray={showDateArray}
            generateAllFridays={allFridays}
            markedDatesObject={colorAddOns}
          />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: HEIGHT(2),
            }}>
            <TouchableOpacity
              style={styles.Donebutton}
              onPress={() => addOnDoneFunction()}>
              <Text style={styles.donebtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={showCalenderModal2}
        onBackdropPress={() => setShowCalenderModal2(false)}
        style={{justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.CalendarWrap}>
          <CalenderForSpecificDate
            showDateArray={showDateArray}
            colorAddOns={colorAddOns}
            generateAllFridays={allFridays}
            markedDatesObject={markedDatesObject}
            selectSpecificDates={selectSpecificDates}
          />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: HEIGHT(2),
            }}>
            <TouchableOpacity
              style={styles.Donebutton}
              onPress={() => addOnSpecificDoneFunction()}>
              <Text style={styles.donebtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChooseDateCalender;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.White,
  },

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
    fontFamily: NotoSans_Medium,
    color: colors.Black,
  },

  addOnBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    elevation: 5,
    backgroundColor: colors.White,
    borderColor: colors.LightGray,
    padding: WIDTH(2),
    borderRadius: 6,
    marginHorizontal: HEIGHT(1),
    marginVertical: HEIGHT(0.8),
  },

  foraddOnTitle: {
    fontSize: 16,
    fontFamily: NotoSans_Medium,
    color: colors.Black,
    paddingLeft: WIDTH(2),
  },

  foraddOnPrice: {
    fontSize: 14,
    fontFamily: NotoSans_SemiBold,
    color: colors.Gray9,
    paddingLeft: WIDTH(2),
  },

  forText: {
    marginTop: HEIGHT(1),
    fontSize: 16,
    fontFamily: NotoSans_Medium,
    color: colors.Black,
  },

  img: {
    height: HEIGHT(11),
    width: WIDTH(21),
    borderRadius: 7,
  },

  addRemoveButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH(25),
    height: HEIGHT(5),
    borderRadius: 5,
    backgroundColor: '#9CEFDF',
  },

  addonaddremovebtnText: {
    color: colors.Black,
    fontFamily: NotoSans_Medium,
  },

  startDateText: {
    fontSize: 16,
    fontFamily: NotoSans_Medium,
    color: colors.Black,
    paddingLeft: WIDTH(2),
  },

  selectAddonView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  modalHeading: {
    width: WIDTH(80),
    textAlign: 'center',
    fontFamily: NotoSans_Medium,
    fontSize: FONTSIZE(2),
    color: colors.Black,
  },

  allDaysmodalText: {
    fontFamily: NotoSans_Medium,
    fontSize: FONTSIZE(2),
    color: colors.Black,
  },

  buttonWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  continueBtnText: {
    fontFamily: NotoSans_Bold,
    fontSize: FONTSIZE(2.2),
    color: colors.ButtonNameColor,
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.AuroraGreen,
    color: colors.Black,
    width: WIDTH(93),
    height: HEIGHT(8),
    borderRadius: 10,
    marginBottom: HEIGHT(1),
  },

  modalWrap: {
    padding: WIDTH(2),
    paddingTop: HEIGHT(3),
    alignItems: 'center',
    backgroundColor: 'white',
    width: WIDTH(92),
    height: HEIGHT(32),
    borderWidth: 1,
    borderColor: colors.Gray,
    borderRadius: 20,
  },

  buttonInModal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.AuroraGreen,
    color: colors.Black,
    width: WIDTH(65),
    height: HEIGHT(6),
    borderRadius: 9,
    marginTop: HEIGHT(2.5),
  },

  CalendarWrap: {
    width: WIDTH(95),
    borderRadius: 12,
    borderColor: 'gray',
    backgroundColor: colors.White,
    borderWidth: 1,
    borderColor: colors.Gray,
    borderRadius: 20,
  },

  Donebutton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.AuroraGreen,
    color: colors.Black,
    borderRadius: 9,
    width: WIDTH(87),
    height: HEIGHT(7),
  },

  donebtnText: {
    fontFamily: NotoSans_Bold,
    fontSize: FONTSIZE(2.2),
    color: colors.ButtonNameColor,
  },
});
