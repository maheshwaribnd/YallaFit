import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  FONTSIZE,
  HEIGHT,
  NotoSans_Bold,
  NotoSans_Medium,
  WIDTH,
} from '../../config/AppConst';
import colors from '../../config/color.json';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { Dropdown } from 'react-native-element-dropdown';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import ApiManager from '../../API/Api';
import { useDispatch, useSelector } from 'react-redux';
import { mealPlanDetails } from '../../Redux/Reducers/usermealPlan';
import { ActivityIndicator } from 'react-native-paper';
import CustomBtn from '../../components/CustomBtn';
import Snackbar from 'react-native-snackbar';

const MyPlans = () => {
  const Plans = [
    { label: '3 days', value: '3', type: 'days' },
    { label: '4 days', value: '4', type: 'days' },
    { label: '5 days', value: '5', type: 'days' },
    { label: '6 days', value: '6', type: 'days' },
    { label: '2 weeks', value: '14', type: 'days' },
    { label: '3 weeks', value: '21', type: 'days' },
    { label: '4 weeks', value: '28', type: 'days' },
    { label: '8 weeks', value: '56', type: 'days' },
    { label: 'demo for one day', value: '1', type: 'days' },
  ];

  const [selectedValue, setSelectedValue] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('');
  const [mealPlaneData, setMealPlanData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [label, setLabel] = useState();

  const [mealPrice, setMealPrice] = useState([]);
  const [mealId, setMealId] = useState([]);

  const bottomSheetRef = useRef();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const selectorInfo = useSelector(state => state.userInfo);

  useEffect(() => {
    mealPlanAPI(selectorInfo.data.categoryId);
  }, []);

  const mealPlanAPI = id => {
    setLoader(true);
    ApiManager.myPlanPackage(id)
      .then(res => {
        if (res.data?.status == 200) {
          setLoader(false);
          const response = res?.data?.respone;
          setMealPlanData(response);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const goBackFunction = () => {
    bottomSheetRef.current.close();
    navigation.goBack();
  };

  const handleDropdownChange = itemValue => {
    setLabel(itemValue.label);
    setType(itemValue.type);
    setSelectedValue(itemValue.value);
    setOpen(true);
  };

  const ContinueButton = item => {
    bottomSheetRef.current.close();
    navigation.navigate('ChooseDateCalender', {
      selectedOption: selectedValue,
      type: type,
    });

    dispatch(
      mealPlanDetails({
        data: item,
        planNames: selectedImages,
        mealPlanPrice: finalPrice().toFixed(2),
        howmanyWeeks: label,
        noOfDays: finalDays(),
        indivualMealPrice: mealPrice,
        indivualMealId: mealId,
        // deliveryTimes: item?.mealPerDay,
      }),
    );

    setSelectedValue('');
    setSelectedImages('');
  };

  const DoneBtn = () => {
    if (open && selectedImages.length !== 0) {
      bottomSheetRef.current.open();
    }
    else {
      Snackbar.show({
        text: 'Please select atleast meal package',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
    // (open && selectedImages) ? bottomSheetRef.current.open() : null;
    // disabled={selectedImages ? false : true}

    const total = selectedImages.reduce(
      (sum, item) => sum + item.packagePrice,
      0,
    );
    setTotalPrice(total);
  };

  const finalPrice = () => {
    var finalPrice;
    switch (selectedValue) {
      case '14':
        finalPrice = totalPrice * 12;
        return finalPrice;
      case '21':
        finalPrice = totalPrice * 18;
        return finalPrice;
      case '28':
        finalPrice = totalPrice * 24;
        return finalPrice;
      case '56':
        finalPrice = totalPrice * 48;
        return finalPrice;
      default:
        finalPrice = totalPrice * selectedValue;
        return finalPrice;
    }
  };

  const finalDays = () => {
    var finalDays;
    switch (selectedValue) {
      case '14':
        finalDays = 12;
        return finalDays;
      case '21':
        finalDays = 18;
        return finalDays;
      case '28':
        finalDays = 24;
        return finalDays;
      case '56':
        finalDays = 48;
        return finalDays;
      default:
        finalDays = selectedValue;
        return finalDays;
    }
  };

  const ShowPlanNames = ({ item }) => {
    return (
      <View>
        <Text style={styles.bottomshitText}>{item.package_name}</Text>
      </View>
    );
  };

  const ShowImages = ({ item }) => {
    const isSelected = selectedImages.includes(item);

    const imageSelection = item => {
      if (selectedImages.includes(item)) {
        setSelectedImages(selectedImages.filter(i => i !== item));

      } else {
        setSelectedImages([...selectedImages, item]);
      }

      setMealPrice(prevItem => [...prevItem, item?.packagePrice]);
      setMealId(prevItem => [...prevItem, item?.id]);
    };

    return (
      <View style={{ margin: WIDTH(2) }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => imageSelection(item)}
          style={{ flex: 1, alignItems: 'center' }}>
          <Image
            source={require('../../Images/Plans/backgroundImg.png')}
            style={isSelected ? styles.imageBoxF : styles.imageBox}
          />
          <View style={styles.box}>
            <Text style={styles.planName}>{item.package_name}</Text>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={{ uri: item.package_image }}
                style={styles.lunchBoxImg}
                resizeMode="contain"
              />
            </View>
            <View style={styles.forPriceView}>
              <Text style={styles.priceText}>{item.packagePrice}OMR</Text>
              <Text style={styles.forMonthText}>/day</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
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
        <Text style={styles.headerText}>My Plans</Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: WIDTH(2) }}>
        <Text style={styles.selectMealplanText}>
          Select your meal plan duration
        </Text>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Dropdown
            style={styles.select}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={Plans}
            itemTextStyle={{ color: colors.Black }}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={selectedValue}
            onChange={itemValue =>
              handleDropdownChange({
                label: itemValue.label,
                type: itemValue.type,
                value: itemValue.value,
              })
            }
          />
        </View>

        <Text style={styles.selectMealpackageText}>Select meal package</Text>

        {loader ? (
          <ActivityIndicator
            size={45}
            color={colors.Black}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          />
        ) : (
          <View style={styles.forFlatlist}>
            <FlatList
              data={mealPlaneData}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => <ShowImages item={item} />}
            />
          </View>
        )}

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: HEIGHT(3),
          }}>
          <CustomBtn name="Done" onPress={() => DoneBtn()} />
        </View>

        <RBSheet
          ref={bottomSheetRef}
          closeOnDragDown={true}
          closeOnPressMask={true}
          animationType="fade"
          animationInTiming={400}
          height={340}
          customStyles={{
            container: {
              borderTopRightRadius: 36,
              borderTopLeftRadius: 36,
            },
          }}>
          <View style={styles.modalWrap}>
            <View>
              <Image
                source={require('../../Images/Plans/backgroundClickImg.png')}
                resizeMode="cover"
                style={styles.image}
              />
              <View style={styles.bottomshitView}>
                <View>
                  <FlatList
                    data={selectedImages}
                    renderItem={({ item }) => <ShowPlanNames item={item} />}
                  />
                </View>
                <Image
                  source={require('../../Images/Plans/Image2.png')}
                  style={styles.bottomshitImg}
                  resizeMode="contain"
                />
              </View>
            </View>
            <View style={styles.bottomshitlastView}>
              <View>
                <Text style={styles.bottomshitPrice}>
                  Price: --------------------- {finalPrice().toFixed(2)} OMR
                  Only
                </Text>
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={item => ContinueButton(item)}>
                  <Text style={styles.continueText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </RBSheet>
      </View>
    </View>
  );
};

export default MyPlans;

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

  select: {
    width: WIDTH(90),
    height: HEIGHT(7),
    borderWidth: 1,
    borderRadius: 12,
    paddingRight: WIDTH(2),
    paddingLeft: WIDTH(3),
    marginTop: HEIGHT(1),
    color: colors.Black,
  },

  selectMealplanText: {
    fontSize: FONTSIZE(2),
    fontFamily: NotoSans_Bold,
    color: colors.Black,
    paddingTop: HEIGHT(1),
    paddingLeft: WIDTH(3),
  },

  selectMealpackageText: {
    fontSize: FONTSIZE(2),
    fontFamily: NotoSans_Bold,
    color: colors.Black,
    paddingLeft: WIDTH(3),
    marginTop: HEIGHT(1),
  },

  forFlatlist: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageBox: {
    alignItems: 'center',
    width: WIDTH(40),
    height: HEIGHT(28),
    borderRadius: 12,
  },
  imageBoxF: {
    alignItems: 'center',
    width: WIDTH(40),
    height: HEIGHT(28),
    borderRadius: 12,
    borderWidth: WIDTH(1),
    borderColor: colors.AuroraGreen,
  },

  box: {
    flex: 1,
    width: WIDTH(46),
    height: HEIGHT(27),
    position: 'absolute',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  planName: {
    width: WIDTH(35),
    marginLeft: WIDTH(2),
    marginTop: HEIGHT(1),
    fontSize: FONTSIZE(2),
    textAlign: 'center',
    color: colors.White,
    fontFamily: NotoSans_Medium,
  },

  lunchBoxImg: {
    height: HEIGHT(10),
    width: WIDTH(21),
    marginTop: HEIGHT(2),
  },

  forPriceView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  priceText: {
    color: colors.AuroraGreen,
    fontFamily: NotoSans_Bold,
    fontSize: FONTSIZE(2.5),
    marginLeft: WIDTH(3),
  },

  forMonthText: {
    color: '#BBBBBB',
    textAlign: 'center',
    fontSize: FONTSIZE(2),
    // fontFamily: NotoSans_Medium,
    paddingTop: HEIGHT(0.5),
    marginRight: WIDTH(3),
  },

  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    color: colors.Black,
  },

  icon: {
    marginRight: 5,
  },

  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    paddingHorizontal: 8,
    fontSize: 14,
    color: colors.Black,
  },

  placeholderStyle: {
    fontSize: 16,
  },

  selectedTextStyle: {
    fontSize: 16,
    color: colors.Black,
  },

  iconStyle: {
    width: 20,
    height: 20,
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: colors.Black,
  },

  image: {
    height: HEIGHT(40),
    width: WIDTH(100),
  },

  modalWrap: {
    backgroundColor: colors.White,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  bottomshitView: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 2,
    width: WIDTH(96),
    padding: WIDTH(4),
    marginVertical: WIDTH(3),
    marginRight: HEIGHT(2),
  },

  bottomshitText: {
    width: WIDTH(62),
    color: colors.White,
    fontSize: FONTSIZE(2.5),
    fontFamily: NotoSans_Bold,
    paddingLeft: WIDTH(5),
  },

  bottomshitImg: {
    height: HEIGHT(14),
    width: WIDTH(30),
    marginRight: WIDTH(3),
    marginBottom: HEIGHT(1),
  },

  bottomshitlastView: {
    paddingBottom: WIDTH(4),
    paddingLeft: WIDTH(5),
    paddingRight: WIDTH(5),
  },

  bottomshitPrice: {
    fontSize: FONTSIZE(2.4),
    fontFamily: NotoSans_Bold,
    color: colors.Black,
    marginBottom: HEIGHT(1),
  },

  continueText: {
    fontFamily: NotoSans_Bold,
    fontSize: FONTSIZE(2.3),
    color: colors.Black,
  },

  button: {
    backgroundColor: colors.AuroraGreen,
    color: colors.Black,
    width: WIDTH(92),
    height: HEIGHT(8),
    borderRadius: 10,
    marginTop: HEIGHT(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
