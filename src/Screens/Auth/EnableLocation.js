import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts, Icons} from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CButton from '../../components/Buttons/CButton';
import {getCurrentLocation} from '../../utils/helpers/location';
import {showAlert} from '../../utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../constants/api';
import Loader from '../../components/Loader';
import {useDispatch} from 'react-redux';
import {setJoinAsGuest} from '../../redux/AuthSlice';

const EnableLocation = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleUseMyLocation = async () => {
    try {
      setLoading(true);
      let {latitude, longitude, address} = await getCurrentLocation();
      // let customer_id = await AsyncStorage.getItem('customer_id');
      let customer_id = route?.params?.customer_id;
      let data = {
        customer_id: customer_id,
        latitude: latitude,
        longitude: longitude,
        location: address,
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
        console.log('response  :   ',response);
        
          if (response?.status == false) {
            showAlert(response?.message);
          } else {
            dispatch(setJoinAsGuest(false));
            navigation?.popToTop();
            navigation?.replace('Drawer');
          }
        })
        .catch(err => {
          console.log('Error in updating user location :  ', err);
          showAlert('Something went wrong!');
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log('error  :  ', error);
      showAlert('Something went wrong');
    }
  };

  const skip = () => {
    navigation?.popToTop();
    navigation?.replace('Drawer');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.White,
        paddingHorizontal: 25,
        paddingVertical: 25,
      }}>
      <Loader loading={loading} />
      <TouchableOpacity style={{}}>
        <Ionicons name="chevron-back" color={'#000'} size={22} />
      </TouchableOpacity>
      <View style={{alignItems: 'center', marginTop: hp(5)}}>
        <Icons.LocationLogo width={wp(80)} />
      </View>
      <Text
        style={{
          textAlign: 'center',
          color: '#000000',
          fontFamily: Fonts.PlusJakartaSans_Bold,
          fontSize: RFPercentage(2.5),
          marginVertical: 15,
        }}>
        Enable Your Location
      </Text>
      <Text
        style={{
          textAlign: 'center',
          color: '#939598',
          fontFamily: Fonts.PlusJakartaSans_Medium,
          fontSize: RFPercentage(1.8),
          marginVertical: 15,
          marginHorizontal: 10,
          lineHeight: 20,
        }}>
        To provide you with the best and most accurate Uber experience, we need
        access to your device's location.
      </Text>

      <View
        style={{flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
        <CButton
          title="USE MY LOCATION"
          width={wp(80)}
          onPress={() => {
            // navigation?.popToTop();
            // navigation?.replace('Drawer');
            handleUseMyLocation();
          }}
        />
        <CButton
          title="Skip for now"
          width={wp(80)}
          transparent={true}
          style={{borderWidth: 0}}
          marginTop={4}
          textStyle={{
            color: '#000000',
            fontFamily: Fonts.PlusJakartaSans_Medium,
            textTransform: 'none',
          }}
          onPress={() => {
            skip();
          }}
        />
      </View>
    </View>
  );
};

export default EnableLocation;

const styles = StyleSheet.create({});
