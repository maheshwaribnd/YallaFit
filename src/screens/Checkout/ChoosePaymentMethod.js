import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import {
  FONTSIZE,
  HEIGHT,
  NotoSans_Bold,
  NotoSans_Medium,
  WIDTH,
} from '../../config/AppConst';
import colors from '../../config/color.json';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import ApiManager from '../../API/Api';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';
import { showSelectedWeeks } from '../../Redux/Reducers/calenderDates';

const ChoosePaymentMethod = () => {
  const [checked, setChecked] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [name, setname] = useState('');
  const [cardNumber, setcardNumber] = useState('');
  const [expDate, setexpDate] = useState('');
  const [cvvNumber, setcvvNumber] = useState();
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const selectorInfoforMealPlan = useSelector(state => state.userMealPlan);
  const selectorforStartDate = useSelector(state => state.calenderDates);
  const selectorformealOption = useSelector(state => state.userMealsOption);
  const selectorforAmount = useSelector(state => state.userTotalAmount);

  const addOnsid = () => {
    let array = [];
    selectorforStartDate?.addOn?.map(e => {
      array.push(e.id);
    });
    return array;
  };

  const addOnsPrice = () => {
    let array = [];
    selectorforStartDate?.addOn?.map(e => {
      array.push(e.price);
    });

    return array;
  };

  const mealOptionid = () => {
    let array = [];
    selectorformealOption.mealoption?.map(e => {
      array.push(e.id);
    });

    return array
  };

  const checkoutAPI = async () => {
    let userId = await AsyncStorage.getItem('userid');
    let userIdd = JSON.parse(userId);
    const params = {
      userId: userIdd,
      packageId: selectorInfoforMealPlan?.indivualMealId,
      packagePrice: selectorInfoforMealPlan?.indivualMealPrice,
      orderStartDate: selectorforStartDate?.startDate,
      orderEndDate: selectorforStartDate?.endDate,
      orderDuration: selectorInfoforMealPlan?.howmanyWeeks,
      orderNoOfDays: selectorInfoforMealPlan?.noOfDays,
      orderAmount: selectorforAmount?.totalAmount,
      deliveryFrom: selectorforAmount?.forDelivery,
      deliverType: selectorforAmount?.saveAs,
      orderAddons: addOnsid(),
      orderAddonsPrice: addOnsPrice(),
      orderAddonsDates: selectorforStartDate?.datesforAddon,
      orderDates: selectorforStartDate?.date,
      orderMeals: mealOptionid(),
      orderPayments: paymentMethod,
    };

    ApiManager.checkout(params)
      .then(res => {
        if (res?.data?.status == 200) {
          console.log('Payment Successfull', res?.data?.response);
          dispatch(
            showSelectedWeeks({
              date: [],
              startDate: [],
              endDate: '',
              addOn: '',
              datesforAddon: [],
              multiplayprice: '',
            }),
          );
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const PaymentCheckout = () => {
    checkoutAPI();
    setShowModal(true);
  };

  const Done = () => {
    setShowModal(false);
    navigation.navigate('ThankYouScreen');
  };

  const CardPayment = () => {
    setChecked('Card');
    setPaymentMethod('Card');
  };

  const CODPayment = () => {
    setChecked('COD');
    setPaymentMethod('COD');
  };

  const WalletPayment = () => {
    setChecked('Wallet');
    setPaymentMethod('Wallet');
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
        <Text style={styles.paymentMethodText}>Choose Payment Method</Text>
      </View>

      <View style={{ padding: HEIGHT(2) }}>
        {/* debit card  */}
        {/* <View style={open ? styles.boxForHeight : styles.box}>
          <View style={styles.insideBox}>
            <View style={styles.radioView}>
              <View>
                <RadioButton
                  value="Card"
                  status={checked === 'Card' ? 'checked' : 'unchecked'}
                  onPress={() => CardPayment()}
                  color="#D6D6D6"
                />
              </View>
              <View>
                <Text style={styles.debitCardText}>Debit card</Text>
                <Text style={styles.bankNameText}>Bank Name</Text>
              </View>
            </View>

            <TouchableOpacity
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <FontAwesome
                onPress={() => setOpen(!open)}
                name={open ? 'chevron-circle-up' : 'chevron-circle-down'}
                size={21}
                style={styles.dropdown}
              />
            </TouchableOpacity>
          </View>
          {open ? (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <TextInput
                placeholder="Enter your name"
                style={styles.InputField}
                value={name}
                onChangeText={text => setname(text)}
              />
              <TextInput
                placeholder="Enter card number"
                style={styles.InputField}
                value={cardNumber}
                onChangeText={text => setcardNumber(text)}
              />
              <View style={styles.forCardText}>
                <TextInput
                  placeholder="Expiry date"
                  style={styles.smallInputField}
                  value={expDate}
                  onChangeText={text => setexpDate(text)}
                />
                <TextInput
                  placeholder="Enter CVV"
                  style={styles.smallInputField}
                  value={cvvNumber}
                  onChangeText={text => setcvvNumber(text)}
                />
              </View>
            </View>
          ) : null}
        </View> */}

        {/* COD  */}
        <View style={styles.box2}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton
              value="COD"
              status={checked === 'COD' ? 'checked' : 'unchecked'}
              onPress={() => CODPayment()}
              color="#D6D6D6"
            />

            <View>
              <Text style={styles.forCODText}>Cash on delivery</Text>
            </View>
          </View>
        </View>

        {/* wallet  */}
        {/* <View style={styles.box}>
          <View style={{flexDirection: 'row', marginTop: HEIGHT(1)}}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <RadioButton
                value="Wallet"
                status={checked === 'Wallet' ? 'checked' : 'unchecked'}
                onPress={() => WalletPayment()}
                color="#D6D6D6"
              />
            </View>
            <View>
              <Text style={styles.walletText}>Wallet</Text>
              <Text style={styles.insufficientText}>
                No sufficient balance in the wallet
              </Text>
            </View>
          </View>
        </View> */}
      </View>

      <View style={styles.bottom}>
        <Text style={styles.checkoutPrice}>
          Price: {selectorforAmount?.totalAmount.toFixed(2)} OMR
        </Text>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            style={paymentMethod ? styles.button : styles.btnDisable}
            disabled={paymentMethod ? false : true}
            onPress={() => PaymentCheckout()}>
            <Text style={styles.checkoutTextBtn}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        isVisible={showModal}
        // onBackdropPress={() => setShowModal(false)}
        style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.modalWrap}>
          <Image
            source={require('../../Images/Gif/ordersucess.gif')}
            style={styles.gifImage}
          />
          <Text style={styles.modalHeading}>Order Successfully Done</Text>
          <TouchableOpacity style={styles.Donebutton} onPress={() => Done()}>
            <Text style={styles.donebtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ChoosePaymentMethod;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  insideBox: {
    marginTop: HEIGHT(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  radioView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  paymentMethodText: {
    marginTop: -2,
    marginLeft: 14,
    fontSize: FONTSIZE(2.4),
    fontFamily: NotoSans_Medium,
    color: colors.Black,
  },

  box: {
    height: HEIGHT(10),
    padding: WIDTH(2),
    marginBottom: HEIGHT(2),
    backgroundColor: colors.White,
    borderRadius: 9,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  boxForHeight: {
    height: HEIGHT(39),
    padding: WIDTH(2),
    marginBottom: HEIGHT(2),

    backgroundColor: colors.White,
    borderRadius: 9,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  box2: {
    height: HEIGHT(10),
    padding: WIDTH(2),
    marginBottom: HEIGHT(2),
    justifyContent: 'center',
    backgroundColor: colors.White,
    borderRadius: 9,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  dropdown: {
    height: HEIGHT(3.5),
    width: WIDTH(6),
  },

  InputField: {
    justifyContent: 'center',
    height: HEIGHT(7.5),
    width: WIDTH(85),
    marginTop: HEIGHT(2),
    borderRadius: 7,
    borderWidth: 1,
    paddingLeft: 12,
    borderColor: colors.Gray,
    color: colors.Gray,
    fontSize: FONTSIZE(2.2),
  },

  smallInputField: {
    height: HEIGHT(7.5),
    width: WIDTH(41),
    marginTop: HEIGHT(2),
    borderRadius: 7,
    borderWidth: 1,
    paddingLeft: 12,
    borderColor: colors.Gray,
    fontSize: FONTSIZE(2.2),
  },

  debitCardText: {
    color: colors.Black,
    fontFamily: NotoSans_Medium,
    fontSize: FONTSIZE(2),
    marginLeft: WIDTH(3),
  },

  bankNameText: {
    color: colors.Gray,
    marginLeft: WIDTH(3),
  },

  forCardText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },

  forCODText: {
    color: colors.Black,
    fontFamily: NotoSans_Medium,
    fontSize: FONTSIZE(2),
    marginLeft: WIDTH(3),
  },

  checkoutPrice: {
    fontFamily: NotoSans_Bold,
    color: colors.Black,
    fontSize: FONTSIZE(2.1),
  },

  checkoutTextBtn: {
    fontFamily: NotoSans_Bold,
    fontSize: FONTSIZE(2),
    color: colors.Black,
    textAlign: 'center',
  },

  walletText: {
    color: colors.Black,
    fontFamily: NotoSans_Medium,
    fontSize: FONTSIZE(2),
    marginLeft: WIDTH(3),
  },

  insufficientText: {
    color: colors.Gray,
    marginLeft: WIDTH(3),
  },

  bottom: {
    position: 'absolute',
    bottom: 0,
    width: WIDTH(100),
    height: HEIGHT(10),
    paddingTop: HEIGHT(1),
    paddingRight: WIDTH(4),
    paddingLeft: WIDTH(4),
    paddingBottom: HEIGHT(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.White,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  button: {
    width: WIDTH(45),
    height: HEIGHT(6),
    paddingBottom: HEIGHT(0.8),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#FFD43D',
  },

  btnDisable: {
    width: WIDTH(45),
    height: HEIGHT(6),
    paddingBottom: HEIGHT(0.8),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: colors.Gray,
  },

  modalWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: WIDTH(5),
    // paddingVertical: HEIGHT(3),
    alignItems: 'center',
    backgroundColor: 'white',
    width: WIDTH(80),
    height: HEIGHT(32),
    gap: WIDTH(2),
    borderWidth: 1,
    borderColor: colors.Gray,
    borderRadius: 20,
  },

  gifImage: {
    height: HEIGHT(14),
    width: WIDTH(25),
    // marginBottom: HEIGHT(1),
    resizeMode: 'cover', // Adjust the image size to the container
  },

  modalHeading: {
    width: WIDTH(80),
    textAlign: 'center',
    fontFamily: NotoSans_Medium,
    fontSize: FONTSIZE(2),
    color: colors.Black,
  },

  Donebutton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD43D',
    color: colors.Black,
    borderRadius: 9,
    width: WIDTH(40),
    height: HEIGHT(6),
    marginTop: HEIGHT(0.5),
  },

  donebtnText: {
    fontFamily: NotoSans_Bold,
    fontSize: FONTSIZE(2),
    color: colors.ButtonNameColor,
  },
});
