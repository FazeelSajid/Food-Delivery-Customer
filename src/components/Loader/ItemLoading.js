import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import React from 'react';
import {Colors} from '../../constants';

const ItemLoading = ({loading}) => {
  return !loading ? null : (
    <ActivityIndicator size="small" color={Colors.Orange} />
  );
};

export default ItemLoading;

const styles = StyleSheet.create({});
