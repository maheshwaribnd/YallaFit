import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Linking,
} from 'react-native';
import colors from '../../config/color.json';
import {
  FONTSIZE,
  HEIGHT,
  NotoSans_Medium,
  NotoSans_SemiBold,
  WIDTH,
} from '../../config/AppConst';
import React from 'react';
import Nurse from '../../assets/nurse.svg'

const SuitsDiet = ({selectedBox, setSelectedBox, followFoodData}) => {
  const openWhatsApp = () => {
    let Number = '0096892420924';
    let url = `whatsapp://send?phone=${encodeURIComponent(
      Number,
    )}&text=${encodeURIComponent('Hello')}`;

    Linking.openURL(url)
      .then(data => {
        console.log('WhatsApp Opened');
      })
      .catch(() => {
        alert('Make sure WhatsApp is installed on your device');
      });
  };

  const RenderDataFunction = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setSelectedBox(item.optionId)}
        style={selectedBox == item.optionId ? styles.boxClrChange : styles.box}>
        <Image source={{uri: item.questionImage}} style={styles.img} />
        <View style={{width: WIDTH(75)}}>
          <Text style={styles.forTitle}>{item.optionTitle}</Text>
          <Text style={styles.forSubtitle}>{item.optionSubTitle}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{paddingHorizontal: HEIGHT(1.5)}}>
      <Text style={styles.heading}>{followFoodData?.question_title}</Text>
      <FlatList
        data={followFoodData?.QuestionType}
        renderItem={({item}) => <RenderDataFunction item={item} />}
      />

      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.nutriBox}
        onPress={openWhatsApp}>
        <View>
          <Text style={styles.nutriText}>Talk to nutritionist</Text>
          <Text
            style={{
              color: colors.Gray,
              marginBottom: HEIGHT(1),
            }}>
            (You might have to pay for this feature)
          </Text>
        </View>
        <View>
           <Nurse/>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SuitsDiet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.White,
  },

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
    width: WIDTH(74),
    color: colors.Gray,
    fontSize: 14,
    fontFamily: NotoSans_SemiBold,
  },

  box: {
    paddingLeft: WIDTH(4),
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
    borderWidth: 2,
    borderRadius: 9,
    borderColor: colors.AuroraGreen,
    backgroundColor: colors.White,
    gap: 6,
    padding: 2,
    padding: WIDTH(0.8),
    marginBottom: HEIGHT(1),
  },

  boxClrChange: {
    paddingLeft: WIDTH(4),
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
    borderWidth: 2,
    borderRadius: 9,
    borderColor: colors.AuroraGreen,
    gap: 6,
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

  nutriBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: WIDTH(95),
    height: HEIGHT(10),
    paddingLeft: WIDTH(6),
    paddingRight: WIDTH(3),
    marginTop: HEIGHT(8),
    borderWidth: 1,
    borderRadius: WIDTH(50),
  },

  nutriText: {
    color: colors.Black,
    fontSize: FONTSIZE(2.3),
    fontFamily: NotoSans_Medium,
  },
});
