import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
  } from 'react-native-responsive-screen';
import AddButton from '../../Assets/svg/addButton.svg';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors, Fonts } from '../../constants';
import { BASE_URL } from '../../utils/globalVariables';


const DealCard = ({isFavorite,  description, price, title, onPress, image, heartPress, addToCartpress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
      {/* Product Image */}
      {/* <View style={styles.imageContainer}> */}
        <Image
          source={{ uri: image}} // Add the image source URL
          style={styles.productImage}
        />
        {/* Cart Icon */}
        <TouchableOpacity style={styles.cartIconContainer} onPress={addToCartpress} >
        <AddButton width={wp(10)} height={hp(5)} />
        </TouchableOpacity>
      {/* </View> */}

      {/* Product Info */}
      <View style={{paddingHorizontal: wp(3)}} >

      <Text style={styles.productTitle}>{title}</Text>
      <Text style={styles.productSubtitle}>{description}</Text>

      {/* Price and Heart Icon */}
      <View style={styles.footer}>
        <Text style={styles.priceText}>£ {price}</Text>
        <TouchableOpacity onPress={heartPress} >
        { isFavorite ? (
                  <AntDesign name="heart" size={24} color={Colors.Orange} />
                ) : (
                  <AntDesign name="hearto" size={24} color={Colors.Orange} />
                )}
        </TouchableOpacity>
      </View>

      </View>
      
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.White,
    borderRadius: wp('3%'),
    // padding: wp('4%'s),
    marginBottom: hp('3%'),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: wp('5%'),
    shadowOffset: { width: 0, height: hp('0.5%') },
    elevation: 2,
    marginRight: wp(6)
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: wp(65),
    height: hp('23%'),
    borderRadius: wp('3%'),
    resizeMode: 'cover'
  },
  cartIconContainer: {
    position: 'absolute',
    top: hp('1.5%'),
    right: wp('2%'),
    // borderRadius: wp('10%'),
    // padding: wp('2%'),
    // alignItems: 'center',
    // backgroundColor: Colors.Orange,
    // paddingVertical: wp(0.6),
    // paddingHorizontal: wp(2.2),
  },
  productTitle: {
    fontSize: wp('5%'),
    fontFamily: Fonts.PlusJakartaSans_Bold,
    // marginTop: hp('1%'),
    color: Colors.Black,
    marginTop: hp('0.5%'),

  },
  productSubtitle: {
    fontSize: wp('3.5%'),
    color: Colors.darkTextColor,
    marginTop: hp('0.5%'),
  },
  footer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
    marginTop: hp('0.5%'),

  },
  priceText: {
    fontSize: wp('5%'),
    fontFamily: Fonts.PlusJakartaSans_Bold,
    color: Colors.darkTextColor,
    marginRight: wp(2)

  },
});

export default DealCard;
