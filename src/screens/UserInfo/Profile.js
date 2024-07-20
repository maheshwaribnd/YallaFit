import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  FONTSIZE,
  HEIGHT,
  NotoSans_Bold,
  NotoSans_Medium,
  WIDTH,
} from '../../config/AppConst';
import COLOR from '../../config/color.json';
import Modal from 'react-native-modal';
import {Badge, Divider} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {LinearGradient} from 'react-native-linear-gradient';
import {launchImageLibrary} from 'react-native-image-picker';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import Octicons from 'react-native-vector-icons/Octicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiManager from '../../API/Api';

const Profile = () => {
  const navigation = useNavigation();

  const [userDetails, setUserDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userImage, setuserImage] = useState('');
  const [documentFile, setDocumentFile] = useState(null);

  useEffect(() => {
    profileAPI();
  }, []);

  useEffect(() => {
    const backAction = () => {
      updateProfileAPI(documentFile);
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  });

  const Logout = () => {
    setShowModal(false);
    AsyncStorage.clear();
    navigation.navigate('SignIn');
  };

  // Get API
  const profileAPI = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const userIdd = JSON.parse(userId);

    await ApiManager.userDetails(userIdd)
      .then(res => {
        if (res?.data?.status == 200) {
          let response = res?.data?.respone;
          setUserDetails(response[0]);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  // Post API

  const updateProfileAPI = async () => {

    const userId = await AsyncStorage.getItem('userid');
    const userIdd = JSON.parse(userId);
    
    const formData = new FormData();
    formData.append('user_id', userIdd);
    {
      documentFile !== null
        ? formData.append('profileImg', {
            uri: documentFile[0].uri,
            type: documentFile[0].type,
            name: documentFile[0].fileName,
          })
        : formData.append('profileImg', undefined);
    }

    await ApiManager.updateUserProfilePicture(formData)
      .then(res => {
        console.log('image response', res?.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const selectImage = async () => {
    launchImageLibrary({quality: 0.7}, fileobj => {
      if (fileobj?.didCancel === true) {
        setuserImage('');
      } else {
        const img = fileobj?.assets[0]?.uri || '';
        setuserImage(img);
        setDocumentFile(fileobj?.assets);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome6Icon
          name="arrow-left-long"
          color="black"
          onPress={() => {
            documentFile !== ''
              ? (updateProfileAPI(), navigation.goBack())
              : navigation.goBack();
          }}
          size={20}
        />
        <Text style={styles.headerText}>My Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#51E3B7', '#7F5EBE']}
          style={styles.imgBackground}>
          <View>
            <Image
              style={{width: WIDTH(28), height: WIDTH(28), borderRadius: 50}}
              source={
                userImage == ''
                  ? userDetails?.length == []
                    ? require('../../Images/Profile/user.png')
                    : {uri: userDetails?.profileImg}
                  : {uri: userImage}
              }
              resizeMode="cover"
            />
            <Badge onPress={() => selectImage()} size={32} style={styles.badge}>
              <Octicons size={18} name="pencil" />
            </Badge>
          </View>
        </LinearGradient>

        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <View style={styles.detailsBox}>
            <Text style={styles.personalDetail}>Personal Details</Text>
            <Divider style={styles.forDivider} />

            <View style={{padding: WIDTH(4)}}>
              <View style={{flexDirection: 'row', gap: 6, alignItems: 'center'}}>
                <Text style={styles.subtitle}>Name :</Text>
                <Text style={styles.name}>{userDetails?.name}</Text>
              </View>

              <View style={{flexDirection: 'row', gap: 6, alignItems: 'center'}}>
                <Text style={styles.subtitle}>Email  :</Text>
                <Text style={styles.name}>{userDetails?.email}</Text>
              </View>

              {/* <View>
                <Text style={styles.subtitle}>Mobile number</Text>
                <Text style={styles.name}>{userDetails?.mobile_no}</Text>
              </View> */}
            </View>
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <TouchableOpacity
              onPress={() => setShowModal(true)}
              style={styles.button}>
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
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
  },
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

  personalDetail: {
    paddingLeft: WIDTH(4),
    paddingTop: HEIGHT(1),
    paddingBottom: HEIGHT(1.2),
    color: COLOR.Black,
    fontSize: FONTSIZE(2.2),
    fontFamily: NotoSans_Bold,
  },

  forDivider: {
    borderColor: COLOR.Gray,
    borderWidth: 0.2,
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 2,
  },

  imgBackground: {
    height: HEIGHT(27),
    paddingTop: HEIGHT(3),
    alignItems: 'center',
  },

  detailsBox: {
    backgroundColor: COLOR.White,
    height: HEIGHT(52),
    width: WIDTH(92),
    borderRadius: 10,
    position: 'absolute',
    bottom: 85,
    elevation: 6,
    shadowColor: 'gray',
    shadowOffset: {width: 4, height: 4},
    shadowOpacity: 2,
    shadowRadius: 5,
  },

  subtitle: {
    color: COLOR.Black,
    fontSize: FONTSIZE(2.2),
    fontFamily: NotoSans_Bold,
  },

  name: {
    color: COLOR.Black,
    fontSize: FONTSIZE(2.2),
    paddingTop: 3
  },

  logoutText: {
    fontFamily: NotoSans_Bold,
    color: COLOR.Black,
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

  modalText: {
    marginTop: 18,
    color: COLOR.Black,
    fontFamily: NotoSans_Medium,
    fontSize: FONTSIZE(2.2),
    width: WIDTH(62),
    textAlign: 'center',
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

  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    gap: 12,
    width: WIDTH(90),
    height: HEIGHT(8),
    borderRadius: 12,
    backgroundColor: COLOR.AuroraGreen,
    color: COLOR.ButtonNameColor,
    marginTop: HEIGHT(52),
  },

  badge: {
    backgroundColor: COLOR.Gray,
    position: 'absolute',
    bottom: 0,
  },
});
