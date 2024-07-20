import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import colors from '../../config/color.json';
import {FONTSIZE, HEIGHT, NotoSans_Medium, WIDTH} from '../../config/AppConst';
import React from 'react';

const Nutritionist = () => {
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

  return (
    <View>
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
          <Image
            source={require('../../Images/QuestionScreenImg/NutriDoc.png')}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Nutritionist;

const styles = StyleSheet.create({
  nutriBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: WIDTH(95),
    height: HEIGHT(10),
    paddingLeft: WIDTH(6),
    paddingRight: WIDTH(3),
    marginTop: HEIGHT(2),
    marginLeft: WIDTH(2),
    borderWidth: 1,
    borderRadius: WIDTH(50),
  },

  nutriText: {
    color: colors.Black,
    fontSize: FONTSIZE(2.3),
    fontFamily: NotoSans_Medium,
  },
});
