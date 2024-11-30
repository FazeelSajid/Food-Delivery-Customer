import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Colors, Fonts, Icons } from '../../constants';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Svg from '../../Assets/svg/svg';
import AddButton from '../../Assets/svg/addButton.svg';
import Heart from '../../Assets/svg/heartBlack.svg';
import HeartActive from '../../Assets/svg/heartActive.svg';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, getCustomerCart, updateCartItemQuantity } from '../../utils/helpers/cartapis';
import { addItemToMYCart, setCartRestaurantId, updateMyCartList } from '../../redux/CartSlice';
import { showAlert } from '../../utils/helpers';


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

}) => {


  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: image }} style={styles.image} />

      <TouchableOpacity style={styles.heartBtn} onPress={heartPress}>
        {isFavorite ? (
          <HeartActive/>
        ) : (
          <Heart />
        )}
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
      <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">{description}</Text>

      <View style={styles.rowView}>
        {newComponent ? newComponent : <TouchableOpacity
          style={styles.floatingButton}
          activeOpacity={0.9}
          onPress={addToCart}
        >
          <AddButton width={wp(10)} height={hp(5)} />
        </TouchableOpacity>}
        <Text style={styles.price}>£ {price}</Text>
      </View>
    </TouchableOpacity>

  )
}

export default FoodCards

// const styles = StyleSheet.create({
//   container: {
//     borderWidth: 1,
//     borderColor: '#E6E7EB',
//     paddingVertical: hp(1.5),
//     paddingHorizontal: wp(3),
//     marginHorizontal: wp(2.5),
//     borderRadius: 10,
//     marginTop: hp(2),
//     flex: 1,
//     // Removing fixed height allows the container to adjust dynamically
//     overflow: 'hidden',
//   },
//   heartBtn: {
//     position: 'absolute',
//     right: wp(2),
//     top: wp(2),
//   },
//   image: {
//     width: wp(30),
//     height: hp(12),
//     resizeMode: 'cover',
//     alignSelf: 'center',
//     borderRadius: wp(2),
//     marginVertical: hp(1.3),
//   },
//   title: {
//     fontFamily: Fonts.PlusJakartaSans_Bold,
//     fontSize: RFPercentage(2.1),
//     color: Colors.Black,
//     // No truncation, the height will adjust dynamically
//   },
//   description: {
//     fontFamily: Fonts.PlusJakartaSans_Medium,
//     fontSize: RFPercentage(1.4),
//     color: Colors.Black,
//     marginVertical: hp(0.5), // Ensure some space between title and description
//   },
//   price: {
//     color: Colors.darkTextColor,
//     fontFamily: Fonts.PlusJakartaSans_Bold,
//     fontSize: RFPercentage(2.3),
//   },
//   rowView: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: hp(1), 
//     alignItems: 'center',
//     flex:1,
    
  

//   },
//   // floatingButton: {
//   //   borderRadius: 30,
//   //   alignItems: 'center',
//   //   justifyContent: 'center',
//   //   backgroundColor: Colors.Orange,
//   //   paddingVertical: wp(0.6),
//   //   paddingHorizontal: wp(2.2),
//   // },
// });
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#E6E7EB',
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
    color: Colors.Black,
  },
  description: {
    fontFamily: Fonts.PlusJakartaSans_Medium,
    fontSize: RFPercentage(1.4),
    color: Colors.Black,
    marginVertical: hp(0.5),
  },
  price: {
    color: Colors.darkTextColor,
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
    backgroundColor: '#FFFFFF', // Optional: Add background for contrast
    paddingVertical: hp(0.5), // Optional: Add padding
    borderRadius: 10, // Optional: Add rounded corners
  },
});
