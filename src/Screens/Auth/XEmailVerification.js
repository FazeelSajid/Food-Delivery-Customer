import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TurboModuleRegistry,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Snackbar from 'react-native-snackbar';
import OTPInputView from '@twotalltotems/react-native-otp-input';

import {Fonts, Icons} from '../../constants';
import StackHeader from '../../components/Header/StackHeader';
import CButton from '../../components/Buttons/CButton';
import STYLE from './STYLE';
import RBSheetSuccess from '../../components/BottomSheet/RBSheetSuccess';
import {useKeyboard} from '../../utils/UseKeyboardHook';
import {firebase} from '@react-native-firebase/auth';
import {handlePopup, showAlert, showAlertLongLength} from '../../utils/helpers';
import api from '../../constants/api';
import Loader from '../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {setCustomerDetail, setCustomerId} from '../../redux/AuthSlice';

const EmailVerification = ({navigation, route}) => {
  const dispatch = useDispatch();
    const {  Colors } = useSelector(store => store.store)

  const keyboardHeight = useKeyboard();
  const scrollViewRef = useRef();
  const otp = route?.params?.otp?.toString()
  const email = route?.params?.email
  

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd();
  }, [keyboardHeight]);

  const ref_RBSheet = useRef();
  const refOTP = useRef();
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);



  const validate = () => {
    console.log(otpCode, 'route :' ,  otp, email);

    
    if (otpCode?.length == 0 || otpCode?.length < 4) {
      handlePopup(dispatch,'Please Enter 4 digit OTP code','red')
      
      return false;
    } else if (otpCode !== otp){
      handlePopup(dispatch,'Incorrect OTP code','red')
    } 
    else {
      return true;
    }
  };


  const handleVerifyCode = async () => {
   
   if (validate()) {
    const data = {
      email: email,
      otp: otpCode
  }
    fetch(api.otpVerification, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then(response => response.json())
    .then(async response => {
      console.log('response  :  ', response);
      if (response?.status == false) {
        handlePopup(dispatch,response?.message, 'red');
      } else {
        handlePopup(dispatch,response?.message, 'green');
       navigation.navigate('ResetPassword', {
        email : response?.result?.email
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

  const updateVerificationStatus = () => {
    let data = {
      customer_id: route?.params?.customer_id,
      verified: true,
    };
    console.log('data  :  ', data);
    fetch(api.update_verification_status, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(async response => {
        console.log('response  :  ', response);
        if (response?.status == false) {
          handlePopup(dispatch,response?.message,'red');
          // showAlert('Invalid Credentials');
        } else {
          // showAlert(response.message, 'green');
          ref_RBSheet?.current?.open();
          let prevResponse = route?.params?.response;
          await AsyncStorage.setItem(
            'customer_id',
            prevResponse?.result?.customer_id?.toString(),
          );
          await AsyncStorage.setItem(
            'customer_detail',
            JSON.stringify(prevResponse?.result),
          );

          dispatch(
            setCustomerId(prevResponse?.result?.customer_id?.toString()),
          );
          dispatch(setCustomerDetail(prevResponse?.result));
        }
      })
      .catch(err => {
        console.log('Error in Login :  ', err);
        handlePopup(dispatch,'Something went wrong!','red');
      })
      .finally(() => {
        setLoading(false);
      });
  };


const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 35,
    width: wp(90),
    marginTop: 50,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textInput: {
    paddingHorizontal: 20,
  },
  underlineStyleBase: {
    color: Colors.primary_text,
    fontSize: 24,
    fontFamily: Fonts.Inter_Medium,
    width: 48,
    height: 50,
    borderRadius: 30,
    borderWidth: 0,
    // borderBottomWidth: 1,
    borderColor: '#DDDDDD',
    // marginHorizontal: 2,
    backgroundColor: '#F5F6FA',
  },
  underlineStyleHighLighted: {
    borderColor: Colors.primary_color,
    borderRadius: 30,
    borderWidth: 1,
  },
});


  return (
    <View style={{flex: 1, backgroundColor: Colors.secondary_color}}>
      <StackHeader title={''} backIconColor={'#1D1D20'} />
      <Loader loading={loading} />
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            alignItems: 'center',
          }}>
          <View style={STYLE.screenTitleContainer}>
            <Text style={STYLE.screenTitle}>Verification</Text>
            <Text style={{...STYLE.screenDesc, lineHeight: 22}}>
              To ensure the security of your account, we require email
              verification
            </Text>
          </View>

          <View style={{width: wp(60), flex: 1, zIndex: 999}}>
            <OTPInputView
              ref={refOTP}
              style={{
                height: 50,
                // marginTop: hp(5),
              }}
              pinCount={4}
              code={otpCode}
              onCodeChanged={code => {
                setOtpCode(code);
              }}
              autoFocusOnLoad={false}
              placeholderCharacter={''}
              placeholderTextColor={'#ABA7AF'}
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={{
                ...styles.underlineStyleHighLighted,
              }}
            />
          </View>
          <View
            style={{
              // height: hp(47),
              flex: 1,
              justifyContent: 'flex-end',
              paddingBottom: 30,
              marginBottom: 10,
            }}>
            {/* <CButton
                title="Send OTP"
                height={hp(6)}
                width={wp(82)}
                onPress={() => handleSendOTPCode()}
                loading={loading}
              /> */}

            <CButton
              title="VERIFY"
              height={hp(6)}
              width={wp(82)}
              onPress={() => handleVerifyCode()}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
      <View>
        <RBSheetSuccess
          refRBSheet={ref_RBSheet}
          title={'Account Verified  Successfully'}
          btnText={'OK'}
          onPress={() => {
            ref_RBSheet?.current?.close();
            // navigation?.popToTop();
            // navigation?.replace('Drawer');
            navigation.navigate('EnableLocation', {
              customer_id: route?.params?.customer_id,
            });
            
          }}
        />
      </View>
    </View>
  );
};

export default EmailVerification;
