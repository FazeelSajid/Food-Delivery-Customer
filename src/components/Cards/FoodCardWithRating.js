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
import {Colors, Fonts, Icons} from '../../constants';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const FoodCardWithRating = ({
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
  isFavorite,
  addFav,
  quantity,
  onRemove
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      disabled={disabled ? disabled : false}
      activeOpacity={0.7}
      // onPress={
      //   onPress ? onPress : () => navigation?.navigate('NearByDealsDetails')
      // }
      onPress={onPress}
      style={{...styles.card1, ...cardStyle}}>
      {label && (
        <View style={styles.labelView}>
          <Text style={styles.labelText}>{label?.split('_')?.join('  ')}</Text>
        </View>
      )}
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

      {/* <View style={styles.textContainer}>
            {title && <Text style={styles.title}>{title}</Text>}
            {description && <Text style={styles.description}>{description}</Text>}
            {price && <Text style={styles.price}>{price}</Text>}
          </View> */}

      <View style={{flex: 1, marginLeft: 15}}>
        <View style={styles.rowViewSB1}>
          {tag &&
            (isTagArray == true ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FlatList
                  data={tag}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item, index}) => {
                    // console.log(item, 'tag');
                    
                    return(
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.White,
                        paddingVertical: 2,
                        paddingHorizontal: 10,
                        borderRadius: 15,
                        marginRight: 4,
                        borderColor: Colors.Orange,
                        borderWidth: 1,
                      }}>
                      <Text
                        style={{
                          color: Colors.Orange,
                          fontFamily: Fonts.PlusJakartaSans_Medium,
                          fontSize: RFPercentage(1.5),
                          marginTop: -2,
                        }}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}}
                />
                {/* {tag?.map((element, key) => {
                  return (
                    <View
                      key={key}
                      style={{
                        backgroundColor: '#FF572230',
                        paddingVertical: 4,
                        paddingHorizontal: 10,
                        borderRadius: 15,
                        marginRight: 4,
                      }}>
                      <Text
                        style={{
                          color: Colors.Orange,
                          fontFamily: Fonts.PlusJakartaSans_Medium,
                          fontSize: RFPercentage(1.5),
                          marginTop: -2,
                        }}>
                        {element?.item_name}
                      </Text>
                    </View>
                  );
                })} */}
              </View>
            ) : (
              <View
                style={{
                  backgroundColor:Colors.White,
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                  borderRadius: 15,
                  borderColor: Colors.Orange,
                  borderWidth: 1,
                }}>
                <Text
                  style={{
                    color: Colors.Orange,
                    fontFamily: Fonts.PlusJakartaSans_Medium,
                    fontSize: RFPercentage(1.5),
                    marginTop: -2,
                  }}>
                  {tag}
                </Text>
              </View>
            ))}

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
                {rating}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.name}>{title ? title : ''}</Text>

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
          {quantity && <Text style={styles.quantity} >{quantity}</Text>}
          
          {price && <Text style={styles.priceText}>￡{price}</Text>}
          {showNextButton == false ? null : (
            <TouchableOpacity onPress={isFavorite? onRemove : addFav}>
              {/* <View style={{height: 40, width: 40, backgroundColor: 'red'}} /> */}
              {nextComponent ? (
                nextComponent
              ) : (
                isFavorite ? (
                  <AntDesign name="heart" size={24} color={Colors.Orange} />
                ) : (
                  <AntDesign name="hearto" size={24} color={Colors.Orange} />
                )
              )}
              {/* <Icons.AddCircle /> */}
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

export default FoodCardWithRating;

const styles = StyleSheet.create({
  name: {
    color: '#02010E',
    fontFamily: Fonts.PlusJakartaSans_SemiBold,
    fontSize: RFPercentage(2),
    marginTop: 5,
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
    color: Colors.Orange,
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(2.5),
    marginTop: -5,
  },
  //
  card1: {
    borderWidth: 1,
    borderColor: '#E6E7EB',
    paddingVertical: 15,
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
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
    color: '#0A212B',
    fontSize: RFPercentage(1.5),
    lineHeight: 30,
  },
  description: {
    fontFamily: Fonts.PlusJakartaSans_Medium,
    color: Colors.Orange,
    fontSize: RFPercentage(1.5),
  },
  price: {
    fontFamily: Fonts.PlusJakartaSans_Bold,
    color: '#0A212B',
    fontSize: RFPercentage(2.5),
  },
  labelView: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.Orange,
    padding: 4,
    paddingHorizontal: 5,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    color: Colors.White,
    fontSize: RFPercentage(1.4),
    fontFamily: Fonts.PlusJakartaSans_Regular,
    textTransform: 'capitalize',
  },
  quantity:{
    color: '#00000099' ,
    fontFamily: Fonts.PlusJakartaSans_Regular,
    fontSize: RFPercentage(1.5),
    
  }
});
