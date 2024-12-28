import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Icons, Images, Fonts } from '../../../constants';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CButton from '../../../components/Buttons/CButton';
import CartSwipeListView from '../../../components/Lists/CartSwipeListView';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { useKeyboard } from '../../../utils/UseKeyboardHook';
import StackHeader from '../../../components/Header/StackHeader';
import {
  getCartItems,
  getCustomerCart,
  removeItemFromCart,
  updateCartItemQuantity,
} from '../../../utils/helpers/cartapis';

import Loader from '../../../components/Loader';
import {  handlePopup } from '../../../utils/helpers';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart,
  setCartRestaurantId,
  setSelectedPaymentType,
  updateMyCartList,
} from '../../../redux/CartSlice';
import PopUp from '../../../components/Popup/PopUp';
import { setBill } from '../../../redux/AuthSlice';
import api from '../../../constants/api';
import CRBSheetComponent from '../../../components/BottomSheet/CRBSheetComponent';
import ItemSeparator from '../../../components/Separator/ItemSeparator';

const MyCart = ({ navigation, route }) => {
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
    // const extractCartItemIds = (itemsArray) => {
  //   return itemsArray.map(item => item.cart_item_id);
  // };

  // // console.log(promoCodeDetail?.promo_code_id );

  // const calculatePreOrderdetails = (paymentType, promoCode) => {
  //   // console.log('handlePaymentTypeChange');

  //   if (!location_id) {
  //     showBtmSheet()
  //   } else {

  //     const cartItemIds = extractCartItemIds(cart)
  //     dispatch(setBill({ cartItemIds: cartItemIds }))
  //     console.log({ cartItemIds});



  //     const body = {
  //       customer_id: customer_id,
  //       cart_items_ids: cartItemIds,
  //       promo_code: promoCode? promoCode: '', // optional
  //       payment_option: 'cash',
  //       sub_total: Bill.subtotal,
  //       location_id: location.id
  //     }
  //     console.log({ body });


  //     fetch(api.calculatePreOrder, {
  //       method: 'POST',
  //       body: JSON.stringify(body),
  //       headers: {
  //         'Content-type': 'application/json; charset=UTF-8',
  //       },
  //     })
  //       .then(response => response.json())
  //       .then(response => {
  //         // console.log({response});
  //         // console.log(body);x

  //         if (response.error == false) {
  //           dispatch(setBill({
  //             delivery_charges: response?.result?.delivery_charges,
  //             gst_charges: response?.result?.gst_charges,
  //             total_amount: response?.result?.total_amount
  //           }
  //           ))

  //         }
  //       })

  //   }
  //   // const response =  fetchApis(api.calculatePreOrder, 'POST', setLoading, 'application/json', body )

  //   //  console.log({response});
  // }

  // const calculateTotalAmount = () => {

  //   const cartItemIds = extractCartItemIds(cart)
  //   dispatch(setBill({ cartItemIds: cartItemIds }))

  //   try {
  //     let total = 0;
  //     for (const item of cart) {
  //       // console.log(item);

  //       // console.log('item?.itemData?.price :  ', item?.itemData?.variationData?.price);
  //       // let price = item?.itemData?.price ? parseInt(item?.itemData?.variationData?.price) : 0
  //       let price = parseInt(item?.itemData?.variationData?.price ? item?.itemData?.variationData?.price : item?.itemData?.price)
  //       let quantity = item?.quantity ? parseInt(item?.quantity) : 1;
  //       total = total + price * quantity;
  //     }

  //     dispatch(setBill({ subtotal: total.toFixed(2) })
  //     )      // setSubtotal(total.toFixed(2));

  //     // setTotal_amount(total.toFixed(2));
  //   } catch (error) {
  //     console.log('error in calculating total amount : ', error);
  //   }
  // };

  // useEffect(() => {
  //   get_Cart_Items();
  // }, []);
  const ref_RBSheetPaymentOption = useRef(null);

  const { cart_restaurant_id, my_cart, cart, selected_payment_type,
    selected_payment_string } = useSelector(store => store.cart);

  const { customer_id, showPopUp, popUpColor, PopUpMesage, promos, Bill, location, Colors } = useSelector(store => store.store)
  const [selectedItem, setSelectedItem] = useState()
  const [itemLoading, setItemLoading] = useState()
  const [checkOutLoading, setCheckOutLoading] = useState()
  const dispatch = useDispatch();
  const keyboardHeight = useKeyboard();
  const scrollViewRef = useRef();
  const btmSheetRef = useRef();
  const location_id = location?.id
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd();
    if (!selected_payment_type) {
    dispatch(setSelectedPaymentType('cash'))
      
    }
  }, [keyboardHeight]);


  

  const showBtmSheet = () => {
    btmSheetRef?.current?.open()
  }
  const closeBtmSheet = () => {
    btmSheetRef?.current?.close()
  }
  
  const [data, setData] = useState([]);

  const handleAddQuantity = async item => {
    try {
      setLoading(true);
      let obj = {
        cart_item_id: item?.cart_item_id,
        quantity: item?.quantity + 1,
      };
      console.log('data   :  ', obj);
      await updateCartItemQuantity(obj, dispatch);
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
        await updateCartItemQuantity(obj, dispatch);
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
    setSelectedItem(item?.cart_item_id)
    setItemLoading(true)

    try {
      console.log('item   :  ', item?.cart_item_id);
      let cart = await getCustomerCart(customer_id, dispatch);
      console.log('cart  : ', cart);

      removeItemFromCart(cart?.cart_id, item?.cart_item_id, dispatch)
        .then(response => {
          if (response?.status == true) {
            console.log('response  :  ', response);
            const filter = data.filter(
              element => element?.cart_item_id != item?.cart_item_id,
            );

            setData(filter);
            dispatch(addToCart(filter));

            dispatch(updateMyCartList(filter));

            if (filter?.length == 0) {
              dispatch(setCartRestaurantId(null));
            }
          } else {
              handlePopup(dispatch,response?.message, 'red');

          }
        })
        .catch(error => {
          console.log('error: ', error);
        })
        .finally(() => {
          setLoading(false);
          setItemLoading(false);
        });
    } catch (error) {
      setLoading(false);
      console.log('error in delete item  :  ', error);
    }
  };



  const get_Cart_Items = async () => {
    try {
      setLoading(true);
      let cart = await getCustomerCart(customer_id, dispatch);
      let cartItems = await getCartItems(cart?.cart_id, dispatch);

      if (cartItems) {
        dispatch(addToCart(cartItems));
        setData(cartItems);
        dispatch(updateMyCartList(cartItems));
        if (!cart_restaurant_id && cartItems?.length > 0) {
          dispatch(setCartRestaurantId(cartItems[0]?.itemData?.restaurant_id));
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error in getCartItems :  ', error);
    }
  };

  const calculatePreOrderDetails = (paymentType, promoCode) => {
    if (!location_id) {
      showBtmSheet();
    }else if (!selected_payment_type) {
      ref_RBSheetPaymentOption.current.open()
    }
     else {
      setCheckOutLoading(true);

      try {
        // Calculate subtotal
        let subtotal = 0;
        const cartItemIds = cart.map(item => {
          const price = parseInt(
            item?.itemData?.variationData?.price
              ? item?.itemData?.variationData?.price
              : item?.itemData?.price
          );
          const quantity = item?.quantity ? parseInt(item?.quantity) : 1;
          subtotal += price * quantity;
          return item.cart_item_id;
        });

       
        dispatch(setBill({ cartItemIds, subtotal: subtotal.toFixed(2) }));

        const body = {
          customer_id: customer_id,
          cart_items_ids: cartItemIds,
          promo_code: promoCode ? promoCode : '', // optional
          payment_option: selected_payment_type,
          sub_total: subtotal.toFixed(2),
          location_id: location.id,
        };

        console.log({ body });

        fetch(api.calculatePreOrder, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
          .then(response => response.json())
          .then(response => {
            if (!response.error) {
              console.log({ response });

              dispatch(
                setBill({
                  delivery_charges: response?.result?.delivery_charges,
                  gst_charges: response?.result?.gst_charges,
                  total_amount: response?.result?.total_amount,
                })
              );
              navigation?.navigate('Checkout');
            }
            else{
            handlePopup(dispatch, 'Something went wrong', 'red')
            console.log({ response });

            }
          }
        
        )
          .catch(error => {
            handlePopup(dispatch, 'Something went wrong', 'red')
          });
      } catch (error) {
        handlePopup(dispatch, 'Something went wrong', 'red')
      }
      finally {
        setCheckOutLoading(false);
      }
    }
  };



  useFocusEffect(
    React.useCallback(() => {
      get_Cart_Items();
    }, []),
  );

  const styles = StyleSheet.create({
    itemView: {
      marginVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: `${Colors.secondary_text}20`,
      padding: 10,
      paddingHorizontal: 10,
      borderRadius: 10,
      overflow: 'hidden',
    },
    itemCard: {
      marginVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
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
      backgroundColor: `${Colors.primary_color}30`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageContainer: {
      width: 60,
      height: 60,
      borderRadius: 10,
      overflow: 'hidden',
      backgroundColor: `${Colors.primary_color}30`,
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
   
    title: {
      color: Colors.primary_text,
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
    rowViewSB1: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    rbSheetHeading: {
      color: Colors.primary_text,
      fontFamily: Fonts.PlusJakartaSans_Bold,
      fontSize: RFPercentage(1.9),
    },
    btmsheettext: {
      color: Colors.primary_text,
      fontFamily: Fonts.PlusJakartaSans_Regular,
      marginLeft: wp(5),
      fontSize: RFPercentage(1.9),
    },
    countText: {
      color: Colors.primary_text,
      marginHorizontal: 8,
      fontFamily: Fonts.PlusJakartaSans_Bold,
    },
  
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

  return (
    <View style={{ flex: 1, backgroundColor: Colors.secondary_color }}>
      <Loader loading={loading} />
      {showPopUp && <PopUp color={popUpColor} message={PopUpMesage} />}
      <ScrollView
        ref={scrollViewRef}
        scrollToOverflowEnabled={true}
        contentContainerStyle={{ flexGrow: 1 }}>
        <StackHeader title={'My Cart'} />
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.itemView}>
            <View style={styles.imageContainer}>
              <Icons.Van />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Estimate Delivery Time</Text>
              <Text
                style={{
                  ...styles.title,
                  color: Colors.primary_color,
                  fontFamily: Fonts.Inter_SemiBold,
                  fontSize: RFPercentage(2.2),
                }}>
                40 mins
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            height: hp(0.1),
            marginVertical: 10,
            backgroundColor: Colors.borderGray,
          }}
        />
        <View>

          {/* <FlatList
            data={data}
            scrollEnabled={false}
            renderItem={({item, index}) => {
              console.log(item);
              
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
                          <Ionicons name="close-circle-outline" size={25} color={'#000'} />
                        </TouchableOpacity>
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
                  <Feather name="plus" color={Colors.primary_color} size={16} />
                  <Text
                    style={{
                      color: Colors.primary_color,
                      fontFamily: Fonts.Inter_Medium,
                      fontSize: RFPercentage(1.7),
                    }}>
                    Add more items
                  </Text>
                </TouchableOpacity>
              );
            }}
          /> */}
        </View>
        <CartSwipeListView
          data={my_cart}
          onDecrement={item => handleRemoveQuantity(item)}
          onIncrement={item => handleAddQuantity(item)}
          onDelete={item => handleDelete(item)}
          itemLoading={itemLoading}
          selectedItem={selectedItem}
          ListFooterComponent={() => <TouchableOpacity
            onPress={() => navigation.navigate('AddItems')}
            style={{
              ...styles.rowView,
              paddingHorizontal: wp(4),
              marginVertical: 10,
              justifyContent: 'flex-start'
            }}>
            <Feather name="plus" color={Colors.icon} size={16} />
            <Text
              style={{
                color: Colors.primary_color,
                fontFamily: Fonts.Inter_Medium,
                fontSize: RFPercentage(2.1),
              }}>
              {data.length > 0 ? 'Add more items' : 'Add items'}
            </Text>
          </TouchableOpacity>}
        />


        <CRBSheetComponent
          height={170}
          refRBSheet={btmSheetRef}
          content={
            <View style={{ width: wp(90) }} >
              <View style={styles.rowViewSB1}>
                <Text style={styles.rbSheetHeading}>Select an option</Text>
                <TouchableOpacity
                  onPress={() => closeBtmSheet()}>
                  <Ionicons name={'close'} size={22} color={'#1E2022'} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.rowView} onPress={async () => {
                navigation.navigate('ManageAddress')
                closeBtmSheet()
              }} >
                <Icons.MarkerOutlineActive />
                <Text style={styles.btmsheettext} >Manage Address</Text>
              </TouchableOpacity>
              <ItemSeparator />
              <TouchableOpacity style={styles.rowView} onPress={() => {
                closeBtmSheet()
                navigation.navigate('Map')
              }} >
                <Icons.AddSimple />
                <Text style={styles.btmsheettext} >Add Location</Text>
              </TouchableOpacity>

            </View>
          }
        />
          <CRBSheetComponent
          refRBSheet={ref_RBSheetPaymentOption}
          height={180}
          content={
            <View style={{ width: wp(90) }}>
              <View style={styles.rowViewSB1}>
                <Text style={styles.rbSheetHeading}>Select an option</Text>
                <TouchableOpacity
                  onPress={() => ref_RBSheetPaymentOption?.current?.close()}>
                  <Ionicons name={'close'} size={22} color={'#1E2022'} />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(setSelectedPaymentType('cash'))
                    ref_RBSheetPaymentOption?.current?.close()
                  }}
                  style={styles.rowView}>
                
                  <Text
                    style={{
                      color: Colors.secondary_text,
                      fontFamily: Fonts.PlusJakartaSans_Regular,
                      marginTop: -2,
                      fontSize: RFPercentage(1.8),
                    }}>
                    Cash on Delivery
                  </Text>
                </TouchableOpacity>
                <ItemSeparator />
                <TouchableOpacity
                  onPress={() => {
                    dispatch(setSelectedPaymentType('card'))
                    ref_RBSheetPaymentOption?.current?.close()

                  }}
                  style={styles.rowView}>
                 
                  <Text
                    style={{
                      color: Colors.secondary_text,
                      fontFamily: Fonts.PlusJakartaSans_Regular,
                      marginTop: -2,
                      fontSize: RFPercentage(1.8),
                    }}>
                    Wallet Payment
                  </Text>
                </TouchableOpacity>
                
              </View>
            </View>
          }
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingBottom: 20,
          }}>
          <CButton
            title="Checkout"
            loading={checkOutLoading}
            onPress={() => {
              if (data?.length == 0) {
                handlePopup(dispatch, 'Please Add Items in cart to checkout', 'red');
              } else {
                calculatePreOrderDetails()
                
              }
            }}
          />
        </View>

      </ScrollView>

    </View>
  );
};

export default MyCart;



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
//                   color: Colors.primary_color,
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
//                   <Text style={{...styles.title, color: Colors.primary_color}}>
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
