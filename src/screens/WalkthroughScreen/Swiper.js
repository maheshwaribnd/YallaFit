import {
  Text,
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {FONTSIZE, HEIGHT, NotoSans_Bold, WIDTH} from '../../config/AppConst';
import colors from '../../config/color.json';
import {Slides} from '../../Array/Slides';
import {useNavigation} from '@react-navigation/native';
import ApiManager from '../../API/Api';
import Paginator from '../../components/Pagination';

const SwiperScreen = () => {
  const navigation = useNavigation();
  const slides = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideData, setSlideData] = useState([]);

  const scrollX = useRef(new Animated.Value(0)).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1
      if (nextIndex >= slideData.length) {
        nextIndex = 0;
      }
      slides.current.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, slideData.length]);

  const handleSkip = () => {
    navigation.replace('SignIn');
  };

  useEffect(() => {
    SliderScreenAPI();
  }, []);

  const SliderScreenAPI = () => {
    ApiManager.sliderAPI()
      .then(res => {
        if (res?.data?.status == 200) {
          const response = res?.data?.respone
          setSlideData(response);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const sliderDetailFunction = ({ item }) => {
    return (
      <View style={styles.container}>
        <ImageBackground
          src={item.image}
          resizeMode="cover"
          style={{
            height: HEIGHT(100),
            width: WIDTH(100),
          }}>

          <View style={{ position: 'absolute', top: HEIGHT(80), left: WIDTH(41) }}>
            <Paginator data={slideData} scrollX={scrollX} />
          </View>

          <View style={styles.forText}>
            <Text
              style={{
                fontFamily: NotoSans_Bold,
                color: colors.Black,
                fontSize: FONTSIZE(2.2),
                lineHeight: 21,
                width: WIDTH(70),
                marginTop: HEIGHT(6),
                textAlign: 'center',
              }}>
              {item.title}
            </Text>
          </View>
          {item.id == 3 ? (
            <TouchableOpacity
              onPress={() => handleSkip()}
              style={styles.button}>
              <Text
                style={{
                  fontSize: FONTSIZE(2),
                  fontFamily: NotoSans_Bold,
                  textAlign: 'center',
                  color: colors.Black,
                }}>
                Get Started
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => handleSkip()}
              style={styles.button}>
              <Text
                style={{
                  fontSize: FONTSIZE(2),
                  fontFamily: NotoSans_Bold,
                  textAlign: 'center',
                  color: colors.Black,
                }}>
                Skip
              </Text>
            </TouchableOpacity>
          )}
        </ImageBackground>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={slideData}
        renderItem={({ item }) => sliderDetailFunction({ item })}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          },
        )}
        scrollEventThrottle={32}
        onViewableItemsChanged={viewableItemsChanged}
        ref={slides}
        viewabilityConfig={viewConfig}
      />
    </View>
  );
};

export default SwiperScreen;

const styles = StyleSheet.create({
  container: {
    height: HEIGHT(100),
    width: WIDTH(100),
  },

  forText: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: HEIGHT(69),
  },

  button: {
    justifyContent: 'center',
    padding: HEIGHT(0.5),
    alignSelf: 'center',
    alignItems: 'center',
    width: 210,
    height: 45,
    borderRadius: 45,
    backgroundColor: colors.AuroraGreen,
    color: colors.ButtonNameColor,
    position: 'absolute',
    bottom: HEIGHT(5),
  },
});
