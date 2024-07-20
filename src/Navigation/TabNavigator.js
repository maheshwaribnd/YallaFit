import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icons from '../config/Icons';
import colors from '../config/color.json';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import Home from '../screens/DashboardScreens/Home';
import Nutritionist from '../screens/DashboardScreens/Nutritionist';
import MyPlans from '../screens/DashboardScreens/MyPlans';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import {FONTSIZE, HEIGHT, NotoSans_Bold, WIDTH} from '../config/AppConst';

const TabArr = [
  {
    route: 'Home',
    label: 'Home',
    type: Octicons,
    icon: 'home',
    component: Home,
  },
  {
    route: 'Nutritionist',
    label: 'Nutritionist',
    type: FontAwesome,
    icon: 'stethoscope',
    component: Nutritionist,
  },
  {
    route: 'Plans',
    label: 'Plans',
    type: MaterialCommunityIcons,
    icon: 'silverware-fork-knife',
    component: MyPlans,
  },
];

// doing Animateble
const animate1 = {
  0: {scale: 0.5, translateY: 1},
  1: {scale: 1, translateY: -3},
};

const animate2 = {
  0: {scale: 1, translateY: -2},
  1: {scale: 1, translateY: 3},
};

const circle1 = {
  0: {scale: 0},

  1: {scale: 1},
};
const circle2 = {0: {scale: 1}, 1: {scale: 0}};

const TabButton = props => {
  const Navigation = useNavigation();
  const [changeColor, setChangeColor] = useState(false);

  const {item, onPress, accessibilityState} = props;
  const focused = accessibilityState.selected;

  const viewRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (focused) {
      setChangeColor(!changeColor);
      viewRef.current.animate(animate1);
      circleRef.current.animate(circle1);
      textRef.current.transitionTo({scale: 1});
    } else {
      setChangeColor(changeColor);
      viewRef.current.animate(animate2);
      circleRef.current.animate(circle2);
      textRef.current.transitionTo({scale: 1});
    }
  }, [focused]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress()}
      activeOpacity={1}>
      <Animatable.View ref={viewRef} duration={300} style={styles.container}>
        <View
          style={[
            styles.btn,
            {
              marginTop: focused ? HEIGHT(2) : 0,
            },
          ]}>
          <Animatable.View ref={circleRef} style={styles.circle} />
          <Icons
            type={item.type}
            name={item.icon}
            color={focused ? colors.White : colors.Black}
            style={{alignItems: 'center'}}
          />
          <Animatable.Text
            ref={textRef}
            style={focused ? styles.textColorChange : styles.text}>
            {item.label}
          </Animatable.Text>
        </View>
      </Animatable.View>
    </TouchableOpacity>
  );
};

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
      }}>
      {TabArr.map((item, index) => {
        return (
          <Tab.Screen
            name={item.route}
            component={item.component}
            options={{
              tabBarLabel: item.label,
              tabBarButton: props => <TabButton {...props} item={item} />,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabBar: {
    height: HEIGHT(9),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D4D4D4',
  },

  btn: {
    width: WIDTH(22),
    height: HEIGHT(7),
    borderRadius: 35,
    marginBottom: HEIGHT(1),
    borderColor: colors.TabNavigateButton,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },

  circle: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.TabNavigateButton,
    borderRadius: 25,
  },
  text: {
    fontSize: FONTSIZE(1.3),
    fontFamily: NotoSans_Bold,
    textAlign: 'center',
    color: colors.Black,
  },
  textColorChange: {
    fontSize: FONTSIZE(1.3),
    fontFamily: NotoSans_Bold,
    textAlign: 'center',
    color: colors.White,
  },
});
