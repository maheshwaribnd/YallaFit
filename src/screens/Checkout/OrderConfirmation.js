import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import colors from '../../config/color.json';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {
  FONTSIZE,
  HEIGHT,
  NotoSans_Bold,
  NotoSans_Medium,
  NotoSans_SemiBold,
  WIDTH,
} from '../../config/AppConst';
import DashedLine from 'react-native-dashed-line';
import { Checkbox } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiManager from '../../API/Api';
import { TotalAmountDetails } from '../../Redux/Reducers/totalAmount';
import Modal from 'react-native-modal';
import { showSelectedWeeks } from '../../Redux/Reducers/calenderDates';
import { Calendar } from 'react-native-calendars';

const OrderConfirmation = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const selectorInfoforMealPlan = useSelector(state => state.userMealPlan);
  const selectorforStartDate = useSelector(state => state.calenderDates);
  const selectorInfo = useSelector(state => state.userInfo);

  const [userLocation, setUserLocation] = useState([]);
  const [checkedDelivery, setcheckedDelivery] = useState('');
  const [checkedSaveAs, setcheckedSaveAs] = useState('');
  const [restroChecked, setRestroChecked] = useState(false);

  const [addPrice, setAddPrice] = useState(0);
  const [deliveryCharges, setdeliveryCharges] = useState(0);
  const [addOns, setAddOns] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [calenderTypeModal, setcalenderTypeModal] = useState(false);
  const [addOnsCalendar, setaddOnsCalendar] = useState(false);

  const [allFridays, setallFridays] = useState('');
  const [addOnDatesarray, setaddOnDatesarray] = useState([]);
  const [planDates, setplanDates] = useState([]);
  const [addOnsDate, setaddOnsDate] = useState([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [userresponse, setUserResponse] = useState('');
  const [startDate, setstartDate] = useState('');
  const [endDate, setendDate] = useState('')
  let totalPrice = 0;
  let addonLength = selectorforStartDate.datesforAddon;
  const keysArray = Object.keys(addonLength);
  const dateArrayLength = keysArray.length;

  useFocusEffect(
    React.useCallback(() => {
      APIforLocation();
      deliveryChargeAPI();
      AddOnAPIFunction();
    }, []),
  );
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

  useEffect(() => {
    let planDates = selectorforStartDate.date;
    let addOnsDates = selectorforStartDate.datesforAddon;
    setaddOnDatesarray(selectorforStartDate?.datesforAddon);

    let markedDatesObject = [];
    let markedDatesObject2 = [];
    // plan dates
    planDates.forEach(date => {
      markedDatesObject[date] = {
        selected: true,
        selectedColor: '#BFFFF3',
      };
    });

    setplanDates(markedDatesObject);

    // add ons dated
    addOnsDates.forEach(date => {
      markedDatesObject2[date] = {
        selected: true,
        selectedColor: '#31917f',
      };
    });
    setaddOnsDate(markedDatesObject2);
  }, [addonLength]);

  const manageDates = day => {
    let planDates = selectorforStartDate.date;
    let addOnsDates = [...addOnDatesarray];
    let markedDatesObject = [];

    if (planDates.includes(day.dateString)) {
      if (addOnsDates.includes(day.dateString)) {
        addOnsDates = addOnsDates.filter(i => i !== day.dateString);
      } else {
        addOnsDates.push(day.dateString);
      }
      addOnsDates.sort();
      setaddOnDatesarray(addOnsDates);
      addOnsDates.forEach(date => {
        markedDatesObject[date] = {
          selected: true,
          selectedColor: '#31917f',
        };
      });
      setaddOnsDate(markedDatesObject);
    } else {
      console.log('not available');
    }
  };

  const APIforLocation = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const userIdd = JSON.parse(userId);
    await ApiManager.userDetails(userIdd)
      .then(res => {
        if (res?.data?.status == 200) {
          let response = res?.data?.respone;
          setUserLocation(response);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const deliveryChargeAPI = async () => {
    try {
      await ApiManager.deliveryCharges().then(res => {
        if (res?.data?.status == 200) {
          const deliveryResponse = res?.data?.respone[0];
          setdeliveryCharges(deliveryResponse?.deliveryCharges);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

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

  const DeliveryType = type => {
    if (type === 'home') {
      setcheckedDelivery('home');
      setRestroChecked(false);
    } else if (type === 'restaurant') {
      setcheckedDelivery('restaurant');
      setcheckedSaveAs('');
      setRestroChecked(true);
    }
  };

  const PickUpType = type => {
    if (type === 'office') {
      setcheckedSaveAs('office');
    } else if (type === 'Home') {
      setcheckedSaveAs('Home');
    }
  };

  const AddNewFunction = () => {
    navigation.navigate('LocationScreens', { data: 1 });
  };

  useEffect(() => {
    activeSubscriptionAPI();
  }, [])

  const activeSubscriptionAPI = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const userIdd = JSON.parse(userId)

    await ApiManager.activeSubscription(userIdd)
      .then(res => {
        if (res?.data?.status == 200) {
          const response = res?.data?.response;
          setUserResponse(response);
          let dates = response?.ordDate
          setstartDate(dates[0])
          setendDate(dates[dates.length - 1]);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const checkout = () => {
    if (userresponse !== '') {
      if (userresponse?.ordDate.includes(selectorforStartDate?.date[0])) {
        setShowStatusModal(true);
      } else {
        dispatch(
          TotalAmountDetails({
            totalAmount: findTotalAmount(),
            forDelivery: checkedDelivery,
            saveAs: checkedSaveAs,
          }),
        );
        navigation.navigate('ChoosePaymentMethod');
      }
    } else {
      dispatch(
        TotalAmountDetails({
          totalAmount: findTotalAmount(),
          forDelivery: checkedDelivery,
          saveAs: checkedSaveAs,
        }),
      );
      navigation.navigate('ChoosePaymentMethod');
    }
  };

  const findTotalAmount = () => {
    let Amount;
    let mealPrice = selectorInfoforMealPlan?.mealPlanPrice;
    let deliveryAmount = selectorInfoforMealPlan?.noOfDays * deliveryCharges;

    if (addOns.length > 0) {
      if (checkedDelivery === 'home') {
        Amount =
          parseFloat(mealPrice) +
          parseFloat(addPrice) +
          parseFloat(deliveryAmount);
      } else {
        Amount = parseFloat(mealPrice) + parseFloat(addPrice);
      }
    } else {
      if (checkedDelivery === 'home') {
        Amount = parseFloat(mealPrice) + parseFloat(deliveryAmount);
      } else {
        Amount = parseFloat(mealPrice);
      }
    }

    return Amount;
  };

  const ShowIndivualAddon = ({ item }) => {
    totalPrice = totalPrice + parseFloat(item?.price);
    setAddPrice(totalPrice * dateArrayLength);

    return (
      <View style={styles.bilingAddon}>
        <Text style={styles.billingText}>
          {item?.title} (add on) x {addOnDatesarray.length}{' '}
        </Text>
        <Text style={{ color: colors.Black, fontFamily: NotoSans_Medium }}>
          {(item?.price * dateArrayLength).toFixed(2)} OMR
        </Text>
      </View>
    );
  };

  const ShowAddOns = ({ item }) => {
    return (
      <View style={styles.addOnBox}>
        <View style={{ flexDirection: 'row' }}>
          <View>
            <Image source={{ uri: item.image }} style={styles.imgforAddon} />
          </View>
          <View>
            <Text style={styles.foraddOnTitle}>{item.title}</Text>
            <Text style={styles.foraddOnPrice}>{item.price} OMR</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => RemoveAddOnsFromRedux(item)}
          activeOpacity={0.6}
          style={styles.addRemoveButton}>
          <Text style={styles.addonaddremovebtnText}>Remove</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const RemoveAddOnsFromRedux = item => {
    let addOns = selectorforStartDate?.addOn;
    const filteredData = addOns.filter(e => e.id !== item.id);

    dispatch(
      showSelectedWeeks({
        date: selectorforStartDate?.date,
        startDate: selectorforStartDate?.startDate,
        addOn: filteredData,
        datesforAddon: selectorforStartDate.datesforAddon,
      }),
    );
  };

  const ShowAddOnsForModal = ({ item }) => {
    return (
      <View style={styles.addOnBox}>
        <View style={{ flexDirection: 'row' }}>
          <View>
            <Image source={{ uri: item.image }} style={styles.imgforAddon} />
          </View>
          <View>
            <Text style={styles.foraddOnTitle}>{item.title}</Text>
            <Text style={styles.foraddOnPrice}>{item.price} OMR</Text>
          </View>
        </View>

        {selectorforStartDate?.addOn.some(e => e.id === item.id) ? (
          <TouchableOpacity style={styles.addRemoveButton}>
            <Text style={styles.addonaddremovebtnText}>Added</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => AddNewInAddOns(item)}
            style={styles.addRemoveButton}>
            <Text style={styles.addonaddremovebtnText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const AddNewInAddOns = item => {
    let addOnsList = [...selectorforStartDate?.addOn];
    addOnsList.push(item);
    dispatch(
      showSelectedWeeks({
        date: selectorforStartDate?.date,
        startDate: selectorforStartDate?.startDate,
        addOn: addOnsList,
        datesforAddon: selectorforStartDate.datesforAddon,
      }),
    );
  };

  const saveDataInRedux = () => {
    dispatch(
      showSelectedWeeks({
        date: selectorforStartDate.date,
        startDate: '',
        addOn: selectorforStartDate?.addOn,
        datesforAddon: addOnDatesarray,
      }),
    );
    setaddOnsCalendar(false);
  };

  const addForAllDaysFunction = () => {
    dispatch(
      showSelectedWeeks({
        date: selectorforStartDate.date,
        startDate: '',
        addOn: selectorforStartDate?.addOn,
        datesforAddon: selectorforStartDate.date,
      }),
    );
    setaddOnsCalendar(true);
    setcalenderTypeModal(false);
  };

  const chooseSpecificDaysFunction = () => {
    if (selectorforStartDate.date.length == addOnDatesarray.length) {
      dispatch(
        showSelectedWeeks({
          date: selectorforStartDate.date,
          startDate: '',
          addOn: selectorforStartDate?.addOn,
          datesforAddon: [],
        }),
      );
      setaddOnsCalendar(true);
      setcalenderTypeModal(false);
    }
    setaddOnsCalendar(true);
    setcalenderTypeModal(false);
  };

  const ShowPlanNames = ({ item }) => {
    return (
      <View>
        <Text style={styles.bottomshitText}>{item.package_name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.forgotHeadline}>
        <FontAwesome6
          name="arrow-left-long"
          color="black"
          onPress={() => navigation.goBack()}
          size={20}
        />
        <Text style={styles.headerText}>Order confirmation</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: HEIGHT(2), paddingTop: HEIGHT(1) }}>
        <Text style={styles.mealPlantext}>Meal Plan</Text>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={require('../../Images/Plans/backgroundImg.png')}
            style={styles.imageBox}
          />
          <View style={styles.mainView}>
            <View style={styles.viewforNamePrice}>
              <View style={{ marginTop: HEIGHT(3), marginHorizontal: WIDTH(2) }}>
                <FlatList
                  data={selectorInfoforMealPlan?.planNames}
                  renderItem={({ item }) => <ShowPlanNames item={item} />}
                />
              </View>
              <View style={styles.mealPriceView}>
                <Text style={styles.mealPrice}>
                  {selectorInfoforMealPlan?.mealPlanPrice} OMR
                </Text>
                <Text style={styles.forMonth}>
                  /{selectorInfoforMealPlan.howmanyWeeks}
                </Text>
              </View>
            </View>
            <View style={styles.imgView}>
              <Image
                source={require('../../Images/Plans/Image2.png')}
                style={styles.img}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        <Text style={styles.subheadline}>Meal plan duration</Text>
        <View style={styles.InputField}>
          <Text style={styles.inputText}>
            {selectorInfoforMealPlan?.howmanyWeeks}
          </Text>
        </View>
        <Text style={styles.subheadline}>Starting date</Text>
        <View style={styles.InputField}>
          <Text style={styles.inputText}>{selectorforStartDate?.date[0]}</Text>
        </View>

        <Text style={styles.subheadline}>Add on's</Text>
        <View>
          <FlatList
            data={selectorforStartDate?.addOn}
            renderItem={({ item }) => <ShowAddOns item={item} />}
            keyExtractor={item => item.id}
          />

          <DashedLine
            dashLength={7}
            dashColor="#CCCCCC"
            style={styles.forDashline}
          />
          <View style={styles.addItemView}>
            <Text style={styles.addMoreItemText}>Add more items</Text>

            <TouchableOpacity
              onPress={() => setModalVisible(!modalVisible)}
              style={styles.addRemoveButton}>
              <Text
                style={{ color: colors.Black, fontFamily: NotoSans_SemiBold }}>
                Add more
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.subheadline}>Choose delivery method</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <Checkbox
            status={checkedDelivery === 'restaurant' ? 'checked' : 'unchecked'}
            onPress={() => DeliveryType('restaurant')}
            color={colors.AuroraGreen}
            style={styles.checkbox}
          />
          <Text style={styles.forText}>Pick up from restaurant</Text>
        </View>
        <View style={styles.forCheckoutView}>
          <Checkbox
            status={checkedDelivery === 'home' ? 'checked' : 'unchecked'}
            onPress={() => DeliveryType('home')}
            color={colors.AuroraGreen}
            style={styles.checkbox}
          />
          <Text style={styles.forText}>Home delivery</Text>
        </View>
        <View style={styles.saveAddressView}>
          <Text style={styles.subheadline}>Saved address</Text>
          <TouchableOpacity
            onPress={() => AddNewFunction()}
            disabled={restroChecked ? true : false}>
            <Text
              style={[
                styles.subheadline,
                { color: restroChecked ? colors.Gray : '#4D8876' },
              ]}>
              Update address
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.locationView}>
          <Text style={restroChecked ? styles.clrchange : styles.inputText}>
            {userLocation[0]?.address}
          </Text>
        </View>
        <View style={styles.CheckoutMainView}>
          <View style={styles.forCheckoutView}>
            <Checkbox
              status={checkedSaveAs === 'office' ? 'checked' : 'unchecked'}
              onPress={() => PickUpType('office')}
              disabled={restroChecked ? true : false}
              color={colors.AuroraGreen}
              style={styles.checkbox}
            />
            <Text style={styles.forText}>Save as office</Text>
          </View>
          <View style={styles.forCheckoutView}>
            <Checkbox
              status={checkedSaveAs === 'Home' ? 'checked' : 'unchecked'}
              onPress={() => PickUpType('Home')}
              disabled={restroChecked ? true : false}
              color={colors.AuroraGreen}
              style={styles.checkbox}
            />
            <Text style={styles.forText}>Save as home</Text>
          </View>
        </View>

        <Text style={[styles.subheadline, { marginBottom: HEIGHT(1) }]}>
          Billing information
        </Text>

        <View style={styles.bilingView}>
          <Text
            style={{
              fontFamily: NotoSans_Bold,
              fontSize: FONTSIZE(1.7),
              color: colors.Black,
            }}>
            Total includes subscription + delivery charges
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.billingText}>
              {selectorInfoforMealPlan?.data?.package_name} Plan (
              {selectorInfo?.data?.dietSuits}){' '}
              {selectorInfoforMealPlan?.howmanyWeeks}
            </Text>
            <Text style={{ color: colors.Black, fontFamily: NotoSans_Medium }}>
              {selectorInfoforMealPlan?.mealPlanPrice} OMR
            </Text>
          </View>

          <FlatList
            data={selectorforStartDate?.addOn}
            renderItem={({ item }) => <ShowIndivualAddon item={item} />}
          />

          {checkedDelivery === 'home' ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.billingText}>Delivery charges</Text>
              <View
                style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                <Text
                  style={{ color: colors.Black, fontFamily: NotoSans_Medium }}>
                  {(selectorInfoforMealPlan.noOfDays * deliveryCharges).toFixed(
                    2,
                  )}{' '}
                  OMR
                </Text>
                <Text style={styles.deliveryText}>
                  (Delivery Charges for {selectorInfoforMealPlan?.noOfDays}{' '}
                  days)
                </Text>
              </View>
            </View>
          ) : null}

          <DashedLine
            dashLength={7}
            dashColor="#CCCCCC"
            style={{ marginTop: HEIGHT(1), marginBottom: HEIGHT(1) }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.billingText}>Amount to pay</Text>
            <Text style={{ color: colors.Black, fontFamily: NotoSans_Bold }}>
              {findTotalAmount().toFixed(2)} OMR
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          style={
            checkedDelivery == 'restaurant'
              ? styles.button
              : checkedSaveAs && checkedDelivery
                ? styles.button
                : styles.btndisable
          }
          activeOpacity={0.6}
          onPress={() =>
            checkedDelivery == 'restaurant'
              ? checkout()
              : checkedSaveAs
                ? checkout()
                : null
          }
          disabled={
            checkedDelivery == 'restaurant'
              ? false
              : checkedSaveAs && checkedDelivery
                ? false
                : true
          }>
          <Text style={styles.checkoutBtnText}>Checkout</Text>
        </TouchableOpacity>
      </View>

      {/* add more Modal  */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(modalVisible)}
        style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text
              style={{
                fontFamily: NotoSans_Bold,
                color: 'black',
                fontSize: FONTSIZE(2.2),
              }}>
              Add On's
            </Text>
            <FlatList
              data={addOns}
              renderItem={({ item }) => <ShowAddOnsForModal item={item} />}
              keyExtractor={item => item.id}
            />
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                selectorforStartDate?.addOn == ''
                  ? (setModalVisible(false), setcalenderTypeModal(false))
                  : (setModalVisible(false), setcalenderTypeModal(true));
              }}
              style={styles.donebtn}>
              <Text style={styles.donebtntext}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={calenderTypeModal}
        style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text
              style={{
                width: WIDTH(80),
                textAlign: 'center',
                fontFamily: NotoSans_Medium,
                fontSize: FONTSIZE(2),
                color: colors.Black,
              }}>
              1. Select for how many day's you want the add on for
            </Text>
            <TouchableOpacity
              style={styles.allDayButton}
              onPress={() => addForAllDaysFunction()}>
              <Text style={styles.allDayText}>Add for all days</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.allDayButton}
              onPress={() => chooseSpecificDaysFunction()}>
              <Text style={styles.allDayText}>Choose specific days</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* add on's calendar */}
      <Modal
        isVisible={addOnsCalendar}
        onBackdropPress={() => setaddOnsCalendar(!addOnsCalendar)}
        style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.centeredView}>
          <View style={styles.calenderView}>
            <Text
              style={{
                color: colors.Black,
                fontFamily: NotoSans_Bold,
                marginHorizontal: 10,
                marginVertical: 5,
              }}>
              Select dates for add On's
            </Text>

            <View style={styles.colorIndicateView}>
              <View style={styles.colorBox1} />
              <Text style={{ color: colors.Black, fontFamily: NotoSans_Medium }}>
                Plan dates
              </Text>
            </View>
            <View style={styles.colorIndicateView}>
              <View style={styles.colorBox2} />
              <Text style={{ color: colors.Black, fontFamily: NotoSans_Medium }}>
                Add on's Specific dates
              </Text>
            </View>

            <Calendar
              style={{ borderRadius: 12 }}
              onDayPress={day => manageDates(day)}
              markedDates={{ ...allFridays, ...planDates, ...addOnsDate }}
              markingType="dot"
              hideExtraDays={true}
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                selectedDayBackgroundColor: 'orange',
                selectedDayTextColor: '#000000',
                todayTextColor: '#000000',
                todayBackgroundColor: '#78D4C3',
                dotColor: 'orange',
                textDisabledColor: '#000000',
              }}
            />
            <TouchableOpacity
              onPress={() => saveDataInRedux()}
              activeOpacity={0.6}
              style={styles.calenderDonebtn}>
              <Text style={styles.donebtntext}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={showStatusModal}
        onBackdropPress={() => setShowStatusModal(false)}
        style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.subStatusmodal}>
          <Text
            style={{
              color: colors.Black,
              fontFamily: NotoSans_Bold,
              fontSize: FONTSIZE(2.1),
              textAlign: 'center',
              marginHorizontal: 17,
              marginVertical: 15,
            }}>
            Please choose different dates for Subscription because you already
            have an Active Subscription from {startDate} to {endDate}
          </Text>

          <View style={{ flexDirection: 'row', gap: 6, marginTop: HEIGHT(1) }}>
            <TouchableOpacity
              onPress={() => setShowStatusModal(false)}
              style={styles.buttonInModal}>
              <Text
                style={{
                  color: colors.Black,
                  fontFamily: NotoSans_Medium,
                  fontSize: FONTSIZE(2),
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('MyPlans')}
              style={styles.buttonInModal}>
              <Text
                style={{
                  color: colors.Black,
                  fontFamily: NotoSans_Medium,
                  fontSize: FONTSIZE(2),
                  textAlign: 'center'
                }}>
                Choose different dates
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default OrderConfirmation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.White,
  },

  forgotHeadline: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: WIDTH(4),
    borderColor: colors.Gray,
    borderWidth: 0.2,
    shadowOffset: { width: 1, height: 1.5 },
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

  bilingAddon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  orderConfirmText: {
    fontSize: 16,
    fontFamily: NotoSans_Medium,
    color: colors.Black,
    paddingLeft: WIDTH(2),
  },

  mealPlantext: {
    color: colors.Black,
    fontFamily: NotoSans_Bold,
    fontSize: FONTSIZE(2),
  },

  bottomshitText: {
    color: colors.White,
    fontSize: FONTSIZE(1.9),
    fontFamily: NotoSans_Bold,
  },

  mainView: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: WIDTH(2),
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
    fontSize: FONTSIZE(2.2),
  },

  forMonth: {
    color: '#BBBBBB',
    textAlign: 'center',
    fontSize: FONTSIZE(2),
    paddingTop: HEIGHT(0.5),
    marginRight: WIDTH(4),
  },

  imgView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: WIDTH(2),
  },

  img: {
    height: HEIGHT(5.4),
    width: WIDTH(21),
    borderRadius: 6,
  },

  imageBox: {
    width: WIDTH(92),
    height: HEIGHT(21),
    padding: WIDTH(1),
    borderRadius: 16,
    margin: WIDTH(2),
  },

  viewforNamePrice: {
    justifyContent: 'space-between',
    height: HEIGHT(21),
  },

  planName: {
    width: WIDTH(35),
    marginLeft: WIDTH(2),
    fontSize: FONTSIZE(2.2),
    color: colors.White,
    fontFamily: NotoSans_Bold,
  },

  subheadline: {
    fontSize: FONTSIZE(2),
    color: colors.Black,
    fontFamily: NotoSans_Bold,
  },

  forDashline: {
    marginTop: HEIGHT(1.5),
    marginBottom: HEIGHT(1.5),
  },

  addItemView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: WIDTH(91),
    marginBottom: HEIGHT(1),
  },

  addMoreItemText: {
    fontSize: 14,
    fontFamily: NotoSans_Medium,
    color: colors.Black,
  },

  InputField: {
    justifyContent: 'center',
    height: HEIGHT(6),
    borderRadius: 10,
    borderWidth: 1,
    paddingLeft: 12,
    color: colors.Black,
    borderColor: colors.Gray,
    marginTop: HEIGHT(1),
    marginBottom: HEIGHT(1),
  },

  inputText: {
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.Black,
    fontSize: FONTSIZE(1.9),
    fontFamily: NotoSans_Medium,
  },

  clrchange: {
    justifyContent: 'center',
    alignItems: 'center',
    color: colors.Gray,
    fontSize: FONTSIZE(1.9),
    fontFamily: NotoSans_Medium,
  },

  addOnBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    elevation: 5,
    backgroundColor: colors.White,
    borderColor: colors.LightGray,
    padding: WIDTH(2),
    borderRadius: 6,
    // marginHorizontal: HEIGHT(1),
    marginVertical: HEIGHT(0.8),
  },

  imgforAddon: {
    height: HEIGHT(12),
    width: WIDTH(23),
    borderRadius: 9,
  },

  foraddOnTitle: {
    fontSize: FONTSIZE(2),
    fontFamily: NotoSans_Medium,
    textAlign: 'center',
    color: colors.Black,
    paddingLeft: WIDTH(2),
  },

  foraddOnPrice: {
    fontSize: 14,
    fontFamily: NotoSans_SemiBold,
    color: colors.Gray9,
    paddingLeft: WIDTH(2),
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

  colorIndicateView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: WIDTH(4),
    gap: 12,
  },

  colorBox1: {
    width: 28,
    height: 14,
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#BFFFF3',
    backgroundColor: '#BFFFF3',
  },

  colorBox2: {
    width: 28,
    height: 14,
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#31917f',
    backgroundColor: '#31917f',
  },

  saveAddressView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  CheckoutMainView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 21,
    marginTop: HEIGHT(1),
  },

  forCheckoutView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  checkbox: {
    borderColor: colors.Gray9,
  },

  forText: {
    color: colors.Black,
  },

  locationView: {
    height: HEIGHT(9),
    borderRadius: 5,
    borderWidth: 1,
    paddingLeft: 12,
    borderColor: colors.Gray,
    marginTop: HEIGHT(2),
  },

  billingText: {
    width: WIDTH(60),
    marginBottom: HEIGHT(1),
    color: colors.Black,
    fontFamily: NotoSans_Medium,
  },

  bilingView: {
    marginBottom: HEIGHT(4),
    borderWidth: 1,
    borderRadius: 9,
    padding: WIDTH(2),
    borderColor: colors.Gray,
    borderWidth: 0.5,
    elevation: 5,
    backgroundColor: colors.White,
    borderColor: colors.LightGray,
  },

  checkoutBtnText: {
    fontFamily: NotoSans_Bold,
    fontSize: FONTSIZE(2),
    color: colors.Black,
  },

  button: {
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: WIDTH(92),
    height: HEIGHT(7),
    marginTop: HEIGHT(2),
    marginBottom: HEIGHT(2),
    borderRadius: 10,
    backgroundColor: colors.AuroraGreen,
  },

  btndisable: {
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: WIDTH(92),
    height: HEIGHT(7),
    marginTop: HEIGHT(2),
    marginBottom: HEIGHT(2),
    borderRadius: 10,
    backgroundColor: colors.Gray,
  },

  deliveryText: {
    width: WIDTH(24),
    color: colors.Black,
    fontFamily: NotoSans_Bold,
    fontSize: FONTSIZE(1.3),
    textAlign: 'center',
  },

  // modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalView: {
    width: WIDTH(95),
    marginVertical: HEIGHT(10),
    backgroundColor: colors.White,
    borderRadius: 10,
    padding: 10,
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

  donebtn: {
    width: WIDTH(80),
    height: HEIGHT(6),
    backgroundColor: colors.AuroraGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },

  donebtntext: {
    fontSize: 16,
    fontFamily: NotoSans_Bold,
    color: colors.Black,
  },

  calenderView: {
    width: WIDTH(95),
    borderRadius: 12,
    borderColor: 'gray',
    backgroundColor: colors.White,
    borderWidth: 1,
    borderColor: colors.Gray,
    borderRadius: 20,
  },

  calenderDonebtn: {
    width: WIDTH(88),
    height: HEIGHT(6),
    backgroundColor: colors.AuroraGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: 'center',
  },
  allDayButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.AuroraGreen,
    color: colors.Black,
    width: WIDTH(65),
    height: HEIGHT(6),
    borderRadius: 9,
    marginTop: HEIGHT(2.5),
  },
  allDayText: {
    fontFamily: NotoSans_Medium,
    fontSize: FONTSIZE(2),
    color: colors.Black,
  },

  subStatusmodal: {
    alignItems: 'center',
    width: WIDTH(90),
    backgroundColor: 'white',
    borderRadius: 21,
  },

  buttonInModal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.AuroraGreen,
    color: colors.Black,
    width: WIDTH(40),
    // height: HEIGHT(6.5),
    borderRadius: 9,
    marginVertical: HEIGHT(2),
  },
});
