import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import {  Fonts, Icons, Images } from '../../constants';
import StackHeader from '../../components/Header/StackHeader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CButton from '../../components/Buttons/CButton';
import STYLE from './STYLE';
import Feather from 'react-native-vector-icons/Feather';
import CInput from '../../components/TextInput/CInput';
import RBSheetSuccess from '../../components/BottomSheet/RBSheetSuccess';
import { useKeyboard } from '../../utils/UseKeyboardHook';
import { handlePopup } from '../../utils/helpers';
import api from '../../constants/api';
import OrangeSuccessCheck from '../../Assets/svg/orangeSuccessCheck.svg';
import { useDispatch, useSelector } from 'react-redux';
import PopUp from '../../components/Popup/PopUp';


const ResetPassword = ({ navigation, route }) => {
  const keyboardHeight = useKeyboard();
    const { Colors } = useSelector(store => store.store)
  const scrollViewRef = useRef();
  const {showPopUp, popUpColor, PopUpMesage} = useSelector(store => store.store);
  const email = route?.params?.email
  const dispatch = useDispatch()
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd();
  }, [keyboardHeight]);

  const ref_RBSheet = useRef();
  const [showNewPass, setShowNewPass] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function validatePassword(password) {
    // Regular expression pattern to match passwords
    const passwordPattern =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // Test if the password matches the pattern
    return passwordPattern.test(password);
  }

  const validate = () => {
    if (!validatePassword(password)) {
      handlePopup(
        dispatch,
        'Your password must be at least 8 characters long and contain a combination of letters, numbers, and special characters',
        'red'
      );
      return false;
    } else if (!validatePassword(confirmPassword)) {
      handlePopup(
        dispatch,
        'Your confirm password must be at least 8 characters long and contain a combination of letters, numbers, and special characters',
        'red',
      );
      return false;
    } else if (password != confirmPassword) {
      handlePopup(dispatch, 'Password and confirm password not matched', 'red');
      return false;
    } else {
      return true;
    }
  };

  const handleUpdatePassword = () => {
    if (validate()) {
      const data = {
        email: email,
        newPassword: password,
      }
      console.log(data);

      setLoading(true);
      fetch(api.update_password, {
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
            handlePopup(dispatch, response?.message, 'red');
          } else {
            ref_RBSheet?.current?.open();
          }
        })
        .catch(err => {
          console.log('Error in Login :  ', err);
          handlePopup(dispatch,'Something went wrong', 'red');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.secondary_color }}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled">
        <StackHeader title={''} backIconColor={'#1D1D20'} />
        {showPopUp && <PopUp color={popUpColor} message={PopUpMesage} />}

        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            alignItems: 'center',
          }}>
          <View style={STYLE.screenTitleContainer}>
            <Text style={STYLE.screenTitle}>Reset Password</Text>
            <Text style={STYLE.screenDesc}>
              Your password must be at least 8 characters long and contain a
              combination of letters, numbers, and special characters.on
            </Text>
          </View>
          <CInput
            placeholder="Password"
            secureTextEntry={!showNewPass}
            value={password}
            onChangeText={text => setPassword(text)}
            width={wp(85)}
            rightContent={
              <TouchableOpacity onPress={() => setShowNewPass(!showNewPass)}>
                <Feather
                  name={!showNewPass ? 'eye' : 'eye-off'}
                  size={20}
                  color={'#39393999'}
                />
              </TouchableOpacity>
            }
          />
          <CInput
            placeholder="Confirm Password"
            secureTextEntry={!showOldPass}
            value={confirmPassword}
            onChangeText={text => setConfirmPassword(text)}
            width={wp(85)}
            rightContent={
              <TouchableOpacity onPress={() => setShowOldPass(!showOldPass)}>
                <Feather
                  name={!showOldPass ? 'eye' : 'eye-off'}
                  size={20}
                  color={'#39393999'}
                />
              </TouchableOpacity>
            }
          />
          <View
            style={{
              // height: hp(36),
              flex: 1,
              justifyContent: 'flex-end',
              paddingBottom: 40,
            }}>
            <CButton
              title="UPDATE"
              height={hp(6)}
              width={wp(82)}
              // onPress={() => ref_RBSheet?.current?.open()}
              loading={loading}
              onPress={() => handleUpdatePassword()}
            />
          </View>
          <View style={{ height: hp(3) }} />
        </View>
      </ScrollView>
{/* 
     <CRBSheetComponent
          refRBSheet={ref_RBSheet}
          content={
            <View style={{width: wp(87), alignItems: 'center'}}>
              <View
                style={{
                  height: 150,
                  width: 150,
                  marginBottom: 10,
                  //   aspectRatio: 1,
                }}>
                <Lottie
                  source={Images.success_check}
                  autoPlay
                  loop={true}
                  resizeMode="cover"
                />
              </View>
              <Text
                style={{
                  color: '#1D1D20',
                  fontSize: RFPercentage(2.5),
                  fontFamily: Fonts.PlusJakartaSans_SemiBold,
                }}>
                Password Reset Successfully
              </Text>
              <CButton
                title="GO TO SIGN IN"
                width={wp(85)}
                height={hp(6)}
                marginTop={hp(5)}
                onPress={() => {
                  ref_RBSheet?.current?.close();
                  navigation.replace('SignIn');
                }}
              />
            </View>
          }
        />  */}
      <View>
        <RBSheetSuccess
          refRBSheet={ref_RBSheet}
          title={'Password Reset Successfully'}
          btnText={'GO TO SIGN IN'}
          svg={<OrangeSuccessCheck />}
          onPress={() => {
            ref_RBSheet?.current?.close();
            navigation?.popToTop();
            navigation.replace('SignIn');
          }}
        />
      </View>
    </View>
  );
};

export default ResetPassword;

