import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { Fonts} from '../../constants';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {useNavigation} from '@react-navigation/native';
import PriceText from '../Text';
import { useSelector } from 'react-redux';

const OrdersCard = ({
  image,
  title,
  description,
  price,
  label,
  type,
  disabled,
}) => {
  const navigation = useNavigation();
      const  {Colors } = useSelector(store => store.store);

      const styles = StyleSheet.create({
        itemView: {
          marginVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: Colors.secondary_color,
          padding: 5,
          paddingHorizontal: 10,
          borderRadius: 10,
          overflow: 'hidden',
        },
        imageContainer: {
          width: 80,
          height: 70,
          borderRadius: 10,
          overflow: 'hidden',
        },
        image: {
          height: '100%',
          width: '100%',
          resizeMode: 'contain',
        },
        textContainer: {
          marginLeft: 10,
          flex: 1,
        },
        title: {
          fontFamily: Fonts.Inter_SemiBold,
          color: Colors.primary_text,
          fontSize: RFPercentage(1.7),
          lineHeight: 25,
        },
        nameText: {
          fontFamily: Fonts.Inter_Regular,
          color: Colors.primary_text,
          opacity: 0.6,
          fontSize: RFPercentage(1.5),
          lineHeight: 16,
        },
        ratingText: {
          fontFamily: Fonts.PlusJakartaSans_Bold,
          color: Colors.primary_text,
          fontSize: RFPercentage(2),
          lineHeight: 25,
          marginLeft: 5,
        },
        rowViewSB: {
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
          justifyContent: 'space-between',
        },
        rowView: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        labelView: {
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: Colors.primary_color,
          padding: 4,
          paddingHorizontal: 5,
          minWidth: 80,
          alignItems: 'center',
          justifyContent: 'center',
        },
        labelText: {
          color: Colors.button.primary_button_text,
          fontSize: RFPercentage(1.4),
          fontFamily: Fonts.PlusJakartaSans_Regular,
        },
      });
  
  return (
    <TouchableOpacity
      disabled={disabled ? disabled : false}
      onPress={() => navigation.navigate('OrderDetails', {type: type})}
      style={styles.itemView}>
      <ImageBackground
        source={image}
        blurRadius={40}
        style={styles.imageContainer}>
        <Image source={image} style={styles.image} />
      </ImageBackground>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.nameText}>{description}</Text>
        {/* <Text style={{...styles.title, color: Colors.primary_color}}>${price}</Text> */}
        {/* <View style={styles.rowView}>
          <Text
            style={{
              ...styles.title,
              color: Colors.primary_color,
              marginBottom: 7,
              marginRight: 3,
              fontSize: RFPercentage(1.8),
            }}>
            $
          </Text>
          <Text style={{...styles.title, color: Colors.primary_color}}>{price}</Text>
        </View> */}

        <PriceText text={price} />
      </View>
      {label && (
        <View style={styles.labelView}>
          <Text style={styles.labelText}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default OrdersCard;


