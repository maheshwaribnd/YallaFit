import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../config/color.json';
import {
  HEIGHT,
  NotoSans_Bold,
  NotoSans_Medium,
  WIDTH,
} from '../../config/AppConst';
import React from 'react';

const TargetWeightScreen = ({
  setSelectedBox,
  selectState,
  InputforTargetWeight,
  setInputforTargetWeight,
  age,
  setAge,
  setSelectState,
  targetWeightData,
}) => {
  
  const onChangeforTargetWeight = text => {
    var changeIntoNumber = text.replace(/[^0-9.]/g, '');
    setInputforTargetWeight(changeIntoNumber);
    setSelectedBox(changeIntoNumber);
  };

  const onChangeforAge = text => {
    var changeIntoNumber = text.replace(/[^0-9]/g, '');
    setAge(changeIntoNumber);
  };

  const selectMale = () => {
    setSelectState('Male');
  };

  const selectFemale = () => {
    setSelectState('Female');
  };

  return (
    <View>
      <View style={{paddingHorizontal: HEIGHT(2)}}>
        <Text style={styles.heading}>{targetWeightData[0].question_title}</Text>
        <View style={styles.inputField}>
          <TextInput
            keyboardType="number-pad"
            value={InputforTargetWeight}
            onChangeText={onChangeforTargetWeight}
            style={styles.forInput}
          />
          <View style={styles.text}>
            <Text style={styles.forKG}>Kg's</Text>
          </View>
        </View>

        <Text style={styles.heading}>{targetWeightData[1].question_title}</Text>
        <View style={styles.inputField}>
          <TextInput
            keyboardType="number-pad"
            value={age}
            onChangeText={onChangeforAge}
            style={styles.forInput}
          />
        </View>
        {/* {age < 18 ? (
          <Text style={{fontSize: 12, color: 'red', marginBottom: HEIGHT(1)}}>
            Age must be greater than 18
          </Text>
        ) : null} */}

        <Text style={styles.heading}>{targetWeightData[2].question_title}</Text>

        <View style={styles.forGender}>
          <TouchableOpacity onPress={selectMale}>
            <View
              style={
                selectState == 'Male' ? styles.selectClrChange : styles.select
              }>
              <Text style={styles.forMaleFemale}>Male</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={selectFemale}
            style={
              selectState == 'Female' ? styles.selectClrChange : styles.select
            }>
            <View>
              <Text style={styles.forMaleFemale}>Female</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TargetWeightScreen;

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
    paddingBottom: HEIGHT(1.5),
    marginTop: HEIGHT(1),
  },

  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.Gray,
    borderRadius: 10,
    height: HEIGHT(6),
    paddingLeft: WIDTH(2),
    marginBottom: HEIGHT(1),
  },

  text: {
    position: 'absolute',
    right: 2,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    height: HEIGHT(5),
    width: WIDTH(17),
    borderRadius: 8,
    backgroundColor: colors.LightGray,
  },

  forInput: {
    width: WIDTH(70),
    color: colors.Black,
  },

  forKG: {
    fontSize: 14,
    fontFamily: NotoSans_Bold,
    color: colors.Black,
  },

  forGender: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
  },

  forMaleFemale: {
    fontFamily: NotoSans_Medium,
    color: colors.Black,
    textAlign: 'center',
  },

  select: {
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH(44),
    height: HEIGHT(6),
    borderWidth: 2,
    borderRadius: 9,
    borderColor: colors.AuroraGreen,
    backgroundColor: colors.White,
  },

  selectClrChange: {
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH(44),
    height: HEIGHT(6),
    borderWidth: 2,
    borderRadius: 9,
    borderColor: colors.AuroraGreen,
    backgroundColor: colors.AuroraGreen,
  },
});
