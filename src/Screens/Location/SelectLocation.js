import React, {useEffect, useId, useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
} from 'react-native';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFPercentage} from 'react-native-responsive-fontsize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors, Icons, Images} from '../../constants';
import {
  getAddressFromLatLng,
  getCurrentLocation,
} from '../../utils/helpers/location';
import {useDispatch, useSelector} from 'react-redux';

import Loader from '../../components/Loader';
import {setLocation} from '../../redux/AuthSlice';
import api from '../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showAlert} from '../../utils/helpers';
import CButton from '../../components/Buttons/CButton';

const SelectLocation = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {location} = useSelector(store => store.store);
  const [loading, setLoading] = useState(false);
  const [searchHide, setSearchHide] = useState(true);

  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const onRegionChange = async region1 => {
    setLoading(true);
    console.log('region change...', region1);
    setRegion({
      latitude: region1.latitude,
      longitude: region1.longitude,
      latitudeDelta: region1.latitudeDelta,
      longitudeDelta: region1.longitudeDelta,
    });
    let address = await getAddressFromLatLng(
      region1.latitude,
      region1.longitude,
    );
    var add = address;
    var value = add?.split(',');
    count = value.length;
    city = value[count - 3];
    console.log('city______ : ', city);
    setSelectedCity(city);
    setSelectedAddress(address);
    setLoading(false);
  };

  const handleUpdateProfile = async (address, latitude, longitude) => {
    setLoading(true);
    let customer_id = await AsyncStorage.getItem('customer_id');
    let data = {
      customer_id: customer_id,
      location: address,
      latitude: latitude,
      longitude: longitude,
    };

    console.log('data  :  ', data);

    fetch(api.update_profile, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(async response => {
        if (response?.status == true) {
          navigation.goBack();
        } else {
          showAlert(response?.message);
        }
      })
      .catch(err => {
        console.log('Error in Login :  ', err);
        showAlert('Something went wrong!');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOnDragEnd = async e => {
    try {
      setLoading(true);
      let latitude = e.nativeEvent.coordinate.latitude;
      let longitude = e.nativeEvent.coordinate.longitude;
      setRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      let address = await getAddressFromLatLng(
        e.nativeEvent.coordinate.latitude,
        e.nativeEvent.coordinate.longitude,
      );
      var add = address;
      var value = add?.split(',');
      count = value.length;
      city = value[count - 3];
      console.log('city______ : ', city);
      setSelectedCity(city);
      setSelectedAddress(address);
      setLoading(false);
    } catch (error) {
      console.log('error  handleOnDragEnd :  ', error);
    }
  };

  const getLocation = async () => {
    console.log('getLocation  ');
    if (location?.address == '' || route?.params?.screen != 'update') {
      setLoading(true);
      let {latitude, longitude, address} = await getCurrentLocation();
      console.log(
        'latitude, longitude, address  :  ',
        latitude,
        longitude,
        address,
      );
      setRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setSelectedAddress(address);
      var add = address;
      var value = add?.split(',');
      count = value.length;
      city = value[count - 3];
      console.log('city______ : ', city);
      setSelectedCity(city);

      setLoading(false);
    } else {
      console.log('else_________  : ', location);
      setRegion({
        latitude: location?.latitude ? location?.latitude : 37.78825,
        longitude: location?.longitude ? location?.longitude : -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setSelectedAddress(location?.address ? location?.address : '');
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      {/* <Loader loading={loading} /> */}
      <View style={styles.bodyContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => (searchHide ? '' : setSearchHide('true'))}>
            <TouchableOpacity
              onPress={() => navigation?.goBack()}
              style={styles.iconContainer}>
              {searchHide ? (
                <AntDesign
                  name={searchHide ? 'close' : 'left'}
                  size={hp(2.5)}
                  color="#FF5722"
                />
              ) : (
                <Ionicons
                  name={'chevron-back'}
                  size={hp(3)}
                  color={Colors.primary_color}
                />
              )}
            </TouchableOpacity>
          </TouchableOpacity>

          {/* {searchHide ? (
            <TouchableOpacity onPress={() => setSearchHide(false)}>
              <View style={styles.iconContainer}>
                <AntDesign name="search1" size={hp(2.5)} color="#FF5722" />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={{...styles.inputIcon}}>
              <View style={{...styles.iconContainer, marginHorizontal: wp(0)}}>
                <AntDesign name="search1" size={hp(2.5)} color="#898A8D" />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  color="#212121"
                  placeholder="Search"
                  placeholderTextColor={'#898A8D'}
                  // onChangeText={text => setFullName(text)}
                  // value={fullName}
                />
              </View>
            </View>
          )} */}
        </View>
        <MapView
          // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={region}
          // onRegionChangeComplete={region => onRegionChange(region)}
          zoomEnabled={true}
          zoomControlEnabled={false}
          showsUserLocation={false}
          showsMyLocationButton={false}>
          <Marker
            draggable
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            // description={'This is a marker in React Natve'}
            onDragEnd={e => {
              handleOnDragEnd(e);
            }}>
            <Icons.MapMarker />
          </Marker>
        </MapView>

        {/* <View style={styles.markerFixed}>
          <Icons.MapMarker />
        </View> */}

        {/* <View
          style={{
            left: '50%',
            marginLeft: -7,
            marginTop: -7,
            position: 'absolute',
            top: '50%',
          }}>
          <Icons.MapMarker />
        </View> */}
        <View style={styles.selectLocationContainer}>
          <View style={styles.textsContainer}>
            <Text style={styles.mainText}>Select your Location</Text>
            <Text style={styles.descriptionText}>
              {/* Choose your delivery address to enjoy our delicious food delivered
              right to your doorstep. Let's get started! */}
              {selectedAddress}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <CButton
              title="Confirm Location"
              loading={loading}
              marginTop={1}
              height={50}
              onPress={() => {
                // navigation.replace('Drawer');
                dispatch(
                  setLocation({
                    latitude: region?.latitude,
                    longitude: region?.longitude,
                    address: selectedAddress,
                    city: selectedCity,
                  }),
                );
                if (route?.params?.type == 'update_user_location') {
                  handleUpdateProfile(
                    selectedAddress,
                    region?.latitude,
                    region?.longitude,
                  );
                } else {
                  navigation.goBack();
                }
              }}
            />
            {/* <TouchableOpacity
              onPress={() => {
                // navigation.replace('Drawer');
                dispatch(
                  setLocation({
                    latitude: region?.latitude,
                    longitude: region?.longitude,
                    address: selectedAddress,
                    city: selectedCity,
                  }),
                );
                if (route?.params?.type == 'update_user_location') {
                  handleUpdateProfile(
                    selectedAddress,
                    region?.latitude,
                    region?.longitude,
                  );
                } else {
                  navigation.goBack();
                }
              }}>
              <View
                style={{...styles.buttonContainer, backgroundColor: '#FF5722'}}>
                <Text style={styles.buttonText}>Confirm Location</Text>
              </View>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  bodyContainer: {
    flex: 1,
  },
  selectLocationContainer: {
    height: hp(29),
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: wp(8),
    borderTopLeftRadius: wp(8),
    position: 'absolute',
    // top: hp(73),
    bottom: 0,
    //paddingLeft:wp(5)
    // justifyContent:"space-evenly",
    // alignItems:"center",
    //  borderWidth:1
  },

  mapContainer: {
    height: '70%',
    width: '90%',
    margin: wp(5),
    borderRadius: wp(5),
    // borderWidth:1
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  textsContainer: {
    height: hp(20),
    width: wp(85),
    marginLeft: wp(5),
    // borderWidth:2,
    justifyContent: 'center',
  },
  mainText: {
    color: '#000000',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: RFPercentage(3),
    //lineHeight: 84,
    fontWeight: '700',
    // textAlign: 'center',
    marginBottom: hp('2'),
  },
  descriptionText: {
    color: '#000000',
    fontSize: RFPercentage(1.6),
    fontFamily: 'PlusJakartaSans-Regular',
    //textAlign: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: RFPercentage(2),
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  buttonContainer: {
    height: hp(6.5),
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp(90),
    borderRadius: hp(10),
    //  borderWidth:1
  },
  headerContainer: {
    height: hp(15),
    //  borderWidth:1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 1,
  },
  iconContainer: {
    width: wp(11),
    height: wp(11),
    borderRadius: hp(50),
    backgroundColor: '#FFFFFF',
    marginHorizontal: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',

    height: wp(11),
    //borderRadius:hp(50),

    // justifyContent:"center",
    backgroundColor: '#FFFFFF',
    //alignItems:"center",
    //borderWidth:1
  },
  input: {
    height: hp(6),
  },
  inputIcon: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    width: wp(75),
    height: wp(11),
    marginRight: wp(5),
    // justifyContent:"center",
    // alignSelf:"center",
    // width:wp(83),
    borderRadius: hp(10),
  },
  markerFixed: {
    left: '50%',
    marginLeft: -18,
    marginTop: -30,
    position: 'absolute',
    top: '50%',
  },
  marker: {
    height: 35,
    width: 35,
  },
});

export default SelectLocation;
