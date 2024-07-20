import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import SwiperScreen from '../screens/WalkthroughScreen/Swiper';
import SignUpDetails from '../screens/SIgnUpScreens/SignUpDetails';
import ForgotPassword from '../screens/ForgotScreens/ForgotEmail';
import NewEmail from '../screens/ForgotScreens/NewEmail';
import LocationScreens from '../screens/Locations/LocationScreens';
import CurrentWeightScreen from '../screens/QuestionsScreens/CurrentWeightScreen';
import ExerciseScreen from '../screens/QuestionsScreens/ExerciseScreen';
import DoNotEatFoodScreen from '../screens/QuestionsScreens/DoNotEatFoodScreen';
import SuitsDiet from '../screens/QuestionsScreens/SuitsDiet';
import TargetScreen from '../screens/QuestionsScreens/TargetScreen';
import TargetWeightScreen from '../screens/QuestionsScreens/TargetWeightScreen';
import QuestionScreen from '../screens/QuestionsScreens/QuestionScreen';
import TabNavigator from './TabNavigator';
import Plans from '../screens/DashboardScreens/Plans';
import OrderConfirmation from '../screens/Checkout/OrderConfirmation';
import ChooseDateCalender from '../screens/DashboardScreens/ChooseDateCalender';
import ChoosePaymentMethod from '../screens/Checkout/ChoosePaymentMethod';
import ThankYouScreen from '../screens/Checkout/ThankYouScreen';
import MyPlans from '../screens/DashboardScreens/MyPlans';
import Profile from '../screens/UserInfo/Profile';
import UserSetting from '../screens/UserInfo/Setting';
import ActiveSubscription from '../screens/UserInfo/ActiveSubscription';
import SignIn from '../screens/SignInScreens/SignIn';
import Notification from '../screens/UserInfo/Notification';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          customAnimationOnGesture: true,
          animation: 'fade_from_bottom',
          animationDuration: '400',
        }}>
        {/* Splash Screen */}
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        {/* Swiper Screen */}
        <Stack.Screen name="SwiperScreen" component={SwiperScreen} />
        {/* SignIn Screens */}
        <Stack.Screen name="SignIn" component={SignIn} />

        {/* SignUp Screens */}
        <Stack.Screen name="SignUpDetails" component={SignUpDetails} />
        {/* Forgot Screens */}
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="NewEmail" component={NewEmail} />
        {/* Location Screens */}
        <Stack.Screen name="LocationScreens" component={LocationScreens} />

        {/* Questionnairs Screens */}
        <Stack.Screen name="QuestionScreen" component={QuestionScreen} />
        <Stack.Screen name="TargetScreen" component={TargetScreen} />
        <Stack.Screen
          name="CurrentWeightScreen"
          component={CurrentWeightScreen}
        />
        <Stack.Screen
          name="TargetWeightScreen"
          component={TargetWeightScreen}
        />
        <Stack.Screen name="ExerciseScreen" component={ExerciseScreen} />
        <Stack.Screen
          name="DoNotEatFoodScreen"
          component={DoNotEatFoodScreen}
        />
        <Stack.Screen name="SuitsDiet" component={SuitsDiet} />
        {/* Dashboard */}
        <Stack.Screen name="Dashboard" component={TabNavigator} />
        <Stack.Screen name="MyPlans" component={MyPlans} />
        <Stack.Screen
          name="ChooseDateCalender"
          component={ChooseDateCalender}
        />
        <Stack.Screen name="Plans" component={Plans} />
        {/* UserInfo */}
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="UserSetting" component={UserSetting} />
        <Stack.Screen name="notification" component={Notification} />
        <Stack.Screen
          name="ActiveSubscription"
          component={ActiveSubscription}
        />
        {/* Payment */}
        <Stack.Screen name="OrderConfirmation" component={OrderConfirmation} />
        <Stack.Screen
          name="ChoosePaymentMethod"
          component={ChoosePaymentMethod}
        />

        <Stack.Screen name="ThankYouScreen" component={ThankYouScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
