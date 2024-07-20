import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {
  FONTSIZE,
  HEIGHT,
  NotoSans_Bold,
  NotoSans_Medium,
  WIDTH,
} from '../../config/AppConst';
import COLOR from '../../config/color.json';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiManager from '../../API/Api';

const Settings = () => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [TndCshowModal, setTndCShowModal] = useState(false);
  const [PVCPshowModal, setPVCPshowModal] = useState(false);
  const [TndC, setTndC] = useState([]);

  const termsAndConditionAPI = () => {
    setTndCShowModal(!TndCshowModal);
    ApiManager.termsAndCondition()
      .then(res => {
        if (res.status == 200) {
          const response = res?.data?.respone[0];
          setTndC(response?.description);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const privacyPolicyAPI = () => {
    setPVCPshowModal(!PVCPshowModal);
    ApiManager.termsAndCondition()
      .then(res => {
        if (res.status == 200) {
          const response = res?.data?.respone[0];
          setTndC(response?.description);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const clearAppData = async function () {
    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Error clearing app data.');
    }
  };

  const Logout = () => {
    setShowModal(false);
    AsyncStorage.clear();
    AsyncStorage.removeItem();
    navigation.navigate('SignIn');
    clearAppData();
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.header}>
        <FontAwesome6
          name="arrow-left-long"
          color="black"
          onPress={() => navigation.goBack()}
          size={20}
        />
        <Text style={styles.headerText}>Setting</Text>
      </View>

      <View style={{marginTop: HEIGHT(2), paddingHorizontal: WIDTH(2)}}>
        {/* profile  */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.6}
          style={styles.sectionTouchable}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={require('../../Images/Icons/profile.png')} />
            <Text style={styles.titles}>My Profile</Text>
          </View>

          <View style={styles.iconsView}>
            <MaterialIcons
              name="keyboard-arrow-right"
              color={COLOR.Gray}
              size={WIDTH(7)}
            />
          </View>
        </TouchableOpacity>

        {/* privacy policy  */}
        <TouchableOpacity
          onPress={privacyPolicyAPI}
          activeOpacity={0.6}
          style={styles.sectionTouchable}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={require('../../Images/Icons/policy.png')} />
            <Text style={styles.titles}>Privacy Policy</Text>
          </View>

          <View style={styles.iconsView}>
            <MaterialIcons
              name="keyboard-arrow-right"
              color={COLOR.Gray}
              size={WIDTH(7)}
            />
          </View>
        </TouchableOpacity>

        {PVCPshowModal ? (
          <Modal
            isVisible={true}
            onBackdropPress={() => setPVCPshowModal(false)}
            style={styles.modalWrap}>
            <Text style={styles.tNdcHeading}>Priacy Policy</Text>
            <ScrollView>
              <Text
                style={{
                  color: COLOR.Black,
                  fontFamily: NotoSans_Medium,
                }}>
                {TndC}
              </Text>

              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styles.okayBtn}
                  onPress={() => setPVCPshowModal(false)}>
                  <Text style={styles.okayTxt}>Okay</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Modal>
        ) : null}

        {/* Terms & Conditions  */}
        <TouchableOpacity
          onPress={termsAndConditionAPI}
          style={styles.sectionTouchable}
          activeOpacity={0.6}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={require('../../Images/Icons/termCondition.png')} />
            <Text style={styles.titles}>Terms & Conditions</Text>
          </View>

          <View style={styles.iconsView}>
            <MaterialIcons
              name="keyboard-arrow-right"
              color={COLOR.Gray}
              size={WIDTH(7)}
            />
          </View>
        </TouchableOpacity>

        {TndCshowModal ? (
          <Modal
            isVisible={true}
            onBackdropPress={() => setTndCShowModal(false)}
            style={styles.modalWrap}>
            <Text style={styles.tNdcHeading}>Terms & Conditions</Text>
            <ScrollView>
              <Text
                style={{
                  color: COLOR.Black,
                  fontFamily: NotoSans_Medium,
                }}>
                {TndC}
              </Text>

              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styles.okayBtn}
                  onPress={() => setTndCShowModal(false)}>
                  <Text style={styles.okayTxt}>Okay</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Modal>
        ) : null}

        {/* Active subscription  */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ActiveSubscription')}
          activeOpacity={0.6}
          style={styles.sectionTouchable}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={require('../../Images/Icons/subscription.png')} />
            <Text style={styles.titles}>Active subscription</Text>
          </View>

          <View style={styles.iconsView}>
            <MaterialIcons
              name="keyboard-arrow-right"
              color={COLOR.Gray}
              size={WIDTH(7)}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.navigate('notification')}
          style={styles.sectionTouchable}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={require('../../Images/Icons/notification.png')} />
            <Text style={styles.titles}>Notification</Text>
          </View>

          <View style={styles.iconsView}>
            <MaterialIcons
              name="keyboard-arrow-right"
              color={COLOR.Gray}
              size={WIDTH(7)}
            />
          </View>
        </TouchableOpacity>

        {/* Log out  */}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => setShowModal(true)}
          style={styles.sectionTouchable}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={require('../../Images/Icons/logout.png')} />
            <Text style={styles.titles}>Log out</Text>
          </View>

          <View style={styles.iconsView}>
            <MaterialIcons
              name="keyboard-arrow-right"
              color={COLOR.Gray}
              size={WIDTH(7)}
            />
          </View>
        </TouchableOpacity>

        {showModal ? (
          <Modal
            isVisible={showModal}
            onBackdropPress={() => setShowModal(false)}
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.modalWrap}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: HEIGHT(2),
                }}>
                <Text style={styles.modalText}>
                  Are Your sure you want to Logout
                </Text>
                <TouchableOpacity
                  onPress={() => Logout()}
                  style={styles.modalLogoutBtn}>
                  <AntDesign
                    name="logout"
                    size={21}
                    style={{
                      color: COLOR.Black,
                      fontFamily: NotoSans_Bold,
                    }}
                  />
                  <Text size={21} style={styles.logoutText}>
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        ) : null}

        <View style={styles.footer}>
          <Text style={styles.footerText}>App version</Text>
          <Text style={styles.footerText}>1.0.0</Text>
        </View>
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: WIDTH(4),
    borderColor: COLOR.Gray,
    borderWidth: 0.2,
    shadowOffset: {width: 1, height: 1.5},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    backgroundColor: COLOR.White,
    elevation: 10,
  },

  headerText: {
    marginTop: -2,
    marginLeft: 14,
    fontSize: FONTSIZE(2.4),
    fontFamily: NotoSans_Bold,
    color: COLOR.Black,
  },

  sectionTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: WIDTH(4),
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: COLOR.LightGray,
  },

  titles: {
    fontSize: FONTSIZE(2.4),
    fontFamily: NotoSans_Medium,
    color: COLOR.Black,
    marginLeft: WIDTH(4),
  },

  iconsView: {
    backgroundColor: COLOR.AuroraGreen,
    width: WIDTH(7),
    height: WIDTH(7),
    borderRadius: 20,
  },

  footer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  footerText: {
    color: COLOR.Black,
    fontFamily: NotoSans_Medium,
    fontSize: FONTSIZE(2),
  },

  modalWrap: {
    paddingVertical: WIDTH(2),
    paddingHorizontal: HEIGHT(3),
    borderRadius: 9,
    borderColor: 'gray',
    backgroundColor: COLOR.White,
    borderWidth: 1,
    borderColor: COLOR.Gray,
    borderRadius: 20,
  },

  tNdcHeading: {
    color: COLOR.Black,
    fontFamily: NotoSans_Bold,
    fontSize: FONTSIZE(3),
    textAlign: 'center',
  },

  modalText: {
    marginTop: 18,
    color: COLOR.Black,
    fontFamily: NotoSans_Bold,
    fontSize: FONTSIZE(3),
    width: WIDTH(62),
    textAlign: 'center',
  },

  logoutText: {
    fontFamily: NotoSans_Bold,
    color: COLOR.Black,
  },

  modalLogoutBtn: {
    width: WIDTH(65),
    height: HEIGHT(6),
    borderRadius: 9,
    backgroundColor: COLOR.AuroraGreen,
    color: COLOR.ButtonNameColor,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    gap: 12,
    marginTop: HEIGHT(2.8),
  },

  okayBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH(16),
    height: HEIGHT(5),
    borderRadius: 6,
    textAlign: 'center',
    backgroundColor: COLOR.AuroraGreen,
  },

  okayTxt: {
    textAlign: 'center',
    color: COLOR.Black,
  },
});
