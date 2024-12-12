import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../../constants';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';

const FoodCard = ({
  image,
  title,
  description,
  price,
  onPress,
  imageContainerStyle,
  disabled,
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled == false ? false : true}
      style={styles.card1}>
      {image && (
        <>
          <ImageBackground
            // source={image}
            source={{uri: image}}
            style={{...styles.imageContainer, ...imageContainerStyle}}
            blurRadius={40}>
            <Image
              // source={image}
              source={{uri: image}}
              style={styles.image}
            />
          </ImageBackground>
        </>
      )}

      <View style={styles.textContainer}>
        {title && <Text style={styles.title}>{title}</Text>}
        {description && <Text style={styles.description}>{description}</Text>}
        {price && <Text style={styles.price}>{price}</Text>}
      </View>
    </TouchableOpacity>
  );
};

export default FoodCard;

const styles = StyleSheet.create({
  card1: {
    borderWidth: 1,
    borderColor: Colors.secondary_color,
    // height: hp(23),
    paddingVertical: 7,
    flex: 0.47,
    borderRadius: hp(3),
    alignItems: 'center',
  },
  textContainer: {
    justifyContent: 'center',
    marginTop: 6,
    alignItems: 'center',
  },
  imageContainer: {
    width: hp(17),
    height: hp(11),
    borderRadius: 15,
    overflow: 'hidden',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    fontFamily: Fonts.PlusJakartaSans_Bold,
    color: Colors.primary_text,
    fontSize: RFPercentage(1.5),
    lineHeight: 30,
  },
  description: {
    fontFamily: Fonts.PlusJakartaSans_Medium,
    color: Colors.primary_color,
    fontSize: RFPercentage(1.5),
  },
  price: {
    fontFamily: Fonts.PlusJakartaSans_Bold,
    color: Colors.primary_text,
    fontSize: RFPercentage(2.5),
  },
});
