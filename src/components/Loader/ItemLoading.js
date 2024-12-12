import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import React from 'react';
import {Colors} from '../../constants';

const ItemLoading = ({loading, size, color}) => {
  return loading && <ActivityIndicator size={size || "small"} color={color || Colors.primary_color} />
  
};

export default ItemLoading;

const styles = StyleSheet.create({});
