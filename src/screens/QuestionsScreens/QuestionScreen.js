import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {HEIGHT, NotoSans_Medium, WIDTH} from '../../config/AppConst';
import colors from '../../config/color.json';
import Progressbar from './Progressbar';
import React, {useEffect, useState} from 'react';
import TargetScreen from './TargetScreen';
import CurrentWeightScreen from './CurrentWeightScreen';
import TargetWeightScreen from './TargetWeightScreen';
import ExerciseScreen from './ExerciseScreen';
import DoNotEatFoodScreen from './DoNotEatFoodScreen';
import SuitsDiet from './SuitsDiet';
import {useNavigation} from '@react-navigation/native';
import ApiManager from '../../API/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../components/CustomHeader';

const QuestionScreen = () => {
  const [progress, setProgress] = useState(20);
  const [color, setColor] = useState('#E6E6E6');
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(1);
  const [userId, setUserId] = useState(null);
  const [selectedBox1, setSelectedBox1] = useState('');
  const [selectedBox2, setSelectedBox2] = useState('');
  const [inputforWeight, setInputforWeight] = useState('');
  const [inputforHeight, setInputforHeight] = useState('');
  const [selectedBox3, setSelectedBox3] = useState('');
  const [InputforTargetWeight, setInputforTargetWeight] = useState('');
  const [age, setAge] = useState('');
  const [selectState, setSelectState] = useState('');
  const [selectedBox4, setSelectedBox4] = useState('');
  const [selectedBox5, setSelectedBox5] = useState([]);
  const [selectedBox6, setSelectedBox6] = useState('');
  const [targetData, setTargetData] = useState([]);
  const [currentWeightData, setCurrentWeightData] = useState([]);
  const [targetWeightData, setTargetWeightData] = useState([]);
  const [exerciseData, setExerciseData] = useState([]);
  const [avoidFoodData, setavoidFoodData] = useState([]);
  const [followFoodData, setfollowFoodData] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    QuestionScreenAPI();
  }, []);

  // Question Get API

  const QuestionScreenAPI = () => {
    ApiManager.questionList()
      .then(async res => {
        if (res?.data?.status == 200) {
          const usID = await AsyncStorage.getItem('userid');
          setUserId(usID);
          const response = res?.data?.response;
          const Questiondata1 = response.filter(
            item => item.question_sequence == 1,
          );
          setTargetData(Questiondata1[0]);
          const Questiondata2 = response.filter(
            item => item.question_sequence == 2,
          );
          setCurrentWeightData(Questiondata2);
          const Questiondata3 = response.filter(
            item => item.question_sequence == 3,
          );
          setTargetWeightData(Questiondata3);
          const Questiondata4 = response.filter(
            item => item.question_sequence == 4,
          );
          setExerciseData(Questiondata4[0]);
          const Questiondata5 = response.filter(
            item => item.question_sequence == 5,
          );
          setavoidFoodData(Questiondata5[0]);
          const Questiondata6 = response.filter(
            item => item.question_sequence == 6,
          );
          setfollowFoodData(Questiondata6[0]);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  // Question Post API

  const PostUserQuestionAPI = async () => {
    const params = {
      userId: JSON.parse(userId),
      target: selectedBox1,
      weight: inputforWeight,
      height: inputforHeight,
      targetWeight: InputforTargetWeight,
      age: age,
      gender: selectState,
      howActive: selectedBox4,
      notEat: selectedBox5,
      dietSuits: selectedBox6,
    };

    try {
      await ApiManager.userAnswerforQuestions(params).then(async res => {
        if (res?.data?.status == 200) {
          let userData = await AsyncStorage.getItem('userData');
          let userData1 = JSON.parse(userData);
          userData1.question_status = true;
          AsyncStorage.setItem('userData', JSON.stringify(userData1));
          navigation.navigate('Dashboard');
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateProgress = () => {
    setProgress(progress >= 80 ? progress + 20 : progress + 20);
    setSelectedComponent(selectedComponent + 1);
  };

  const handleGoBack = () => {
    if (selectedComponent !== 1) {
      setProgress(progress >= 90 ? progress - 20 : progress - 20);
      setSelectedComponent(selectedComponent - 1);
    } else {
      navigation.goBack();
    }
  };

  const Next = newColor => {
    if (selectedComponent == 1) {
      if (selectedBox1 == '') {
        Alert.alert('Invalid Input', 'Select any one option');
      } else {
        updateProgress();
      }
    } else if (selectedComponent == 2) {
      if (inputforWeight == '') {
        Alert.alert('Invalid Input', 'Please enter your current weight');
      } else if (selectedBox3.length == '' || InputforTargetWeight == '') {
        Alert.alert('Invalid Input', 'Please enter your target weight');
      } else if (inputforHeight == '') {
        Alert.alert('Invalid Input', 'Please enter your height');
      } else if (age == '') {
        Alert.alert('Invalid Input', 'Please enter your age');
      } else if (selectState == '') {
        Alert.alert('Invalid Input', 'Please select your gender');
      } else {
        updateProgress()
      }
    } else if (selectedComponent == 3) {
      if (selectedBox4 == '') {
        Alert.alert('Invalid Input', 'Select any one option');
      } else {
        updateProgress();
      }
    } else if (selectedComponent == 4) {
      if (selectedBox5 == '') {
        Alert.alert('Invalid Input', 'Select any one option');
      } else {
        updateProgress();
      }
    } else if (selectedComponent == 5) {
      if (selectedBox6 == '') {
        Alert.alert('Invalid Input', 'Select any one option');
      } else {
        PostUserQuestionAPI();
      }
    } else {
      PostUserQuestionAPI();
    }
    setColor(newColor);
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case 1:
        return (
          <TargetScreen
            selectedBox={selectedBox1}
            setSelectedBox={setSelectedBox1}
            targetData={targetData}
          />
        );
      case 2:
        return (
          <CurrentWeightScreen
            selectedBox2={selectedBox2}
            setSelectedBox2={setSelectedBox2}
            inputforWeight={inputforWeight}
            setInputforWeight={setInputforWeight}
            inputforHeight={inputforHeight}
            setInputforHeight={setInputforHeight}
            currentWeightData={currentWeightData}
            // Details for Targated
            selectedBox3={selectedBox3}
            setSelectedBox3={setSelectedBox3}
            selectState={selectState}
            setSelectState={setSelectState}
            InputforTargetWeight={InputforTargetWeight}
            setInputforTargetWeight={setInputforTargetWeight}
            age={age}
            setAge={setAge}
            targetWeightData={targetWeightData}
          />
        );
      // case 3:
      //   return (
      //     <TargetWeightScreen
      //       selectedBox={selectedBox3}
      //       setSelectedBox={setSelectedBox3}
      //       selectState={selectState}
      //       InputforTargetWeight={InputforTargetWeight}
      //       setInputforTargetWeight={setInputforTargetWeight}
      //       age={age}
      //       setAge={setAge}
      //       setSelectState={setSelectState}
      //       targetWeightData={targetWeightData}
      //     />
      //   );
      case 3:
        return (
          <ExerciseScreen
            selectedBox={selectedBox4}
            setSelectedBox={setSelectedBox4}
            exerciseData={exerciseData}
          />
        );
      case 4:
        return (
          <DoNotEatFoodScreen
            selectedBox={selectedBox5}
            setSelectedBox={setSelectedBox5}
            avoidFoodData={avoidFoodData}
          />
        );
      case 5:
        return (
          <SuitsDiet
            selectedBox={selectedBox6}
            setSelectedBox={setSelectedBox6}
            followFoodData={followFoodData}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.forgotHeadline}>
        <CustomHeader
          name={'Custom meal plan'}
          onPress={() => handleGoBack('#E6E6E6')}
        />
      </View>

      <View style={{padding: HEIGHT(2)}}>
        <Progressbar
          progress={progress}
          selectedComponent={selectedComponent}
          selectedOption={color}
        />
      </View>
      {renderComponent()}
      <TouchableOpacity
        disabled={isButtonDisabled}
        onPress={() => {
          Next(colors.AuroraGreen);
        }}
        style={styles.button}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: NotoSans_Medium,
            textAlign: 'center',
            color: colors.Black,
          }}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuestionScreen;

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

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: HEIGHT(2.5),
    width: WIDTH(94),
    height: HEIGHT(7),
    borderRadius: 12,
    marginLeft: WIDTH(3),
    backgroundColor: colors.AuroraGreen,
    color: colors.ButtonNameColor,
  },
});
