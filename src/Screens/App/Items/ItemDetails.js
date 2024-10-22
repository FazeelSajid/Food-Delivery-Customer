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
  getRestaurantDetail,
  showAlert,
} from '../../../utils/helpers';
import CButton from '../../../components/Buttons/CButton';
import ItemSeparator from '../../../components/Separator/ItemSeparator';
import RBSheetGuestUser from '../../../components/BottomSheet/RBSheetGuestUser';
import { useDispatch, useSelector } from 'react-redux';
import {
  addItemToCart,
  clearCartItems,
  getCustomerCart,
  updateCartItemQuantity,
} from '../../../utils/helpers/cartapis';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  addItemToMYCart,
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


const ItemDetails = ({ navigation, route }) => {
  const ref_RBSheetSuccess = useRef();
  const dispatch = useDispatch();
  const { join_as_guest } = useSelector(store => store.store);
  const { cart, cart_restaurant_id, my_cart } = useSelector(store => store.cart);
  const ref_RBSheet = useRef();
  const ref_cartAlert = useRef();
  const ref_RBSheetResClosed = useRef();
  const { customer_id } = useSelector(store => store.store);
  const { favoriteItems} = useSelector(store => store.favorite);


  const btmSheetRef = useRef()


  const [selectedVariation, setSelectedVariation] = useState(null);

  // Function to handle radio button press


  const showBtmSheet = () => {
    setSelectedVariation(null)
    btmSheetRef?.current?.open()
  }
  const closeBtmSheet = () => {
    btmSheetRef?.current?.close()
  }

  const isItemFavorite = (id) => {    
    return favoriteItems.some(item => item?.item?.item_id === id);
  };
  const isFavorite = isItemFavorite(route?.params?.id)

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [count, setCount] = useState(my_cart.length);

  const [itemDetail, setItemDetail] = useState('');
  const [restaurantDetails, setRestaurantDetails] = useState('');

  const [data, setData] = useState([]);

  // const [isFavorite, setIsFavorite] = useState(false);

  const [restaurant_timings, setRestaurant_timings] = useState('');

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

  const onIncrement = () => {
    setCount(count + 1);
  };

  const onDecrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const handleOnRemove = () => {
    setLoading(true);
    // remove all items of previous restaurant
    clearCartItems()
      .then(response => {
        //add new item
        dispatch(setCartRestaurantId(restaurantDetails?.restaurant_id));
        console.log(
          'new cart restaurant_id : ',
          restaurantDetails?.restaurant_id,
        );
        // //my_cart
        // dispatch(clearMyCart());
        //my_cart
        dispatch(updateMyCartList([]));

        add_item_to_cart();
      })
      .catch(error => {
        console.log('error : ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const validate = () => {
    if (cart_restaurant_id == null) {
      return true;
    } else if (cart_restaurant_id != restaurantDetails?.restaurant_id) {
      console.log(
        'cart_restaurant_id  : ',
        cart_restaurant_id,
        restaurantDetails?.restaurant_id,
      );
      ref_cartAlert.current.open();
      return false;
    } else {
      return true;
    }
  };

  const add_item_to_cart = async (id) => {
    setLoading(true);
    // let customer_id = await AsyncStorage.getItem('customer_id');
    console.log('customer_Id :  ', customer_id);
    let cart = await getCustomerCart(customer_id);
    console.log('______cart    :  ', cart?.cart_id);
    if (count == 0) {
      showAlert('Please select quantity');
      setLoading(false);
    } else {
      let data = {
        item_id: route?.params?.id?.toString(),
        cart_id: cart?.cart_id?.toString(),
        item_type: 'item',
        comments: 'Adding item in cart',
        quantity: count?.toString(),
        variation_id: id ? id : selectedVariation
      };

      console.log('data   :  ', data);

      await addItemToCart(data)
        .then(response => {
          console.log('response ', response);
          if (response?.status == true) {
            // navigation?.navigate('MyCart');
            // cart_restaurant_id
            dispatch(setCartRestaurantId(restaurantDetails?.restaurant_id));
            //my_cart
            dispatch(addItemToMYCart(response?.result));
            setSelectedVariation(null)

            ref_RBSheetSuccess?.current?.open();
          } else {
            showAlert(response?.message);
          }
        })
        .catch(error => {
          console.log('error  :  ', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // const filter = my_cart?.filter(
  //   item => item?.item_id == route?.params?.id,
  // );
  // console.log(filter, 'filter');
  
  

  const handleAddToCart = async (id) => {
    // console.log(id, 'id');
    setSelectedVariation(id)

    if (id === null) {
      showBtmSheet()
    }else {
      const filter = my_cart?.filter(
        item => item?.item_id == route?.params?.id,
      );
      // console.log(filter, 'filter');
      // const OtherFilter = filter.filter(
      //   item => item.variation_id === id
      // )
      
      if (filter?.length > 0) {
        const checkVariation = filter?.filter(
          item =>
            item?.variation_id == id,
        )

        // console.log( 'checkVariation', checkVariation.length > 0);
        

        if (checkVariation.length === 0) {
          add_item_to_cart(id);
          closeBtmSheet()
        } else {
          // console.log('check variation icon' , checkVariation);
          
          let obj = {
            cart_item_id: checkVariation[0]?.cart_item_id,
            quantity: checkVariation[0]?.quantity + 1,
          };

          await updateCartItemQuantity(obj);

          // also update quantity in redux
          const newData = my_cart?.map(item => {
            if (item?.item_id == route?.params?.id) {
              return {
                ...item,
                quantity: checkVariation[0]?.quantity + 1,
              };
            } else {
              return { ...item };
            }
          });
          dispatch(updateMyCartList(newData));
          dispatch(setCartRestaurantId(restaurantDetails?.restaurant_id));
          ref_RBSheetSuccess?.current?.open();
        }
       
      } else {
        add_item_to_cart(id);
        closeBtmSheet()
  
      }
     
    }
    

    // if item already exists in card then we will only update quantity of that item
   
    // setLoading(true);
    // let time_obj = await checkRestaurantTimings(
    //   restaurantDetails?.restaurant_id,
    // );
    // console.log('time_obj?.isClosed : ', time_obj?.isClosed);
    // setLoading(false);
    // if (time_obj?.isClosed) {
    //   setRestaurant_timings(time_obj);
    //   ref_RBSheetResClosed.current.open();
    //   return;
    // } else if (validate()) {
    //   // if item already exists in card then we will only update quantity of that item
    //   const filter = my_cart?.filter(
    //     item => item?.item_id == route?.params?.id,
    //   );
    //   if (filter?.length > 0) {
    //     let obj = {
    //       cart_item_id: filter[0]?.cart_item_id,
    //       quantity: filter[0]?.quantity + count,
    //     };
    //     await updateCartItemQuantity(obj);
    //     // also update quantity in redux
    //     const newData = my_cart?.map(item => {
    //       if (item?.item_id == route?.params?.id) {
    //         return {
    //           ...item,
    //           quantity: filter[0]?.quantity + count,
    //         };
    //       } else {
    //         return {...item};
    //       }
    //     });
    //     dispatch(updateMyCartList(newData));
    //     dispatch(setCartRestaurantId(restaurantDetails?.restaurant_id));
    //     ref_RBSheetSuccess?.current?.open();
    //   } else {
    //     add_item_to_cart();
    //   }
    // }
  };



  const getItemDetails = async id => {
    setLoading(true);
    fetch(api.get_item_detail + id)
      .then(response => response.json())
      .then(async response => {
        let list = response?.result ? response?.result : {};
        setItemDetail(list);
        let restaurant_details = await getRestaurantDetail(list?.restaurant_id);
        setRestaurantDetails(restaurant_details);
        let imageList = [];
        for (const item of list?.images) {
          let obj = {
            image: item,
          };
          imageList.push(obj);
        }
        setData(imageList);
      })
      .catch(err => console.log('error : ', err))
      .finally(() => setLoading(false));
  };

  // useEffect(() => {
  //   if (route?.params?.type == 'favorite') setIsFavorite(true);
  // }, [route?.params]);

  useEffect(() => {
    let item_id = route?.params?.id;
    if (item_id) {
      getItemDetails(item_id);

    }

    
  }, []);


  const handlePress = async (id) => {
    setSelectedVariation(id);

    const filter = my_cart?.filter(
      item => item?.item_id == route?.params?.id,
    );
    if (filter?.length > 0) {
      let obj = {
        cart_item_id: filter[0]?.cart_item_id,
        quantity: filter[0]?.quantity + count,
      };
      await updateCartItemQuantity(obj);
      // also update quantity in redux
      const newData = my_cart?.map(item => {
        if (item?.item_id == route?.params?.id) {
          return {
            ...item,
            quantity: filter[0]?.quantity + count,
          };
        } else {
          return { ...item };
        }
      });
      dispatch(updateMyCartList(newData));
      dispatch(setCartRestaurantId(restaurantDetails?.restaurant_id));
      ref_RBSheetSuccess?.current?.open();
      closeBtmSheet()
    } else {
      add_item_to_cart(id);
      closeBtmSheet()

    }

    
  };
  // useFocusEffect(
  //   React.useCallback(() => {
  //     let item_id = route?.params?.id;
  //     if (item_id) {
  //       getItemDetails(item_id);
  //     }
  //   }, []),
  // );

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: Colors.Orange }}>
        <StatusBar backgroundColor={Colors.Orange} barStyle={'light-content'} />
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
                    ? removeFavoriteitem( route?.params?.id ,customer_id, favoriteItems, dispatch, showAlert)
                    : addFavoriteitem( route?.params?.id ,customer_id, dispatch, showAlert)
                }
              }}
            >
              {isFavorite ? (
                <AntDesign name="heart" size={24} color={Colors.White} />
              ) : (
                <AntDesign name="hearto" size={24} color={Colors.White} />
              )}
            </TouchableOpacity>
          }
        //   rightIcon={
        //     <View
        //       style={{
        //         flexDirection: 'row',
        //         alignItems: 'center',
        //         justifyContent: 'space-between',
        //         width: 60,
        //         height: route?.params?.nav_screen == 'home' ? 80 : 0,
        //       }}>
        //       <TouchableOpacity
        //         onPress={() =>
        //           navigation.navigate('UpdateItem', {
        //             id: route?.params?.id,
        //           })
        //         }>
        //         <Icons.EditWhite />
        //       </TouchableOpacity>
        //       <TouchableOpacity
        //         onPress={() => {
        //           // setVisible(!visible);
        //           ref_RBSheet?.current?.open();
        //         }}>
        //         <Icons.DeleteWhite />
        //       </TouchableOpacity>
        //     </View>
        //   }
        />
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 25 }}>
            {/* <Text style={styles.restaurantName}>
              {restaurantDetails?.user_name}
            </Text> */}
            <View style={styles.rowViewSB}>
              <Text style={{ ...styles.restaurantName, flex: 1 }}>
                {restaurantDetails?.user_name}
              </Text>
              {/* <Text style={{...styles.restaurantName, flex: 0.3}}>
                Quantity
              </Text> */}
            </View>
            {/* <Text style={styles.itemName}>{itemDetail?.item_name}</Text> */}
            <View style={styles.rowViewSB}>
              <Text style={{ ...styles.itemName, flex: 1 }}>
                {itemDetail?.item_name}
              </Text>
              <View
                style={{
                  ...styles.rowView,
                  backgroundColor: '#FFFFFF4F',
                  borderRadius: 15,
                }}>
                <TouchableOpacity
                  onPress={() => onDecrement()}
                  style={{paddingHorizontal: 10, paddingVertical: 5}}>
                  <AntDesign name="minus" color="white" size={16} />
                </TouchableOpacity>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: Fonts.PlusJakartaSans_Bold,
                    fontSize: RFPercentage(1.7),
                    marginTop: -2,
                  }}>
                  {count}
                </Text>
                <TouchableOpacity
                  onPress={() => onIncrement()}
                  style={{paddingHorizontal: 10, paddingVertical: 5}}>
                  <AntDesign name="plus" color="white" size={16} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              marginTop: 5,
            }}>


            {/* <ImageSlider data={data} marginBottom={1} /> */}
            <ImageSliderCircle data={data} marginBottom={1} />
            <View style={{ paddingHorizontal: 20, flex: 1, }}>
              <View style={styles.AboutContainer}>

                <Text
                  style={styles.variationTxt}>
                  Variations
                </Text>

                {
                  itemDetail?.item_prices?.map((item, i) => {
                    return (
                      <View key={i} style={styles.variationContainer}>
                        <Text
                          style={styles.variationName}>
                          {item.variation_name}
                        </Text>
                        <Text
                          style={styles.priceTxt}>
                          •  Price: £ {item.price}
                        </Text>
                      </View>
                    )
                  })
                }


                <Text
                  style={styles.descriptionTxt}>
                  Description
                </Text>
                <Text
                  style={styles.description}>
                  {itemDetail?.description}
                </Text>

              </View>
              {/* <View style={{...styles.rowViewSB, marginVertical: 7}}>
                <Text style={styles.title}>About the Food</Text>
                <Text
                  style={{
                    color: '#02010E',
                    fontFamily: Fonts.PlusJakartaSans_Bold,
                    fontSize: RFPercentage(2.5),
                  }}>
                  ${itemDetail?.price}
                </Text>
              </View> */}

            </View>
            <ItemSeparator width={wp(100)} />
            {/* <View
              style={{
                ...styles.rowViewSB,
                marginVertical: 10,
                paddingHorizontal: 20,
              }}> */}
              <View style={{marginBottom: wp(2)}} >
                <CButton
                  title="Add to Cart"
                  // width={wp(70)}
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
                      showBtmSheet()
                    }
                  }}
                />
              {/* </View> */}
              {/* <TouchableOpacity onPress={() => navigation.navigate('Checkout')}>
                <Icons.Checkout />
              </TouchableOpacity> */}
            
            </View>
          </View>
        </View>
      </ScrollView>

      <RBSheetOtherRestaurantCartItem
        refRBSheet={ref_cartAlert}
        title={'Remove your previous items?'}
        description={
          'You still have products from another restaurant.Shall we start over with a fresh cart?'
        }
        okText={'Remove'}
        cancelText={'No'}
        onOk={() => {
          handleOnRemove();
          ref_cartAlert?.current?.close();
        }}
        onCancel={() => {
          ref_cartAlert?.current?.close();
        }}
      />

      <RBSheetGuestUser
        refRBSheet={ref_RBSheet}
        // title={'Attention'}
        // description={'Please Sign up before ordering'}
        btnText={'OK'}
        onSignIn={() => {
          ref_RBSheet?.current?.close();
          navigation?.popToTop();
          navigation?.replace('SignIn');
          // navigation?.goBack();
        }}
        onSignUp={() => {
          ref_RBSheet?.current?.close();
          navigation?.popToTop();
          navigation?.replace('SignUp');
          // navigation?.goBack();
        }}
      />

      <RBSheetSuccess
        refRBSheet={ref_RBSheetSuccess}
        title={`${itemDetail?.item_name} added to cart.`}
        btnText={'OK'}
        onPress={() => {
          ref_RBSheetSuccess?.current?.close();
          // navigation.goBack();
        }}
      />

      <ConfirmationModal
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
              //   marginBottom: 10,
              //   aspectRatio: 1,
            }}>
            <Lottie
              source={Images.success_check}
              autoPlay
              loop={true}
              resizeMode="cover"
            />
          </View>
        }
      />

      <RBSheetRestaurantClosed
        refRBSheet={ref_RBSheetResClosed}
        title={`“${restaurant_timings?.restaurant_details?.user_name
          }” is closed ${restaurant_timings?.closed_till
            ? ' till ' + restaurant_timings?.closed_till
            : '.'
          }`}
      />


      <CRBSheetComponent
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



              <View key={i} style={styles.rowViewSB}>

                <View style={styles.rowView } > 

                <RadioButton
                  color={Colors.Orange} // Custom color for selected button
                  uncheckedColor={Colors.Orange} // Color for unselected buttons
                  status={selectedVariation === variation.variation_id ? 'checked' : 'unchecked'}
                  onPress={() => handleAddToCart(variation.variation_id)}
                />
                <Text style={styles.variationText}>{variation.variation_name}</Text>
                
                </View>
                <Text style={styles.variationText}>£ {variation?.price}</Text>

                
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
    backgroundColor: Colors.White,
    alignItems: 'center',
    // paddingHorizontal: 20,
  },
  heading: {
    fontFamily: Fonts.PlusJakartaSans_Bold,
    color: '#191A26',
    fontSize: RFPercentage(3),
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  restaurantName: {
    color: Colors.White,
    fontFamily: Fonts.PlusJakartaSans_Medium,
    fontSize: RFPercentage(1.5),
  },
  itemName: {
    color: Colors.White,
    fontFamily: Fonts.PlusJakartaSans_Medium,
    fontSize: RFPercentage(2.8),
    marginVertical: 5,
    marginBottom: 15,
  },
  subText: {
    color: '#8D93A1',
    fontFamily: Fonts.PlusJakartaSans_Medium,
    fontSize: RFPercentage(2),
  },
  timeCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAEDF3',
    paddingHorizontal: 18,
    paddingVertical: 5.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  timeText: {
    color: '#191A26',
    fontFamily: Fonts.PlusJakartaSans_Medium,
    marginLeft: 5,
  },
  title: {
    color: '#191A26',
    fontSize: RFPercentage(2.2),
    fontFamily: Fonts.PlusJakartaSans_Bold,
  },
  rowViewSB: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageCard: {
    width: wp(90),
    height: hp(25),
    // backgroundColor: '#ccc',
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
    backgroundColor: Colors.Orange,
    margin: 0,
    marginHorizontal: 2,
  },
  paginationStyleItemInactive: {
    width: wp(2.5),
    height: wp(2.5),
    borderRadius: wp(2.5) / 2,
    backgroundColor: Colors.White,
    borderWidth: 1,
    borderColor: Colors.Orange,
    opacity: 0.7,
    marginHorizontal: 2,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionTxt: {
    color: '#02010E',
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(1.7),
    marginTop: hp(2)
  },
  description: {

    color: '#00000099',
    fontFamily: Fonts.PlusJakartaSans_Medium,
    fontSize: RFPercentage(1.6),
    lineHeight: 20,

  },
  priceTxt: {

    color: '#00000099',
    fontFamily: Fonts.PlusJakartaSans_Medium,
    fontSize: RFPercentage(1.6),
    lineHeight: 20,
    marginLeft: wp(3),
    marginVertical: hp(1)

  },
  variationName: {

    color: '#00000099',
    fontFamily: Fonts.PlusJakartaSans_Medium,
    fontSize: RFPercentage(1.6),
    lineHeight: 20,
    marginLeft: wp(2)

  },
  AboutContainer: {
    marginVertical: 10,
    backgroundColor: '#FFF6F3',
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
    borderRadius: 15,

  },
  variationTxt: {
    color: '#02010E',
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
    color: '#02010E',
    fontFamily: Fonts.PlusJakartaSans_Medium,
  },

});