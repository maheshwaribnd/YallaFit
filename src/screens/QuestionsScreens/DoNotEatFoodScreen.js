import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import colors from '../../config/color.json';
import {HEIGHT, NotoSans_Medium, WIDTH} from '../../config/AppConst';
import React from 'react';

const DoNotEatFoodScreen = ({selectedBox, setSelectedBox, avoidFoodData}) => {
  const RenderDataFunction = ({item}) => {
    const boxSelectFunction = item => {
      setSelectedBox(prevSelectedItems => {
        if (prevSelectedItems.includes(item)) {
          return prevSelectedItems.filter(id => id !== item);
        }

        else {
          if (prevSelectedItems.length < 2) {
            return [...prevSelectedItems, item];
          } else {
            return prevSelectedItems;
          }
        }
      })
    };

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => boxSelectFunction(item.optionId)}
        style={
          selectedBox.includes(item.optionId) ? styles.boxClrChange : styles.box
        }>
        <Image source={{uri: item.questionImage}} style={styles.img} />
        <Text style={styles.forTitle}>{item.optionTitle}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{paddingHorizontal: HEIGHT(2)}}>
      <Text style={styles.heading}>{avoidFoodData?.question_title}</Text>
      <FlatList
        data={avoidFoodData?.QuestionType}
        renderItem={({item}) => <RenderDataFunction item={item} />}
      />
    </View>
  );
};

export default DoNotEatFoodScreen;

const styles = StyleSheet.create({
  forgotHeadline: {
    backgroundColor: colors.White,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: WIDTH(4),
    width: WIDTH(100),
    height: HEIGHT(9),
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 9,
    elevation: 7,
  },

  heading: {
    fontSize: 16,
    fontFamily: NotoSans_Medium,
    color: colors.Black,
    paddingBottom: 15,
  },

  forTitle: {
    color: colors.ButtonNameColor,
    fontSize: 16,
    fontFamily: NotoSans_Medium,
  },

  box: {
    flexDirection: 'row',
    borderWidth: 2,
    borderRadius: 9,
    borderColor: colors.AuroraGreen,
    backgroundColor: colors.White,
    alignItems: 'center',
    gap: 9,
    padding: 2,
    padding: WIDTH(0.8),
    marginBottom: HEIGHT(1),
  },

  boxClrChange: {
    flexDirection: 'row',
    borderWidth: 2,
    borderRadius: 9,
    borderColor: colors.AuroraGreen,
    alignItems: 'center',
    gap: 9,
    padding: 2,
    padding: WIDTH(0.8),
    marginBottom: HEIGHT(1),
    backgroundColor: '#BFFFF3',
  },

  img: {
    height: HEIGHT(9),
    width: WIDTH(18),
    borderRadius: 7,
  },
});
