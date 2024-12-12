import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React from 'react';
import {Colors, Fonts, Icons, Images} from '../../constants';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import CButton from '../Buttons/CButton';
import {AirbnbRating} from 'react-native-ratings';
import {formatePrice} from '../../utils/helpers/GlobalFunctions';
import moment from 'moment';
const FoodCardOrderHistory = ({
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
  isTagArray,
  nextComponent,
  label,
  onReOrderPress,
  orderDate,
  itemsList,
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      disabled={disabled ? disabled : false}
      activeOpacity={0.7}
      onPress={onPress}
      style={{...styles.card1, ...cardStyle}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {label && (
          <View style={styles.labelView}>
            <Text style={styles.labelText}>
              {label?.split('_')?.join('  ')}
            </Text>
          </View>
        )}
        {image && (
          <>
            <ImageBackground
              source={
                typeof image != 'string'
                  ? image
                  : image?.startsWith('http://') ||
                    image?.startsWith('https://')
                  ? {uri: image}
                  : image
              }
              style={{
                flex: 0.4,
                borderRadius: 10,
                overflow: 'hidden',
                ...imageContainerStyle,
              }}
              blurRadius={40}>
              <Image
                //  source={image}
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

        <View style={{flex: 1, marginLeft: 15}}>
          <View style={styles.rowViewSB}>
            <Text style={styles.name}>{title ? title : ''}</Text>
            <Text style={styles.priceText}>${formatePrice(price)}</Text>
          </View>
          <Text>
            {/* 23 Sep,12:00 */}
            {orderDate && moment(orderDate).format('DD MMM, YYYY')}
          </Text>
          <View style={{...styles.rowView, justifyContent: 'flex-start'}}>
            {itemsList?.length > 0 &&
              itemsList?.map((item, key) => {
                return (
                  <Text
                    key={key}
                    style={{
                      color: '#939393',
                      fontFamily: Fonts.PlusJakartaSans_Regular,
                      fontSize: RFPercentage(1.8),
                    }}>
                    {item
                      ? item?.item_type == 'deal'
                        ? item?.itemData?.name
                        : item?.itemData?.item_name
                      : ''}
                    ,
                  </Text>
                );
              })}
          </View>
        </View>
      </View>
      <CButton
        title="REORDER ITEM"
        width={wp(80)}
        marginTop={15}
        height={hp(5.5)}
        style={{marginBottom: 15}}
        onPress={onReOrderPress}
      />
      <View style={{height: 1, width: wp(100), backgroundColor: '#E6E7EB'}} />
      <View
        style={{
          ...styles.rowView,
          justifyContent: 'flex-start',
          marginLeft: 20,
          width: '100%',
        }}>
        <Text
          style={{
            color: '#262626',
            fontFamily: Fonts.PlusJakartaSans_Medium,
            fontSize: RFPercentage(2),
          }}>
          Rating :{' '}
        </Text>
        <AirbnbRating
          count={5}
          showRating={false}
          defaultRating={rating}
          isDisabled={true}
          size={25}
          //   starImage={<Images.burger />}
          ratingContainerStyle={{
            marginVertical: 10,
            marginHorizontal: 10,
            marginBottom: 4,
          }}
          onFinishRating={value => {
            //   setRating(value);
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default FoodCardOrderHistory;

const styles = StyleSheet.create({
  name: {
    color: Colors.primary_text,
    fontFamily: Fonts.PlusJakartaSans_SemiBold,
    fontSize: RFPercentage(2),
    marginTop: 3,
    marginBottom: 1,
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
    // flexDirection: 'row',
    paddingHorizontal: 10,
    overflow: 'hidden',
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
    textTransform: 'capitalize',
  },
});
