import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
const ItemSeparator = ({width, style}) => {
        const  {Colors } = useSelector(store => store.store)
  return(
    <View
    style={{
      height: hp(0.15),
      marginVertical: 15,
      backgroundColor: Colors.borderGray,
      width: width ? width : wp(90),
      alignSelf: 'center',
      ...style,
    }}
  />
  )
}

 


export default ItemSeparator;

const styles = StyleSheet.create({});
