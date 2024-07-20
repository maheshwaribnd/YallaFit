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

const TargetScreen = ({selectedBox, setSelectedBox, targetData}) => {
  const RenderDataFunction = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setSelectedBox(item.optionId)}
        style={selectedBox == item.optionId ? styles.boxClrChange : styles.box}>
        <Image style={styles.img} source={{uri: item.questionImage}} />
        <Text style={styles.forTitle}>{item.optionTitle}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{paddingHorizontal: HEIGHT(2)}}>
      <Text style={styles.heading}>{targetData?.question_title}</Text>
      <FlatList
        data={targetData?.QuestionType}
        renderItem={({item}) => <RenderDataFunction item={item} />}
      />
    </View>
  );
};

export default TargetScreen;

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

  img: {
    height: HEIGHT(9),
    width: WIDTH(18),
    borderRadius: 7,
  },

  box: {
    flexDirection: 'row',
    borderWidth: 2,
    borderRadius: 9,
    borderColor: colors.AuroraGreen,
    backgroundColor: colors.White,
    alignItems: 'center',
    gap: 9,
    padding: WIDTH(0.8),
    marginBottom: 10,
  },

  boxClrChange: {
    flexDirection: 'row',
    borderWidth: 2,
    borderRadius: 9,
    borderColor: colors.AuroraGreen,
    alignItems: 'center',
    gap: 9,
    padding: WIDTH(0.8),
    marginBottom: 10,
    backgroundColor: '#BFFFF3',
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH(94),
    height: HEIGHT(7),
    borderRadius: 12,
    marginTop: HEIGHT(27),
    marginLeft: WIDTH(3),
    backgroundColor: colors.AuroraGreen,
    color: colors.ButtonNameColor,
  },
});
