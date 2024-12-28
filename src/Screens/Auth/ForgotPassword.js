import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useRef, useDebugValue} from 'react';
import StackHeader from '../../components/Header/StackHeader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CButton from '../../components/Buttons/CButton';
import CInput from '../../components/TextInput/CInput';
import STYLE from './STYLE';
import {useKeyboard} from '../../utils/UseKeyboardHook';
import {handlePopup} from '../../utils/helpers';
import api from '../../constants/api';
import {useDispatch, useSelector} from 'react-redux';

const ForgotPassword = ({navigation, route}) => {
  const dispatch = useDispatch();
  const { Colors } = useSelector(store => store.store)

  const keyboardHeight = useKeyboard();
  const scrollViewRef = useRef();

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd();
  }, [keyboardHeight]);

  const [userValue, setUserValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phone_no, setPhone_no] = useState('');
  const [countryCode, setCountryCode] = useState('+92');


  const validate = () => {
    if (!userValue || userValue.length === 0) {
      // showAlert('Please Enter email address');
      handlePopup(dispatch, 'Please Enter email address', 'red');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(userValue)) {

      handlePopup(dispatch,'Please Enter a valid email address','red');
      return false;
    }
       else {
        return true;
      }
    };

  const handleSendCode = async () => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9\s-]+$/;

    // const phone = countryCode + phone_no


    // console.log('country code  : ', countryCode);
    // console.log('phone_no  : ', phone_no);

    if (validate()) {
      setLoading(true)
      const data = {
        email: userValue
    }
    console.log(data);
    
      fetch(api.forgetPassword, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .then(response => response.json())
      .then(async response => {
        console.log('response  :  ', response);
        if (response?.error == true) {
          // showAlert(response?.msg);
          handlePopup(dispatch, response?.msg, 'red')
        } else {
          // showAlert(response?.message, 'green');
          handlePopup(dispatch, response?.message, 'green')
         navigation.navigate('EmailVerification', {
          otp : response?.otp,
          email : response?.userID?.email
          
         })
        }
      })
      .catch(err => {
        console.log('Error in Login :  ', err);
        handlePopup(dispatch,'Something went wrong!', 'red');
      })
      .finally(() => {
        setLoading(false);
      });
    }
  };


  return (
    <View style={{flex: 1, backgroundColor: Colors.secondary_color}}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <StackHeader title={''} backIconColor={'#1D1D20'} />

        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            alignItems: 'center',
          }}>
          <View style={STYLE.screenTitleContainer}>
            <Text style={STYLE.screenTitle}>Forget Password</Text>
            <Text style={{...STYLE.screenDesc, width: wp(70)}}>
              Please enter your phone number below. We will send you a 6-digit
              code to reset your password.
            </Text>
          </View>

          

          <CInput
            placeholder="Email"
            value={userValue}
            onChangeText={text => setUserValue(text)}
          />

        
          <View
            style={{
              // height: hp(47),
              flex: 1,
              justifyContent: 'flex-end',
              paddingBottom: 30,
            }}>
            <CButton
              title="SEND CODE"
              height={hp(6)}
              onPress={() => handleSendCode()}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ForgotPassword;

