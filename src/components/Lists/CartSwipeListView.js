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
import { BASE_URL_IMAGE } from '../../utils/globalVariables';
import ItemLoading from '../Loader/ItemLoading';

const CartSwipeListView = ({data, onDecrement, onIncrement, onDelete, ListFooterComponent, selectedItem, itemLoading }) => {
  const [dataa, setData] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      setData(data); // Re-render the list to initiate preview
    }, 500); // Adjust delay as needed
  }, []);

     
  // console.log( selectedItem,'fdasda');
  
  return (
    <SwipeListView
    // style={{backgroundColor: 'green'}}
      scrollEnabled={false}
      previewRowKey={'1'} 
      previewOpenValue={-40} 
      previewOpenDelay={3000}
      previewDuration={3000}
      previewRepeat={true}
      previewFirstRow={true}
      previewRowIndex={0}
      keyExtractor={(item)=> item.cart_item_id.toString()}
      data={data}
      extraData={data}
      contentContainerStyle={{
        alignSelf: 'center',
        width: wp(100),
        paddingHorizontal: 20,
        // backgroundColor: 'red'
      }}
      disableRightSwipe={true}
      rightOpenValue={-wp(18)}
      renderItem={({item, rowMap}) => {
        // console.log(item)  
        
        return(
        <View key={item.cart_item_id} style={styles.itemView}>
          <ImageBackground
          source={{
            uri: item?.itemData?.images[0],
          }}
            blurRadius={40}
            style={styles.imageContainer}>
            <Image source={{
                            uri: item?.itemData?.images[0],
                          }}style={styles.image} />
          </ImageBackground>
          <View style={styles.textContainer}>
            <Text style={styles.title}  ellipsizeMode='tail' numberOfLines={1}  >{item?.item_type == 'item'
                          ? item?.itemData?.item_name
                          : item?.itemData?.name}</Text>
            <Text style={styles.nameText} ellipsizeMode='tail' numberOfLines={1} >{item?.itemData?.description }</Text>
            {item?.itemData?.variationData?.variation_name && <Text style={styles.variation_name}>{item?.itemData?.variationData?.variation_name}</Text>}
            <View style={styles.rowViewSB}>
            
              <PriceText text={item?.itemData?.variationData ? item?.itemData?.variationData.price * item?.quantity : item?.itemData?.price ? item?.itemData?.price * item?.quantity: item?.sub_total * item?.quantity } />
              <View style={styles.rowView}>
                {
                  item?.quantity != 1  &&  <TouchableOpacity onPress={() => onDecrement(item)}>
                  <Icons.Remove />
                </TouchableOpacity>
                }
               
                <Text style={styles.countText}>{item?.quantity}</Text>
                <TouchableOpacity onPress={() => onIncrement(item)}>
                  <Icons.AddFilled />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}}
      renderHiddenItem={({item, rowMap}) => {
        // console.log(selectedItem , item.cart_item_id, itemLoading)
        return(

        <View style={styles.rowBack} key={item.cart_item_id} >
              <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onDelete(item)}
            style={[styles.backRightBtn, styles.backRightBtnRight]}>
            <Icons.Delete />
          </TouchableOpacity>

        
        
        </View>
      )}}
      ListFooterComponent={ListFooterComponent}
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
 
  title: {
    color: Colors.primary_text,
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
    color: Colors.primary_text,
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
  },
  backRightBtnRight: {
    right: 0,
  },

  nameText: {
    fontFamily: Fonts.Inter_Regular,
    color: Colors.primary_text,
    fontSize: RFPercentage(1.5),
    lineHeight: 15.5,
  },
  variation_name: {
    fontSize: RFPercentage(1.8), color: Colors.primary_color, fontFamily: Fonts.PlusJakartaSans_SemiBold 
  }
});
