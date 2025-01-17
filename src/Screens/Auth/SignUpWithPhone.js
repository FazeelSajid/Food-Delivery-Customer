import {
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { Icons, Images } from '../../constants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CInput from '../../components/TextInput/CInput';
import Feather from 'react-native-vector-icons/Feather';
import CButton from '../../components/Buttons/CButton';
import { getStyles } from './STYLE';
import {
  setCustomerDetail,
  setCustomerId,
  setJoinAsGuest,
  setRestautantDetails,
} from '../../redux/AuthSlice';
import api from '../../constants/api';
import { getUserFcmToken, handlePopup } from '../../utils/helpers';
import CInputWithCountryCode from '../../components/TextInput/CInputWithCountryCode';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useDispatch, useSelector } from 'react-redux';
import PopUp from '../../components/Popup/PopUp';

const SignUpWithPhone = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { showPopUp, popUpColor, PopUpMesage, Colors } = useSelector(store => store.store);
  const scrollViewRef = useRef();
  const [userName, setUserName] = useState('');
  const STYLE = getStyles(Colors)
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [phone_no, setPhone_no] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+92');

  const createCustomerWallet = async customer_id => {
    return new Promise(async (resolve, reject) => {
      fetch(api.create_customer_wallet, {
        method: 'POST',
        body: JSON.stringify({
          customer_id: customer_id,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(async response => {
          resolve(response);
        })
        .catch(err => {
          resolve(false);
        });
    });
  };

  const clearFields = () => {
    setShowPass(false);
    setUserEmail('');
    setPhone_no('');
    setPassword('');
    setUserName('');
  };

  const validate = () => {
    // Email Validation
    if (userEmail || userEmail.length > 0) {
      if (!/\S+@\S+\.\S+/.test(userEmail)) {
        handlePopup(dispatch, 'Please Enter a valid email address', 'red')
        return false;
      }
    }

    // Country Code Validation
    if (!countryCode || countryCode.length === 0) {
      handlePopup(dispatch, 'Please Enter Country', 'red');
      return false;
    }

    // Password Validation
    if (!password || password.length === 0) {
      handlePopup(dispatch, 'Please Enter Password', 'red')
      return false;
    } else if (password.length < 8) {
      handlePopup(dispatch, 'Password must be at least 8 characters long', 'red')
      return false;
    } else if (!/[A-Z]/.test(password)) {
      handlePopup(dispatch, 'Password must include at least one uppercase letter', 'red')
      return false;
    } else if (!/[a-z]/.test(password)) {
      handlePopup(dispatch, 'Password must include at least one lowercase letter', 'red')
      return false;
    } else if (!/\d/.test(password)) {
      handlePopup(dispatch, 'Password must include at least one number', 'red')
      return false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      handlePopup(dispatch, 'Password must include at least one special character', 'red')
      return false;
    }

    // Username Validation
    if (!userName || userName.length === 0) {
      handlePopup(dispatch, 'Please Enter username', 'red')
      return false;
    } else if (userName.length < 3) {
      handlePopup(dispatch, 'Username must be at least 3 characters long', 'red')
      return false;
    }

    if (!phone_no || phone_no.length === 0) {
      handlePopup(dispatch, 'Please Enter phone number', 'red')
      return false;
    } else if (!/^\d{10,15}$/.test(phone_no)) {
      handlePopup(dispatch, 'Please Enter a valid phone number (10-15 digits)', 'red')
      return false;
    }

    return true;
  };




  const handleSignUp = async () => {
    if (validate()) {
      setLoading(true);
      let fcm_token = await getUserFcmToken();

      let data = {
        user_name: userName,
        email: userEmail,
        password: password,
        signup_type: "phone_no",
        phone_no: countryCode + phone_no,
        fcm_token: fcm_token,
        rest_ID: "res_4074614",
      };
      console.log('data  :  ', data);

      fetch(api.register, {
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
            handlePopup(dispatch, response?.message, 'red')
          } else {
            handlePopup(dispatch, response?.message, 'green')
            let wallet = await createCustomerWallet(
              response?.result?.customer_id,
            );
            console.log(wallet);
            dispatch(
              setCustomerId(response?.result?.customer_id?.toString()),
            );
            dispatch(setCustomerDetail(response?.result));
            navigation?.navigate('Drawer');
            clearFields();
          }
        })
        .catch(err => {
          console.log('Error in Login :  ', err);
          handlePopup(dispatch, 'Something went wrong!', 'red')
        })
        .finally(() => {
          setLoading(false);
        });
    }
    // }
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
        otp: otp
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
            handlePopup(dispatch, response.message, 'green')

            let wallet = await createCustomerWallet(
              response?.result?.customer_id,
            );
            console.log(wallet);
            dispatch(
              setCustomerId(response?.result?.customer_id?.toString()),
            );
            dispatch(setJoinAsGuest(false));
            dispatch(setCustomerDetail(response?.result));
            dispatch(setRestautantDetails(response?.restaurant))
            navigation?.navigate('Drawer');
            clearFields();
          }
        })
        .catch(err => {
          handlePopup(dispatch, 'Something went wrong!', 'red')
        });
    });
  };

  const handleGoogleSignUp = async () => {
    console.log('handleGoogleSignIn');
    try {
      await GoogleSignin.signOut();

      await GoogleSignin.hasPlayServices({
        // Check if device has Google Play Services installed
        // Always resolves to true on iOS
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      let user_email = userInfo?.user?.email;
      let user_name = userInfo?.user?.name;

      console.log('user email : ', user_email, user_name);
      let fcm_token = await getUserFcmToken();
      if (user_email) {
        setLoading(true);
        let data = {
          signup_type: 'email',
          email: user_email,
          user_name: user_name,
          fcm_token: fcm_token,
          signup_type: "google",
          rest_ID: "res_4074614",
        };
        console.log('data  :  ', data);

        fetch(api.register, {
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
              handlePopup(dispatch, response?.message, 'red')
            } else if (response.result.verified === false) {

              updateVerificationStatus(response?.result?.customer_id, response.verifyCode)
              dispatch(setRestautantDetails(response?.restaurant))
            }

            else {
              handlePopup(dispatch, response.message, 'green')

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
            console.log('Error in Login :  ', err);
            handlePopup(dispatch, 'Something went wrong!', 'red')

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
        handlePopup(dispatch, 'Something went wrong!', 'red')

      }
    }
  };

  return (
    <View style={STYLE.container}>
      <StatusBar translucent={true} backgroundColor={'transparent'} />
      {showPopUp && <PopUp color={popUpColor} message={PopUpMesage} />}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled">
        <View style={STYLE.authBGContainer}>
          <Image source={Images.authBG} style={STYLE.authBGImage} />
        </View>
        <TouchableOpacity
          style={STYLE.topScreenBTnContainer}
          onPress={() => navigation.navigate('SignIn')}>
          <Text style={STYLE.topScreenBTn}>Sign In</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={STYLE.heading}>Sign Up </Text>

          <CInput
            placeholder="Username"
            value={userName}
            onChangeText={text => setUserName(text)}
          />
          <CInputWithCountryCode
            phoneNo={phone_no}
            setPhoneNo={setPhone_no}
            setCountryCode={setCountryCode}
            countryCode={countryCode}
            placeholder={'Phone Number'}
          />
          <CInput
            placeholder="Email Address (optional)"
            value={userEmail}
            onChangeText={text => setUserEmail(text)}
          />


          <CInput
            placeholder="Password"
            value={password}
            secureTextEntry={!showPass}
            onChangeText={text => setPassword(text)}
            rightContent={
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Feather
                  name={!showPass ? 'eye' : 'eye-off'}
                  size={20}
                  color={Colors.secondary_text}
                />
              </TouchableOpacity>
            }
          />

          <CButton
            title="SIGN UP"
            height={hp(6.2)}
            marginTop={hp(5)}
            width={wp(88)}
            onPress={() => handleSignUp()}
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
          <View style={{ paddingBottom: 20 }} >
            <CButton
              title="Sign in with Google"
              height={hp(6.2)}
              transparent={true}
              width={wp(88)}
              leftIcon={<Icons.Googlee />}
              onPress={() => handleGoogleSignUp()}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUpWithPhone;
