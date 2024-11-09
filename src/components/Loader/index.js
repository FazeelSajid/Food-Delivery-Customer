import {StyleSheet, Text, View, ActivityIndicator, Modal} from 'react-native';
import React from 'react';
import {Colors} from '../../constants';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const Loader = ({loading, size, color}) => {
  return (
    <Modal visible={loading} transparent={true}>
      <View
        style={styles.container}>
        <ActivityIndicator size={size || "large"} color={color || Colors.Orange} />
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container : {
    height: hp(100),
    width: wp(100),
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
