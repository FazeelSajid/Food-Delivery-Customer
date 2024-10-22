import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Colors} from '../../constants';

const Chip = ({title, onPress, selected, icon}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: '#E6E9ED',
        backgroundColor: selected ? Colors.Orange : Colors.White,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        flexDirection: 'row',
      }}>
      {icon && <View style={{marginRight: 5}}>{icon}</View>}
      <Text style={{color: selected ? Colors.White : Colors.Text}}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Chip;

const styles = StyleSheet.create({});
