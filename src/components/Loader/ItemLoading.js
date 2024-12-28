import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';

const ItemLoading = ({loading, size, color}) => {
    const  {Colors } = useSelector(store => store.store);
  
  return loading && <ActivityIndicator size={size || "small"} color={color || Colors.primary_color} />
  
};

export default ItemLoading;

