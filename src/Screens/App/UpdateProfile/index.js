import {StyleSheet, Text, View, ScrollView, Keyboard} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {Colors, Fonts, Icons} from '../../../constants';
import StackHeader from '../../../components/Header/StackHeader';
import CInput from '../../../components/TextInput/CInput';
import CButton from '../../../components/Buttons/CButton';
import {RFPercentage} from 'react-native-responsive-fontsize';
import RBSheetSuccess from '../../../components/BottomSheet/RBSheetSuccess';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  getCustomerDetail,
  getRestaurantDetail,
  getUserFcmToken,
  showAlert,
} from '../../../utils/helpers';
import Loader from '../../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {setCustomerDetail, setLocation, setUpdateLocation} from '../../../redux/AuthSlice';
import api from '../../../constants/api';

const UpdateProfile = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {location, customer_detail, customer_id, updateLocation} = useSelector(store => store.store);

  const ref_RBSheet = useRef();
  const textInput_HEIGHT = 42;
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('000-000000-00');
  const [email, setEmail] = useState('');
  const [userDetail, setUserDetail] = useState(null);

  const [customer, setCustomer] = useState({
    name: customer_detail?.user_name,
    phoneNo: customer_detail?.phone_no,
    email: customer_detail?.email,
    // location: customer_detail?.location
  })
  

  // const [location, setLocation] = useState('');
  // console.log(updateLocation);
  

  const handleUpdateProfile = async () => {
    setUpdating(true);
    // let customer_id = await AsyncStorage.getItem('customer_id');
    let fcm_token = await getUserFcmToken();
    let data = {
      customer_id: customer_id,
      location: updateLocation?.address,
      user_name: customer.name,
      email: customer.email,
      phone_no: customer.phoneNo,
      fcm_token: fcm_token,
      latitude: updateLocation?.latitude,
      longitude: updateLocation?.longitude,
    };

    console.log('Update request data  :  ', data);

    fetch(api.update_profile, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(async response => {
        console.log('response  : ', response);
        if (response?.status == true) {
          // ref_RBSheet?.current?.open();
          console.log(" Update request response  :  ",response?.result  );
          
          dispatch(setCustomerDetail(response?.result));
          // await AsyncStorage.setItem(
          //   'customer_detail',
          //   JSON.stringify(response?.result),
          // );
          ref_RBSheet?.current?.open();
        } else {
          showAlert(response?.message);
        }
      })
      .catch(err => {
        console.log('Error in Login :  ', err);
        showAlert('Something went wrong!');
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const get_customer_Details = async () => {
    // let customer_id = await AsyncStorage.getItem('customer_id');
    console.log('customer_id  :  ', customer_id);
    let details = await getCustomerDetail(customer_id);
    if (details) {
      setUserDetail(details);
      // dispatch(setCustomerDetail(details));
      // console.log('details  :  ', details);
      setName(details?.user_name);
      setPhoneNo(details?.phone_no);
      setEmail(details?.email);
      // setLocation(details?.location);
      console.log('details?.location  :  ', details?.location);
      dispatch(
        setLocation({
          latitude: details?.latitude ? details?.latitude : 0.0,
          longitude: details?.longitude ? details?.longitude : 0.0,
          address: details?.location ? details?.location : '',
        }),
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    // setLoading(true);
    setCustomer(prev => {
      return {
       ...prev,
        name: customer_detail?.user_name,
        phoneNo: customer_detail?.phone_no,
        email: customer_detail?.email,
      };
    })
    dispatch(setUpdateLocation({
      latitude: customer_detail?.latitude,
      longitude: customer_detail?.longitude,
      address: customer_detail?.location,
  }))
    // setName(customer_detail?.user_name);
    //   setPhoneNo(customer_detail?.phone_no);
    //   setEmail(customer_detail?.email);
    //   setUserDetail(customer_detail);
    // get_customer_Details();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1, backgroundColor: Colors.secondary_color}}
      keyboardShouldPersistTaps="handled">
      <Loader loading={loading} />

      <StackHeader title={'Update Profile'} />
      {!loading && (
        <>
          <View style={{height: 7}} />
          <CInput
            heading={'User name'}
            // placeholder="John Doe"
            value={customer?.name}
            onChangeText={text => setCustomer(prev => {
              return{
                ...prev,
                name: text
              }
            })}
            headingStyle={styles.headingStyle}
            height={textInput_HEIGHT}
          />
          <CInput
            heading={'Phone Number'}
            placeholder="0000 0000000"
            keyboardType="numeric"
            value={customer?.phoneNo}
            onChangeText={text => setCustomer(prev => {
              return{
                ...prev,
                phoneNo: text
              }
            })}
            headingStyle={styles.headingStyle}
            height={textInput_HEIGHT}
            editable={customer_detail?.signup_type == 'google' || customer_detail?.signup_type == 'email' ? true : false}
            disabled={true}
          />

          {customer_detail?.signup_type == 'phone_no'  && (
            <Text style={styles.errorText}>
              you can't change your phone number
            </Text>
          )}

          <CInput
            heading={'Email Address'}
            placeholder="example@example.com"
            keyboardType="email-address"
            value={customer?.email}
            onChangeText={text => setCustomer(prev => {
              return{
                ...prev,
                email: text
              }
            })}
            headingStyle={styles.headingStyle}
            height={textInput_HEIGHT}
            editable={customer_detail?.signup_type == 'google' ||  customer_detail?.signup_type == 'email' ? false : true}
            disabled={true}
          />
          {customer_detail?.signup_type == 'google' || customer_detail?.signup_type == 'email' && (
            <Text style={styles.errorText}>
              you can't change your email address
            </Text>
          )}
          <CInput
            heading={'Location'}
            value={updateLocation?.address}
            // value={location}
            // onChangeText={text => setLocation(text)}
            headingStyle={styles.headingStyle}
            // height={textInput_HEIGHT}
            leftContent={<Icons.Location width={16} />}
            editable={false}
            disabled={false}
            multiline
            onPress={() => navigation.navigate('ManageAddress')}
          />
          <View
            style={{
              flex: 0.8,
              paddingBottom: 30,
              justifyContent: 'flex-end',
            }}>
            <CButton
              title="Save"
              width={wp(85)}
              loading={updating}
              onPress={() => {
                Keyboard.dismiss();
                // ref_RBSheet?.current?.open();
                handleUpdateProfile();
              }}
            />
          </View>
        </>
      )}
      <View>
        <RBSheetSuccess
          refRBSheet={ref_RBSheet}
          title={'Profile Updated Successfully'}
          btnText={'OK'}
          onPress={() => {
            ref_RBSheet?.current?.close();
            navigation.goBack();
          }}
        />
      </View>
    </ScrollView>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  headingStyle: {
    color: Colors.primary_text,
    fontFamily: Fonts.PlusJakartaSans_SemiBold,
    fontSize: RFPercentage(1.8),
    marginTop: -5,
    marginBottom: 10,
  },
  errorText: {
    color: '#FF0505',
    marginTop: -15,
    marginLeft: 25,
    fontFamily: Fonts.PlusJakartaSans_Medium,
    fontSize: RFPercentage(1.6),
    marginBottom: 18,
  },
});
