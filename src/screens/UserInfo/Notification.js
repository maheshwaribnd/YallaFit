import {
  BackHandler,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  FONTSIZE,
  HEIGHT,
  NotoSans_Bold,
  NotoSans_Medium,
  WIDTH,
} from '../../config/AppConst';
import colors from '../../config/color.json';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {useNavigation} from '@react-navigation/native';
import ApiManager from '../../API/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image} from 'react-native';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    NotificationAPI();
  }, []);

  const NotificationAPI = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const userIdd = JSON.parse(userId)

    await ApiManager.notification(userIdd)
      .then(res => {
        if (res?.data?.status == 200) {
          let response = res?.data?.response;
          setNotifications(response);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    setTimeout(() => {
      getUpdateNotification();
    }, 5000);
  }, []);

  const getUpdateNotification = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const userIdd = JSON.parse(userId)

    await ApiManager.updateNotification(userIdd)
      .then(resp => {
        if (resp?.data?.status == 200) {
          NotificationAPI();
        }
      })
      .catch(err => {
        console.log('error', err);
      });
  };

  // useEffect(() => {
  //   const backAction = () => {
  //     navigation.goBack();
  //     return true;
  //   };
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );
  //   return () => backHandler.remove();
  // }, []);

  const handleNotification = item => {
    return (
      <>
        <TouchableOpacity
          style={[
            styles.customerList,
            {
              backgroundColor:
                item.isNotifyCustomer === 0 ? '#f5f3f2' : colors.White,
            },
          ]}>
          <View
            style={{
              width: WIDTH(95),
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 7,
            }}>
            <Image
              source={require('../../Images/Profile/user.png')}
              style={{
                height: HEIGHT(8),
                width: WIDTH(14),
                borderRadius: 45,
                borderColor: 'black',
              }}
            />
            <Text
              style={[
                styles.msgStyle,
                {
                  fontFamily:
                    item.isNotifyCustomer === 0
                      ? NotoSans_Bold
                      : NotoSans_Medium,
                },
              ]}>
              {item.msgCustomer}
            </Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.White}}>
      <View style={styles.header}>
        <FontAwesome6
          name="arrow-left-long"
          color="black"
          onPress={() => navigation.goBack()}
          size={20}
        />
        <Text style={styles.headerText}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        renderItem={({item}) => handleNotification(item)}
      />
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: WIDTH(5),
    borderColor: colors.Gray,
    borderWidth: 0.2,
    // shadowOffset: {width: 1, height: 1.5},
    // shadowOpacity: 0.4,
    // shadowRadius: 2,
    backgroundColor: colors.White,
    // elevation: 10,
  },

  headerText: {
    marginTop: -2,
    marginLeft: 14,
    fontSize: FONTSIZE(2.4),
    fontFamily: NotoSans_Bold,
    color: colors.Black,
  },

  customerList: {
    justifyContent: 'center',
    paddingHorizontal: WIDTH(1),
    paddingVertical: HEIGHT(1.5),
  },

  msgStyle: {
    fontSize: FONTSIZE(2),
  },
});
