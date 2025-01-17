import {StyleSheet} from 'react-native';
import { Colors } from '../../../constants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Fonts } from '../../../constants';
import { RFPercentage } from 'react-native-responsive-fontsize';


export const getStyles = (Colors) =>
StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.secondary_color,
    // justifyContent: 'center',
    // paddingHorizontal: wp(10),
    // alignItems: 'center',
    paddingVertical: wp(5),
  },
  skipBtn: {
    color: Colors.primary_text,
    fontFamily: Fonts.PlusJakartaSans_Regular,
    fontSize: RFPercentage(2.3),
    alignSelf: 'flex-end',
    marginRight: wp(8)
  },
  imgContainer: {
    // justifyContent: 'center',
    // paddingTop: wp(10),
    alignItems: 'center',
  },
  text: {
    color: Colors.primary_text,
    fontSize: wp(6),
    fontFamily: Fonts.PlusJakartaSans_Bold,
    textAlign: 'center',
    lineHeight: wp(8),
    marginTop: hp(8),
    // backgroundColor : 'green',
    width: wp(100)
  },
  subHeading: {
    color: Colors.primary_text,
    fontSize: wp(3.8),
    textAlign: 'center',
    marginTop: hp(3),
    fontFamily: Fonts.PlusJakartaSans_Regular,
    
  },
  continueButtonContainer: {
    backgroundColor: Colors.button.primary_button,
    paddingVertical: wp(3),
    borderRadius: wp(6),
    
  },
  joinButtonContainer: {
    backgroundColor: 'transparent',
    paddingVertical: wp(3),
    borderRadius: wp(6),
    borderWidth: 1,
    borderColor: Colors.button.secondary_button_text,
    marginBottom: hp(2)
    
  },
  joinButtonText: {
    alignSelf: 'center',
    color: Colors.button.secondary_button_text,
    fontFamily: Fonts.medium,
    fontSize: wp(4),
  },
  continueButtonText: {
    alignSelf: 'center',
    color: Colors.button.primary_button_text,
    fontFamily: Fonts.medium,
    fontSize: wp(4),
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    // marginTop: hp(3),
  },
  dot: {
    height: wp(2),
    borderRadius: wp(2.5),
    marginHorizontal: wp(1),
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
