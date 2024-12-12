import React, { useRef } from 'react';
import {
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import CButton from '../../components/Buttons/CButton';
import { Colors, Fonts, Icons, Images } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { setJoinAsGuest, setSignUpWith } from '../../redux/AuthSlice';
import CRBSheetComponent from '../../components/BottomSheet/CRBSheetComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RadioButton } from 'react-native-paper';

const OnBoarding = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const btmSheetRef = useRef()
  const { signUpWith } = useSelector(store => store.store)

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
  return (
    <View style={styles.container}  >
      <StatusBar backgroundColor={Colors.secondary_color} barStyle={'dark-content'} />
      <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image
          source={Images.onboardingLogo}
          style={{
            height: hp(30),
            width: wp(80),
            resizeMode: 'contain',
            marginBottom: hp(3),
          }}
        />
        <Text
          style={{
            color: Colors.primary_text,
            fontFamily: Fonts.PlusJakartaSans_SemiBold,
            fontSize: RFPercentage(3),
            width: wp(60),
            textAlign: 'center',
            textTransform: 'capitalize',
            marginVertical: 10,
          }}>
          Order your favorite food delivery
        </Text>
        <Text
          style={{
            textAlign: 'center',
            color: Colors.primary_text,
            fontFamily: Fonts.PlusJakartaSans_Medium,
            width: wp(80),
            lineHeight: 20,
            fontSize: RFPercentage(1.8),
            textTransform: 'capitalize',
          }}>
          Browse an extensive menu featuring mouthwatering dishes from local
          restaurants.
        </Text>
        {/* <CButton
          title="GET STARTED"
          height={hp(6.2)}
          marginTop={hp(15)}
          width={wp(85)}
          onPress={() => navigation.navigate('SignIn')}
        /> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            width: wp(95),
            justifyContent: 'space-between',
          }}>
          <CButton
            title="SIGN IN"
            // height={hp(5.5)}
            marginTop={hp(15)}
            width={wp(38)}
            onPress={() => navigation.navigate('SignIn')}
          />
          <CButton
            title="SIGN UP"
            // height={hp(5.7)}
            marginTop={hp(15)}
            width={wp(38)}
            onPress={() => showBtmSheet()}
          />
        </View>
        <CButton
          title="JOIN AS GUEST"
          width={wp(85)}
          // height={hp(6)}
          transparent={true}
          onPress={() => {
            dispatch(setJoinAsGuest(true));
            navigation?.navigate('Drawer');
          }}
        />
        


      </View>
      <CRBSheetComponent
          height={170}
          refRBSheet={btmSheetRef}
          content={
            <View style={{ width: wp(90) }} >
              <View style={styles.rowViewSB1}>
                <Text style={styles.rbSheetHeading}>Select an option</Text>
                <TouchableOpacity
                  onPress={() => closeBtmSheet()}>
                  <Ionicons name={'close'} size={22} color={'#1E2022'} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.rowView} onPress={() =>toggleSelection('phone')} >
                <RadioButton color={Colors.button.primary_button} uncheckedColor={Colors.button.primary_button} status={signUpWith === 'phone' ? 'checked' : 'unchecked'} onPress={() =>toggleSelection('phone')}/>
                <Text
                  style={{
                    color: Colors.secondary_text,
                    fontFamily: Fonts.PlusJakartaSans_Regular,
                    marginTop: -2,
                    fontSize: RFPercentage(2),
                  }}>
                  Phone Number
                </Text>

              </TouchableOpacity  >
              <ItemSeparator />
              <TouchableOpacity style={styles.rowView} onPress={() => toggleSelection('email')}>
                <RadioButton color={Colors.button.primary_button} uncheckedColor={Colors.button.primary_button} status={signUpWith === 'email' ? 'checked' : 'unchecked'} onPress={() => toggleSelection('email')} />
                <Text
                  style={{
                    color: Colors.primary_text,
                    fontFamily: Fonts.PlusJakartaSans_Regular,
                    marginTop: -2,
                    fontSize: RFPercentage(2),
                  }}>
                  Email
                </Text>

              </TouchableOpacity  >
            </View>
          }

        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary_color,
  },
  image: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    // paddingTop:hp("20%"),
  },
  // mainBody: {
  //   flex: 1,
  //   backgroundColor: 'rgba(0, 0, 0, 0.45)',
  // },
  // textsContainer: {
  //   flex: 7.5,
  //   width: wp(100),
  //   // borderWidth:2,
  //   justifyContent: 'center',
  // },
  // mainText: {
  //   color: Colors.secondary_color,
  //   fontFamily: 'PlusJakartaSans-Regular',
  //   fontSize: RFPercentage(3.5),
  //   //lineHeight: 84,
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  //   marginBottom: hp('2'),
  // },
  // descriptionText: {
  //   color: Colors.secondary_color,
  //   fontSize: RFPercentage(2),
  //   fontFamily: 'PlusJakartaSans-Regular',
  //   textAlign: 'center',
  // },
  // buttonsContainer: {
  //   flex: 3,
  //   //paddingHorizontal:wp(2),
  //   //borderWidth:1,
  //   //  justifyContent:"center"
  // },
  // signInsignUpContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-evenly',
  //   // height:hp(7),
  //   marginBottom: hp(5),
  //   // borderWidth:1,
  // },
  // signInsignUpButton: {
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   width: wp(38),
  //   height: hp(7),
  //   borderRadius: hp(10),
  //   backgroundColor: '#FF5722',
  //   //borderWidth:1,
  // },
  // buttonText: {
  //   color: Colors.secondary_color,
  //   fontSize: RFPercentage(2),
  //   textAlign: 'center',
  //   fontFamily: 'PlusJakartaSans-Regular',
  // },
  // joinAsGuestButton: {
  //   height: hp(7),
  //   justifyContent: 'center',
  //   alignSelf: 'center',
  //   width: wp(83),
  //   borderRadius: hp(10),
  //   borderColor: '#FFFFFF',
  //   borderWidth: 1,
  // },
  rbSheetHeading: {
    color: Colors.primary_text,
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(2),
  },
  rowViewSB1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default OnBoarding;

// import React from 'react';
// import {
//   View,
//   ImageBackground,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   StatusBar,
// } from 'react-native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import {RFPercentage} from 'react-native-responsive-fontsize';
// import CButton from '../../components/Buttons/CButton';

// const OnBoarding = props => {
//   return (
//     <View style={styles.container}>
//       <StatusBar
//         backgroundColor={'transparent'}
//         barStyle={'light-content'}
//         translucent
//       />
//       <ImageBackground
//         source={require('../../Assets/png/Auth/onboarding.png')}
//         resizeMode="cover"
//         style={styles.image}>
//         <View style={styles.mainBody}>
//           <View style={styles.textsContainer}>
//             <Text style={styles.mainText}>Food Delivery App</Text>
//             <Text style={styles.descriptionText}>
//               Welcome to our food delivery app, where {'\n'}
//               deliciousness is just a tap away! Browse {'\n'}
//               an extensive menu featuring mouthwatering {'\n'}
//               dishes from local restaurants.
//             </Text>
//           </View>
//           <View style={styles.buttonsContainer}>
//             <View style={styles.signInsignUpContainer}>
//               <CButton
//                 title="Sign In"
//                 width={wp(36.5)}
//                 height={47}
//                 onPress={() => props.navigation.navigate('SignIn')}
//               />
//               <CButton
//                 title="Sign Up"
//                 width={wp(36.5)}
//                 height={47}
//                 onPress={() => props.navigation.navigate('SignUp')}
//               />
//             </View>
//             <TouchableOpacity
//               onPress={() => props?.navigation?.navigate('Drawer')}>
//               <View style={styles.joinAsGuestButton}>
//                 <Text style={styles.buttonText}>Join as a Guest</Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ImageBackground>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   image: {
//     flex: 1,
//     // justifyContent: 'center',
//     alignItems: 'center',
//     // paddingTop:hp("20%"),
//   },
//   mainBody: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.45)',
//   },
//   textsContainer: {
//     flex: 7.5,
//     width: wp(100),
//     // borderWidth:2,
//     justifyContent: 'center',
//   },
//   mainText: {
//     color: '#FFFFFF',
//     fontFamily: 'PlusJakartaSans-Regular',
//     fontSize: RFPercentage(3.5),
//     //lineHeight: 84,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: hp('2'),
//   },
//   descriptionText: {
//     color: '#FFFFFF',
//     fontSize: RFPercentage(2),
//     fontFamily: 'PlusJakartaSans-Regular',
//     textAlign: 'center',
//     opacity: 0.9,
//   },
//   buttonsContainer: {
//     flex: 3,
//     //paddingHorizontal:wp(2),
//     //borderWidth:1,
//     //  justifyContent:"center"
//   },
//   signInsignUpContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//     // height:hp(7),
//     marginBottom: hp(5),
//     // borderWidth:1,
//   },

//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: RFPercentage(2),
//     textAlign: 'center',
//     fontFamily: 'PlusJakartaSans-Regular',
//   },
//   joinAsGuestButton: {
//     height: hp(7),
//     justifyContent: 'center',
//     alignSelf: 'center',
//     width: wp(83),
//     borderRadius: hp(10),
//     borderColor: '#FFFFFF',
//     borderWidth: 1,
//   },
// });

// export default OnBoarding;
