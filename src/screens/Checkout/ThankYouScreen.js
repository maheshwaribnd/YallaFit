import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  FONTSIZE,
  HEIGHT,
  NotoSans_Medium,
  NotoSans_SemiBold,
  WIDTH,
} from '../../config/AppConst';
import colors from '../../config/color.json';
import {useNavigation} from '@react-navigation/native';
import ApiManager from '../../API/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlatList} from 'react-native';
import {CardDetails} from '../../CardDetails';

const ThankYouScreen = () => {
  const navigation = useNavigation();

  const slides = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');

  const [recomend, setrecomend] = useState(true);
  const [gift, setgift] = useState(true);

  const feedBackAPI = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const userIdd = JSON.parse(userId)
    
    const params = {
      user_id: userIdd,
      recommend: recomend ? 'Yes' : 'No',
      gift: gift ? 'Yes' : 'No',
      how_to_improve: inputValue,
    };

    await ApiManager.Feedback(params)
      .then(res => {
        if (res.status == 201) {
          navigation.navigate('Dashboard');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const onChangeTextFun = text => {
    setInputValue(text);
  };

  const handleNextPress = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < CardDetails.length) {
      slides.current.scrollToIndex({index: nextIndex});
      setCurrentIndex(nextIndex);
    }
  };

  const Done = () => {
    setInputValue('');
    feedBackAPI();
    navigation.navigate('Dashboard');
  };

  const viewableItemsChanged = useRef(({viewableItems}) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const cardDetailFunction = ({item}) => {
    return (
      <View>
        {item?.id == 1 ? (
          <View style={styles.questionView}>
            <Text style={styles.questionText}>
              1. Would you recommend this to a friend ?
            </Text>
            <View style={styles.yexNoBtnView}>
              <TouchableOpacity
                onPress={() => setrecomend(true)}
                style={recomend ? styles.yesNoClrChange : styles.yesNo}>
                <Text style={styles.yexNoBtnText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setrecomend(false)}
                style={recomend ? styles.yesNo : styles.yesNoClrChange}>
                <Text style={styles.yexNoBtnText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : item.id == 2 ? (
          <View style={styles.questionView}>
            <Text style={styles.questionText}>
              2. Would you gift this to a loved one ?
            </Text>
            <View style={styles.yexNoBtnView}>
              <TouchableOpacity
                onPress={() => setgift(true)}
                style={gift ? styles.yesNoClrChange : styles.yesNo}>
                <Text style={styles.yexNoBtnText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setgift(false)}
                style={gift ? styles.yesNo : styles.yesNoClrChange}>
                <Text style={styles.yexNoBtnText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.questionView}>
            <Text style={styles.questionText}>3. How should we improve ?</Text>
            <View>
              <TextInput
                value={inputValue}
                keyboardType="text"
                multiline
                onChangeText={onChangeTextFun}
                style={styles.forInput}
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../Images/Gif/Animation.gif')}
        style={styles.gifImage}
      />

      <Text style={styles.thankYouText}>Thank you for ordering</Text>
      <View style={styles.viewForText}>
        <Text style={styles.forText}>Let's begin eating clean,</Text>
        <Text style={styles.forText}>Getting fit and becoming happier</Text>
      </View>
      <Text style={styles.title}>Give us your valuable feedback</Text>

      {/* swiper */}
      <View style={styles.formainView}>
        <View style={styles.modalWrap}>
          <FlatList
            data={CardDetails}
            renderItem={({item}) => cardDetailFunction({item})}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollX}}}],
              {
                useNativeDriver: false,
              },
            )}
            scrollEventThrottle={32}
            onViewableItemsChanged={viewableItemsChanged}
            ref={slides}
            viewabilityConfig={viewConfig}
          />

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            {currentIndex < 2 ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleNextPress()}>
                <Text style={styles.BtnText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={Done}>
                <Text style={styles.BtnText}>Done</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default ThankYouScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: HEIGHT(20),
    alignItems: 'center',
    backgroundColor: colors.White,
  },

  thankYouText: {
    fontSize: FONTSIZE(2.5),
    fontFamily: NotoSans_Medium,
    color: '#04AC7A',
  },

  viewForText: {
    marginTop: HEIGHT(3),
    justifyContent: 'center',
    alignItems: 'center',
  },

  forText: {
    fontFamily: NotoSans_SemiBold,
    color: colors.Black,
    fontSize: FONTSIZE(2),
  },

  gifImage: {
    marginBottom: HEIGHT(1),
    resizeMode: 'contain', // Adjust the image size to the container
  },

  formainView: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 15,
  },

  modalWrap: {
    padding: WIDTH(2),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.White,
    width: WIDTH(90),
    height: HEIGHT(32),
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 4,
  },

  title: {
    fontFamily: NotoSans_Medium,
    color: colors.Black,
    fontSize: FONTSIZE(2.2),
    marginTop: HEIGHT(3),
    fontFamily: NotoSans_Medium,
    color: colors.Black,
    fontSize: FONTSIZE(2.2),
    marginTop: HEIGHT(3),
  },

  questionView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH(80),
    margin: 10,
  },

  questionText: {
    fontFamily: NotoSans_Medium,
    color: colors.Black,
    fontSize: FONTSIZE(2),
    marginTop: HEIGHT(2),
  },

  yexNoBtnView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
  },

  yexNoBtnText: {
    fontFamily: NotoSans_Medium,
    color: colors.Black,
    fontSize: FONTSIZE(2),
    textAlign: 'center',
  },

  yesNo: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.AuroraGreen,
    backgroundColor: colors.White,
    height: HEIGHT(6),
    width: WIDTH(30),
    marginTop: HEIGHT(3),
    marginBottom: HEIGHT(3),
    borderRadius: 9,
  },

  yesNoClrChange: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.AuroraGreen,
    backgroundColor: colors.AuroraGreen,
    height: HEIGHT(6),
    width: WIDTH(30),
    marginTop: HEIGHT(3),
    marginBottom: HEIGHT(3),
    borderRadius: 9,
  },

  forInput: {
    height: HEIGHT(9),
    width: WIDTH(80),
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#775577',
    marginTop: HEIGHT(1),
    marginBottom: HEIGHT(1),
    paddingTop: WIDTH(0),
    paddingLeft: WIDTH(2),
  },

  swiper: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  BtnText: {
    fontFamily: NotoSans_Medium,
    fontSize: FONTSIZE(2),
    color: colors.Black,
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD43D',
    color: colors.Black,
    borderRadius: 9,
    width: WIDTH(80),
    height: HEIGHT(6),
    marginBottom: HEIGHT(1),
  },
});
