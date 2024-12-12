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

import {Colors, Fonts, Icons} from '../../constants';
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
import OrangeSuccessCheck from '../../Assets/svg/orangeSuccessCheck.svg';
import {setCustomerDetail, setCustomerId, setJoinAsGuest, setRestautantDetails} from '../../redux/AuthSlice';
import PopUp from '../../components/Popup/PopUp';

const Verification = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {showPopUp, popUpColor, PopUpMesage} = useSelector(store => store.store);
  const keyboardHeight = useKeyboard();
  const scrollViewRef = useRef();

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd();
  }, [keyboardHeight]);

  const ref_RBSheet = useRef();
  const refOTP = useRef();
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [confirmResult, setConfirmResult] = useState(null);

  const otp = route?.params?.otp?.toString()
  const email = route?.params?.email,
  customer_id =route?.params?.customer_id

  const validate = () => {
    console.log(otpCode, 'route :' ,  otp, email, customer_id);

    
    if (otpCode?.length == 0 || otpCode?.length < 4) {
      handlePopup(dispatch, 'Please Enter 4 digit OTP code', 'red')
      return false;
    } else if (otpCode !== otp){
      handlePopup(dispatch,'Incorrect OP code')
    } 
    else {
      return true;
    }
  };

  // const handleSendOTPCode = () => {
  //   console.log('phone to send code : ', route?.params?.phone_no);
  //   if (route?.params?.phone_no) {
  //     setLoader(true);
  //     firebase
  //       .auth()
  //       .signInWithPhoneNumber(route?.params?.phone_no)
  //       .then(response => {
  //         console.log('confirmResult  :  ', response);
  //         setConfirmResult(response);
  //         setTimeout(() => refOTP.current.focusField(0), 250);
  //       })
  //       .catch(error => {
  //         showAlert(error.message);
  //         console.log(error,'error');
  //       })
  //       .finally(() => setLoader(false));
  //   }
  // };

  // const handleVerifyCode = async () => {
  //   console.log('handleVerifyCode________++++++++++');
  //   // if (validate()) {
  //   // navigation.replace('ResetPassword');
  //   // }
  //   // ref_RBSheet?.current?.open();
  //   if (validate()) {
  //     try {
  //       setLoading(true);
  //       await confirmResult
  //         .confirm(otpCode)
  //         .then(user => {
  //           console.log('user :  ', user);
  //           //
  //           if (route?.params?.phone_no == '+11234567890') {
  //             ref_RBSheet?.current?.open();
  //           } else {
  //             updateVerificationStatus();
  //           }
  //         })
  //         .catch(error => {
  //           const {code, message} = error;
  //           console.log({code, message});
  //           let messageText = '';
  //           if (code == 'auth/too-many-requests') {
  //             messageText =
  //               'We have blocked all requests from this device due to unusual activity. Try again later.';
  //           } else if (code == 'auth/invalid-verification-code') {
  //             messageText =
  //               'The verification code from SMS/TOTP is invalid. Please check and enter the correct verification code again.';
  //           } else if (code == 'auth/session-expired') {
  //             messageText =
  //               'The sms code has expired. Please re-send the verification code to try again.';
  //           } else {
  //             messageText = 'Something went wrong';
  //           }
  //           showAlertLongLength(messageText, 'red', 3);
  //           setLoading(false);
  //         });
  //     } catch (error) {
  //       setLoading(false);
  //       showAlert('Something went wrong');
  //       console.log('error : ', error);
  //     }
  //   } else {
  //     console.log('else called.....');
  //   }
  // };

  const updateVerificationStatus = () => {
    if (validate()) {
      
  
    let prevResponse = route?.params?.response;
    let data = {
      customer_id: customer_id,
      verified: true,
      otp: otpCode
    };

    // console.log('data  :  ', data);
    fetch(api.update_verification_status, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(async response => {
        // console.log('response  :  ', response); 
        if (response?.status == false) {
          // showAlert(response?.message);
          handlePopup(dispatch, response?.message, 'red')
          // showAlert('Invalid Credentials');
        } else {
          // showAlert(response.message, 'green');
          ref_RBSheet?.current?.open();
          dispatch(setJoinAsGuest(false));
          
          dispatch(
            setCustomerId(customer_id,),
          );
          dispatch(setCustomerDetail(prevResponse?.user));
          dispatch(setRestautantDetails(prevResponse?.restautant))
        }
      })
      .catch(err => {
        console.log('Error in Login :  ', err);
        // showAlert('Something went wrong!');
        handlePopup(dispatch, 'Something went wrong!', 'red')

      })
      .finally(() => {
        setLoading(false);
      });
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      {showPopUp && <PopUp color={popUpColor} message={PopUpMesage} />}
      <StackHeader title={''} backIconColor={'#1D1D20'} />
      <Loader loading={loader} />
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
              keyboardAppearance='default'
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
              onPress={() => updateVerificationStatus()}
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
          svg={<OrangeSuccessCheck/>}
          onPress={() => {
            ref_RBSheet?.current?.close();
            // navigation?.popToTop();
            navigation?.replace('Drawer');
            // navigation.navigate('EnableLocation', {
            //   customer_id: route?.params?.customer_id,
            // });
          }
        }
        />
      </View>
    </View>
  );
};

export default Verification;

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
    color: Colors.Text,
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
