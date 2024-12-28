import {
  StyleSheet,
  Text,
  View,
  ScrollView,

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
import {handlePopup} from '../../utils/helpers';
import api from '../../constants/api';
import Loader from '../../components/Loader';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setCustomerDetail} from '../../redux/AuthSlice';

const Verification_Phone = ({navigation, route}) => {
  const dispatch = useDispatch();

  const {otpConfirm, Colors} = useSelector(store => store.store);

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

  useEffect(() => {
    setTimeout(() => refOTP.current.focusField(0), 300);
  }, []);

  const handleUpdatePhoneNo = async () => {
    setLoading(true);
    let customer_id = await AsyncStorage.getItem('customer_id');

    let data = {
      customer_id: customer_id,
      phone_no: route?.params?.phone_no,
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
        console.log('response :  ', response);
        if (response?.status == true) {
          ref_RBSheet?.current?.open();
          dispatch(setCustomerDetail(response?.result));
          await AsyncStorage.setItem(
            'customer_detail',
            JSON.stringify(response?.result),
          );
          navigation.goBack();
        } else {
          show(response?.message);
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

  const validate = () => {
    if (otpCode?.length == 0 || otpCode?.length < 6) {
      Snackbar.show({
        text: 'Please Enter 6 digit OTP code',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
      return false;
    } else {
      return true;
    }
  };

  const handleVerifyCode = async () => {
    console.log('handleVerifyCode________++++++++++');
    // if (validate()) {
    // navigation.replace('ResetPassword');
    // }
    // ref_RBSheet?.current?.open();
    if (validate()) {
      try {
        setLoading(true);
        await otpConfirm
          .confirm(otpCode)
          .then(user => {
            console.log('user :  ', user);
            if (route?.params?.screen == 'checkout') {
              handleUpdatePhoneNo();
            } else {
              navigation.replace('ResetPassword', {
                phone_no: route?.params?.phone_no,
              });
            }
          })
          .catch(error => {
            const {code, message} = error;
            console.log({code, message});
            let messageText = '';
            if (code == 'auth/too-many-requests') {
              messageText =
                'We have blocked all requests from this device due to unusual activity. Try again later.';
            } else if (code == 'auth/invalid-verification-code') {
              messageText =
                'The verification code from SMS/TOTP is invalid. Please check and enter the correct verification code again.';
            } else if (code == 'auth/session-expired') {
              messageText =
                'The sms code has expired. Please re-send the verification code to try again.';
            } else {
              messageText = 'Something went wrong';
            }
            handlePopup(dispatch,messageText, 'red');
            setLoading(false);
          });
      } catch (error) {
        setLoading(false);
        handlePopup(dispatch,'Something went wrong','red');
        console.log('error : ', error);
      }
    } else {
      console.log('else called.....');
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
          handlePopup(dispatch,response?.message, 'green');
        } else {
          ref_RBSheet?.current?.open();
        }
      })
      .catch(err => {
        console.log('Error in Login :  ', err);
        handlePopup(dispatch,'Something went wrong!', 'red');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const styles = StyleSheet.create({
    inputContainer: {
      borderWidth: 1,
      borderColor: Colors.borderGray,
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
      borderColor: Colors.borderGray,
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
              To ensure the security of your account, we require phone number
              verification
            </Text>
          </View>

          <View
            style={{
              width: wp(90),
              flex: 1,
              zIndex: 999,
            }}>
            <OTPInputView
              ref={refOTP}
              style={{
                height: 50,
              }}
              pinCount={6}
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
              flex: 1,
              justifyContent: 'flex-end',
              paddingBottom: 30,
              marginBottom: 10,
            }}>
            
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
            navigation.navigate('EnableLocation');
          }}
        />
      </View>
    </View>
  );
};

export default Verification_Phone;

