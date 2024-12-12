import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Colors} from '../../constants';

const Chip = ({title, onPress, selected, icon}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: Colors.borderGray,
        backgroundColor: selected ? Colors.button.primary_button : Colors.button.secondary_button,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        flexDirection: 'row',
      }}>
      {icon && <View style={{marginRight: 5}}>{icon}</View>}
      <Text style={{color: selected ? Colors.button.primary_button_text : Colors.button.secondary_button_text}}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Chip;

const styles = StyleSheet.create({});
