import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Fonts } from '../../constants';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Empty from '../../Assets/svg/Empty.svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';

const NoDataFound = ({ loading, text, textStyle, svgHeight }) => {
    const  {Colors } = useSelector(store => store.store);
    const styles = StyleSheet.create({
      txtStyle : {
        fontFamily: Fonts.PlusJakartaSans_Bold,
        color: Colors.primary_text,
        fontSize: RFPercentage(1.7),
        marginTop: hp(2)
        
      }
    })
  return (
    <>
      {!loading && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          
          <Empty height={svgHeight || hp(10)} />
          <Text style={[  styles.txtStyle, textStyle ]} >{text}</Text>
        </View>
      )}
    </>
  );
};

export default NoDataFound;


