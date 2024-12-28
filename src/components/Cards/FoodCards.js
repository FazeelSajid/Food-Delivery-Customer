import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Fonts, Icons } from '../../constants';
import { RFPercentage } from 'react-native-responsive-fontsize';


import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';

const FoodCards = ({
  isFavorite,
  image,
  description,
  price,
  addToCart,
  heartPress,
  title,
  item,
  id,
  onPress,
  newComponent,
  iconSize

}) => {
    const  {Colors } = useSelector(store => store.store);

    const styles = StyleSheet.create({
      container: {
        borderWidth: 1,
        borderColor: Colors.borderGray,
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(3),
        marginHorizontal: wp(2.5),
        borderRadius: 10,
        marginTop: hp(2),
        flex: 1,
        overflow: 'hidden',
        position: 'relative', // Enable positioning for children
        paddingBottom: hp(7),
      },
      heartBtn: {
        position: 'absolute',
        right: wp(2),
        top: wp(2),
      },
      image: {
        width: wp(30),
        height: hp(12),
        resizeMode: 'cover',
        alignSelf: 'center',
        borderRadius: wp(2),
        marginVertical: hp(1.3),
      },
      title: {
        fontFamily: Fonts.PlusJakartaSans_Bold,
        fontSize: RFPercentage(2.1),
        color: Colors.primary_text,
      },
      description: {
        fontFamily: Fonts.PlusJakartaSans_Medium,
        fontSize: RFPercentage(1.6),
        color: Colors.primary_text,
        marginVertical: hp(0.5),
      },
      price: {
        color: Colors.primary_text,
        fontFamily: Fonts.PlusJakartaSans_Bold,
        fontSize: RFPercentage(2.3),
      },
      rowView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute', // Fix the row at the bottom
        bottom: hp(1), // Adjust as needed for spacing from the bottom
        left: wp(3), // Add padding from the left
        right: wp(3), // Add padding from the right
        paddingVertical: hp(0.5), // Optional: Add padding
        borderRadius: 10, // Optional: Add rounded corners
      },
      addbtn: {
        backgroundColor: Colors.button.primary_button,
        paddingHorizontal: wp(2),
        paddingVertical: wp(2),
        borderRadius: wp('50%'),
      }
    });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.image} />

      <TouchableOpacity style={styles.heartBtn} onPress={heartPress}>
        {isFavorite ? (
          <Icons.HeartActive/>
        ) : (
          <Icons.HeartB />
        )}
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
      <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">{description}</Text>

      <View style={styles.rowView}>
        {newComponent ? newComponent : <TouchableOpacity
          style={styles.addbtn}
          activeOpacity={0.9}
          onPress={addToCart}
        >
        <AntDesign name="plus" size={iconSize ? iconSize : 15} color={Colors.button.primary_button_text} />
        </TouchableOpacity>}
        <Text style={styles.price}>£ {price}</Text>
      </View>
    </TouchableOpacity>

  )
}

export default FoodCards



