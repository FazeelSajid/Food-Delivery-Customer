import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import { Colors } from '../../constants';

const SectionSeparator = () => {
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

const styles = StyleSheet.create({});
