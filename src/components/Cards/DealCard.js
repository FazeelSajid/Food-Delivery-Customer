import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AddButton from '../../Assets/svg/addButton.svg';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors, Fonts } from '../../constants';
import Heart from '../../Assets/svg/heartBlack.svg';
import HeartActive from '../../Assets/svg/heartActive.svg';const DealCard = ({
  isFavorite,
  description,
  price,
  title,
  onPress,
  image,
  heartPress,
  addToCartpress,
  imageStyle,
  nameStyle,
  descriptionStyle,
  priceStyle,
  iconSize,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
      {/* Product Image */}
      <Image
        source={{ uri: image }}
        style={[styles.productImage, imageStyle]}
      />
      
      {/* Cart Icon */}
      <TouchableOpacity style={styles.cartIconContainer} onPress={addToCartpress}>
        <AntDesign name="plus" size={iconSize ? iconSize : 15} color={Colors.button.primary_button_text} />
      </TouchableOpacity>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={[styles.productTitle, nameStyle]}>{title}</Text>
        <Text style={[styles.productSubtitle, descriptionStyle]} ellipsizeMode="tail" numberOfLines={1}>
          {description}
        </Text>

        {/* Price and Heart Icon */}
        <View style={styles.footer}>
          <Text style={[styles.priceText, priceStyle]}>£ {price}</Text>
          <TouchableOpacity onPress={heartPress}>
            {isFavorite ? (
              // <AntDesign name="heart" size={iconSize ? iconSize : 24} color={Colors.button.primary_button} />
              <HeartActive/>
            ) : (
              // <AntDesign name="hearto" size={iconSize ? iconSize : 24} color={Colors.button.primary_button} />
              <Heart/>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.secondary_color,
    borderRadius: wp('3%'),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: wp('5%'),
    shadowOffset: { width: 0, height: hp('0.5%') },
    elevation: 2,
    margin: wp(2),
    width: wp(42), // Adjusted for a better fit
    overflow: 'hidden',
    paddingBottom: wp(2)
  },
  productImage: {
    width: '100%',
    height: hp('20%'),
    borderRadius: wp('3%'),
    resizeMode: 'cover',
  },
  cartIconContainer: {
    position: 'absolute',
    top: hp('1.5%'),
    right: wp('2%'),
    backgroundColor: Colors.button.primary_button,
    paddingHorizontal: wp(2),
    paddingVertical: wp(2),
    borderRadius: wp('50%'),
  },
  infoContainer: {
    paddingHorizontal: wp(3),
    marginTop: hp('1%'),
  },
  productTitle: {
    fontSize: wp('4.5%'),
    fontFamily: Fonts.PlusJakartaSans_Bold,
    color: Colors.primary_text,
    marginTop: hp('0.5%'),
  },
  productSubtitle: {
    fontSize: wp('3%'),
    color: Colors.secondary_text,
    marginTop: hp('0.5%'),
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  priceText: {
    fontSize: wp('4.5%'),
    fontFamily: Fonts.PlusJakartaSans_Bold,
    color: Colors.primary_text,
    marginRight: wp(2),
  },
});

export default DealCard;
