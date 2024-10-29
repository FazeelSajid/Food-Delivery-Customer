import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ImageBackground,
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import ItemSeparator from '../../../components/Separator/ItemSeparator';
import CButton from '../../../components/Buttons/CButton';
import { useFocusEffect } from '@react-navigation/native';
import {
  checkRestaurantTimings,
  getRestaurantDetail,
  showAlert,
} from '../../../utils/helpers';
import api from '../../../constants/api';
import Loader from '../../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import {
  addItemToCart,
  clearCartItems,
  getCustomerCart,
  updateCartItemQuantity,
} from '../../../utils/helpers/cartapis';
import RBSheetGuestUser from '../../../components/BottomSheet/RBSheetGuestUser';
import RBSheetOtherRestaurantCartItem from '../../../components/BottomSheet/RBSheetOtherRestaurantCartItem';
import {
  addItemToMYCart,
  clearMyCart,
  setCartRestaurantId,
  updateMyCartList,
} from '../../../redux/CartSlice';
import { addFavoriteDeal, addFavoriteitem, getDealsFavoriteStatus, removeFavoriteDeal, removeFavoriteitem } from '../../../utils/helpers/FavoriteApis';
import RBSheetSuccess from '../../../components/BottomSheet/RBSheetSuccess';
import moment from 'moment';
import RBSheetRestaurantClosed from '../../../components/BottomSheet/RBSheetRestaurantClosed';
import { BASE_URL_IMAGE } from '../../../utils/globalVariables';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FoodCardWithRating from '../../../components/Cards/FoodCardWithRating';


const NearByDealsDetails = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { join_as_guest } = useSelector(store => store.store);
  const { cart, cart_restaurant_id, my_cart } = useSelector(store => store.cart);
  const customer_id = useSelector(store => store.store.customer_id)
  const { favoriteDeals, favoriteItems } = useSelector(store => store.favorite);
  

  const isDealFavorite = (id) => {

    return favoriteDeals.some(item => item?.deal?.deal_id === id);
  };

  const isItemFavorite = (id) => {
    return favoriteItems.some(item => item?.item?.item_id === id);
  };


  const isFavorite = isDealFavorite(route?.params?.id)



  // console.log( route?.params?.id, 'deal id');
  




  const ref_RBSheet = useRef();
  const ref_cartAlert = useRef();
  const ref_RBSheetSuccess = useRef();
  const ref_RBSheetResClosed = useRef();

  const [count, setCount] = useState(1);
  const [visible, setVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [itemDetail, setItemDetail] = useState('');
  const [restaurantDetails, setRestaurantDetails] = useState('');

  // const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteDetails, setFavoriteDetails] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  const [restaurant_timings, setRestaurant_timings] = useState('');

  const [data, setData] = useState([
    // {
    //   id: 0,
    //   image: Images.burger,
    // },
    // {
    //   id: 1,
    //   image: Images.shake,
    // },
    // {
    //   id: 2,
    //   image: Images.pasta,
    // },
    // {
    //   id: 3,
    //   image: Images.chinese,
    // },
    // {
    //   id: 4,
    //   image: Images.biryani,
    // },
  ]);
  // const removeFavorite = async id => {
  //   console.log('id passed to removeFavorite :  ', id);
  //   setLoading(true);
  //   // favourite_item_id

  //   fetch(api.delete_deal_from_favorites + id, {
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
  //     deal_id: route?.params?.id,
  //   };
  //   console.log('data : ', data);

  //   fetch(api.add_deal_to_favorites, {
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
  //       console.log('Error in add deal to favorite :  ', err);
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

  // const handleOnRemove = () => {
  //   setLoading(true);
  //   // remove all items of previous restaurant
  //   clearCartItems()
  //     .then(response => {
  //       //add new item
  //       dispatch(setCartRestaurantId(restaurantDetails?.restaurant_id));
  //       console.log(
  //         'new cart restaurant_id : ',
  //         restaurantDetails?.restaurant_id,
  //       );
  //       //my_cart
  //       dispatch(updateMyCartList([]));

  //       add_item_to_cart();

  //       // //my_cart
  //       // dispatch(clearMyCart());
  //     })
  //     .catch(error => {
  //       console.log('error : ', error);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
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

  const add_item_to_cart = async () => {
    setLoading(true);
    // let customer_id = await AsyncStorage.getItem('customer_id');
    let cart = await getCustomerCart(customer_id);

    if (count == 0) {
      showAlert('Please select quantity');
      setLoading(false);
    } else {
      let data = {
        item_id: route?.params?.id,
        cart_id: cart?.cart_id,
        item_type: 'deal',
        comments: '',
        quantity: count,
      };
      console.log('data   :  ', data);

      await addItemToCart(data)
        .then(response => {
          // console.log('response ', response);
          if (response?.status == true) {

            // dispatch(setCartRestaurantId(restaurantDetails?.restaurant_id));
            // navigation?.navigate('MyCart');
            //my_cart
            dispatch(addItemToMYCart(response?.result));
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

  // const parseTime = timeString => {
  //   console.log('timeString  : ', timeString);
  //   const timeParts = timeString.match(/(\d+):(\d+)/);
  //   if (timeParts) {
  //     const hours = parseInt(timeParts[1], 10);
  //     const minutes = parseInt(timeParts[2], 10);
  //     return hours * 60 + minutes;
  //   }
  //   return 0;
  // };

  const handleAddToCart = async () => {
    setLoading(true);
    // let time_obj = await checkRestaurantTimings(
    //   restaurantDetails?.restaurant_id,
    // );
    // setLoading(false);
    // if (time_obj?.isClosed) {
    //   setRestaurant_timings(time_obj);
    //   ref_RBSheetResClosed.current.open();
    //   return;
    // } else 
    // if (validate()) {
    // if item already exists in card then we will only update quantity of that item
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
      // dispatch(setCartRestaurantId(restaurantDetails?.restaurant_id));
      ref_RBSheetSuccess?.current?.open();
    } else {
      add_item_to_cart();
    }
    // }
  };

  const getItemDetails = async id => {
    // console.log('deal id  :  ', id);
    // setLoading(false);
    // return;

    fetch(api.get_deal_detail + id)
      .then(response => response.json())
      .then(async response => {
        let list = response?.result ? response?.result : {};
        setItemDetail(list);
        // console.log('list?.restaurant_id : ', list?.restaurant_id);
        // let restaurant_details = await getRestaurantDetail(list?.restaurant_id);
        // setRestaurantDetails(restaurant_details);
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

  useEffect(() => {
    setLoading(true);
  }, []);

  // useEffect(() => {
  //   if (route?.params?.type == 'favorite') setIsFavorite(true);
  // }, [route?.params]);

  useFocusEffect(
    React.useCallback(() => {
      let id = route?.params?.id;
      if (id) {
        getItemDetails(id);
      }
    }, []),
  );



  // console.log(itemDetail);


  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, }}>
        {/* <StackHeader
          backgroundColor={Colors.Orange}
          barStyle={'light-content'}
          enableStatusBar={true}
          titleColor={'white'}
          backIconColor={'white'}
          showTitle={false}
          title={'Details'}
        /> */}

        <StatusBar backgroundColor={Colors.White} barStyle={'light-content'} />
        <View style={{ flex: 1 }}>
          {/* <View style={{paddingHorizontal: 25}}>
            <View style={styles.rowViewSB}>
              <Text style={{...styles.restaurantName, flex: 1}}>
                {restaurantDetails?.user_name}
              </Text>
             
            </View>
            <View style={styles.rowViewSB}>
              <Text style={{...styles.itemName, flex: 1}}>
                {itemDetail?.name}
              </Text>
              
            </View>
          </View> */}
          {/* <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              // marginTop: 5,
            }}> */}


          {/* <ImageSlider data={data} marginBottom={1} />
            
            {/* <ImageSliderCircle data={data} marginBottom={1} /> */}
          <View style={styles.sliderContainer}>
            <SwiperFlatList
              autoplay
              autoplayDelay={2}
              autoplayLoop
              // index={2}
              showPagination
              data={data}
              renderItem={({ item }) => (
                <View style={styles.imageCard}>
                  <ImageBackground
                    source={{ uri: BASE_URL_IMAGE + item?.image }}
                    style={{
                      width: '100%',
                      height: '100%',
                      // resizeMode: 'contain',
                    }}
                  >
                    <View style={styles.rowViewSB} >
                      <TouchableOpacity
                        style={styles.iconContainer}
                        onPress={() => navigation.goBack()}>
                        <Ionicons
                          name={'chevron-back'}
                          size={hp(3.5)}
                          color={Colors.Orange}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        // disabled={isFavorite}
                        onPress={() => {
                          if (join_as_guest) {
                            ref_RBSheet?.current?.open();
                          } else {
                            isFavorite

                              ? removeFavoriteDeal(route?.params?.id, customer_id, favoriteDeals, dispatch, showAlert)
                              : addFavoriteDeal(route?.params?.id, customer_id, dispatch, showAlert)
                          }
                        }}
                        style={{
                          position: 'absolute',
                          right: 5,
                          top: 5,
                          padding: 10,
                          zIndex: 999,
                        }}>
                        {isFavorite ? (
                          <AntDesign name="heart" size={24} color={Colors.Orange} />
                        ) : (
                          <AntDesign name="hearto" size={24} color={Colors.Orange} />
                        )}
                      </TouchableOpacity>
                    </View>

                  </ImageBackground>
                </View>
              )}
              paginationStyle={styles.paginationStyle}
              paginationStyleItemActive={styles.paginationStyleItemActive}
              paginationStyleItemInactive={styles.paginationStyleItemInactive}
            />

          </View>

          <View style={{ paddingHorizontal: 20 }}>

            <View style={styles.rowViewSB}>
              <Text style={{ ...styles.itemName, flex: 1 }}>
                {itemDetail?.name}
              </Text>

              <Text style={{ ...styles.itemName, flex: 1, textAlign: 'right' }}>
                £  {itemDetail?.price}
              </Text>

            </View>
            <View style={styles.descriptionContainer}>
              <Text
                style={[styles.description, { fontFamily: Fonts.PlusJakartaSans_SemiBold }]}>{moment(itemDetail?.expiry_date).format("D MMMM YYYY")}</Text>
              <Text style={[styles.description,]}>{itemDetail?.description}</Text>

            </View>

          </View>
          <View style={{ paddingHorizontal: wp(6), marginTop: hp(3) }} >


            {
              itemDetail?.items?.map((item) => {
                const isFavoriteItem = isItemFavorite(item?.item_id)
                // console.log(item?.variations);
              
                return (
                  <View style={{ height: hp(15) }} >
                    <FoodCardWithRating
                      onPress={() =>
                        navigation?.navigate('ItemDetails', {
                          id: item?.item_id,
                        })
                      }
                      title={item?.item_name}
                      image={
                        // item.image
                        item?.images?.length > 0
                          ? BASE_URL_IMAGE + item?.images[0]
                          : ''
                      }
                      // price={item?.variations[0]?.price}
                      quantity={`${item.variations[0].quantity} ${item.variations[0].variation_name} ${item?.item_name}  `}
                      rating={item?.rating}
                      tag={item?.cuisineData?.cuisine_name}
                      isTagArray={false}
                      nextIconWidth={26}
                      cardStyle={{ marginHorizontal: 0, marginBottom: 15 }}
                      showNextButton={true}
                      showRating={false}
                      priceContainerStyle={{ marginTop: 0 }}
                      isFavorite={isFavoriteItem}
                      onRemove={() => removeFavoriteitem(item?.item_id, customer_id, favoriteItems, dispatch, showAlert)}
                      addFav={() => addFavoriteitem(item?.item_id, customer_id, dispatch, showAlert)}
                    />


                  </View>

                )
              })
            }

          </View>

          {/* <ItemSeparator width={wp(100)} /> */}

          <View
            style={{
              ...styles.rowViewSB,
              marginVertical: 10,
              paddingHorizontal: 20,
              flex: 0.95,
              alignItems: 'flex-end',
            }}>
            <View>
              <CButton
                title="Add to Cart"
                width={wp(60)}
                height={hp(6)}
                marginTop={-2}
                marginBottom={1}
                textStyle={{ textTransform: 'none' }}
                onPress={() => {
                  console.log('join_as_guest  : ____ ', join_as_guest);

                  if (join_as_guest) {
                    ref_RBSheet?.current?.open();
                  } else {
                    handleAddToCart();
                  }
                }}
              />
            </View>
            {/* <TouchableOpacity onPress={() => navigation.navigate('Checkout')}>
                <Icons.Checkout />
              </TouchableOpacity> */}

            <View
              style={{
                ...styles.rowView,
                backgroundColor: '#FF57224F',
                borderRadius: 25,
                paddingVertical: 8,
                paddingHorizontal: 4,
              }}>
              <TouchableOpacity
                onPress={() => onDecrement()}
                style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                <AntDesign name="minus" color={Colors.Orange} size={16} />
              </TouchableOpacity>
              <Text
                style={{
                  color: Colors.Orange,
                  fontFamily: Fonts.PlusJakartaSans_Bold,
                  fontSize: RFPercentage(2),
                  marginTop: -2,
                }}>
                {count}
              </Text>
              <TouchableOpacity
                onPress={() => onIncrement()}
                style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                <AntDesign name="plus" color={Colors.Orange} size={16} />
              </TouchableOpacity>
            </View>
          </View>
          {/* </View> */}
        </View>
      </ScrollView>

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

      {/* <RBSheetOtherRestaurantCartItem
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
      /> */}

      <RBSheetSuccess
        refRBSheet={ref_RBSheetSuccess}
        title={`"${itemDetail?.name}" added to cart.`}
        btnText={'OK'}
        onPress={() => {
          ref_RBSheetSuccess?.current?.close();
          // navigation.goBack();
        }}
      />
      <RBSheetRestaurantClosed
        refRBSheet={ref_RBSheetResClosed}
        title={`“${restaurant_timings?.restaurant_details?.user_name
          }” is closed ${restaurant_timings?.closed_till
            ? ' till ' + restaurant_timings?.closed_till
            : '.'
          }`}
      />
      {/* <RBSheetConfirmation
        refRBSheet={ref_RBSheet}
        title={'Do you want to delete this Deal?'}
        onOk={() => {
          ref_RBSheet?.current?.close();
          navigation.goBack();
        }}
      /> */}

      <ConfirmationModal
        visible={visible}
        setVisible={setVisible}
        title={'Confirmation'}
        description={'Do you want to delete this Deal?'}
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
    </View>
  );
};

export default NearByDealsDetails;

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
    color: Colors.Orange,
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(2),
    letterSpacing: 1,
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
  iconContainer: { backgroundColor: Colors.White, marginTop: hp(0.5), marginLeft: wp(2), borderRadius: wp(100), paddingHorizontal: 2 },
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
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowViewSB: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // sliderContainer: { marginVertical: 20, paddingHorizontal: 0, height: hp(30) },
  paginationStyle: {
    // marginBottom: hp(1),
  },
  paginationStyleItemActive: {
    width: wp(8),
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
  imageCard: {
    width: wp(100),
    height: hp(30),

    // marginHorizontal: wp(3.5),
    // borderRadius: 10,
    // overflow: 'hidden',
  },
  sliderContainer: {
    // marginVertical: 20,
    marginBottom: 1,
    paddingHorizontal: 0,
    height: hp(35),
    // backgroundColor: 'green',
  },
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
  description: {
    paddingVertical: hp(0.5),
    color: '#00000099',
    fontFamily: Fonts.PlusJakartaSans_Medium,
    fontSize: RFPercentage(1.6),
    lineHeight: 20,

  },
  descriptionContainer: {
    backgroundColor: '#FFF6F3',
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.5),
    borderRadius: 15,
    fontSize: RFPercentage(1.6),
    lineHeight: 20,

  },
});

// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import React, {useState, useEffect} from 'react';
// import {Colors, Fonts, Icons, Images} from '../../../constants';
// import StackHeader from '../../../components/Header/StackHeader';
// import {RFPercentage} from 'react-native-responsive-fontsize';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import {SwiperFlatList} from 'react-native-swiper-flatlist';
// import PriceText from '../../../components/Text';
// import ImageSlider from '../../../components/Slider/ImageSlider';
// import ConfirmationModal from '../../../components/Modal/ConfirmationModal';

// const NearByDealsDetails = ({navigation, route}) => {
//   const [visible, setVisible] = useState(false);
//   const [data, setData] = useState([
//     {
//       id: 0,
//       image: Images.food8,
//     },
//     {
//       id: 1,
//       image: Images.food8,
//     },
//     {
//       id: 2,
//       image: Images.food8,
//     },
//   ]);

//   return (
//     <View style={styles.container}>
//       <ScrollView contentContainerStyle={{flexGrow: 1}}>
//         <StackHeader rightIcon={<Icons.HeartActive />} />
//         <View style={{flex: 1}}>
//           <View style={{alignItems: 'center', paddingHorizontal: 40}}>
//             <Text style={styles.heading}>
//               Shrimp Pad Thai Sauce ABC Barbeque
//             </Text>
//             <Text style={styles.subText}>By Resto Parmato Bapo</Text>
//             <View style={styles.timeCard}>
//               <Icons.Bike />
//               <Text style={styles.timeText}>20 min</Text>
//             </View>
//           </View>
//           <ImageSlider data={data} marginBottom={1} />
//           <View style={{paddingHorizontal: 20, flex: 1}}>
//             <View style={styles.rowViewSB}>
//               <Text style={styles.title}>Description</Text>
//               {/* <Text style={styles.title}>
//                 <Text style={{color: Colors.Orange}}>$</Text> 9.67
//               </Text> */}
//               <PriceText
//                 text={9.67}
//                 fontSize={RFPercentage(2.5)}
//                 textColor={Colors.Black}
//               />
//             </View>
//             <Text
//               style={{
//                 marginVertical: 10,
//                 color: '#808D9E',
//                 fontFamily: Fonts.PlusJakartaSans_Regular,
//               }}>
//               Amet minim mollit non deserunt ullamco est sit aliqua dolor do
//               amet sint. Velit officia consat du veniam consequat coseqtures
//               adipsing contentet minim mollit non deserunt ullamco est sit
//               aliqua dolor do amet sint. Velit officia consat du veniam
//               consequat coseqtures adipsing
//             </Text>
//             <View
//               style={{
//                 marginVertical: 20,
//                 flexDirection: 'row',
//                 alignItems: 'flex-end',
//                 flex: 1,
//               }}>
//               <TouchableOpacity
//                 onPress={() => {
//                   if (route?.params?.nav_type == 'add_item') {
//                     navigation?.goBack();
//                   } else {
//                     navigation.navigate('ShippingAddress');
//                   }
//                 }}
//                 // onPress={() => setVisible(true)}
//                 style={{
//                   backgroundColor: Colors.Orange,
//                   height: 45,
//                   borderRadius: 25,
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   flex: 1,
//                   marginRight: 15,
//                 }}>
//                 <Text
//                   style={{
//                     color: 'white',
//                     fontFamily: Fonts.PlusJakartaSans_Regular,
//                   }}>
//                   Add to Cart
//                 </Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => navigation.navigate('Checkout')}>
//                 <Icons.Checkout />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//       <ConfirmationModal
//         visible={visible}
//         setVisible={setVisible}
//         onOK={() => navigation.replace('Sign In')}
//         onCancel={() => setVisible(false)}
//       />
//     </View>
//   );
// };

// export default NearByDealsDetails;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.White,
//     alignItems: 'center',
//     // paddingHorizontal: 20,
//   },
//   heading: {
//     fontFamily: Fonts.PlusJakartaSans_Bold,
//     color: '#191A26',
//     fontSize: RFPercentage(3),
//     textAlign: 'center',
//     paddingHorizontal: 10,
//   },
//   subText: {
//     color: '#8D93A1',
//     fontFamily: Fonts.PlusJakartaSans_Medium,
//     fontSize: RFPercentage(2),
//   },
//   timeCard: {
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#EAEDF3',
//     paddingHorizontal: 18,
//     paddingVertical: 5.5,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginVertical: 10,
//   },
//   timeText: {
//     color: '#191A26',
//     fontFamily: Fonts.PlusJakartaSans_Medium,
//     marginLeft: 5,
//   },
//   title: {
//     color: '#191A26',
//     fontSize: RFPercentage(2.2),
//     fontFamily: Fonts.PlusJakartaSans_Bold,
//   },
//   rowViewSB: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   imageCard: {
//     width: wp(90),
//     height: hp(25),
//     // backgroundColor: '#ccc',
//     marginHorizontal: wp(4.5),
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   sliderContainer: {marginVertical: 20, paddingHorizontal: 0, height: hp(30)},
//   paginationStyle: {
//     // marginBottom: hp(1),
//   },
//   paginationStyleItemActive: {
//     width: wp(2.5),
//     height: wp(2.5),
//     borderRadius: wp(2.5) / 2,
//     backgroundColor: Colors.Orange,
//     margin: 0,
//     marginHorizontal: 2,
//   },
//   paginationStyleItemInactive: {
//     width: wp(2.5),
//     height: wp(2.5),
//     borderRadius: wp(2.5) / 2,
//     backgroundColor: Colors.White,
//     borderWidth: 1,
//     borderColor: Colors.Orange,
//     opacity: 0.7,
//     marginHorizontal: 2,
//   },
// });
