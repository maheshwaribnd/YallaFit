import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import {HEIGHT, NotoSans_Medium, WIDTH} from '../../config/AppConst';
import colors from '../../config/color.json';
import React from 'react';

const ExerciseScreen = ({selectedBox, setSelectedBox, exerciseData}) => {
  const RenderDataFunction = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setSelectedBox(item.optionId)}
        style={selectedBox == item.optionId ? styles.boxClrChange : styles.box}>
        <Text style={styles.forTitle}>{item.optionTitle}</Text>
        <Text style={styles.forSubtitle}>{item.optionSubTitle}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{paddingHorizontal: HEIGHT(2)}}>
      <Text style={styles.heading}>{exerciseData?.question_title}</Text>
      <FlatList
        data={exerciseData?.QuestionType}
        renderItem={({item}) => <RenderDataFunction item={item} />}
      />
    </View>
  );
};

export default ExerciseScreen;

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

  forSubtitle: {
    color: colors.Gray,
    fontSize: 14,
    fontFamily: NotoSans_Medium,
  },

  box: {
    height: HEIGHT(11),
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 9,
    borderColor: colors.AuroraGreen,
    backgroundColor: colors.White,
    paddingTop: WIDTH(1),
    paddingBottom: HEIGHT(2),
    paddingRight: WIDTH(6),
    paddingLeft: WIDTH(3),
    marginBottom: HEIGHT(1),
  },

  boxClrChange: {
    height: HEIGHT(11),
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 9,
    borderColor: colors.AuroraGreen,
    padding: WIDTH(1),
    paddingBottom: HEIGHT(2),
    paddingRight: WIDTH(6),
    paddingLeft: WIDTH(3),
    marginBottom: HEIGHT(1),
    backgroundColor: '#BFFFF3',
  },
});
