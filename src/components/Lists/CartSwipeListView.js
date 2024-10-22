import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Colors, Icons, Images, Fonts} from '../../constants';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SwipeListView} from 'react-native-swipe-list-view';
import PriceText from '../Text';

const CartSwipeListView = ({data, onDecrement, onIncrement, onDelete}) => {
  return (
    <SwipeListView
      scrollEnabled={false}
      data={data}
      //   extraData={extraData}
      contentContainerStyle={{
        alignSelf: 'center',
        width: wp(100),
        paddingHorizontal: 20,
      }}
      disableRightSwipe={true}
      rightOpenValue={-wp(18)}
      renderItem={({item, rowMap}) => (
        <View style={styles.itemView}>
          <ImageBackground
            source={item.image}
            blurRadius={40}
            style={styles.imageContainer}>
            <Image source={item.image} style={styles.image} />
          </ImageBackground>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.nameText}>{item.description}</Text>
            <View style={styles.rowViewSB}>
              {/* <Text style={{...styles.title, color: Colors.Orange}}>
                ${item.price}
              </Text> */}
              <PriceText text={item?.price} />
              <View style={styles.rowView}>
                <TouchableOpacity onPress={() => onDecrement(item)}>
                  <Icons.Remove />
                </TouchableOpacity>
                <Text style={styles.countText}>{item.count}</Text>
                <TouchableOpacity onPress={() => onIncrement(item)}>
                  <Icons.AddFilled />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
      renderHiddenItem={(item, rowMap) => (
        <View style={styles.rowBack}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onDelete(item.item)}
            style={[styles.backRightBtn, styles.backRightBtnRight]}>
            <Icons.Delete />
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

export default CartSwipeListView;

const styles = StyleSheet.create({
  itemView: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    padding: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FF572233',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  subText: {
    color: '#8D93A1',
    fontFamily: Fonts.PlusJakartaSans_Medium,
    fontSize: RFPercentage(2),
  },
  title: {
    color: '#292323',
    fontSize: RFPercentage(1.8),
    fontFamily: Fonts.Inter_SemiBold,
  },

  rowViewSB: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countText: {
    color: Colors.Text,
    marginHorizontal: 8,
    fontFamily: Fonts.PlusJakartaSans_Bold,
  },

  //swipe list view
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp(1),
  },
  backRightBtn: {
    alignItems: 'center',
    // bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    // top: 0,
    width: wp(15),
    height: hp(6.7),
    borderRadius: wp(2),
    // backgroundColor: '#ffbdbd',
  },
  backRightBtnRight: {
    right: 0,
  },

  nameText: {
    fontFamily: Fonts.Inter_Regular,
    color: '#292323',
    fontSize: RFPercentage(1.5),
    lineHeight: 15.5,
  },
});
