import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Fonts } from '../../constants';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useSelector } from 'react-redux';

const CInput = props => {
  const { Colors } = useSelector(store => store.store)
  return (
    <View style={{ width: wp(90), alignSelf: 'center' }}>
      {props?.heading && (
        <Text
          style={{
            color: Colors.primary_text,
            fontFamily: Fonts.PlusJakartaSans_Medium,
            fontSize: RFPercentage(1.8),
            marginHorizontal: 10,
            marginBottom: 14,
            ...props.headingStyle,
          }}>
          {props?.heading}
        </Text>

      )}

      <TouchableOpacity
        onPress={props?.onPress}
        disabled={props?.disabled == false ? false : true}
        style={[props?.containerStyle, {
          borderRadius: 25,
          width: props?.width ? props?.width : wp(90),
          alignSelf: 'center',
          // borderWidth: 1,
          // borderColor: '#DADADA',
          paddingHorizontal: 15,
          marginBottom: 20,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: props?.backgroundColor
            ? props?.backgroundColor
            : `${Colors.secondary_text}12`,
          ...props?.containerStyle,
        }]}>
        <TouchableOpacity>{props?.leftContent}</TouchableOpacity>
        <TextInput
          {...props}
          // value=''
          // onChangeText={(text)=> }
          // placeholder=''
          // multiline
          // numberOfLines={}
          // textAlignVertical=''
          // keyboardType='numeric'
          // secureTextEntry
          // placeholder=''
          placeholderTextColor={
            props?.placeholderTextColor
              ? props?.placeholderTextColor
              : Colors.secondary_text
          }
          style={{
            color: Colors.primary_text,
            flex: 1,
            // backgroundColor: 'green',
            fontFamily: Fonts.PlusJakartaSans_Regular,
          }}
        />

        <TouchableOpacity>{props?.rightContent}</TouchableOpacity>

        
      </TouchableOpacity>
    </View>
  );
};

export default CInput;

const styles = StyleSheet.create({});

