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
import AntDesign from 'react-native-vector-icons/AntDesign';

const FavoriteItemCard = ({
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
  nextComponent,
  label,
  onHeartPress,
  reviews,
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      disabled={disabled == false ? false : true}
      activeOpacity={0.7}
      onPress={onPress}
      style={{...styles.card1, ...cardStyle}}>
      {image && (
        <>
        <View style={{
              // ...styles.imageContainer,
              // height: imageHeight ? imageHeight : hp(7.5),
              //   ...imageContainerStyle,
              borderRadius: 10,
              overflow: 'hidden',
              ...imageContainerStyle,
            }} >
        <Image
              source={{uri: image}}
              style={{...styles.image, ...imageStyle}}
            />

        </View>
          
          {/* <ImageBackground
            source={{uri: image}}
            style={{
              // ...styles.imageContainer,
              // height: imageHeight ? imageHeight : hp(7.5),
              //   ...imageContainerStyle,
              flex: 0.4,
              borderRadius: 10,
              overflow: 'hidden',
              ...imageContainerStyle,
            }}
            blurRadius={40}>
            <Image
              source={{uri: image}}
              style={{...styles.image, ...imageStyle}}
            />
          </ImageBackground> */}
        </>
      )}

      <View style={{flex: 1, marginLeft: 15}}>
        {tag ? (
          <>
            <View style={styles.rowViewSB1}>
              <View
                style={{
                  backgroundColor: Colors.White,
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                  borderRadius: 15,
                  borderColor: Colors.Orange,
                  borderWidth: 1,
                  alignItems: 'center'
                }}>
                <Text
                  style={{
                    color: Colors.Orange,
                    fontFamily: Fonts.PlusJakartaSans_Medium,
                    fontSize: RFPercentage(1.4),
                    marginTop: -2,
                  }}>
                  {tag}
                </Text>
              </View>

              <TouchableOpacity onPress={onHeartPress}>
                <AntDesign name="heart" color={Colors.Orange} size={20} />
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>{title ? title : ''}</Text>
          </>
        ) : (
          <View style={styles.rowViewSB1}>
            <Text style={styles.name}>{title ? title : ''}</Text>
            <TouchableOpacity onPress={onHeartPress}>
              <AntDesign name="heart" color={Colors.Orange} size={20} />
            </TouchableOpacity>
          </View>
        )}

        <View style={{...styles.rowViewSB, ...priceContainerStyle}}>
          {reviews ? (
            <Text style={styles.reviewText}> ({reviews} reviews) </Text>
          ) : (
            <Text style={styles.priceText}>${price}</Text>
          )}
          {showRating == false ? null : (
            <View style={styles.rowView}>
              <Icons.Rating />
              <Text
                style={{
                  marginLeft: 5,
                  color: '#C7C5C5',
                  fontFamily: Fonts.PlusJakartaSans_Bold,
                  fontSize: RFPercentage(1.6),
                }}>
                {rating ? rating : '0.0'}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FavoriteItemCard;

const styles = StyleSheet.create({
  name: {
    color: '#02010E',
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
    color: Colors.Orange,
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(2.5),
    marginTop: -5,
  },
  reviewText: {
    fontFamily: Fonts.PlusJakartaSans_Regular,
    color: '#979797',
    fontSize: RFPercentage(1.5),
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
    overflow: 'hidden',
    marginTop: 15,
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
  },
});

// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   ImageBackground,
//   FlatList,
// } from 'react-native';
// import React from 'react';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import {Colors, Fonts, Images} from '../../constants';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import {RFPercentage} from 'react-native-responsive-fontsize';
// import PriceText from '../Text';

// const FavoriteItemCard = ({image, title, description, price}) => {
//   return (
//     <View style={styles.itemView}>
//       <ImageBackground
//         source={image}
//         blurRadius={40}
//         style={styles.imageContainer}>
//         <Image source={image} style={styles.image} />
//       </ImageBackground>
//       <View style={styles.textContainer}>
//         <View style={styles.rowViewSB}>
//           <Text style={styles.title}>{title}</Text>
//           <AntDesign name="heart" color={Colors.Orange} size={20} />
//         </View>
//         <Text style={styles.nameText}>{description}</Text>
//         {/* <Text style={{...styles.title, color: Colors.Orange}}>$ {price}</Text>
//          */}
//         <PriceText text={price} />
//       </View>
//     </View>
//   );
// };

// export default FavoriteItemCard;

// const styles = StyleSheet.create({
//   itemView: {
//     marginVertical: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F6F6F6',
//     padding: 5,
//     paddingHorizontal: 10,
//     borderRadius: 10,
//   },
//   imageContainer: {
//     width: 80,
//     height: 70,
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   image: {
//     height: '100%',
//     width: '100%',
//     resizeMode: 'contain',
//   },
//   textContainer: {
//     marginLeft: 10,
//     flex: 1,
//   },
//   title: {
//     fontFamily: Fonts.Inter_Medium,
//     color: Colors.Text,
//     fontSize: RFPercentage(2),
//     // lineHeight: 25,
//   },
//   nameText: {
//     fontFamily: Fonts.PlusJakartaSans_Medium,
//     color: '#7E8CA0',
//     fontSize: RFPercentage(1.5),
//     // lineHeight: 20,
//     marginBottom: 5,
//   },
//   ratingText: {
//     fontFamily: Fonts.PlusJakartaSans_Bold,
//     color: Colors.Text,
//     fontSize: RFPercentage(2),
//     lineHeight: 25,
//     marginLeft: 5,
//   },
//   rowViewSB: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     // flex: 1,
//     justifyContent: 'space-between',
//   },
//   rowView: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
// });
