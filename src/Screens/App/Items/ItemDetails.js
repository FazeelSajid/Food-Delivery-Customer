import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Colors, Fonts, Icons, Images } from '../../../constants';
import StackHeader from '../../../components/Header/StackHeader';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import PriceText from '../../../components/Text';
import ImageSlider from '../../../components/Slider/ImageSlider';
import ConfirmationModal from '../../../components/Modal/ConfirmationModal';
import SuccessModal from '../../../components/Modal/SuccessModal';
import Lottie from 'lottie-react-native';
import ImageSliderCircle from '../../../components/Slider/ImageSliderCircle';
import RBSheetConfirmation from '../../../components/BottomSheet/RBSheetConfirmation';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../../components/Loader';
import api from '../../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  checkRestaurantTimings,
  fetchApisGet,
  getRestaurantDetail,
  handlePopup,
  showAlert,
} from '../../../utils/helpers';
import CButton from '../../../components/Buttons/CButton';
import ItemSeparator from '../../../components/Separator/ItemSeparator';
import RBSheetGuestUser from '../../../components/BottomSheet/RBSheetGuestUser';
import { useDispatch, useSelector } from 'react-redux';
import {
  addItemToCart,
  clearCartItems,
  getCartItems,
  getCustomerCart,
  removeCartItemQuantity,
  removeItemFromCart,
  updateCartItemQuantity,
} from '../../../utils/helpers/cartapis';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  addItemToMYCart,
  addToCart,
  removeItemFromMyCart,
  setCartRestaurantId,
  updateMyCartList,
} from '../../../redux/CartSlice';
import RBSheetOtherRestaurantCartItem from '../../../components/BottomSheet/RBSheetOtherRestaurantCartItem';
import { addFavoriteitem, getItemFavoriteStatus, removeFavoriteitem } from '../../../utils/helpers/FavoriteApis';
import RBSheetSuccess from '../../../components/BottomSheet/RBSheetSuccess';
import RBSheetRestaurantClosed from '../../../components/BottomSheet/RBSheetRestaurantClosed';
import CRBSheetComponent from '../../../components/BottomSheet/CRBSheetComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RadioButton } from 'react-native-paper';
import Heart from '../../../Assets/svg/HeartWhite.svg';
import HeartActive from '../../../Assets/svg/HeartActiveWhite.svg';
import PopUp from '../../../components/Popup/PopUp';
import NoDataFound from '../../../components/NotFound/NoDataFound';


const ItemDetails = ({ navigation, route }) => {
  const ref_RBSheetSuccess = useRef();
  const dispatch = useDispatch();
  const { customer_id, showPopUp, popUpColor, PopUpMesage, join_as_guest, customerCartId } = useSelector(store => store.store)

  const { cart, cart_restaurant_id, my_cart } = useSelector(store => store.cart);
  const ref_RBSheet = useRef();
  const ref_cartAlert = useRef();
  const removeBtmSheet = useRef()
  const ref_RBSheetResClosed = useRef();
  const { favoriteItems } = useSelector(store => store.favorite);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [count, setCount] = useState(0);
  const [itemDetail, setItemDetail] = useState('');
  // const [restaurantDetails, setRestaurantDetails] = useState('');
  const [data, setData] = useState([]);
  // const [isFavorite, setIsFavorite] = useState(false);
  const [restaurant_timings, setRestaurant_timings] = useState('')
  const btmSheetRef = useRef()
  const [selectedVariation, setSelectedVariation] = useState({
    variation_id: '',
    variation_name: '',
    variation_price: '',
  });
  const [variations, setVariations] = useState([]);
  const [variationCount, setVariationCount] = useState();
  const isItemFavorite = (id) => {
    return favoriteItems.some(item => item?.item?.item_id === route?.params?.id);
  };
  const isFavorite = isItemFavorite()

  // console.log(route?.params?.id);


  // Function to handle radio button press

  // console.log(variations);



  // const showBtmSheet = () => {
  //   btmSheetRef?.current?.open()
  // }

  // const closeBtmSheet = () => {
  //   btmSheetRef?.current?.close()
  // }
  const checkVariationInCart = async (array) => {
    if (!route?.params?.id) return;

    // Fetch and update cart items
    // const cartItems = await getCartItems(customerCartId, dispatch);
    let cartItems;
    const response = await fetchApisGet(api.get_cart_items + customerCartId, false, dispatch)
    if (response.status) {
      // console.log(response);

      dispatch(updateMyCartList(response.result));
      cartItems = response.result;
    }


    // Filter items matching the route ID
    const filteredItems = cartItems?.filter(item => item?.item_id === route?.params?.id);


    // Calculate total quantity
    const totalQuantity = filteredItems?.reduce((sum, item) => sum + (item?.quantity || 0), 0);
    setCount(totalQuantity || 0);

    // Create matching variations
    const matchingVariations = filteredItems?.map(item => ({
      variation_id: item?.variation_id,
      variation_name: item?.itemData?.variationData?.variation_name,
      price: parseFloat(item?.itemData?.variationData?.price || 0),
      quantity: item?.quantity || 0,
      sub_total: item?.sub_total || 0,
      cart_item_id: item?.cart_item_id,
      cart_id: item?.cart_id,
      item_id: item?.item_id,
    }));

    // Map item prices with matching variations
    const array3 = (Array.isArray(array)
      ? array
      : Array.isArray(itemDetail?.item_prices)
        ? itemDetail.item_prices
        : []
    ).map(item2 => {
      if (!item2) return {}; // Fallback for undefined `item2`

      const match = matchingVariations?.find(item1 => item1?.variation_id === item2?.variation_id);
      return match || item2; // Use match if found, else fallback to item2
    });



    console.log({ matchingVariations });
    console.log({ array3 });

    setVariations(array3);

  };



  const add_item_to_cart = async (variation_id, quantity) => {
    try {
      setLoading(true);

      const data = {
        item_id: route?.params?.id?.toString(),
        cart_id: customerCartId?.toString(),
        item_type: 'item',
        comments: 'Adding item to cart',
        quantity: quantity,
        variation_id: variation_id,
      };

      console.log('Data for Add to Cart:', data);

      const response = await addItemToCart(data, dispatch);

      if (response?.status) {
        // Refresh cart and show success message
        checkVariationInCart(variation_id);
        // ref_RBSheetSuccess?.current?.open();
      } else {
        handlePopup(dispatch, response?.message, 'red');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setLoading(false);
    }
  };







  // const removeFavorite = async id => {
  //   setLoading(true);
  //   // favourite_item_id

  //   fetch(api.delete_item_from_favorites + id, {
  //     method: 'DELETE',
  //     // body: JSON.stringify(data),
  //     headers: {
  //       'Content-type': 'application/json; charset=UTF-8',
  //     },
  //   })
  //     .then(response => response.json())
  //     .then(async response => {
  //       console.log('response : ', response);
  //       if (response?.status == true) {
  //         setFavoriteDetails(response?.result);
  //         setIsFavorite(false);
  //       } else {
  //         showAlert(response?.message);
  //       }
  //     })
  //     .catch(err => {
  //       console.log('Error   ', err);
  //       showAlert('Something Went Wrong');
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

  // const handleFavorite = async () => {
  //   console.log('handleFavorite called...');
  //   setLoading(true);

  //   // let customer_id = await AsyncStorage.getItem('customer_id');
  //   let data = {
  //     customer_id: customer_id,
  //     item_id: route?.params?.id,
  //   };
  //   console.log('data : ', data);

  //   fetch(api.add_item_to_favorites, {
  //     method: 'POST',
  //     body: JSON.stringify(data),
  //     headers: {
  //       'Content-type': 'application/json; charset=UTF-8',
  //     },
  //   })
  //     .then(response => response.json())
  //     .then(async response => {
  //       console.log('response : ', response);
  //       if (response?.status == true) {
  //         setFavoriteDetails(response?.result);
  //         setIsFavorite(true);
  //       } else {
  //         showAlert(response?.message);
  //       }
  //     })
  //     .catch(err => {
  //       console.log('Error in add item to favorite :  ', err);
  //       showAlert('Something Went Wrong');
  //     })
  //     .finally(() => setLoading(false));
  // };


  // const onDecrement = () => {
  //   if (count > 1) {
  //     setCount(count - 1);
  //   }
  // };

  // const handleDelete = async item => {
  //   try {
  //     setLoading(true);
  //     console.log('item   :  ', item?.cart_item_id);
  //     let cart = await getCustomerCart(customer_id);
  //     console.log('cart  : ', cart);

  //     removeItemFromCart(cart?.cart_id,item?.cart_item_id)
  //       .then(response => {
  //         if (response?.status == true) {
  //           console.log('response  :  ', response);
  //           const filter = data.filter(
  //             element => element?.cart_item_id != item?.cart_item_id,
  //           );
  //           // console.log('filter, from remove from cart' ,filter );

  //           setData(filter);
  //           dispatch(addToCart(filter));

  //           //my_cart
  //           // dispatch(removeItemFromMyCart(item?.cart_item_id));
  //           dispatch(updateMyCartList(filter));

  //           if (filter?.length == 0) {
  //             dispatch(setCartRestaurantId(null));
  //           }
  //         } else {
  //           setTimeout(() => {
  //             showAlert(response?.message);
  //           }, 500);
  //         }
  //       })
  //       .catch(error => {
  //         console.log('error: ', error);
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   } catch (error) {
  //     setLoading(false);
  //     console.log('error in delete item  :  ', error);
  //   }
  // };

  // const handleOnRemove = async () => {
  //   // setLoading(true);

  //   const checkVariation = checkVariationInCart(selectedVariation.variation_id)
  //   //  console.log(checkVariation);

  //   if (count === 0) {
  //     return
  //   } else if (count === 1 && checkVariation.length > 0) {
  //     removeItemFromCart(customerCartId, checkVariation[0]?.cart_item_id, dispatch)
  //       .then(response => {
  //         if (response?.status == true) {
  //           console.log('response  :  ', response);
  //           const filter = my_cart.filter(
  //             element => element?.cart_item_id != checkVariation?.cart_item_id,
  //           );
  //           // console.log('filter, from remove from cart' ,filter );
  //           setCount(0)
  //           dispatch(addToCart(filter));

  //           //my_cart
  //           dispatch(removeItemFromMyCart(item?.cart_item_id));
  //           dispatch(updateMyCartList(filter));


  //         } else {
  //           handlePopup(dispatch, response?.message, 'red');
  //         }
  //       })
  //       .catch(error => {
  //         console.log('error: ', error);
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   }
  //   else {
  //     let obj = {
  //       cart_item_id: checkVariation[0]?.cart_item_id,
  //       quantity: count - 1,
  //     };

  //     // console.log(obj);

  //     updateCartItemQuantity(obj, dispatch)
  //       .then(response => {
  //         if (response.status === true) {
  //           const newData = my_cart?.map(item => {
  //             if (item?.item_id == route?.params?.id) {
  //               return {
  //                 ...item,
  //                 quantity: checkVariation[0]?.quantity - 1,
  //               };
  //             } else {
  //               return { ...item };
  //             }
  //           });
  //           setCount(count - 1)
  //           dispatch(addToCart(newData));
  //           dispatch(updateMyCartList(newData));
  //           handlePopup(dispatch, response.message, 'green')
  //         } else {
  //           handlePopup(dispatch, response.message, 'red')
  //         }
  //       })

  //     // also update quantity in redux

  //     // dispatch(setCartRestaurantId(restaurantDetails?.restaurant_id));
  //     // ref_RBSheetSuccess?.current?.open();
  //   }



  //   // // remove all items of previous restaurant
  //   // clearCartItems()
  //   //   .then(response => {
  //   //     //add new item
  //   //     dispatch(setCartRestaurantId(restaurantDetails?.restaurant_id));
  //   //     console.log(
  //   //       'new cart restaurant_id : ',
  //   //       restaurantDetails?.restaurant_id,
  //   //     );
  //   //     // //my_cart
  //   //     // dispatch(clearMyCart());
  //   //     //my_cart
  //   //     dispatch(updateMyCartList([]));

  //   //     add_item_to_cart();
  //   //   })
  //   //   .catch(error => {
  //   //     console.log('error : ', error);
  //   //   })
  //   //   .finally(() => {
  //   //     setLoading(false);
  //   //   });
  // };

  // const validate = () => {
  //   if (cart_restaurant_id == null) {
  //     return true;
  //   } else if (cart_restaurant_id != restaurantDetails?.restaurant_id) {
  //     console.log(
  //       'cart_restaurant_id  : ',
  //       cart_restaurant_id,
  //       restaurantDetails?.restaurant_id,
  //     );
  //     ref_cartAlert.current.open();
  //     return false;
  //   } else {
  //     return true;
  //   }
  // };



  // const add_item_to_cart = async (id) => {
  //   setLoading(true);
  //   // let customer_id = await AsyncStorage.getItem('customer_id');
  //   console.log('customer_Id :  ', customer_id);
  //   // let cart = await getCustomerCart(customer_id, dispatch);
  //   console.log('______cart    :  ', customerCartId);
  //   let data = {
  //     item_id: route?.params?.id?.toString(),
  //     cart_id: customerCartId.toString(),
  //     item_type: 'item',
  //     comments: 'Adding item in cart',
  //     quantity: count?.toString(),
  //     variation_id: selectedVariation?.variation_id
  //   };

  //   console.log('data   :  ', data);

  //   await addItemToCart(data, dispatch)
  //     .then(async response => {
  //       console.log('response ', response);
  //       if (response?.status == true) {
  //         // navigation?.navigate('MyCart');
  //         // cart_restaurant_id
  //         // dispatch(setCartRestaurantId(restaurantDetails?.restaurant_id));
  //         //my_cart
  //         // let cartItems = await getCartItems(customerCartId, dispatch);
  //         // dispatch(updateMyCartList(cartItems));
  //         checkVariationInCart(selectedVariation?.variation_id)

  //         // setSelectedVariation(null)

  //         ref_RBSheetSuccess?.current?.open();
  //       } else {
  //         handlePopup(dispatch, response?.message, 'red');
  //       }
  //     })
  //     .catch(error => {
  //       console.log('error  :  ', error);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

  // const filter = my_cart?.filter(
  //   item => item?.item_id == route?.params?.id,
  // );
  // console.log(filter, 'filter');

  useEffect(() => {

    if (itemDetail) {
      //  console.log(itemDetail.item_prices[0]);
      setSelectedVariation({
        variation_id: itemDetail.item_prices[0].variation_id,
        variation_name: itemDetail.item_prices[0].variation_name,
        variation_price: itemDetail.item_prices[0].price,
      });

      // checkVariationInCart(itemDetail.item_prices[0].variation_id)


    }
  }, [itemDetail])

  const closeRmoveBtmSheet = () => {
    removeBtmSheet?.current?.close()
  }


  const handleDecrement = async (variation_id, item_id) => {
    if (variation_id === null) {
      showRmoveBtmSheet();
      return;
    }

    const filteredItems = my_cart?.filter(item => item.item_id == item_id);

    if (filteredItems?.length > 0) {
      const matchingVariation = filteredItems?.filter(item => item.variation_id == variation_id);


      if (matchingVariation?.length > 0) {
        const [variation] = matchingVariation;

        if (variation?.quantity === 1) {
          await removeCartItemQuantity({
            item_id: variation.cart_item_id,
            cart_id: variation.cart_id,
          }).then(response => {
            if (response.status) {
              checkVariationInCart(variation_id)
              handlePopup(dispatch, `${itemDetail?.item_name} removed from cart`, 'green');
              // setVariationCount(0);
              setCount(count - 1);
            }
          });
        } else {
          const updatedItem = {
            cart_item_id: variation.cart_item_id,
            quantity: variation.quantity - 1,
          };

          await updateCartItemQuantity(updatedItem, dispatch).then(response => {
            if (response.status) {
              handlePopup(dispatch, `1 ${itemDetail?.item_name} removed from cart`, 'green');
              checkVariationInCart(variation_id);
              setCount(count - 1);
            }
          });
        }
      }
    }
  };


  // console.log({variations}); 

  const showRmoveBtmSheet = async () => {
    if (itemDetail.item_prices?.length > 1) {

      removeBtmSheet?.current?.open()
    } else {
      handleDecrement(itemDetail.item_prices[0].variation_id, itemDetail.item_id, itemDetail?.item_name,)
    }


  }

  const handleAddToCart = async (variation_id, quantity) => {

    const filteredItems = my_cart?.filter(item => item?.item_id === route?.params?.id) || [];
    const existingVariation = filteredItems.find(
      item => item?.variation_id === variation_id
    );

    if (existingVariation) {
      // Update quantity for the existing variation
      const updateData = {
        cart_item_id: existingVariation.cart_item_id,
        quantity: quantity,
      };
      await updateCartItemQuantity(updateData, dispatch);

      // Refresh cart data and open success sheet
      checkVariationInCart(variation_id);
      // ref_RBSheetSuccess?.current?.open();
    } else {
      // Add new item to the cart
      add_item_to_cart(variation_id, quantity);
    }
  };

  const getItemDetails = async id => {
    setFetching(true);
    fetch(api.get_item_detail + id)
      .then(response => response.json())
      .then(async response => {
        let food = response?.result ? response?.result : {};
        setItemDetail(response?.result ? response?.result : {});
        setSelectedVariation({
          variation_id: food?.item_prices[0]?.variation_id,
          variation_name: food?.item_prices[0]?.variation_name,
          variation_price: food?.item_prices[0]?.price

        })

        checkVariationInCart(response?.result?.item_prices)
        let imageList = [];
        for (const item of food?.images) {
          let obj = {
            image: item,
          };
          imageList.push(obj);
        }
        setData(imageList);
      })
      .catch(err => console.log('error : ', err))
      .finally(() => setFetching(false));
  };

  useEffect(() => {
    setFetching(true)
    let item_id = route?.params?.id;
    if (item_id) {
      getItemDetails(item_id);

    }


  }, []);


  // console.log(variations);


  return (
    <View style={styles.container}>

      {showPopUp && <PopUp color={popUpColor} message={PopUpMesage} />}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, }}>
        {
          itemDetail ?
            <View style={{ flexGrow: 1, backgroundColor: Colors.primary_color }} >
              <StatusBar backgroundColor={loading ? Colors.secondary_color : Colors.primary_color} barStyle={'light-content'} />
              <StackHeader
                enableStatusBar={false}
                titleColor={'white'}
                backIconColor={'white'}
                title={'Details'}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => {
                      if (join_as_guest) {
                        ref_RBSheet?.current?.open();
                      } else {
                        isFavorite
                          ? removeFavoriteitem(route?.params?.id, customer_id, favoriteItems, dispatch)
                          : addFavoriteitem(route?.params?.id, customer_id, dispatch)
                      }
                    }}
                  >
                    {isFavorite ? (
                      <HeartActive />
                    ) : (
                      <Heart />
                    )}
                  </TouchableOpacity>
                }
              />
              <View style={{ flex: 1 }}>
                <View style={{ paddingHorizontal: 25 }}>
                  <View style={styles.rowViewSB}>
                    <Text style={{ ...styles.itemName, flex: 1 }}>
                      {itemDetail?.item_name}
                    </Text>

                    {/* {
                      itemDetail.item_prices?.length > 1 ? <View
                        style={{
                          ...styles.rowView,
                          backgroundColor: `${Colors.secondary_color}40`,
                          borderRadius: 15,
                        }}>
                        <TouchableOpacity
                          onPress={() => showRmoveBtmSheet()}
                          style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                          <AntDesign name="minus" color={Colors.secondary_color} size={16} />
                        </TouchableOpacity>
                        <Text
                          style={{
                            color: Colors.secondary_color,
                            fontFamily: Fonts.PlusJakartaSans_Bold,
                            fontSize: RFPercentage(1.7),
                            marginTop: -2,
                          }}>
                          {count}
                        </Text>
                        <TouchableOpacity
                          onPress={() => showRmoveBtmSheet()}
                          style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                          <AntDesign name="plus" color={Colors.secondary_color} size={16} />
                        </TouchableOpacity>
                      </View> : <View
                        style={{
                          ...styles.rowView,
                          backgroundColor: `${Colors.secondary_color}40`,
                          borderRadius: 15,
                        }}>
                        <TouchableOpacity
                          onPress={() => handleDecrement(itemDetail.item_prices[0].variation_id, itemDetail.item_id, itemDetail?.item_name)}
                          style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                          <AntDesign name="minus" color={Colors.secondary_color} size={16} />
                        </TouchableOpacity>
                        <Text
                          style={{
                            color: Colors.secondary_color,
                            fontFamily: Fonts.PlusJakartaSans_Bold,
                            fontSize: RFPercentage(1.7),
                            marginTop: -2,
                          }}>
                          {count}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleAddToCart(itemDetail.item_prices[0].variation_id, count + 1)}
                          style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                          <AntDesign name="plus" color={Colors.secondary_color} size={16} />
                        </TouchableOpacity>
                      </View>
                    } */}
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: Colors.secondary_color,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    marginTop: 5,
                  }}>
                  {/* <ImageSlider data={data} marginBottom={1} /> */}
                  <ImageSliderCircle data={data} marginBottom={1} />
                  <View style={{ paddingHorizontal: 20, flex: 1, }}>
                    {
                      // itemDetail?.item_prices?.length > 1 ? <View style={styles.AboutContainer}>
                      //   <View style={styles.rowViewSB} >

                      //     <View style={styles.variationContainer} >
                      //       <TouchableOpacity onPress={showBtmSheet} style={[styles.rowViewSB, { alignItems: 'center' }]} >
                      //         <Text style={styles.sizeText} >Variations</Text>
                      //         <Ionicons name={'chevron-down'} size={19} color={Colors.primary_color} />
                      //       </TouchableOpacity>
                      //       <Text style={styles.variationName} >{selectedVariation?.variation_name}</Text>
                      //     </View>
                      //     <Text style={styles.priceTxt} >£ {selectedVariation?.variation_price}</Text>
                      //   </View>
                      //   {/* <Vi></Vi> */}

                      //   <Text
                      //     style={styles.descriptionTxt}>
                      //     About the Food
                      //   </Text>
                      //   <Text
                      //     style={styles.description}>
                      //     {itemDetail?.description}
                      //   </Text>

                      // </View>
                      // : 
                      <View style={styles.AboutContainer} >
                        <View style={styles.rowViewSB}>
                          <Text
                            style={[styles.descriptionTxt, { marginTop: 0 }]}>
                            About the Food
                          </Text>
                          <Text style={[styles.priceTxt]} >£ {selectedVariation?.variation_price}</Text>
                        </View>
                        <Text
                          style={styles.description}>
                          {itemDetail?.description}
                        </Text>
                      </View>
                    }

                  </View>
                  <ItemSeparator width={wp(100)} />

                  <View style={{ marginBottom: wp(2) }}>
                    {count === 0 ?  <CButton
                      title="Add to Cart"
                      // width={wp(70)}
                      loading={loading}
                      width={wp(90)}
                      height={hp(6)}
                      marginTop={-2}
                      marginBottom={1}
                      textStyle={{ textTransform: 'none' }}
                      onPress={() => {
                        console.log('join_as_guest  : ____ ', join_as_guest);
                        if (join_as_guest) {
                          ref_RBSheet?.current?.open();
                        } else {
                          if ( itemDetail.item_prices?.length > 1) {
                            showRmoveBtmSheet()
                          }else{
                            handleAddToCart(
                              itemDetail.item_prices[0]?.variation_id,
                              count + 1
                            )
                          }
                         
                        }
                      }}
                    /> : (
                      <View
                        style={{
                          ...styles.rowView,
                          backgroundColor:  `${Colors.primary_color}`,
                          borderRadius: wp(10),
                          justifyContent: 'center',
                          paddingVertical:hp(1) ,
                          width: wp(90),
                          alignSelf:'center'
                        }}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            itemDetail.item_prices?.length > 1
                              ? showRmoveBtmSheet()
                              : handleDecrement(
                                itemDetail.item_prices[0]?.variation_id,
                                itemDetail.item_id,
                                itemDetail?.item_name
                              )
                          }
                          style={{
                            padding: 5,
                            backgroundColor: `${Colors.secondary_color}40`,
                            borderRadius: wp(5),
                          }}
                        >
                          <AntDesign name="minus" color={Colors.secondary_color} size={18} />
                        </TouchableOpacity>

                        <Text
                          style={{
                            color: Colors.secondary_color,
                            fontFamily: Fonts.PlusJakartaSans_Bold,
                            fontSize:  RFPercentage(1.7),
                            marginTop: -2,
                            marginHorizontal: wp(3),
                          }}
                        >
                          {count}
                        </Text>

                        <TouchableOpacity
                          onPress={() =>
                            itemDetail.item_prices?.length > 1
                              ? showRmoveBtmSheet()
                              : handleAddToCart(
                                itemDetail.item_prices[0]?.variation_id,
                                count + 1
                              )
                          }
                          style={{
                            padding: 5,
                            backgroundColor: `${Colors.secondary_color}40`,
                            borderRadius: wp(5),
                          }}
                        >
                          <AntDesign name="plus" color={Colors.secondary_color} size={18} />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>



                  {/* <View style={{ marginBottom: wp(2), }} > */}
                  {/* {
                      count === 0
                    } */}
                  {
                    //   itemDetail.item_prices?.length > 1 ?   <View
                    //   style={{
                    //     ...styles.rowView,
                    //     backgroundColor: `${Colors.primary_color}`,
                    //     borderRadius: 15,
                    //     justifyContent: 'center',
                    //     paddingVertical: hp(1)
                    //   }}>
                    //   <TouchableOpacity
                    //     onPress={() => showRmoveBtmSheet()}
                    //     style={{padding: 5,  backgroundColor: `${Colors.secondary_color}40`,borderRadius : wp(5) }}>
                    //     <AntDesign name="minus" color={Colors.secondary_color} size={18} />
                    //   </TouchableOpacity>
                    //   <Text
                    //     style={{
                    //       color: Colors.secondary_color,
                    //       fontFamily: Fonts.PlusJakartaSans_Bold,
                    //       fontSize: RFPercentage(2),
                    //       marginTop: -2,
                    //       marginHorizontal: wp(3)
                    //     }}>
                    //     {count}
                    //   </Text>
                    //   <TouchableOpacity
                    //     onPress={() => showRmoveBtmSheet()}
                    //     style={{padding: 5,  backgroundColor: `${Colors.secondary_color}40`,borderRadius : wp(5) }}>
                    //     <AntDesign name="plus" color={Colors.secondary_color} size={18} />
                    //   </TouchableOpacity>
                    // </View>:   <View
                    //   style={{
                    //     ...styles.rowView,
                    //     backgroundColor: `${Colors.secondary_color}40`,
                    //     borderRadius: 15,
                    //   }}>
                    //   <TouchableOpacity
                    //     onPress={() =>  handleDecrement(itemDetail.item_prices[0].variation_id, itemDetail.item_id, itemDetail?.item_name)}
                    //     style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                    //     <AntDesign name="minus" color={Colors.secondary_color} size={18} />
                    //   </TouchableOpacity>
                    //   <Text
                    //     style={{
                    //       color: Colors.secondary_color,
                    //       fontFamily: Fonts.PlusJakartaSans_Bold,
                    //       fontSize: RFPercentage(1.7),
                    //       marginTop: -2,
                    //     }}>
                    //     {count}
                    //   </Text>
                    //   <TouchableOpacity
                    //     onPress={() =>  handleAddToCart(itemDetail.item_prices[0].variation_id, count+1)}
                    //     style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                    //     <AntDesign name="plus" color={Colors.secondary_color} size={16} />
                    //   </TouchableOpacity>
                    // </View>
                  }
                  {/* <CButton
                      title="Add to Cart"
                      // width={wp(70)}
                      loading={loading}
                      width={wp(90)}
                      height={hp(6)}
                      marginTop={-2}
                      marginBottom={1}
                      textStyle={{ textTransform: 'none' }}
                      onPress={() => {
                        console.log('join_as_guest  : ____ ', join_as_guest);
                        if (join_as_guest) {
                          ref_RBSheet?.current?.open();
                        } else {
                          handleAddToCart()
                        }
                      }}
                    /> */}
                  {/* </View> */}
                </View>
              </View>
            </View>
            : fetching ? <Loader loading={fetching} bgColor={Colors.secondary_color} /> :

              <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} >
                <StackHeader
                  enableStatusBar={false}
                  titleColor={Colors.primary_color}
                  backIconColor={Colors.primary_color}
                  title={'Details'}
                /><NoDataFound text={'Oops Something went wrong'} svgHeight={hp(20)} /></View>
        }
      </ScrollView>



      <RBSheetGuestUser
        refRBSheet={ref_RBSheet}
        btnText={'OK'}
        onSignIn={() => {
          ref_RBSheet?.current?.close();
          navigation?.popToTop();
          navigation?.replace('SignIn');
        }}
        onSignUp={() => {
          ref_RBSheet?.current?.close();
          navigation?.popToTop();
          navigation?.replace('SignUp');
        }}
      />

      <RBSheetSuccess
        refRBSheet={ref_RBSheetSuccess}
        title={`${itemDetail?.item_name} added to cart.`}
        btnText={'OK'}
        onPress={() => {
          ref_RBSheetSuccess?.current?.close();
        }}
      />

      {/* <View> */}
      {/* <ConfirmationModal
        visible={visible}
        setVisible={setVisible}
        title={'Confirmation'}
        description={'Do you want to delete this item?'}
        cancelText={'Cancel'}
        okText={'Delete'}
        buttonContainerStyle={{ marginTop: -20 }}
        onOK={() => {
          setVisible(false);
          navigation.goBack();
        }}
        topContent={
          <View
            style={{
              height: 110,
              width: 110,
            }}>
            <Lottie
              source={Images.success_check}
              autoPlay
              loop={true}
              resizeMode="cover"
            />
          </View>
        }
      /> */}

      {/* <RBSheetOtherRestaurantCartItem
        refRBSheet={ref_cartAlert}
        title={'Remove your previous items?'}
        description={
          'You still have products from another restaurant.Shall we start over with a fresh cart?'
        }
        okText={'Remove'}
        cancelText={'No'}
        onOk={() => {
          // handleOnRemove();
          ref_cartAlert?.current?.close();
        }}
        onCancel={() => {
          ref_cartAlert?.current?.close();
        }}
      /> */}


      {/* <RBSheetRestaurantClosed
        refRBSheet={ref_RBSheetResClosed}
        title={`“${restaurant_timings?.restaurant_details?.user_name
          }” is closed ${restaurant_timings?.closed_till
            ? ' till ' + restaurant_timings?.closed_till
            : '.'
          }`}
      /> */}


      {/* <CRBSheetComponent
        height={230}
        refRBSheet={btmSheetRef}
        content={
          <View style={{ width: wp(90) }} >
            <View style={styles.rowViewSB} >
              <Text style={[styles.variationTxt, { fontSize: RFPercentage(2) }]} >Select your variation</Text>
              <TouchableOpacity
                onPress={() => closeBtmSheet()}>
                <Ionicons name={'close'} size={22} color={'#1E2022'} />
              </TouchableOpacity>
            </View>
            {itemDetail?.item_prices?.map((variation, i) => (
              <View key={i} style={[styles.rowViewSB, { borderBottomColor: Colors.borderGray, borderBottomWidth: wp(0.3), paddingBottom: wp(1) }]}>
                <TouchableOpacity style={styles.rowView} >
                  <RadioButton
                    color={Colors.primary_color} // Custom color for selected button
                    uncheckedColor={Colors.primary_color} // Color for unselected buttons
                    status={selectedVariation?.variation_id === variation?.variation_id ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setSelectedVariation({
                        variation_id: variation.variation_id,
                        variation_name: variation.variation_name,
                        variation_price: variation.price,
                      });

                      checkVariationInCart(variation.variation_id)

                      closeBtmSheet()

                    }}
                  />
                  <Text style={styles.variationText}>{variation.variation_name}</Text>
                </TouchableOpacity>
                <Text style={styles.variationText}>£ {variation?.price}</Text>
              </View>
            ))}

          </View>
        }

      /> */}

      {/* </View> */}

      <CRBSheetComponent
        height={230}
        refRBSheet={removeBtmSheet}
        content={
          <View style={{ width: wp(90) }} >
            <View style={styles.rowViewSB} >
              <Text style={[styles.variationTxt, { fontSize: RFPercentage(2) }]} >Select your variation</Text>
              <TouchableOpacity
                onPress={() => closeRmoveBtmSheet()}>
                <Ionicons name={'close'} size={22} color={'#1E2022'} />
              </TouchableOpacity>
            </View>
            {variations?.map((variation, i) => (
              <View key={i} style={[styles.rowViewSB, { borderBottomColor: Colors.borderGray, borderBottomWidth: wp(0.3), paddingBottom: wp(1) }]}>
                <TouchableOpacity style={styles.rowView} >
                  <View>

                  </View>
                  <RadioButton
                    color={Colors.primary_color} // Custom color for selected button
                    uncheckedColor={Colors.primary_color} // Color for unselected buttons
                    status={selectedVariation?.variation_id === variation?.variation_id ? 'checked' : 'unchecked'}
                  // onPress={() => handleDecrement(variation?.variation_id, variation.item_id)}
                  />
                  <Text style={styles.variationText}>{variation.variation_name}</Text>
                </TouchableOpacity>

                {
                  variation?.cart_item_id ? <View
                    style={{
                      ...styles.rowView,
                      backgroundColor: `${Colors.primary_color}`,
                      borderRadius: 15,
                      paddingVertical: 5,
                      flex: 0.3,
                      alignSelf: 'flex-end',
                      justifyContent: 'space-around'
                    }}>
                    <TouchableOpacity
                      onPress={() => handleDecrement(variation?.variation_id, variation?.item_id)}
                      style={{
                        backgroundColor: `${Colors.secondary_color}40`,
                        borderRadius: wp(3),
                        // paddingHorizontal: wp(0),
                        // marginLeft: wp(2),
                      }}>
                      <AntDesign name="minus" color={Colors.secondary_color} size={16} />
                    </TouchableOpacity>
                    <Text
                      style={{
                        color: Colors.secondary_color,
                        fontFamily: Fonts.PlusJakartaSans_Bold,
                        fontSize: RFPercentage(1.5),
                        marginTop: -2,
                        backgroundColor: `${Colors.secondary_color}40`,
                        borderRadius: wp(3),
                        paddingHorizontal: wp(1.5),

                      }}>
                      {variation?.quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleAddToCart(variation?.variation_id, variation?.quantity + 1)}
                      style={{
                        backgroundColor: `${Colors.secondary_color}40`,
                        borderRadius: wp(3),
                        paddingHorizontal: wp(0),
                        // marginRight: wp(2),
                      }}>
                      <AntDesign name="plus" color={Colors.secondary_color} size={16} />
                    </TouchableOpacity>
                  </View> : <TouchableOpacity
                    onPress={() => handleAddToCart(variation?.variation_id, 1)}
                    style={{
                      backgroundColor: `${Colors.primary_color}`,
                      borderRadius: wp(3),
                      padding: wp(0.5),
                      marginRight: wp(2)

                      // marginRight: wp(2),
                    }}>
                    <AntDesign name="plus" color={Colors.secondary_color} size={16} />
                  </TouchableOpacity>
                }



              </View>
            ))}

          </View>
        }

      />
    </View>
  );
};
export default ItemDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary_color,
    alignItems: 'center',
    // paddingHorizontal: 20,
  },
  heading: {
    fontFamily: Fonts.PlusJakartaSans_Bold,
    color: Colors.primary_text,
    fontSize: RFPercentage(3),
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  restaurantName: {
    color: Colors.secondary_color,
    fontFamily: Fonts.PlusJakartaSans_Medium,
    fontSize: RFPercentage(1.5),
  },
  itemName: {
    color: Colors.secondary_color,
    fontFamily: Fonts.PlusJakartaSans_Medium,
    fontSize: RFPercentage(2.8),
    marginVertical: 5,
    marginBottom: 15,
  },
  subText: {
    color: Colors.secondary_text,
    fontFamily: Fonts.PlusJakartaSans_Medium,
    fontSize: RFPercentage(2),
  },
  // timeCard: {
  //   borderRadius: 20,
  //   borderWidth: 1,
  //   borderColor: '#EAEDF3',
  //   paddingHorizontal: 18,
  //   paddingVertical: 5.5,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginVertical: 10,
  // },
  // timeText: {
  //   color: '#191A26',
  //   fontFamily: Fonts.PlusJakartaSans_Medium,
  //   marginLeft: 5,
  // },
  // title: {
  //   color: '#191A26',
  //   fontSize: RFPercentage(2.2),
  //   fontFamily: Fonts.PlusJakartaSans_Bold,
  // },

  rowViewSB: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageCard: {
    width: wp(90),
    height: hp(25),
    marginHorizontal: wp(4.5),
    borderRadius: 10,
    overflow: 'hidden',
  },
  sliderContainer: { marginVertical: 20, paddingHorizontal: 0, height: hp(30) },
  paginationStyle: {
    // marginBottom: hp(1),
  },
  paginationStyleItemActive: {
    width: wp(2.5),
    height: wp(2.5),
    borderRadius: wp(2.5) / 2,
    backgroundColor: Colors.primary_color,
    margin: 0,
    marginHorizontal: 2,
  },
  paginationStyleItemInactive: {
    width: wp(2.5),
    height: wp(2.5),
    borderRadius: wp(2.5) / 2,
    backgroundColor: Colors.secondary_color,
    borderWidth: 1,
    borderColor: Colors.primary_color,
    opacity: 0.7,
    marginHorizontal: 2,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionTxt: {
    color: Colors.primary_text,
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(1.7),
    marginTop: hp(2)
  },
  description: {

    color: Colors.primary_text,
    fontFamily: Fonts.PlusJakartaSans_Medium,
    fontSize: RFPercentage(1.6),
    lineHeight: 20,

  },
  priceTxt: {

    color: Colors.primary_text,
    fontFamily: Fonts.PlusJakartaSans_ExtraBold,
    fontSize: RFPercentage(2.2),
    lineHeight: 20,
    marginLeft: wp(3),
    marginVertical: hp(1)

  },
  variationName: {

    color: Colors.secondary_text,
    fontFamily: Fonts.PlusJakartaSans_Medium,
    fontSize: RFPercentage(1.6),
    marginVertical: hp(0.5)
    // lineHeight: 20,
    // marginLeft: wp(2)

  },
  AboutContainer: {
    marginVertical: 10,
    backgroundColor: `${Colors.primary_color}10`,
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
    borderRadius: 15,

  },
  variationContainer: {
    borderColor: Colors.primary_color,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: wp(2),
    // alignItems: 'center',

  },
  variationTxt: {
    color: Colors.primary_text,
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(1.7),
    marginBottom: hp(1)
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  variationText: {
    fontSize: RFPercentage(1.6),
    color: Colors.primary_text,
    fontFamily: Fonts.PlusJakartaSans_Medium,
  },
  sizeText: {
    color: Colors.primary_color,
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(2.2),
    marginRight: wp(4)


  }

});
