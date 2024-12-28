import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';

const SectionSeparator = () => {
        const  {Colors } = useSelector(store => store.store)
  return (
    <View
      style={{
        height: 1,
        width: widthPercentageToDP(100),
        backgroundColor: Colors.borderGray,
      }}
    />
  );
};

export default SectionSeparator;

