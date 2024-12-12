import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Colors, Fonts, Icons} from '../../constants';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
const RestaurantCard = ({
  image,
  title,
  description,
  price,
  onPress,
  imageHeight,
  disabled,
  imageStyle,
  cardStyle,
  showNextButton,
  showRatingOnBottom,
  showRating,
  nextIconWidth,
  imageContainerStyle,
  priceContainerStyle,
  rating,
  tag,
  reviews,
}) => {
  const navigation = useNavigation();

  function truncateString(str) {
    if (str?.length > 75) {
        return str.slice(0, 75) + '...';
    }
    return str;
}
  return (
    <TouchableOpacity
      disabled={disabled ? disabled : false}
      activeOpacity={0.7}
      onPress={onPress}
      style={{...styles.card1, ...cardStyle}}>
      {image && (
        <>
          <ImageBackground
            // source={image}
            source={
              typeof image != 'string'
                ? image
                : image?.startsWith('http://') || image?.startsWith('https://')
                ? {uri: image}
                : image
            }
            style={{
              //   ...styles.imageContainer,
              //   //   height: imageHeight ? imageHeight : hp(7.5),
              //   ...imageContainerStyle,
              flex: 0.4,
              borderRadius: 10,
              overflow: 'hidden',
              ...imageContainerStyle,
            }}
            blurRadius={40}>
            <Image
              // source={image}
              source={
                typeof image != 'string'
                  ? image
                  : image?.startsWith('http://') ||
                    image?.startsWith('https://')
                  ? {uri: image}
                  : image
              }
              style={{...styles.image, ...imageStyle}}
            />
          </ImageBackground>
        </>
      )}

      {/* <View style={styles.textContainer}>
              {title && <Text style={styles.title}>{title}</Text>}
              {description && <Text style={styles.description}>{description}</Text>}
              {price && <Text style={styles.price}>{price}</Text>}
            </View> */}

      <View style={{flex: 1, marginLeft: 15}}>
        <View style={styles.rowViewSB1}>
          {tag && (
            <View
              style={{
                backgroundColor: Colors.White,
                paddingVertical: 4,
                paddingHorizontal: 10,
                borderRadius: 15,
                borderColor: Colors.primary_color,
                borderWidth: 1,
              }}>
              <Text
                style={{
                  color: Colors.primary_color,
                  fontFamily: Fonts.PlusJakartaSans_Medium,
                  fontSize: RFPercentage(1.5),
                  marginTop: -2,
                }}>
                {tag}
              </Text>
            </View>
          )}

          {showRatingOnBottom == true || showRating == false ? null : (
            <View style={styles.rowView}>
              <Icons.Rating />
              <Text
                style={{
                  marginLeft: 5,
                  color: '#C7C5C5',
                  fontFamily: Fonts.PlusJakartaSans_Bold,
                  fontSize: RFPercentage(1.6),
                }}>
                {rating ? parseFloat(rating)?.toFixed(1) : '0.0'}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.name}>{title && title }</Text>

        {/* <View style={styles.rowViewSB1}>
            <Text style={styles.name}>{title ? title : 'Green Salad'}</Text>
            {showRatingOnBottom == true || showRating == false ? null : (
              <View style={styles.rowView}>
                <Icons.Rating />
                <Text
                  style={{
                    marginLeft: 5,
                    color: '#C7C5C5',
                    fontFamily: Fonts.PlusJakartaSans_Bold,
                    fontSize: RFPercentage(1.6),
                  }}>
                  {rating ? rating : '4.3'}
                </Text>
              </View>
            )}
          </View> */}

        <View style={{...styles.rowViewSB, ...priceContainerStyle}}>
          {/* <Text style={styles.priceText}>$12.50</Text> */}
          <Text style={styles.rowViewText}> {truncateString(description)} </Text>
          {/* <Text style={styles.rowViewText}> ({reviews} reviews) </Text> */}
          {showNextButton == false ? null : (
            <TouchableOpacity
              onPress={
                onPress
              }
              >
              <Icons.Heart width={nextIconWidth ? nextIconWidth : 30} />
            </TouchableOpacity>
          )}
          {showRatingOnBottom == true && (
            <View style={styles.rowView}>
              <Icons.Rating />
              <Text
                style={{
                  marginLeft: 5,
                  color: '#C7C5C5',
                  fontFamily: Fonts.PlusJakartaSans_Bold,
                  fontSize: RFPercentage(1.6),
                }}>
                {rating ? rating : '4.3'}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RestaurantCard;

const styles = StyleSheet.create({
  name: {
    color: '#02010E',
    fontFamily: Fonts.PlusJakartaSans_SemiBold,
    fontSize: RFPercentage(2),
    marginTop: 3,
    marginBottom: 1,
  },
  rowViewText: {
    fontFamily: Fonts.PlusJakartaSans_Regular,
    color: '#979797',
    fontSize: RFPercentage(1.4),
    // width: wp(40)
    // flex: 2
  },
  rowViewSB1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowViewSB: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5.5,
    // backgroundColor: 'red',
  },
  rowView: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  priceText: {
    color: Colors.primary_color,
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(2.5),
    marginTop: -5,
  },
  //
  card1: {
    borderWidth: 1,
    borderColor: '#E6E7EB',
    paddingVertical: 7,
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  textContainer: {
    justifyContent: 'center',
    marginTop: 6,
    alignItems: 'center',
    marginLeft: 10,
  },
  imageContainer: {
    width: hp(8.5),
    height: 20,
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontFamily: Fonts.PlusJakartaSans_Bold,
    color: '#0A212B',
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
    color: '#0A212B',
    fontSize: RFPercentage(2.5),
  },
});
