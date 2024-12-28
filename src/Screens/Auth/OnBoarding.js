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
import {  Fonts, Icons, Images } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { setJoinAsGuest, setSignUpWith } from '../../redux/AuthSlice';
import CRBSheetComponent from '../../components/BottomSheet/CRBSheetComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RadioButton } from 'react-native-paper';

const OnBoarding = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const btmSheetRef = useRef()
  const { signUpWith, Colors } = useSelector(store => store.store)

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



export default OnBoarding;
