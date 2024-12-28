import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Badge} from 'react-native-paper';
import { useSelector } from 'react-redux';

const CBadge = ({text}) => {
      const  {Colors } = useSelector(store => store.store);
  return (
    <Badge
      style={{
        color: Colors.button.primary_button_text,
        backgroundColor: Colors.button.primary_button,
      }}>
      {text}
    </Badge>
  );
};

export default CBadge;

const styles = StyleSheet.create({});
