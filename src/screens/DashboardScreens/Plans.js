import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  FONTSIZE,
  HEIGHT,
  NotoSans_Bold,
  NotoSans_Medium,
  WIDTH,
} from '../../config/AppConst';
import colors from '../../config/color.json';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import ApiManager from '../../API/Api';
import {useDispatch, useSelector} from 'react-redux';
import {mealOptionDetails} from '../../Redux/Reducers/mealsOption';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Colors from '../../config/color.json';
import {Dropdown} from 'react-native-element-dropdown';
import {ActivityIndicator} from 'react-native-paper';

const Plans = () => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [saveArray, setSaveArray] = useState('');
  const [category, setCategory] = useState([]);
  const [menus, setMenus] = useState([]);
  const [menuCount, setmenuCount] = useState(0);
  const [loader, setLoader] = useState(false);

  const bottomSheetRef = useRef();

  const navigation = useNavigation();
  const selectorInfo = useSelector(state => state.userInfo);
  const dispatch = useDispatch();

  const goBackFunction = () => {
    bottomSheetRef.current.close();
    navigation.goBack();
  };

  useEffect(() => {
    mealCategoryAPI();
    categoryMealsAPI(selectorInfo.data.categoryId);
  }, []);

  const mealCategoryAPI = async () => {
    try {
      await ApiManager.categoriesInMealOption().then(async res => {
        if (res?.status == 200) {
          const response = res?.data?.respone;
          let filtered = response.filter(
            e => e.id == selectorInfo?.data?.categoryId,
          );
          setValue(filtered[0]?.title);
          setCategory(response);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  categoryOnChangeFunction = item => {
    categoryMealsAPI(item.id);
    setLoader(true);
    setValue(item.title);
    setIsFocus(false);
  };

  const categoryMealsAPI = async id => {
    ApiManager.mealsByCategory(id)
      .then(res => {
        setLoader(true);
        if (res?.status == 200) {
          if (res?.data?.status) {
            setLoader(false);
            const response = res?.data?.respone;
            setMenus(response);
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const Continue = () => {
    bottomSheetRef.current.close();
    dispatch(mealOptionDetails({mealoption: menus}));
    navigation.navigate('OrderConfirmation');
  };

  const truncatedTitle = name => {
    if (name?.length <= 13) {
      return name;
    } else {
      return name?.substr(0, 10) + '...';
    }
  };

  const openSheet = item => {
    setSaveArray(item);
    bottomSheetRef.current.open();
  };

  RemoveThisMealFunction = ID => {
    if (menuCount < 2) {
      setmenuCount(menuCount + 1);
      const removemealm = menus.filter(itemm => itemm.id !== ID);
      setMenus(removemealm);
      bottomSheetRef.current.close();
    } else {
      ToastAndroid.show('cannot remove more than 2 meals!', ToastAndroid.SHORT);
    }
  };

  const ShowImages = ({item}) => {
    return (
      <View style={{marginHorizontal: WIDTH(1.5)}}>
        <TouchableOpacity onPress={() => openSheet(item)}>
          <Image source={{uri: item?.image}} style={styles.imageBox} />
          <Text style={styles.dishName}>{truncatedTitle(item?.title)}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome6
          name="arrow-left-long"
          color="black"
          onPress={() => goBackFunction()}
          size={20}
        />
        <Text style={styles.headerText}>Meal options</Text>
      </View>

      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        {/* <Dropdown
          style={styles.select}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={category}
          maxHeight={300}
          labelField="title"
          valueField="title"
          placeholder={!isFocus ? (value ? value : 'Select item') : '...'}
          searchPlaceholder="Search..."
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => categoryOnChangeFunction(item)}
        /> */}
        <View style={styles.dietTitle}>
          <Text style={styles.dietText}>{value}</Text>
        </View>
      </View>
      {loader ? (
        <ActivityIndicator
          size={45}
          color={colors.Black}
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        />
      ) : (
        <View style={styles.flatListStyle}>
          <FlatList
            data={menus}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => <ShowImages item={item} />}
          />
        </View>
      )}

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 2,
          left: WIDTH(4),
        }}>
        <TouchableOpacity
          style={styles.Continuebutton}
          onPress={() => Continue()}>
          <Text
            style={{
              fontFamily: NotoSans_Bold,
              fontSize: FONTSIZE(2.3),
              color: colors.Black,
            }}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>

      {/* bottom sheet  */}
      <RBSheet
        ref={bottomSheetRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        animationType="fade"
        animationInTiming={500}
        height={HEIGHT(62)}
        customStyles={{
          container: {
            borderTopRightRadius: 36,
            borderTopLeftRadius: 36,
          },
        }}>
        <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
          <Image
            source={{uri: saveArray.image}}
            resizeMode="cover"
            style={{
              width: WIDTH(90),
              height: HEIGHT(25),
              alignSelf: 'center',
              borderRadius: 16,
            }}
          />

          <View style={styles.bottomshitView}>
            <View
              style={{
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}>
              <View style={{marginBottom: HEIGHT(1)}}>
                <Text style={styles.titleInModal}>{saveArray?.title}</Text>
                <Text>{saveArray?.totalCalories} calories</Text>
              </View>

              <View style={styles.proteinCarbFatView}>
                <View style={styles.ProteinWrap}>
                  <Text style={styles.CaloryText}>Protein</Text>
                  <Text style={{color: colors.Gray}}>
                    {saveArray?.protainsCalories} calories
                  </Text>
                </View>
                <View style={styles.CarbWrap}>
                  <Text style={styles.CaloryText}>Carbs</Text>
                  <Text style={{color: colors.Gray}}>
                    {saveArray?.carbsCalories} calories
                  </Text>
                </View>
                <View style={styles.FatWrap}>
                  <Text style={styles.CaloryText}>Fat</Text>
                  <Text style={{color: colors.Gray}}>
                    {saveArray?.fatCalories} calories
                  </Text>
                </View>
              </View>

              <Text style={styles.textInBottomshit}>
                These meals are prepared considering diet preferences selected
                by you
              </Text>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity
                style={styles.bremoveButton}
                onPress={() => RemoveThisMealFunction(saveArray.id)}>
                <Text style={styles.remoeBtnText}>Remove this meal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </RBSheet>
    </View>
  );
};

export default Plans;

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

  dietTitle: {
    margin: HEIGHT(2),
    borderWidth: 1,
    width: WIDTH(88),
    height: HEIGHT(7),
    borderRadius: 8,
    justifyContent: 'center',
    paddingLeft: 10,
    borderColor: colors.Gray,
  },

  dietText: {
    fontFamily: NotoSans_Medium,
    fontSize: 16,
    color: Colors.Black,
    marginTop: -3,
  },

  select: {
    width: WIDTH(90),
    height: HEIGHT(7),
    borderWidth: 1,
    borderColor: colors.Gray,
    borderRadius: 12,
    paddingHorizontal: WIDTH(3),
    marginTop: HEIGHT(3),
    marginBottom: HEIGHT(1),
  },

  flatListStyle: {
    flex: 1,
    paddingBottom: HEIGHT(9),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: HEIGHT(1),
  },

  imageBox: {
    width: WIDTH(26),
    height: HEIGHT(14),
    borderRadius: 9,
  },

  dishName: {
    fontFamily: NotoSans_Medium,
    fontSize: FONTSIZE(1.7),
    color: colors.Black,
    marginBottom: HEIGHT(2),
  },

  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
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
  },

  placeholderStyle: {
    fontSize: 16,
  },

  selectedTextStyle: {
    fontSize: 16,
  },

  iconStyle: {
    width: 20,
    height: 20,
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },

  image: {
    height: HEIGHT(30),
    width: WIDTH(100),
  },

  bottomshitView: {
    paddingHorizontal: WIDTH(4),
    paddingBottom: WIDTH(3),
  },

  titleInModal: {
    fontSize: 20,
    fontFamily: NotoSans_Medium,
    color: colors.Black,
    textAlign: 'center',
  },

  proteinCarbFatView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
  },

  ProteinWrap: {
    width: WIDTH(29),
    height: HEIGHT(7),
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#00BF36',
    paddingBottom: WIDTH(1.5),
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },

  CarbWrap: {
    width: WIDTH(29),
    height: HEIGHT(7),
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#F55F5F',
    paddingBottom: WIDTH(1.5),
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },

  FatWrap: {
    width: WIDTH(30),
    height: HEIGHT(7),
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#F0DE3E',
    paddingBottom: WIDTH(1.5),
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },

  CaloryText: {
    fontFamily: NotoSans_Medium,
    fontSize: FONTSIZE(2),
    color: colors.Black,
  },

  textInBottomshit: {
    color: colors.Gray,
    fontFamily: NotoSans_Medium,
    fontSize: FONTSIZE(1.7),
    marginTop: HEIGHT(1),
    width: WIDTH(80),
    letterSpacing: 0.5,
  },

  remoeBtnText: {
    fontFamily: NotoSans_Bold,
    fontSize: 16,
    color: colors.Black,
  },

  bremoveButton: {
    backgroundColor: colors.AuroraGreen,
    color: colors.ButtonNameColor,
    width: WIDTH(92),
    height: HEIGHT(8),
    borderRadius: 10,
    marginTop: HEIGHT(1),
    justifyContent: 'center',
    alignItems: 'center',
  },

  Continuebutton: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: WIDTH(92),
    height: HEIGHT(8),
    marginTop: HEIGHT(1),
    marginBottom: HEIGHT(1),
    borderRadius: 10,
    backgroundColor: colors.AuroraGreen,
  },
});
