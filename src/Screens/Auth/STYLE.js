import {StyleSheet, Text, View, StatusBar} from 'react-native';
import React from 'react';
import {Colors, Fonts, Icons, Images} from '../../constants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFPercentage} from 'react-native-responsive-fontsize';

export default STYLE = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.secondary_color},
  authBGContainer: {position: 'relative', left: -wp(4)},
  authBGImage: {
    height: hp(30),
    width: wp(89),
    resizeMode: 'cover',
  },
  topScreenBTnContainer: {
    position: 'absolute',
    right: 20,
    top: StatusBar.currentHeight + 10,
  },
  topScreenBTn: {
    color: Colors.button.primary_button,
    fontFamily: Fonts.PlusJakartaSans_SemiBold,
    fontSize: RFPercentage(2),
  },
  heading: {
    color: Colors.primary_text,
    fontFamily: Fonts.PlusJakartaSans_SemiBold,
    fontSize: RFPercentage(3.5),
    marginBottom: hp(4),
  },
  txtForgotPassword: {
    color: Colors.button.primary_button,
    fontSize: RFPercentage(1.8),
    fontFamily: Fonts.PlusJakartaSans_SemiBold,
    textAlign: 'right',
    marginRight: wp(7),
    marginTop: -15,
  },
  orText: {
    color: Colors.secondary_text,
    fontFamily: Fonts.PlusJakartaSans_Regular,
    fontSize: RFPercentage(2),
    marginVertical: hp(5)
    // marginTop: hp(2),
  },
  socialIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(33),
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  googleIconContainer: {
    borderColor: Colors.borderGray,
    borderWidth: 1,
    width: wp(13),
    height: wp(13),
    borderRadius: wp(13) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  //

  screenTitleContainer: {paddingHorizontal: wp(3), paddingTop: hp(4)},
  screenTitle: {
    fontFamily: Fonts.PlusJakartaSans_SemiBold,
    fontSize: RFPercentage(3.2),
    color: Colors.primary_text,
    textAlign: 'center',
  },
  screenDesc: {
    color: Colors.secondary_text,
    fontFamily: Fonts.PlusJakartaSans_Regular,
    fontSize: RFPercentage(1.8),
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 10,
    marginBottom: hp(12),
  },
  signInWithGoogle:{
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(8),
    marginTop: hp(3),
    alignSelf: 'center',
    flexDirection: 'row',
    height:hp(6.2),
    width : wp(88)
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
