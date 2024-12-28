import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {Fonts, Icons, Images} from '../../constants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFPercentage} from 'react-native-responsive-fontsize';
import CInput from '../../components/TextInput/CInput';
import Feather from 'react-native-vector-icons/Feather';
import CButton from '../../components/Buttons/CButton';
import { getStyles } from './STYLE';
import {useKeyboard} from '../../utils/UseKeyboardHook';
import {useDispatch, useSelector} from 'react-redux';
import {
  setCustomerDetail,
  setCustomerId,
  setJoinAsGuest,
  setSignUpWith,
  setPassword,
  setRestautantDetails
} from '../../redux/AuthSlice';
import {getUserFcmToken, handlePopup} from '../../utils/helpers';
import api from '../../constants/api';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import CRBSheetComponent from '../../components/BottomSheet/CRBSheetComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PopUp from '../../components/Popup/PopUp';


const SignIn = ({navigation, route}) => {
  const dispatch = useDispatch();
  const btmSheetRef = useRef()
  const {showPopUp, popUpColor, PopUpMesage, signUpWith, Colors} = useSelector(store => store.store);
  const STYLE = getStyles(Colors)


  const showBtmSheet = () => {
    btmSheetRef?.current?.open()
  }
  const closeBtmSheet = () => {
    btmSheetRef?.current?.close()
  }

  const toggleSelection = (param) => {
    if (param === 'phone'){
      signUpWith === param ? dispatch(setSignUpWith('')) : dispatch(setSignUpWith(param))
      navigation.navigate('SignUpWithPhone')
      closeBtmSheet()
    }
    if (param === 'email'){
      signUpWith === 'email' ? dispatch(setSignUpWith('')) : dispatch(setSignUpWith(param))
      navigation.navigate('SignUpWithEmail')
      closeBtmSheet()
    }
  }
  const ItemSeparator = () => (
    <View
      style={{
        height: hp(0.1),
        marginVertical: 10,
        backgroundColor: Colors.borderGray,
      }}
    />
  );

  const scrollViewRef = useRef();
  

  const [loading, setLoading] = useState(false);
  const [userValue, setUserValue] = useState(null);
  const [phone_no, setPhone_no] = useState('');
  const [password, setPasswords] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [countryCode, setCountryCode] = useState('+92');

  const clearFields = () => {
    setShowPass(false);
    setPhone_no('');
    setPasswords('');
  };

  const validate = () => {
    if (!userValue || userValue.length === 0) {
      handlePopup(dispatch, 'Please Enter email address', 'red');
      return false;
    } 
    const isEmail = /\S+@\S+\.\S+/.test(userValue);
    const isPhone = /^[+]?[0-9]{10,15}$/.test(userValue);
  
    if (!isEmail && !isPhone) {
      handlePopup(dispatch, 'Please enter a valid email or phone number', 'red');
      return false;
    }
  
    if (!password || password.length === 0) {
      handlePopup(dispatch, 'Please Enter Password', 'red');
      return false;
    }
      return true;
  };

  const handleLogin = async () => {

    if (validate()) {
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9\s-]+$/;
    
    let fcm_token = await getUserFcmToken();
    console.log({fcm_token});
    

    if (emailRegex.test(userValue)) {
      const data = {
        email: userValue.toLowerCase(),
        password: password,
       fcm_token,
        login_type: "email",
        rest_ID: "res_4074614",
    }

    

    fetch(api.login, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(async response => {
       
        if (
          response?.user?.verified == false
        ) {
          navigation.navigate('Verification',{
            response: response?.user,
            customer_id: response?.user?.customer_id,
            otp: response?.verificationCode,
            email: response?.user?.email
          })
          
          clearFields();
        } else if (response?.status == false) {
          handlePopup(dispatch,'Invalid Credentials', 'red');
        } else if (response?.user?.trash === true) {
          handlePopup(dispatch,'Account Delete Please login with different email', 'red');

        } 
        
        else {
        
          
          dispatch(setJoinAsGuest(false));
          dispatch(
            setCustomerId(response?.user?.customer_id?.toString()),
          );
          dispatch(setRestautantDetails(response?.restaurant))
          dispatch(setCustomerDetail(response?.user));
         console.log('user', data)
          dispatch(setPassword(password))
          navigation?.replace('Drawer');
          clearFields();
        }
      })
      .catch(err => {
        console.log('Error in Login :  ', err);
        handlePopup(dispatch,'Something went wrong!', 'red');
      })
      .finally(() => {
        setLoading(false);
      });
      console.log("Signing in with email:", userValue);
    } else if (phoneRegex.test(userValue)) {
      let data = {
        login_type: 'phone_no',
        phone_no: userValue,
        password: password,
        rest_ID: "res_4074614",
        fcm_token: fcm_token,
      };
      console.log(data);
      

      fetch(api.login, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(async response => {
          console.log('login response   : ', response);
          if (
            response?.user?.verified == false
          ) {
            navigation.navigate('Verification',{
              response: response?.user,
              customer_id: response?.user?.customer_id,
              otp: response?.verificationCode,
              email: response?.user?.email
            })
            
            clearFields();
          } else if (response?.status == false) {
            handlePopup(dispatch,'Invalid Credentials', 'red');
          }else if (response?.user?.trash === true) {
            handlePopup(dispatch,'Account Delete Please login with different phone', 'red');
  
          }  
          
          else {
           
            dispatch(setJoinAsGuest(false));
            dispatch(setRestautantDetails(response?.restaurant))
            dispatch(
              setCustomerId(response?.user?.customer_id?.toString()),
            );
            dispatch(setPassword(password))
            dispatch(setCustomerDetail(response?.user));
            navigation?.replace('Drawer');
            clearFields();
          }
        })
        .catch(err => {
          console.log('Error in Login :  ', err);
          handlePopup(dispatch,'Something went wrong!', 'red');
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });

      console.log("Signing in with phone number:", userValue);
    } else {
      handlePopup(dispatch,"Invalid input. Please enter a valid email or phone number.", 'red');
      setLoading(false);
    }

   
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      androidClientId:
        '293745886997-4i5fm6s806fpea20r9qq7383pdtedl65.apps.googleusercontent.com',
      iosClientId: '',
    });
  }, []);

  const updateVerificationStatus = (customer_id, otp) => {
    return new Promise((resolve, reject) => {
      let data = {
        customer_id: customer_id,
        verified: true,
        otp:otp
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
              handlePopup(dispatch, 'Something went wrong!', 'red')
          } else {
            handlePopup(dispatch, "Login Successfully", 'green')

            let wallet = await createCustomerWallet(
              response?.result?.customer_id,
            );
            console.log(wallet);
            dispatch(
              setCustomerId(response?.result?.customer_id?.toString()),
            );
            dispatch(setJoinAsGuest(false));
            dispatch(setCustomerDetail(response?.result));
            navigation?.navigate('Drawer');
            clearFields();
          }
        })
        .catch(err => {
          console.log(err);
          
            handlePopup(dispatch, 'Something went wrong!', 'red')
        });
    });
  };

  const handleGoogleSignIn = async () => {
    console.log('handleGoogleSignIn');
    try {
      await GoogleSignin.signOut();

      await GoogleSignin.hasPlayServices({
        // Check if device has Google Play Services installed
        // Always resolves to true on iOS
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      let email = userInfo?.user?.email;
      let name = userInfo?.user?.name;
      let fcm_token = await getUserFcmToken();
      if (email) {
        setLoading(true);
        let data = {
          login_type: 'google',
          email: email,
          fcm_token: fcm_token,
          rest_ID: "res_4074614"
        };
        console.log('data  :  ', data);
        fetch(api.login, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
          .then(response => response.json())
          .then(async response => {
            console.log('response : ', response);

            if (
              response?.user?.verified == false
            ) {
              updateVerificationStatus(response?.user?.customer_id,response?.verificationCode)
              dispatch(setRestautantDetails(response?.restaurant))

            } else if (response?.status == false) {
              handlePopup(dispatch,response?.message, 'red');
            setLoading(false);
            clearFields();

              // showAlert('Invalid Credentials');
            }else if (response?.user?.trash === true) {
              handlePopup(dispatch,'Account Delete Please login with different email', 'red');
    
            }  
            else {
              dispatch(setJoinAsGuest(false));
              dispatch(
                setCustomerId(response?.user?.customer_id?.toString()),
              );
              dispatch(setCustomerDetail(response?.user));
              dispatch(setRestautantDetails(response?.restaurant))
              navigation?.replace('Drawer');
              clearFields();
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
    } catch (error) {
      console.log('Error Message', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      } else {

        handlePopup(dispatch,'Something went wrong!', 'red');
      }
    }
  };

  return (
    <View style={STYLE.container}>
      <StatusBar translucent={true} backgroundColor={'transparent'} barStyle={'dark-content'} />
      {showPopUp && <PopUp color={popUpColor} message={PopUpMesage} />}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled"
        >
        <View style={STYLE.authBGContainer}>
          <Image source={Images.authBG} style={STYLE.authBGImage} />
        </View>
        <TouchableOpacity
          style={STYLE.topScreenBTnContainer}
          onPress={() => showBtmSheet()}>
          <Text style={STYLE.topScreenBTn}>Sign Up</Text>
        </TouchableOpacity>
        <View style={{alignItems: 'center'}}>
          <Text style={STYLE.heading}>Sign In </Text>

          <CInput
            placeholder="Email/Phone"
            value={userValue}
            onChangeText={text => setUserValue(text)}
          />

          <CInput
            placeholder="Password"
            value={password}
            onChangeText={text => setPasswords(text)}
            secureTextEntry={!showPass}
            rightContent={
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Feather
                  name={!showPass ? 'eye' : 'eye-off'}
                  size={20}
                  color={'#39393999'}
                />
              </TouchableOpacity>
            }
          />

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ForgotPassword');
            }}
            style={{
              width: 190,
              alignSelf: 'flex-end',
            }}>
            <Text style={STYLE.txtForgotPassword}>Forget Password?</Text>
          </TouchableOpacity>

          <CButton
            title="SIGN IN"
            height={hp(6.2)}
            marginTop={hp(5)}
            width={wp(88)}
            onPress={() => handleLogin()
            }
            loading={loading}
          />
          <CButton
            title="JOIN AS GUEST"
            height={hp(6.2)}
            transparent={true}
            width={wp(88)}
            onPress={() => {
              dispatch(setJoinAsGuest(true));
              navigation?.navigate('Drawer');
            }}
          />

          <Text style={STYLE.orText}>-- Or --</Text>
          <View style={{}} >
          <CButton
            title="Sign in with Goole"
            height={hp(6.2)}
            transparent={true}
            width={wp(88)}
            leftIcon={<Icons.Googlee  />}
            // borderColor={Colors.borderGray}
            // color={Colors.primary_text}
            onPress={() => handleGoogleSignIn()}
            style={{marginTop: 0}}
          />
          </View>
       
        </View>
        <CRBSheetComponent
          height={170}
          refRBSheet={btmSheetRef}
          content={
            <View style={{ width: wp(90) }} >
              <View style={STYLE.rowViewSB1}>
                <Text style={STYLE.rbSheetHeading}>Select an option</Text>
                <TouchableOpacity
                  onPress={() => closeBtmSheet()}>
                  <Ionicons name={'close'} size={22} color={Colors.primary_text} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={STYLE.rowView} onPress={() =>toggleSelection('phone')} >
                <Text
                  style={{
                    color: Colors.secondary_text,
                    fontFamily: Fonts.PlusJakartaSans_Regular,
                    fontSize: RFPercentage(2),
                    marginLeft: wp(4)
                  }}>
                  Phone Number
                </Text>

              </TouchableOpacity  >
              <ItemSeparator />
              <TouchableOpacity style={STYLE.rowView} onPress={() => toggleSelection('email')}>
                <Text
                  style={{
                    color: Colors.secondary_text,
                    fontFamily: Fonts.PlusJakartaSans_Regular,
                    fontSize: RFPercentage(2),
                    marginLeft: wp(4)
                  }}>
                  Email
                </Text>

              </TouchableOpacity  >
            </View>
          }

        />
      </ScrollView>
    </View>
  );
};

export default SignIn;

