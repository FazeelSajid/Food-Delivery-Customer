import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Fonts } from '../../constants';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Empty from '../../Assets/svg/Empty.svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const NoDataFound = ({ loading, text, textStyle, svgHeight }) => {
  return (
    <>
      {!loading && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {/* <Text
            style={{
              fontFamily: Fonts.PlusJakartaSans_Bold,
              color: '#0A212B',
              fontSize: RFPercentage(1.8),
              lineHeight: 30,
            }}>
            No Data Found
          </Text> */}
          <Empty height={svgHeight || hp(10)} />
          <Text style={[  styles.txtStyle, textStyle ]} >{text}</Text>
        </View>
      )}
    </>
  );
};

export default NoDataFound;

const styles = StyleSheet.create({
  txtStyle : {
    fontFamily: Fonts.PlusJakartaSans_Bold,
    color: Colors.darkTextColor,
    fontSize: RFPercentage(1.7),
    marginTop: hp(2)
    
  }
})
