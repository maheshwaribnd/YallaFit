import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {
  FONTSIZE,
  HEIGHT,
  WIDTH,
  NotoSans_Bold,
  NotoSans_Medium,
  googleMapApiKey,
  NotoSans_SemiBold,
} from '../../config/AppConst';
import {useNavigation, useRoute} from '@react-navigation/native';
import colors from '../../config/color.json';
import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {PermissionsAndroid} from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geocoder from 'react-native-geocoding';

import GetLocation from 'react-native-get-location';
import ApiManager from '../../API/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';

const LocationScreens = () => {
  Geocoder.init(googleMapApiKey);
  const navigation = useNavigation();
  const route = useRoute();
  const googleRef = useRef();

  const [currentAddress, setcurrentAddress] = useState('');
  const [serchAddress, setsearchAddress] = useState('');
  const [cityName, setCityName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locationList, setLocationList] = useState([]);
  const [UserAddress, setUserAddress] = useState('');
  const [searchLocationLoader, setsearchLocationLoader] = useState(false);

  const ConfirmLocationButton = () => {
    LocationAPI();
  };

  const LocationAPI = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const userIdd = JSON.parse(userId);
    const params = {
      user_id: userIdd,
      lattitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      address: currentAddress ? currentAddress : serchAddress,
      search_address: '',
      city: cityName,
    };

    try {
      await ApiManager.Location(params).then(res => {
        if (res?.data?.status == 200) {
          if (route?.params?.data) {
            navigation.replace('OrderConfirmation');
          } else {
            navigation.navigate('QuestionScreen');
          }
        }
      });
      if (serchAddress) {
        searchLocationAPI();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Search Location API
  const searchLocationAPI = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const userIdd = JSON.parse(userId);
    const params = {
      user_id: userIdd,
      lattitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      address: serchAddress,
      search_address: UserAddress,
    };

    try {
      ApiManager.SearchLocation(params).then(res => {
        if (res?.data?.status == 200) {
          console.log('saved in recent Search');
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    LocationListAPI();
  }, []);

  const LocationListAPI = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const userIdd = JSON.parse(userId);

    try {
      await ApiManager.recentLocationList(userIdd).then(res => {
        if (res?.data?.status == 200) {
          const response = res?.data?.respone;
          if (res?.data?.status == 200) {
            setLocationList(response);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const searchLocationFunction = data => {
    setUserAddress(data.description);
    setcurrentAddress('');
    setsearchAddress(data.description);
    findCoordinates(data.description);
  };

  const searchLocationFromHistory = data => {
    setUserAddress(data);
    setcurrentAddress('');
    setsearchAddress(data);
    findCoordinates(data);
  };

  const truncatedTitle = name => {
    if (name?.length <= 13) {
      return name;
    } else {
      return name?.substr(0, 24) + '...';
    }
  };

  const LocationList = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => searchLocationFromHistory(item.address)}
        activeOpacity={0.6}
        style={styles.singleLocation}>
        <View style={styles.logoWithName}>
          <FontAwesome5
            name="location-arrow"
            color={colors.Gray}
            size={16}
            style={{marginTop: HEIGHT(1)}}
          />
          <Text style={styles.addressListText}>
            {truncatedTitle(item?.search_address)}
          </Text>
        </View>
        <Text style={{color: '#757575'}}>{item?.address}</Text>
      </TouchableOpacity>
    );
  };

  const getPermissions = () => {
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    }).then(data => {
      if (data === 'already-enabled') {
        getLocationPermission();
      } else {
        setTimeout(() => {
          getLocationPermission();
        }, 500);
      }
    });
  };

  const getLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'location permission',
            message: 'please allow location..',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          setsearchLocationLoader(false);
          console.log('location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const findCoordinates = async item => {
    try {
      const response = await Geocoder.from(item);
      const {lat, lng} = response.results[0].geometry.location;
      setSelectedLocation({latitude: lat, longitude: lng});
      getLocation1(lat, lng);
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  const getCurrentLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(async location => {
        let latitude = location.latitude;
        let longitude = location.longitude;
        setSelectedLocation({latitude, longitude});
        await getLocation(latitude, longitude);
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
  };

  const getLocation1 = async (latitude, longitude) => {
    const apiKey = googleMapApiKey;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    try {
      const response = await axios.get(url);
      const result = response.data;

      if (result.status === 'OK') {
        const addressComponents = result.results[0].address_components;

        const filteredLongNames = addressComponents
          .filter(item => item.hasOwnProperty('long_name'))
          .map(item => item.long_name);
        const joinedLongNames = filteredLongNames.join(', ');
        setcurrentAddress('');
        setsearchAddress(joinedLongNames);

        // find city name

        const filteredComponents = addressComponents.filter(item =>
          item.hasOwnProperty('long_name'),
        );

        const cityComponent = filteredComponents.find(component =>
          component.types.includes('locality'),
        );

        // Extract the city name
        const city = cityComponent ? cityComponent.long_name : '';

        setCityName(city);
      } else {
        throw new Error(
          result.error_message || 'Reverse geocoding request failed.',
        );
      }
    } catch (error) {
      throw new Error(`Reverse geocoding request failed:: ${error.message}`);
    }
  };

  const getLocation = async (latitude, longitude) => {
    const apiKey = googleMapApiKey;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    try {
      const response = await axios.get(url);
      const result = response?.data;

      if (result.status === 'OK') {
        setsearchLocationLoader(false);
        const addressComponents = result.results[0].address_components;
        const filteredLongNames = addressComponents
          .filter(item => item.hasOwnProperty('long_name'))
          .map(item => item.long_name);
        const joinedLongNames = filteredLongNames.join(', ');

        // find city name
        const filteredComponents = addressComponents.filter(item =>
          item.hasOwnProperty('long_name'),
        );

        const cityComponent = filteredComponents.find(component =>
          component.types.includes('locality'),
        );

        // Extract the city name
        const city = cityComponent ? cityComponent.long_name : '';

        setCityName(city);

        if (serchAddress !== '') {
          setUserAddress(joinedLongNames);
          setcurrentAddress('');
          setsearchAddress(joinedLongNames);
        } else {
          setcurrentAddress(joinedLongNames);
        }
      } else {
        throw new Error(
          result.error_message || 'Reverse geocoding request failed.',
        );
      }
    } catch (error) {
      throw new Error(`Reverse geocoding request failed:: ${error.message}`);
    }
  };

  const handleMapPress = event => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setSelectedLocation({latitude, longitude});
    getLocation(latitude, longitude);
  };

  return (
    <View style={styles.container}>
      <View style={styles.forgotHeadline}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: HEIGHT(2),
            paddingBottom: HEIGHT(1.5),
          }}>
          {selectedLocation ? (
            <FontAwesome6Icon
              name="arrow-left-long"
              color="black"
              size={20}
              onPress={() => setSelectedLocation('')}
            />
          ) : null}

          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: colors.Black,
              paddingLeft: WIDTH(2),
            }}>
            Enter your location manually
          </Text>
        </View>
      </View>

      <View style={styles.searchView}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          ref={googleRef}
          onPress={data => searchLocationFunction(data)}
          query={{
            key: 'AIzaSyDjFGPFuN3IMaMQU76874r-T1glz8dyupw',
            language: 'en',
          }}
          styles={{
            textInputContainer: {
              width: WIDTH(94),
            },
            textInput: {
              color: colors.Black,
            },
            listView: {
              width: WIDTH(94),
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#e0e0e0',
            },
            description: {
              color: colors.Black,
            },
          }}
        />
        {/* <TouchableOpacity
          onPress={() => setsearchAddress('')}
          style={styles.crossStyle}>
          <Entypo name="cross" color={colors.Gray} size={20} />
        </TouchableOpacity> */}
      </View>

      {selectedLocation ? (
        <View style={styles.container}>
          {selectedLocation && (
            <MapView
              style={styles.map}
              onPress={handleMapPress}
              provider={PROVIDER_GOOGLE}
              region={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>
              <Marker
                coordinate={selectedLocation}
                onDragEnd={e => handleMapPress(e)}
                title="Selected Location"
              />
            </MapView>
          )}

          {selectedLocation ? (
            <View style={{height: HEIGHT(10)}}>
              <View style={styles.modalWrap}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../Images/Location/Selectlocation.png')}
                    style={styles.image}
                  />
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        fontSize: FONTSIZE(2.1),
                        fontFamily: NotoSans_Bold,
                        color: colors.Black,
                        textAlign: 'center',
                      }}>
                      {serchAddress
                        ? truncatedTitle(UserAddress)
                        : truncatedTitle(currentAddress)}
                    </Text>
                  </View>
                </View>

                <Text
                  style={{
                    color: colors.Gray,
                    fontFamily: NotoSans_Medium,
                    fontSize: 16,
                  }}>
                  {serchAddress == '' ? currentAddress : serchAddress}
                </Text>

                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => ConfirmLocationButton()}>
                    <Text
                      style={{
                        fontFamily: NotoSans_Bold,
                        fontSize: 16,
                        color: colors.ButtonNameColor,
                      }}>
                      Confirm delivery location
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : null}
        </View>
      ) : (
        <View>
          <View style={{padding: HEIGHT(2)}}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                getPermissions(), setsearchLocationLoader(true);
              }}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <FontAwesome5
                name="location-arrow"
                color="#31A481"
                style={{marginBottom: HEIGHT(2)}}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: '#31A481',
                  paddingLeft: WIDTH(2),
                  paddingBottom: HEIGHT(2),
                }}>
                Use my current location
              </Text>
            </TouchableOpacity>

            <Text
              style={{fontSize: 16, fontWeight: '500', color: colors.Black}}>
              Recent search results
            </Text>
          </View>

          {locationList == '' || locationList == undefined ? (
            <View style={styles.imageForRecent}>
              <Image
                source={require('../../Images/Location/recentLocationImg.png')}
              />
              <Text style={{color: '#757575'}}>NO RECENT SEARCHES</Text>
            </View>
          ) : (
            <View style={styles.listContainer}>
              <FlatList
                data={locationList.reverse()}
                renderItem={({item}) => <LocationList item={item} />}
              />
            </View>
          )}
        </View>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={searchLocationLoader}>
        <View style={styles.centeredView}>
          <ActivityIndicator size="large" color={colors.AuroraGreen} />
        </View>
      </Modal>
    </View>
  );
};

export default LocationScreens;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.White,
  },

  forgotHeadline: {
    paddingLeft: WIDTH(3),
    backgroundColor: '#51E3B780',
    width: WIDTH(100),
    height: HEIGHT(14),
  },

  crossStyle: {
    position: 'absolute',
    right: 6,
    top: 10,
    borderWidth: 2,
    borderRadius: 45,
    borderColor: colors.Gray,
    backgroundColor: colors.White,
  },

  searchView: {
    flex: 1,
    position: 'absolute',
    zIndex: 999,
    left: WIDTH(3),
    top: HEIGHT(6),
    borderRadius: 6,
  },

  logoWithName: {
    flexDirection: 'row',
    gap: 6,
    textAlign: 'center',
  },

  addressListText: {
    color: colors.Black,
    fontFamily: NotoSans_Bold,
    width: WIDTH(80),
  },

  listContainer: {
    height: HEIGHT(100),
    backgroundColor: '#ECEDED',
    paddingVertical: HEIGHT(0.7),
  },

  singleLocation: {
    padding: HEIGHT(1.5),
    marginTop: HEIGHT(1.2),
    marginRight: HEIGHT(2),
    marginLeft: HEIGHT(2),
    backgroundColor: colors.White,
    borderRadius: 16,
  },

  map: {
    flex: 1,
    width: WIDTH(100),
  },

  locationDetails: {
    bottom: 10,
    left: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },

  allow: {
    color: '#0587FF',
    fontSize: 16,
  },

  dontAllow: {
    color: colors.Black,
    fontSize: 16,
    fontFamily: NotoSans_Medium,
  },

  locationDetails: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },

  modalWrap: {
    backgroundColor: colors.White,
    position: 'absolute',
    alignSelf: 'stretch',
    bottom: 0,
    left: 0,
    right: 0,
    padding: HEIGHT(2),
    paddingTop: HEIGHT(1.4),
    backgroundColor: colors.White,
  },

  locationText: {
    fontSize: 16,
    fontFamily: NotoSans_SemiBold,
    textAlign: 'center',
    color: colors.Black,
  },

  image: {
    height: HEIGHT(4),
    width: WIDTH(7),
    marginRight: WIDTH(1.5),
  },

  imageForRecent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: HEIGHT(21),
    padding: HEIGHT(2),
  },

  button: {
    backgroundColor: colors.AuroraGreen,
    color: colors.ButtonNameColor,
    width: WIDTH(92),
    height: HEIGHT(8),
    borderRadius: 10,
    marginTop: HEIGHT(3),
    justifyContent: 'center',
    alignItems: 'center',
  },

  // modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.6)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
