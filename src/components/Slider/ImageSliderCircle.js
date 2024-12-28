import {StyleSheet, View, Image} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import {BASE_URL_IMAGE} from '../../utils/globalVariables';
import { useSelector } from 'react-redux';
const ImageSliderCircle = ({data, marginBottom}) => {
          const  {Colors } = useSelector(store => store.store)
  const styles = StyleSheet.create({
    imageCard: {
      width: wp(52),
      height: wp(52),
      borderRadius: wp(52),
      backgroundColor: Colors.secondary_color,
      marginHorizontal: wp(4.5),
      overflow: 'hidden',
    },
    sliderContainer: {
      marginVertical: 20,
      marginBottom: marginBottom ? marginBottom : 20,
      paddingHorizontal: 0,
      height: hp(30),
    },
    paginationStyle: {
      // marginBottom: hp(1),
    },
    paginationStyleItemActive: {
      width: wp(2.2),
      height: wp(2.2),
      borderRadius: wp(2.2) / 2,
      backgroundColor: Colors.primary_color,
      margin: 0,
      marginHorizontal: 2,
    },
    paginationStyleItemInactive: {
      width: wp(2.2),
      height: wp(2.2),
      borderRadius: wp(2.2) / 2,
      backgroundColor:Colors.secondary_color,
      //   borderWidth: 1,
      //   borderColor: Colors.primary_color,
      opacity: 0.7,
      marginHorizontal: 2,
    },
  });
  return (
    <View style={styles.sliderContainer}>
      <SwiperFlatList
        // autoplay
        // autoplayDelay={2}
        // autoplayLoop
        // index={2}
        showPagination
        data={data}
        renderItem={({item}) => (
          <View
            style={{
              flex: 1,
              width: wp(100),
              alignItems: 'center',
            }}>
            <View style={styles.imageCard}>
              <Image
                // source={item.image}
                source={{uri: item?.image}}
                style={{
                  width: '100%',
                  height: '100%',
                  // resizeMode: 'contain',
                }}
              />
            </View>
          </View>
        )}
        paginationStyle={styles.paginationStyle}
        paginationStyleItemActive={styles.paginationStyleItemActive}
        paginationStyleItemInactive={styles.paginationStyleItemInactive}
      />
    </View>
  );
};

export default ImageSliderCircle;
