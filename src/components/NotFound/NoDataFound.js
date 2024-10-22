import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Fonts} from '../../constants';
import {RFPercentage} from 'react-native-responsive-fontsize';

const NoDataFound = ({loading}) => {
  return (
    <>
      {!loading && (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              fontFamily: Fonts.PlusJakartaSans_Bold,
              color: '#0A212B',
              fontSize: RFPercentage(1.8),
              lineHeight: 30,
            }}>
            No Data Found
          </Text>
        </View>
      )}
    </>
  );
};

export default NoDataFound;
