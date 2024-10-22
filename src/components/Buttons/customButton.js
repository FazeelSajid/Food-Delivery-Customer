

import {StyleSheet, Text, View, Pressable, Image} from 'react-native';
import React, {Children} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Loader from '../Loader copy/loader';

const CustomButton = ({
  containerStyle,
  borderColor,
  onPress,
  mode,
  text,
  textStyle,
  txtColor,
  icon,
  iconSize,
  iconColor,
  pressedRadius,
  svg,
  img,
  imgStyle,
  isLoading,
  vertical,
  rightSvg,
  contentContainer,
  loaderColor
}) => {
  
  return (

    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        containerStyle,
        mode && {
          backgroundColor: 'transparent',
          borderColor: borderColor,
          borderWidth: 2,
        },
        pressed && {opacity: 0.5, borderRadius: pressedRadius},
      ]}
      disabled={isLoading}
      >
       {isLoading ?
        <Loader color={loaderColor} /> :
      icon ? (
        <>
          <Icon name={icon} size={iconSize} color={iconColor} />
          {text && <Text style={[textStyle, txtColor]}>{text}</Text>}
        </>
      ) : rightSvg ? (
        <View style={[!vertical &&{flexDirection: 'row', alignItems: 'center'},contentContainer ] } >
         {text && <Text style={[textStyle, txtColor]}>{text}</Text>}
          {rightSvg}
        </View>
      ): text && !svg && !icon  ? (
        <Text style={[textStyle, txtColor]}>{text}</Text>
      ) : svg ? (
        <View style={[!vertical &&{flexDirection: 'row', alignItems: 'center'}, ] } >
          {svg}
          {text && <Text style={[textStyle, txtColor]}>{text}</Text>}
        </View>
      ) 
      :(
        img && <Image source={img} style={imgStyle} />
      )}
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    // borderRadius: wp('3%'),
    // paddingHorizontal: wp(2)
    // padding: 8,
    // borderRadius: 4
  },
});
