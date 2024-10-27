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
import React, {useState, useEffect, useRef} from 'react';
import {Colors, Icons, Images, Fonts} from '../../../constants';
import MenuHeader from '../../../components/Header/MenuHeader';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SwipeListView} from 'react-native-swipe-list-view';
import CButton from '../../../components/Buttons/CButton';
import CartSwipeListView from '../../../components/Lists/CartSwipeListView';
import PriceText from '../../../components/Text';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import CInput from '../../../components/TextInput/CInput';
import {useKeyboard} from '../../../utils/UseKeyboardHook';
import StackHeader from '../../../components/Header/StackHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getCartItems,
  getCustomerCart,
  removeItemFromCart,
  updateCartItemQuantity,
} from '../../../utils/helpers/cartapis';

import Loader from '../../../components/Loader';
import {getRestaurantDetail, showAlert} from '../../../utils/helpers';
import {useFocusEffect} from '@react-navigation/native';
import {BASE_URL_IMAGE} from '../../../utils/globalVariables';
import {useDispatch, useSelector} from 'react-redux';
import {
  addToCart,
  removeItemFromMyCart,
  setCartRestaurantId,
  setOrderComment,
  updateMyCartList,
} from '../../../redux/CartSlice';
import {getEstimatedDeliveryTime} from '../../../utils/helpers/location';
import {getShippingAddress} from '../../../utils/helpers/localStorage';

const MyCart = ({navigation, route}) => {
  const {cart_restaurant_id, my_cart} = useSelector(store => store.cart);
  const { customer_id } = useSelector(store => store.store);


  const dispatch = useDispatch();

  const keyboardHeight = useKeyboard();
  const scrollViewRef = useRef();

  useEffect(() => {
    console.log('keyboardHeight  : ', keyboardHeight);
    scrollViewRef.current?.scrollToEnd();
    // scrollViewRef.current?.scrollTo({y: 1180});
  }, [keyboardHeight]);

  const [loading, setLoading] = useState(false);

  // const [estimated_delivery_time, setEstimated_delivery_time] = useState(0);

  const [data, setData] = useState([
    // {
    //   id: 0,
    //   image: Images.chinese,
    //   title: 'Fresh Orange splash',
    //   description: 'Mix fresh real orange',
    //   price: '13.40',
    //   count: 2,
    // },
    // {
    //   id: 1,
    //   image: Images.food8,
    //   title: 'Fresh Orange splash',
    //   description: 'Mix fresh real orange',
    //   price: '13.40',
    //   count: 2,
    // },
    // {
    //   id: 2,
    //   image: Images.food5,
    //   title: 'Fresh Orange',
    //   description: 'Mix fresh real orange',
    //   price: '13.40',
    //   count: 2,
    // },
  ]);

  const handleAddQuantity = async item => {
    try {
      setLoading(true);
      let obj = {
        cart_item_id: item?.cart_item_id,
        quantity: item?.quantity + 1,
      };
      console.log('data   :  ', obj);
      await updateCartItemQuantity(obj);
      const newData = data?.map(element => {
        if (element?.cart_item_id == item.cart_item_id) {
          return {
            ...element,
            quantity: element.quantity + 1,
          };
        } else {
          return {
            ...element,
          };
        }
      });
      setData(newData);
      dispatch(addToCart(newData));
      //my_cart
      dispatch(updateMyCartList(newData));
      setLoading(false);
    } catch (error) {
      console.log('Error updating quantity : ', error);
    }
  };

  const handleRemoveQuantity = async item => {
    try {
      if (item?.quantity > 1) {
        setLoading(true);
        let obj = {
          cart_item_id: item?.cart_item_id,
          quantity: item?.quantity - 1,
        };
        await updateCartItemQuantity(obj);
        const newData = data?.map(element => {
          if (element?.item_id == item.item_id) {
            return {
              ...element,
              quantity: element.quantity - 1,
            };
          } else {
            return {
              ...element,
            };
          }
        });
        setData(newData);
        dispatch(addToCart(newData));
        //my_cart
        dispatch(updateMyCartList(newData));

        if (newData?.length == 0) {
          dispatch(setCartRestaurantId(null));
        }
        setLoading(false);
      }
    } catch (error) {
      console.log('Error updating quantity : ', error);
    }
  };

  const handleDelete = async item => {
    try {
      setLoading(true);
      console.log('item   :  ', item?.cart_item_id);
      // let customer_id = await AsyncStorage.getItem('customer_id');
      let cart = await getCustomerCart(customer_id);
      console.log('cart  : ', cart);

      removeItemFromCart(cart?.cart_id,item?.cart_item_id)
        .then(response => {
          if (response?.status == true) {
            console.log('response  :  ', response);
            const filter = data.filter(
              element => element?.cart_item_id != item?.cart_item_id,
            );
            // console.log('filter, from remove from cart' ,filter );
            
            setData(filter);
            dispatch(addToCart(filter));

            //my_cart
            // dispatch(removeItemFromMyCart(item?.cart_item_id));
            dispatch(updateMyCartList(filter));

            if (filter?.length == 0) {
              dispatch(setCartRestaurantId(null));
            }
          } else {
            setTimeout(() => {
              showAlert(response?.message);
            }, 500);
          }
        })
        .catch(error => {
          console.log('error: ', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      console.log('error in delete item  :  ', error);
    }
  };

  // const getDeliveryTime = async cartItems => {
  //   let shipping_address = await getShippingAddress();
  //   let location = shipping_address?.address;
  //   if (location) {
  //     let res_details = await getRestaurantDetail(
  //       cartItems[0]?.itemData?.restaurant_id,
  //     );
  //     let pickup_location = res_details?.location;
  //     let dropOff_Location = location;

  //     let delivery_time = await getEstimatedDeliveryTime(
  //       pickup_location,
  //       dropOff_Location,
  //     );
  //     setEstimated_delivery_time(delivery_time);
  //   } else {
  //     setEstimated_delivery_time(0);
  //   }
  // };

  const get_Cart_Items = async () => {
    try {
      setLoading(true);
      // let customer_id = await AsyncStorage.getItem('customer_id');
      let cart = await getCustomerCart(customer_id);
      let cartItems = await getCartItems(cart?.cart_id);
      if (cartItems) {
        dispatch(addToCart(cartItems));
        setData(cartItems);
        //my_cart
        dispatch(updateMyCartList(cartItems));
        if (!cart_restaurant_id && cartItems?.length > 0) {
          dispatch(setCartRestaurantId(cartItems[0]?.itemData?.restaurant_id));
        }
        // getDeliveryTime(cartItems);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error in getCartItems :  ', error);
    }
  };

  // useEffect(() => {
  //   get_Cart_Items();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      get_Cart_Items();
    }, []),
  );

  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <Loader loading={loading} />
      <ScrollView
        ref={scrollViewRef}
        scrollToOverflowEnabled={true}
        contentContainerStyle={{flexGrow: 1}}>
        {/* <MenuHeader
          title={'My Cart'}
          // rightIcon={
          //   <TouchableOpacity onPress={() => navigation.navigate('AddItems')}>
          //     <Icons.AddActive />
          //   </TouchableOpacity>
          // }
        /> */}
        <StackHeader title={'My Cart'} />
        <View style={{paddingHorizontal: 20}}>
          <View style={styles.itemView}>
            <View style={styles.imageContainer}>
              <Icons.Van />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Estimate Delivery Time</Text>
              <Text
                style={{
                  ...styles.title,
                  color: Colors.Orange,
                  fontFamily: Fonts.Inter_SemiBold,
                  fontSize: RFPercentage(2.2),
                }}>
                40 mins
                {/* {estimated_delivery_time} mins */}

              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            height: hp(0.1),
            marginVertical: 10,
            backgroundColor: '#00000026',
          }}
        />
        <View>
          <FlatList
            data={data}
            scrollEnabled={false}
            renderItem={({item, index}) => {
              return (
                <>
                  <View style={styles.itemCard}>
                    <View
                      style={styles.imageContainer1}>
                      {item?.itemData?.images?.length > 0 ? (
                        <Image
                          source={{
                            uri: BASE_URL_IMAGE + item?.itemData?.images[0],
                          }}
                          style={styles.image}
                        />
                      ) : (
                        <View style={styles.image} />
                      )}
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.title}>
                        {item?.item_type == 'item'
                          ? item?.itemData?.item_name
                          : item?.itemData?.name}
                      </Text>
                      <View style={styles.rowViewSB}>
                        <PriceText text={item?.itemData?.variationData ? item?.itemData?.variationData.price * item?.quantity : item?.itemData?.price * item?.quantity  } />
                        <TouchableOpacity onPress={() => handleDelete(item)}>
                          <Ionicons name="close" size={22} color={'#000'} />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.rowView}>
                        <TouchableOpacity
                          onPress={() => handleRemoveQuantity(item)}>
                          <Icons.Remove width={18} height={18} />
                        </TouchableOpacity>
                        <Text style={styles.countText}>{item?.quantity}</Text>
                        <TouchableOpacity
                          onPress={() => handleAddQuantity(item)}>
                          <Icons.AddFilled width={22} height={22} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </>
              );
            }}
            ListFooterComponent={() => {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('AddItems')}
                  style={{
                    ...styles.rowView,
                    paddingHorizontal: 27,
                    marginVertical: 10,
                  }}>
                  <Feather name="plus" color={Colors.Orange} size={16} />
                  <Text
                    style={{
                      color: Colors.Orange,
                      fontFamily: Fonts.Inter_Medium,
                      fontSize: RFPercentage(1.7),
                    }}>
                    Add more items
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* <CartSwipeListView
          data={data}
          onDecrement={item => handleRemoveQuantity(item)}
          onIncrement={item => handleAddQuantity(item)}
          onDelete={item => handleDelete(item)}
        /> */}

        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingBottom: 20,
          }}>
          <CButton
            title="CheckOut"
            onPress={() => {
              // console.log('data?.length : ', data);
              if (data?.length == 0) {
                showAlert('Please Add Items in cart to checkout');
              } else {
                // dispatch(setOrderComment(comments));

                navigation?.navigate('Checkout');
                // navigation?.navigate('Checkout', {
                //   items: data,
                //   comments: comments,
                // });
              }
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default MyCart;

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
  itemCard: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#F6F6F6',
    // padding: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
    width: wp(90),
    alignSelf: 'center',
  },
  imageContainer1: {
    width: 70,
    height: 70,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FF572233',
    alignItems: 'center',
    justifyContent: 'center',
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
    resizeMode: 'cover',
  },
  subText: {
    color: '#8D93A1',
    fontFamily: Fonts.PlusJakartaSans_Medium,
    fontSize: RFPercentage(2),
  },
  title: {
    color: '#191A26',
    fontSize: RFPercentage(2),
    fontFamily: Fonts.Inter_SemiBold,
    lineHeight: 25,
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
    justifyContent: 'center',
    position: 'absolute',
    width: wp(15),
    height: hp(6.7),
    borderRadius: wp(2),
  },
  backRightBtnRight: {
    right: 0,
  },
});

// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   Image,
//   ImageBackground,
//   TouchableOpacity,
//   FlatList,
// } from 'react-native';
// import React, {useState, useEffect} from 'react';
// import {Colors, Icons, Images, Fonts} from '../../../constants';
// import MenuHeader from '../../../components/Header/MenuHeader';
// import {RFPercentage} from 'react-native-responsive-fontsize';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import {SwipeListView} from 'react-native-swipe-list-view';
// import CButton from '../../../components/Buttons/CButton';
// import CartSwipeListView from '../../../components/Lists/CartSwipeListView';

// const MyCart = ({navigation, route}) => {
//   const [data, setData] = useState([
//     {
//       id: 0,
//       image: Images.food1,
//       title: 'Fresh Orange splash',
//       description: 'Mix fresh real orange',
//       price: 13.2,
//       count: 1,
//     },
//     {
//       id: 1,
//       image: Images.food2,
//       title: 'Fresh Orange splash',
//       description: 'Mix fresh real orange',
//       price: 13.2,
//       count: 1,
//     },
//     {
//       id: 2,
//       image: Images.food3,
//       title: 'Fresh Orange',
//       description: 'Mix fresh real orange',
//       price: 13.2,
//       count: 1,
//     },
//   ]);

//   const handleAddQuantity = async item => {
//     const newData = data?.map(element => {
//       if (element?.id == item.id) {
//         return {
//           ...element,
//           count: element.count + 1,
//         };
//       } else {
//         return {
//           ...element,
//         };
//       }
//     });
//     setData(newData);
//   };
//   const handleRemoveQuantity = async item => {
//     const newData = data?.map(element => {
//       if (element?.id == item.id) {
//         return {
//           ...element,
//           count: element.count - 1,
//         };
//       } else {
//         return {
//           ...element,
//         };
//       }
//     });
//     setData(newData);
//   };

//   const handleDelete = async item => {
//     const filter = data.filter(element => element?.id != item?.id);
//     setData(filter);
//   };
//   return (
//     <View style={{flex: 1, backgroundColor: Colors.White}}>
//       <ScrollView contentContainerStyle={{flex: 1, flexGrow: 1}}>
//         <MenuHeader
//           title={'My Cart'}
//           rightIcon={
//             <TouchableOpacity onPress={() => navigation.navigate('AddItems')}>
//               <Icons.AddActive />
//             </TouchableOpacity>
//           }
//         />
//         <View style={{paddingHorizontal: 20}}>
//           <View style={styles.itemView}>
//             <View style={styles.imageContainer}>
//               <Icons.Van />
//             </View>
//             <View style={styles.textContainer}>
//               <Text style={styles.title}>Estimate Delivery Time</Text>
//               <Text
//                 style={{
//                   ...styles.title,
//                   color: Colors.Orange,
//                   fontFamily: Fonts.Inter_SemiBold,
//                   fontSize: RFPercentage(2.2),
//                 }}>
//                 40 mins
//               </Text>
//             </View>
//           </View>
//         </View>
//         <View
//           style={{
//             height: hp(0.1),
//             marginVertical: 10,
//             backgroundColor: '#00000026',
//           }}
//         />
//         {/* <SwipeListView
//           scrollEnabled={false}
//           data={data}
//           //   extraData={extraData}
//           contentContainerStyle={{
//             alignSelf: 'center',
//             width: wp(100),
//             paddingHorizontal: 20,
//           }}
//           disableRightSwipe={true}
//           rightOpenValue={-wp(18)}
//           renderItem={({item, rowMap}) => (
//             <View style={styles.itemView}>
//               <ImageBackground
//                 source={item.image}
//                 blurRadius={40}
//                 style={styles.imageContainer}>
//                 <Image source={item.image} style={styles.image} />
//               </ImageBackground>
//               <View style={styles.textContainer}>
//                 <Text style={styles.title}>{item.title}</Text>
//                 <Text style={styles.nameText}>{item.description}</Text>
//                 <View style={styles.rowViewSB}>
//                   <Text style={{...styles.title, color: Colors.Orange}}>
//                     ${item.price}
//                   </Text>
//                   <View style={styles.rowView}>
//                     <TouchableOpacity
//                       onPress={() => handleRemoveQuantity(item)}>
//                       <Icons.Remove />
//                     </TouchableOpacity>
//                     <Text style={styles.countText}>{item.count}</Text>
//                     <TouchableOpacity onPress={() => handleAddQuantity(item)}>
//                       <Icons.AddFilled />
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </View>
//             </View>
//           )}
//           renderHiddenItem={(item, rowMap) => (
//             <View style={styles.rowBack}>
//               <TouchableOpacity
//                 activeOpacity={0.8}
//                 onPress={() => handleDelete(item.item)}
//                 style={[styles.backRightBtn, styles.backRightBtnRight]}>
//                 <Icons.Delete />
//               </TouchableOpacity>
//             </View>
//           )}
//         /> */}
//         <CartSwipeListView
//           data={data}
//           onDecrement={item => handleRemoveQuantity(item)}
//           onIncrement={item => handleAddQuantity(item)}
//           onDelete={item => handleDelete(item)}
//         />
//         <View
//           style={{
//             flex: 1,
//             justifyContent: 'flex-end',
//             paddingBottom: 20,
//           }}>
//           <CButton title="Place Order" />
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default MyCart;

// const styles = StyleSheet.create({
//   itemView: {
//     marginVertical: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F6F6F6',
//     padding: 10,
//     paddingHorizontal: 10,
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   imageContainer: {
//     width: 60,
//     height: 60,
//     borderRadius: 10,
//     overflow: 'hidden',
//     backgroundColor: '#FF572233',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   textContainer: {
//     marginLeft: 15,
//     flex: 1,
//   },
//   image: {
//     height: '100%',
//     width: '100%',
//     resizeMode: 'contain',
//   },
//   subText: {
//     color: '#8D93A1',
//     fontFamily: Fonts.PlusJakartaSans_Medium,
//     fontSize: RFPercentage(2),
//   },
//   title: {
//     color: '#191A26',
//     fontSize: RFPercentage(2),
//     fontFamily: Fonts.Inter_SemiBold,
//     lineHeight: 25,
//   },

//   rowViewSB: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   rowView: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   countText: {
//     color: Colors.Text,
//     marginHorizontal: 8,
//     fontFamily: Fonts.PlusJakartaSans_Bold,
//   },

//   //swipe list view
//   rowBack: {
//     alignItems: 'center',
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginHorizontal: wp(1),
//   },
//   backRightBtn: {
//     alignItems: 'center',
//     // bottom: 0,
//     justifyContent: 'center',
//     position: 'absolute',
//     // top: 0,
//     width: wp(15),
//     height: hp(6.7),
//     borderRadius: wp(2),
//     // backgroundColor: '#ffbdbd',
//   },
//   backRightBtnRight: {
//     right: 0,
//   },
// });
