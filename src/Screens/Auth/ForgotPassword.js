import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useRef, useDebugValue} from 'react';
import {Colors, Fonts, Icons} from '../../constants';
import StackHeader from '../../components/Header/StackHeader';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CButton from '../../components/Buttons/CButton';
import CInput from '../../components/TextInput/CInput';
import STYLE from './STYLE';
import {useKeyboard} from '../../utils/UseKeyboardHook';
import {handlePopup, showAlert} from '../../utils/helpers';
import api from '../../constants/api';
import {firebase} from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';
import {setOtpConfirm} from '../../redux/AuthSlice';

import CountryPicker from 'react-native-country-picker-modal';
import CInputWithCountryCode from '../../components/TextInput/CInputWithCountryCode';

const ForgotPassword = ({navigation, route}) => {
  const dispatch = useDispatch();

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



    // if (validate()) {
    //   setLoading(true);
    //   firebase
    //     .auth()
    //     .signInWithPhoneNumber(countryCode + phone_no)
    //     .then(response => {
    //       console.log('confirmResult  :  ', response);
    //       // setConfirmResult(response);
    //       // setTimeout(() => refOTP.current.focusField(0), 250);
    //       dispatch(setOtpConfirm(response));
    //       navigation?.navigate('Verification_Phone', {
    //         // confirmResult: response,
    //         phone_no: countryCode + phone_no,
    //       });
    //     })
    //     .catch(error => {
    //       showAlert(error.message);
    //       console.log(error);
    //     })
    //     .finally(() => setLoading(false));
    // }
  };

   

  // const validate = () => {
  //   if (countryCode?.length == 0) {
  //     showAlert('Please Enter Country');
  //     return false;
  //   } else if (phone_no?.length == 0) {
  //     showAlert('Please Enter Phone Number');
  //     return false;
  //   } else {
  //     return true;
  //   }
  // };

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

          {/* <CInputWithCountryCode
            phoneNo={phone_no}
            setPhoneNo={setPhone_no}
            setCountryCode={setCountryCode}
            countryCode={countryCode}
          /> */}

          <CInput
            placeholder="Email"
            value={userValue}
            onChangeText={text => setUserValue(text)}
          />

          {/* <CInput
            placeholder="Phone Number"
            value={phone_no}
            onChangeText={text => setPhone_no(text)}
            // value={email}
            // onChangeText={text => setEmail(text)}
          /> */}
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

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 35,
    width: wp(90),
    marginVertical: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textInput: {
    paddingHorizontal: 20,
  },
});
