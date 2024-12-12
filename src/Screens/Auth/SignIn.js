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
import {Colors, Fonts, Icons, Images} from '../../constants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFPercentage} from 'react-native-responsive-fontsize';
import CInput from '../../components/TextInput/CInput';
import Feather from 'react-native-vector-icons/Feather';
import CButton from '../../components/Buttons/CButton';
import STYLE from './STYLE';
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
import {getUserFcmToken, handlePopup, showAlert} from '../../utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../constants/api';
import CInputWithCountryCode from '../../components/TextInput/CInputWithCountryCode';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import CRBSheetComponent from '../../components/BottomSheet/CRBSheetComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RadioButton } from 'react-native-paper';
import Google from '../../Assets/svg/Googlee.svg';
import PopUp from '../../components/Popup/PopUp';


const SignIn = ({navigation, route}) => {
  const dispatch = useDispatch();
  const btmSheetRef = useRef()
  const { signUpWith } = useSelector(store => store.store)
  const {showPopUp, popUpColor, PopUpMesage} = useSelector(store => store.store);


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

  const keyboardHeight = useKeyboard();
  const scrollViewRef = useRef();
  

  const [loading, setLoading] = useState(false);
  const [userValue, setUserValue] = useState(null);
  const [phone_no, setPhone_no] = useState('');
  const [password, setPasswords] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [countryCode, setCountryCode] = useState('+92');

  const clearFields = () => {
    setShowPass(false);
    // setUser_name('');
    setPhone_no('');
    setPasswords('');
  };

  const validate = () => {
    if (!userValue || userValue.length === 0) {
      handlePopup(dispatch, 'Please Enter email address', 'red');
      return false;
    } 
    // Check if userValue is a valid email
    const isEmail = /\S+@\S+\.\S+/.test(userValue);
    // Check if userValue is a valid phone number
    const isPhone = /^[+]?[0-9]{10,15}$/.test(userValue);
  
    if (!isEmail && !isPhone) {
      handlePopup(dispatch, 'Please enter a valid email or phone number', 'red');
      return false;
    }
  
    // Check if password is empty
    if (!password || password.length === 0) {
      handlePopup(dispatch, 'Please Enter Password', 'red');
      return false;
    }
  
    // All validations passed
    return true;
  };
  // const validate = () => {
  //   if (countryCode?.length == 0) {
  //     showAlert('Please Enter Country');
  //     return false;
  //   } else if (phone_no?.length == 0) {
  //     showAlert('Please Enter Phone No');
  //     return false;
  //   } else if (password?.length == 0) {
  //     showAlert('Please Enter Password');
  //     return false;
  //   } else {
  //     return true;
  //   }
  // };

  const handleLogin = async () => {

    if (validate()) {
    // console.log('countryCode + phone_no   :  ', countryCode + phone_no);
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9\s-]+$/;
    // console.log(emailRegex);
    
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

    // console.log(data, 'dataaa');
    

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
          // navigation?.popToTop()
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
      // Add email sign-in logic here
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
            // showAlert(response?.message);
            handlePopup(dispatch,'Invalid Credentials', 'red');
          }else if (response?.user?.trash === true) {
            handlePopup(dispatch,'Account Delete Please login with different phone', 'red');
  
          }  
          
          else {
           
            dispatch(setJoinAsGuest(false));
            // console.log(response?.user?.customer_id?.toString());
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
      // Add phone sign-in logic here
    } else {
      handlePopup(dispatch,"Invalid input. Please enter a valid email or phone number.", 'red');
      setLoading(false);
      // Optionally handle invalid input case
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
            // navigation?.popToTop()
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
      // console.log('user email : ', email, name);
      // console.log('userInfo  :   ', userInfo);
      // return;
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
        //alert('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        //alert('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        //alert('Play Services Not Available or Outdated');
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
          {/* <CInput
            placeholder="Phone Number"
            value={phone_no}
            onChangeText={text => setPhone_no(text)}
            keyboardType="numeric"
          /> */}

          {/* <CInputWithCountryCode
            phoneNo={phone_no}
            setPhoneNo={setPhone_no}
            setCountryCode={setCountryCode}
            countryCode={countryCode}
          /> */}

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
            // marginTop={hp(10)}
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
            title="Sign in with Google"
            height={hp(6.2)}
            // marginTop={hp(10)}
            transparent={true}
            width={wp(88)}
            leftIcon={<Google  />}
            borderColor={Colors.borderGray}
            color={Colors.primary_text}
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
                {/* <RadioButton color={Colors.primary_color} uncheckedColor={Colors.primary_color} status={signUpWith === 'phone' ? 'checked' : 'unchecked'} onPress={() =>toggleSelection('phone')}/> */}
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
                {/* <RadioButton color={Colors.primary_color} uncheckedColor={Colors.primary_color} status={signUpWith === 'email' ? 'checked' : 'unchecked'} onPress={() => toggleSelection('email')} /> */}
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

// const styles = StyleSheet.create({});

// import React from 'react';
// import {
//   View,
//   ImageBackground,
//   Text,
//   ScrollView,
//   Image,
//   KeyboardAvoidingView,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   StatusBar,
// } from 'react-native';

// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';

// import {RFPercentage} from 'react-native-responsive-fontsize';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Feather from 'react-native-vector-icons/Feather';

// const SignIn = ({navigation, route}) => {
//   return (
//     <KeyboardAvoidingView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.content}>
//         <StatusBar
//           backgroundColor={'transparent'}
//           barStyle={'light-content'}
//           translucent
//         />
//         <ImageBackground
//           source={require('../../Assets/png/Auth/signInbg.png')}
//           resizeMode="stretch"
//           style={styles.image}>
//           <View style={styles.mainBody}>
//             <View style={styles.header}>
//               <TouchableOpacity
//                 onPress={() => navigation?.goBack()}
//                 style={styles.backIcon}>
//                 <Ionicons name="chevron-back" size={hp(4)} color="#FFFFFF" />
//               </TouchableOpacity>
//             </View>
//             <View style={styles.textsContainer}>
//               <Text style={styles.mainText}>Food Delivery App</Text>
//               <Text style={styles.descriptionText}>
//                 Sign in to our food delivery app and {'\n'} unlock a world of
//                 culinary delights
//               </Text>
//             </View>
//             <View style={styles.inputsbuttonContainer}>
//               <View style={styles.inputsContainer}>
//                 <View
//                   style={{
//                     ...styles.inputButton,
//                     flexDirection: 'row',
//                     backgroundColor: '#FFFFFF',
//                     opacity: 0.7,
//                     marginTop: hp(4),
//                   }}>
//                   <View
//                     style={{
//                       ...styles.iconContainer,
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                     }}>
//                     <FontAwesome name="user-o" size={hp(2.3)} color="#595959" />
//                   </View>
//                   <View style={styles.inputContainer}>
//                     <TextInput
//                       style={styles.input}
//                       color="#212121"
//                       placeholder="Username"
//                       placeholderTextColor={Colors.secondary_text}
//                       // onChangeText={text => setFullName(text)}
//                       // value={fullName}
//                     />
//                   </View>
//                 </View>
//                 <View
//                   style={{
//                     ...styles.inputButton,
//                     flexDirection: 'row',
//                     backgroundColor: '#FFFFFF',
//                     opacity: 0.7,
//                     marginTop: hp(4),
//                   }}>
//                   <View
//                     style={{
//                       ...styles.iconContainer,
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                     }}>
//                     <Feather name="phone" size={hp(2.3)} color="#595959" />
//                   </View>
//                   <View style={styles.inputContainer}>
//                     <TextInput
//                       style={styles.input}
//                       color="#212121"
//                       placeholder="Phone Number"
//                       placeholderTextColor={Colors.secondary_text}
//                       keyboardType="phone-pad"
//                       // onChangeText={text => setFullName(text)}
//                       // value={fullName}
//                     />
//                   </View>
//                 </View>
//               </View>
//               <TouchableOpacity onPress={() => navigation?.navigate('Drawer')}>
//                 <View
//                   style={{
//                     ...styles.inputButton,
//                     backgroundColor: '#FF5722',
//                     marginTop: hp(4),
//                   }}>
//                   <Text style={styles.buttonText}>Sign In</Text>
//                 </View>
//               </TouchableOpacity>
//             </View>
//             <View style={styles.continueAscontainer}>
//               <View style={styles.line} />
//               <View style={styles.textContainer}>
//                 <Text style={styles.descriptionText}>or continue as</Text>
//               </View>
//               <View style={styles.line} />
//             </View>
//             <View style={styles.optionsContainer}>
//               <TouchableOpacity>
//                 <View style={styles.optionContainer}>
//                   <Image
//                     source={require('../../Assets/png/Auth/google.png')}
//                     resizeMode="contain"
//                   />
//                 </View>
//               </TouchableOpacity>
//               <TouchableOpacity>
//                 <View style={styles.optionContainer}>
//                   <Image
//                     source={require('../../Assets/png/Auth/facebook.png')}
//                     resizeMode="contain"
//                   />
//                 </View>
//               </TouchableOpacity>
//             </View>
//             <View style={styles.signUpTextContainer}>
//               <Text style={styles.descriptionText}>Don’t have an account?</Text>
//               <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
//                 <Text style={{...styles.descriptionText, color: '#FF5722'}}>
//                   {' '}
//                   Sign Up
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </ImageBackground>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   content: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   image: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   mainBody: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.45)',
//     paddingTop: hp(1),
//   },

//   header: {
//     height: hp(12),
//     justifyContent: 'center',
//     marginBottom: hp(5),
//     marginTop: hp(1),
//   },
//   backIcon: {
//     height: hp(5),
//     width: wp(8),
//     marginLeft: wp(6),
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   textsContainer: {
//     height: hp(19),
//     width: wp(100),
//     justifyContent: 'center',
//   },
//   mainText: {
//     color: '#FFFFFF',
//     fontFamily: 'PlusJakartaSans-Regular',
//     fontSize: RFPercentage(3.5),
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: hp('2'),
//     opacity: 0.9,
//   },
//   descriptionText: {
//     color: '#FFFFFF',
//     fontSize: RFPercentage(2),
//     fontFamily: 'PlusJakartaSans-Regular',
//     textAlign: 'center',
//     opacity: 0.9,
//   },
//   inputsbuttonContainer: {
//     height: hp(40),
//   },
//   inputsContainer: {
//     height: hp(25),
//   },
//   iconContainer: {
//     width: wp(10),
//     height: '100%',
//   },
//   inputContainer: {
//     width: wp(60),
//     height: '100%',
//   },
//   input: {
//     height: hp(6),
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: RFPercentage(2),
//     textAlign: 'center',
//     fontFamily: 'PlusJakartaSans-Regular',
//   },
//   inputButton: {
//     height: hp(6.5),
//     justifyContent: 'center',
//     alignSelf: 'center',
//     width: wp(83),
//     borderRadius: hp(10),
//   },
//   continueAscontainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: hp(2),
//   },
//   line: {
//     width: wp(25),
//     height: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   textContainer: {
//     paddingHorizontal: 10,
//   },
//   optionsContainer: {
//     height: hp(15),
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },
//   optionContainer: {
//     width: wp(15),
//     height: wp(15),
//     borderRadius: hp(50),
//     backgroundColor: '#FFFFFF',
//     marginHorizontal: wp(5),
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   signUpTextContainer: {
//     justifyContent: 'center',
//     flexDirection: 'row',
//   },
// });

// export default SignIn;
