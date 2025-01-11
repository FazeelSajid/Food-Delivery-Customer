import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFPercentage} from 'react-native-responsive-fontsize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import StackHeader from '../../../components/Header/StackHeader';
import {Colors, Fonts, Icons, Images} from '../../../constants';
// import FastImage from 'react-native-fast-image';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import FoodCard from '../../../components/Cards/FoodCard';
import CButton from '../../../components/Buttons/CButton';
import RBSheetRating from '../../../components/BottomSheet/RBSheetRating';
import RBSheetSuccess from '../../../components/BottomSheet/RBSheetSuccess';
import {
  checkRestaurantTimings,
  getRestaurantDetail,
  getUserFcmToken,
  showAlert,
  showAlertLongLength,
} from '../../../utils/helpers';
import {
  firebase_server_key,
} from '../../../utils/globalVariables';
import {useFocusEffect} from '@react-navigation/native';
import Loader from '../../../components/Loader';
import api from '../../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getRestaurantFavoriteStatus} from '../../../utils/helpers/FavoriteApis';
import {useDispatch, useSelector} from 'react-redux';
import RBSheetGuestUser from '../../../components/BottomSheet/RBSheetGuestUser';
import {
  getCurrentLocation,
  getDeliveryCharges,
  getEstimatedDeliveryTime,
} from '../../../utils/helpers/location';
import {getDistance} from 'geolib';
import HeaderImageSlider from '../../../components/Slider/HeaderImageSlider';
import FoodCardWithRating from '../../../components/Cards/FoodCardWithRating';
import NoDataFound from '../../../components/NotFound/NoDataFound';
import ItemLoading from '../../../components/Loader/ItemLoading';
import RBSheetOtherRestaurantCartItem from '../../../components/BottomSheet/RBSheetOtherRestaurantCartItem';
import {
  addItemToCart,
  clearCartItems,
  getCustomerCart,
  removeItemFromCart,
  updateCartItemQuantity,
} from '../../../utils/helpers/cartapis';
import {
  addItemToMYCart,
  addToCart,
  setCartRestaurantId,
  updateMyCartList,
} from '../../../redux/CartSlice';
import RBSheetRestaurantClosed from '../../../components/BottomSheet/RBSheetRestaurantClosed';

const RestaurantAllDetails = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {join_as_guest} = useSelector(store => store.store);
  const {cart, cart_restaurant_id, my_cart} = useSelector(store => store.cart);

  const ref_RBSheetGuestUser = useRef(null);

  const refRBSheetRating = useRef();
  const ref_cartAlert = useRef();
  const ref_RBSheetSuccess = useRef();
  const ref_RBSheetResClosed = useRef(null);

  const [rating, setRating] = useState(1);
  const [ratingComment, setRatingComment] = useState('');

  let description =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ullamcorper, lorem non sagittis hendrerit, metus turpis consectetur turpis, eget fermentum nisl velit a  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ullamcorper, lorem non sagittis hendrerit, metus turpis consectetur turpis, eget fermentum nisl velit a';
  const [readMore, setReadMore] = useState(false);

  const [details, setDetails] = useState('');
  const [topSellingList, setTopSellingList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteDetails, setFavoriteDetails] = useState(null);

  const [estimated_delivery_time, setEstimated_delivery_time] = useState(0);
  const [distance, setDistance] = useState(0);
  const [delivery_charges, setDelivery_charges] = useState(0);

  const [cuisinesList, setCuisinesList] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [itemsList, setItemsList] = useState([]);

  const [showViewCartButton, setShowViewCartButton] = useState(false);

  const [loadingNewItems, setLoadingNewItems] = useState(false);

  const [selected_restaurant_id, setSelected_restaurant_id] = useState('');
  const [selected_item, setSelected_item] = useState('');
  const [isItemLoading, setIsItemLoading] = useState(false);

  const [restaurant_timings, setRestaurant_timings] = useState('');

  const DATA = [
    {
      id: 1,
      title: 'Chicken Noodle Special',
      description: 'Grim Cafe & Eatery',
      price: '$ 1,55',
      image: Images.food2,
    },
    {
      id: 2,
      title: 'Chicken Noodle Special',
      description: 'Grim Cafe & Eatery',
      price: '$ 1,55',
      image: Images.food3,
    },
    {
      id: 3,
      title: 'Chicken Noodle Special',
      description: 'Grim Cafe & Eatery',
      price: '$ 1,55',
      image: Images.food7,
    },
    {
      id: 4,
      title: 'Chicken Noodle Special',
      description: 'Grim Cafe & Eatery',
      price: '$ 1,55',
      image: Images.food4,
    },
    {
      id: 5,
      title: 'Chicken Noodle Special',
      description: 'Grim Cafe & Eatery',
      price: '$ 1,55',
      image: Images.chinese,
    },
    {
      id: 6,
      title: 'Chicken Noodle Special',
      description: 'Grim Cafe & Eatery',
      price: '$ 1,55',
      image: Images.food5,
    },
  ];

  // _________________________ handle add to cart functionality ___________________________

  const handleOnRemove = () => {
    setLoading(true);
    // remove all items of previous restaurant
    clearCartItems()
      .then(response => {
        //add new item
        dispatch(setCartRestaurantId(null));
        console.log('new cart restaurant_id : ', selected_restaurant_id);
        add_item_to_cart(selected_item);
        //my_cart
        dispatch(updateMyCartList([]));
        const newData = itemsList?.map(e => {
          return {
            ...e,
            quantity: 0,
          };
        });
        setItemsList(newData);
      })
      .catch(error => {
        console.log('error : ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const validate = restaurant_id => {
    console.log({cart_restaurant_id, restaurant_id});
    if (cart_restaurant_id == null) {
      console.log('cart_restaurant_id is null...');
      return true;
    } else if (cart_restaurant_id != restaurant_id) {
      ref_cartAlert.current.open();
      return false;
    } else {
      return true;
    }
  };

  const updateList = item => {
    const newData = itemsList?.map(element => {
      if (element?.item_id == item?.item_id) {
        return {
          ...element,
          quantity: element.quantity ? element.quantity + 1 : 1,
        };
      } else {
        return {
          ...element,
        };
      }
    });

    setItemsList(newData);
  };

  const handleRemoveItemFromCart = async item => {
    try {
      setIsItemLoading(true);

      let customer_id = await AsyncStorage.getItem('customer_id');
      let cart = await getCustomerCart(customer_id);

      removeItemFromCart(cart?.cart_id, item?.item_id, dispatch)
        .then(response => {
          if (response?.status == true) {
            const newData = itemsList?.map(e => {
              if (e?.item_id == item.item_id) {
                return {
                  ...e,
                  quantity: 0,
                };
              } else {
                return {...e};
              }
            });
            setItemsList(newData);
            const filter = itemsList.filter(
              element => element?.item_id != item?.item_id,
            );
            // setData(filter);
            dispatch(addToCart(filter));

            //my_cart
            // dispatch(removeItemFromMyCart(item?.cart_item_id));
            dispatch(updateMyCartList(filter));

            let filter1 = newData?.filter(e => e?.quantity > 0);
            if (filter1?.length == 0) {
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
          setIsItemLoading(false);
        });
    } catch (error) {
      setIsItemLoading(false);
      console.log('error in delete item  :  ', error);
    }
  };

  const onIncrement = async item => {
    setIsItemLoading(true);
    const newData = itemsList?.map(element => {
      if (element?.item_id == item?.item_id) {
        return {
          ...element,
          quantity: element.quantity ? element.quantity + 1 : 1,
        };
      } else {
        return {
          ...element,
        };
      }
    });
    setItemsList(newData);

    // also update quantity in database and redux state
    const filter = my_cart?.filter(e => e?.item_id == item?.item_id);
    if (filter?.length > 0) {
      let newQuantity = item?.quantity + 1;
      let obj = {
        cart_item_id: filter[0]?.cart_item_id,
        quantity: newQuantity,
      };
      console.log({newQuantity});
      await updateCartItemQuantity(obj, dispatch);
      // also update quantity in redux
      const newData1 = my_cart?.map(e => {
        if (e?.item_id == item?.item_id) {
          return {
            ...e,
            quantity: newQuantity,
          };
        } else {
          return {...e};
        }
      });

      dispatch(updateMyCartList(newData1));
      dispatch(setCartRestaurantId(selected_restaurant_id));
      // ref_RBSheetSuccess?.current?.open();
    }
    setIsItemLoading(false);
  };

  const onDecrement = async item => {
    if (item?.quantity <= 1) {
      //remove that item,
      handleRemoveItemFromCart(item);
      return;
    }

    setIsItemLoading(true);
    const newData = itemsList?.map(element => {
      if (element?.item_id == item?.item_id) {
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
    setItemsList(newData);

    // also update quantity in database and redux state
    const filter = my_cart?.filter(e => e?.item_id == item?.item_id);
    if (filter?.length > 0) {
      let obj = {
        cart_item_id: filter[0]?.cart_item_id,
        quantity: filter[0]?.quantity - 1,
      };
      await updateCartItemQuantity(obj, dispatch);
      // also update quantity in redux
      const newData1 = my_cart?.map(item => {
        if (item?.item_id == route?.params?.id) {
          return {
            ...item,
            quantity: filter[0]?.quantity - 1,
          };
        } else {
          return {...item};
        }
      });

      dispatch(updateMyCartList(newData1));
      dispatch(setCartRestaurantId(selected_restaurant_id));
      setIsItemLoading(false);
    }
    setIsItemLoading(false);
  };

  const add_item_to_cart = async item => {
    setIsItemLoading(true);
    let customer_id = await AsyncStorage.getItem('customer_id');
    let cart = await getCustomerCart(customer_id);
    let data = {
      item_id: item?.item_id,
      cart_id: cart?.cart_id,
      item_type: 'item',
      comments: '',
      quantity: 1,
    };

    await addItemToCart(data, dispatch)
      .then(response => {
        if (response?.status == true) {
          // navigation?.navigate('MyCart');
          console.log('restaurant id set... ', {selected_restaurant_id});
          // dispatch(setCartRestaurantId(selected_restaurant_id));
          dispatch(setCartRestaurantId(item?.restaurant_id));
          //my_cart
          dispatch(addItemToMYCart(response?.result));
          // navigation.goBack();
          // cart_restaurant_id
          ref_RBSheetSuccess?.current?.open();
          updateList(item);
        } else {
          showAlert(response?.message);
        }
      })
      .catch(error => {
        console.log('error  :  ', error);
      })
      .finally(() => {
        setIsItemLoading(false);
      });
  };

  const handelAddItem = async item => {
    console.log(
      'restaurant_timings?.isClosed  : ',
      restaurant_timings?.isClosed,
    );
    if (restaurant_timings?.isClosed) {
      ref_RBSheetResClosed.current.open();
      return;
    } else if (validate(item?.restaurant_id)) {
      add_item_to_cart(item);
    }
  };

  // _______________________________________________________________

  const removeFavorite = async id => {
    setLoading(true);
    // favourite_item_id

    fetch(api.delete_restaurant_from_favorites + id, {
      method: 'DELETE',
      // body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(async response => {
        if (response?.status == true) {
          setFavoriteDetails(response?.result);
          setIsFavorite(false);
        } else {
          showAlert(response?.message);
        }
      })
      .catch(err => {
        showAlert('Something Went Wrong');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleFavorite = async () => {
    setLoading(true);

    let customer_id = await AsyncStorage.getItem('customer_id');
    let data = {
      customer_id: customer_id,
      restaurant_id: route?.params?.id,
    };

    fetch(api.add_restaurant_to_favorites, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(async response => {
        if (response?.status == true) {
          setFavoriteDetails(response?.result);
          setIsFavorite(true);
        } else {
          showAlert(response?.message);
        }
      })
      .catch(err => {
        showAlert('Something Went Wrong');
      })
      .finally(() => setLoading(false));
  };

  const handleSubmitRating = async () => {
    if (rating > 0) {
      setLoading(true);
      let customer_id = await AsyncStorage.getItem('customer_id');
      //send notification to restaurant
      // handleSendPushNotification(`Customer gives you ${rating} star rating`);
      let data = {
        restaurant_id: route?.params?.id,
        rating: rating,
        customer_id: customer_id,
        comment: ratingComment,
      };

      fetch(api.rate_restaurant, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(async response => {
          if (response?.status == false) {
            // showAlert(response?.message);
            showAlert('Invalid Credentials');
            setLoading(false);
          } else {
            getRestaurantDetails(route?.params?.id);
            setTimeout(() => {
              showAlertLongLength('Rating Submitted successfully', 'green');
              setLoading(false);
            }, 3000);
          }
        })
        .catch(err => {
          showAlert('Something went wrong!');
          setLoading(false);
        });
    }
  };

  const handleSendPushNotification = async text => {
    const receiver_fcm = await getUserFcmToken();

    if (receiver_fcm) {
      let body = {
        to: receiver_fcm,
        notification: {
          title: 'Rating',
          body: text ? text : '',
          // mutable_content: true,
          sound: 'default',
        },
        data: {
          // user_id: user,
          type: 'chat',
        },
        priority: 'high',
      };

      var requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `key=${firebase_server_key}`,
        },
        body: JSON.stringify(body),
      };

      fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
        .then(response => response.text())
        .then(response => {
          let res = JSON.parse(response);
        })
        .catch(err => {
          console.log('error :  ', err);
        });
    } else {
      console.log('receiver_fcm not found');
    }
  };

  const getTopSellingItems = id => {
    return new Promise((resolve, reject) => {
      try {
        fetch(api.get_restaurant_top_selling_items + id)
          .then(response => response.json())
          .then(response => {
            resolve(response?.result);
          })
          .catch(err => {
            resolve('');
          });
      } catch (error) {
        resolve('');
      }
    });
  };

  const getRestaurantDetails = async restaurant_id => {
    let res_details = await getRestaurantDetail(restaurant_id);
    let top_selling_items = await getTopSellingItems(restaurant_id);
    setTopSellingList(top_selling_items);
    setDetails(res_details);
    restaurantDistanceAndTimeCalculation(res_details);
    let isFav = await getRestaurantFavoriteStatus(restaurant_id);
    // getting restaurant timings
    let time_obj = await checkRestaurantTimings(restaurant_id);
    setRestaurant_timings(time_obj);
    if (isFav) {
      setIsFavorite(true);
      setFavoriteDetails(isFav);
    }
    setLoading(false);
  };

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const radius = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = radius * c; // Distance in kilometers
    return distance;
  }

  const restaurantDistanceAndTimeCalculation = async res_details => {
    let {latitude, longitude, address} = await getCurrentLocation();

    let pickup_location = res_details?.location;
    let dropOff_Location = address;

    let delivery_time = await getEstimatedDeliveryTime(
      pickup_location,
      dropOff_Location,
    );
    setEstimated_delivery_time(delivery_time);

    ///
    var add = address;
    var value = add?.split(',');
    count = value.length;
    city = value[count - 3];

    let delivery_charges1 = await getDeliveryCharges(city);

    setDelivery_charges(delivery_charges1);
    if (
      latitude &&
      longitude &&
      res_details?.latitude &&
      res_details?.longitude
    ) {
      let distance_in_meters = getDistance(
        {latitude: latitude, longitude: longitude},
        {latitude: res_details?.latitude, longitude: res_details?.longitude},
      );
      // let meter =  distance_in_meters;
      let km = distance_in_meters / 1000;
      setDistance(km);
    }
  };

  const updateItemQuantity = item => {
    const newData = itemsList?.map(element => {
      if (element?.item_id == item?.item_id) {
        return {
          ...element,
          quantity: element.quantity ? element.quantity + 1 : 1,
        };
      } else {
        return {
          ...element,
        };
      }
    });
    const filter = newData?.filter(item => item?.item_id);
    setShowViewCartButton(filter?.length > 0 ? true : false);
    setItemsList(newData);
  };

  // const onIncrement = item => {
  //   const newData = itemsList?.map(element => {
  //     if (element?.item_id == item?.item_id) {
  //       return {
  //         ...element,
  //         quantity: element.quantity ? element.quantity + 1 : 1,
  //       };
  //     } else {
  //       return {
  //         ...element,
  //       };
  //     }
  //   });
  //   setItemsList(newData);
  // };

  // const onDecrement = item => {
  //   const newData = itemsList?.map(element => {
  //     if (element?.item_id == item?.item_id) {
  //       return {
  //         ...element,
  //         quantity: element.quantity - 1,
  //       };
  //     } else {
  //       return {
  //         ...element,
  //       };
  //     }
  //   });
  //   setItemsList(newData);
  // };

  const getAllItem = async restaurant_id => {
    setLoadingNewItems(true);
    fetch(api.get_all_items_by_restaurant + restaurant_id)
      .then(response => response.json())
      .then(response => {
        let list = response?.result ? response?.result : [];
        // setItemsList(list);
        let newList = [];
        for (const item of list) {
          const filter = my_cart?.filter(e => e?.item_id == item?.item_id);
          let obj = {
            ...item,
            quantity: filter?.length > 0 ? filter[0]?.quantity : 0,
          };
          newList.push(obj);
        }
        setItemsList(newList);
      })
      .catch(err => console.log('error : ', err))
      .finally(() => setLoadingNewItems(false));
  };

  const getAllItemByCuisine = async cuisine_id => {
    setLoadingNewItems(true);
    fetch(api.get_all_item_by_cuisine + cuisine_id)
      .then(response => response.json())
      .then(response => {
        let list = response?.result ? response?.result : [];
        // setItemsList(list);
        let newList = [];
        for (const item of list) {
          const filter = my_cart?.filter(e => e?.item_id == item?.item_id);
          let obj = {
            ...item,
            quantity: filter?.length > 0 ? filter[0]?.quantity : 0,
          };
          newList.push(obj);
        }
        setItemsList(newList);
      })
      .catch(err => console.log('error : ', err))
      .finally(() => setLoadingNewItems(false));
  };

  const getAllCuisines = async restaurant_id => {
    setLoadingNewItems(true);
    fetch(api.get_all_cuisine_by_restaurant + restaurant_id)
      .then(response => response.json())
      .then(response => {
        let list = response?.result ? response?.result : [];
        setCuisinesList(list);
      })
      .catch(err => console.log('error : ', err))
      .finally(() => setLoadingNewItems(false));
  };

  useEffect(() => {
    if (selectedCuisine == 'all') {
      //get all restaurant items
      getAllItem(route?.params?.id);
    } else {
      getAllItemByCuisine(selectedCuisine?.cuisine_id);
    }
  }, [selectedCuisine]);

  useEffect(() => {
    if (route?.params?.type == 'favorite') setIsFavorite(true);
  }, [route?.params]);

  useEffect(() => {
    setLoading(true);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      //   let restaurant_id = 'res_2983350';
      getRestaurantDetails(route?.params?.id);
      getAllCuisines(route?.params?.id);
    }, []),
  );

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <StatusBar
        backgroundColor={'transparent'}
        barStyle={'light-content'}
        translucent={true}
      />
      {!loading && (
        <ScrollView style={{flex: 1}}>
         

          <HeaderImageSlider
            data={details?.images ? details?.images : []}
            paginationStyleItemActiveStyle={{
              width: 18,
              height: 7,
              borderRadius: 7 / 2,
            }}
            paginationStyleItemInactive={{
              backgroundColor: '#D4D4D4',
              borderWidth: 0,
            }}
          />

          <View style={{flex: 1, width: wp(100)}}>
            <View style={{flex: 1, paddingHorizontal: 20}}>
              <View style={styles.rowViewSB}>
                <Text
                  style={{
                    color: Colors.primary_color,
                    fontSize: RFPercentage(2.4),
                    fontFamily: Fonts.PlusJakartaSans_Bold,
                  }}>
                  {details?.user_name}
                </Text>
                <View style={styles.rowViewSB}>
                  <Icons.Rating />
                  <Text style={styles.text}>
                    {details?.rating ? details?.rating?.toFixed(1) : '0.0'}
                  </Text>

                  <TouchableOpacity
                    // disabled={isFavorite}
                    onPress={() => {
                      if (join_as_guest) {
                        ref_RBSheetGuestUser?.current?.open();
                      } else {
                        isFavorite
                          ? removeFavorite(
                              favoriteDetails?.favourite_restaurant_id,
                            )
                          : handleFavorite();
                      }
                    }}
                    style={{
                      // position: 'absolute',
                      // right: 5,
                      // top: 5,
                      padding: 10,
                      paddingRight: 0,
                      zIndex: 999,
                    }}>
                    {isFavorite ? (
                      <AntDesign name="heart" size={24} color={Colors.primary_color} />
                    ) : (
                      <AntDesign
                        name="hearto"
                        size={24}
                        color={Colors.primary_color}
                      />
                    )}
                  </TouchableOpacity>

                  {/* <TouchableOpacity
                    style={{paddingLeft: 10}}
                    onPress={() => {
                      navigation.navigate('Conversation', {
                        userId: 'restaurant',
                        name: 'Eatery Hotspot',
                        image: Images.restaurant1,
                      });
                    }}>
                    <Icons.ChatActive />
                  </TouchableOpacity> */}
                </View>
              </View>
              <View
                style={{
                  ...styles.rowView,
                  alignItems: 'center',
                  marginTop: -4,
                  marginBottom: 6,
                }}>
                <Icons.MarkerOutlineActive />
                <Text
                  style={{
                    fontFamily: Fonts.Inter_Regular,
                    color: '#292323',
                    fontSize: RFPercentage(1.5),
                    opacity: 0.55,
                    marginLeft: 7,
                  }}>
                  {details?.location}
                </Text>
              </View>

              <View style={styles.rowView}>
                <View style={styles.card}>
                  <Text style={styles.cardText}>{details?.buisness_type}</Text>
                </View>
                <View style={styles.card}>
                  <Text style={styles.cardText}>{details?.phone_no}</Text>
                </View>
              </View>
            </View>
            {/* <View style={{marginLeft: 20}}>
              <View style={styles.rowView1}>
                <Text style={styles.heading}>Delivery : </Text>
                <Text style={styles.description}>
                  {estimated_delivery_time} mins
                </Text>
              </View>

              <View style={styles.rowView1}>
                <Text style={styles.heading}>Minimum Order : </Text>
                <Text style={styles.description}>
                  {' '}
                  {details?.minimum_order}{' '}
                </Text>
              </View>
              <View style={styles.rowView1}>
                <Text style={styles.heading}>Delivery Charges : </Text>
                <Text style={styles.description}> ${delivery_charges} </Text>
              </View>
              <View style={styles.rowView1}>
                <Text style={styles.heading}>Distance : </Text>
                <Text style={styles.description}>
                  {' '}
                  {distance?.toFixed(1)} km{' '}
                </Text>
              </View>
            </View> */}

            <ScrollView contentContainerStyle={{flex: 1}}>
              <Text
                style={{
                  color: '#191A26',
                  fontSize: RFPercentage(2.4),
                  fontFamily: Fonts.PlusJakartaSans_SemiBold,
                  marginLeft: 20,
                  marginBottom: 20,
                }}>
                {details?.user_name} items
              </Text>

              <FlatList
                data={cuisinesList}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListHeaderComponent={() => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedCuisine('all');
                    }}
                    style={{
                      borderBottomWidth: 3,
                      borderColor:
                        selectedCuisine == 'all' ? Colors.primary_color : '#00000017',
                    }}>
                    <Text
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        paddingLeft: 15,
                        color:
                          selectedCuisine == 'all' ? Colors.primary_color : '#979797',
                        fontFamily:
                          selectedCuisine == 'all'
                            ? Fonts.Inter_SemiBold
                            : Fonts.Inter_Regular,
                      }}>
                      All
                    </Text>
                  </TouchableOpacity>
                )}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => setSelectedCuisine(item)}
                      style={{
                        borderBottomWidth: 3,
                        borderColor:
                          selectedCuisine?.cuisine_id == item?.cuisine_id
                            ? Colors.primary_color
                            : '#00000017',
                      }}>
                      <Text
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 10,
                          color:
                            selectedCuisine?.cuisine_id == item?.cuisine_id
                              ? Colors.primary_color
                              : '#979797',
                          fontFamily:
                            selectedCuisine?.cuisine_id == item?.cuisine_id
                              ? Fonts.Inter_SemiBold
                              : Fonts.Inter_Regular,
                        }}>
                        {item?.cuisine_name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
              {loadingNewItems ? (
                <View style={{marginTop: 40}}>
                  <ItemLoading loading={loadingNewItems} />
                </View>
              ) : (
                <FlatList
                  data={itemsList}
                  ListHeaderComponent={() => <View style={{height: 10}} />}
                  ListFooterComponent={() => <View style={{height: 100}} />}
                  ListEmptyComponent={() => <NoDataFound />}
                  renderItem={({item, index}) => {
                    return (
                      <FoodCardWithRating
                        disabled={true}
                        image={
                          item?.images?.length > 0
                            ? item?.images[0]
                            : ''
                        }
                        title={item?.item_name}
                        price={item?.price}
                        showRating={false}
                        rating={item?.rating}
                        tag={item?.tag}
                        nextIconWidth={26}
                        cardStyle={{
                          marginHorizontal: 0,
                          marginVertical: 8,
                          width: wp(90),
                          alignSelf: 'center',
                        }}
                        showNextButton={true}
                        // showRating={true}
                        priceContainerStyle={{marginTop: 0}}
                        // nextComponent={
                        //   <>
                        //     {item?.quantity > 0 ? (
                        //       <View
                        //         style={{
                        //           flexDirection: 'row',
                        //           alignItems: 'center',
                        //           backgroundColor: '#FF57224F',
                        //           borderRadius: 25,
                        //           paddingVertical: 2,
                        //           paddingHorizontal: 2,
                        //         }}>
                        //         <TouchableOpacity
                        //           onPress={() => onDecrement(item)}
                        //           style={{
                        //             paddingHorizontal: 10,
                        //             paddingVertical: 5,
                        //           }}>
                        //           <AntDesign
                        //             name="minus"
                        //             color={Colors.primary_color}
                        //             size={16}
                        //           />
                        //         </TouchableOpacity>
                        //         <Text
                        //           style={{
                        //             color: Colors.primary_color,
                        //             fontFamily: Fonts.PlusJakartaSans_Bold,
                        //             fontSize: RFPercentage(2),
                        //             marginTop: -2,
                        //           }}>
                        //           {item?.quantity}
                        //         </Text>
                        //         <TouchableOpacity
                        //           onPress={() => onIncrement(item)}
                        //           style={{
                        //             paddingHorizontal: 10,
                        //             paddingVertical: 5,
                        //           }}>
                        //           <AntDesign
                        //             name="plus"
                        //             color={Colors.primary_color}
                        //             size={16}
                        //           />
                        //         </TouchableOpacity>
                        //       </View>
                        //     ) : (
                        //       <TouchableOpacity
                        //         onPress={() => {
                        //           updateItemQuantity(item);
                        //         }}>
                        //         <Icons.AddCircle width={25} />
                        //       </TouchableOpacity>
                        //     )}
                        //   </>
                        // }

                        nextComponent={
                          <>
                            {isItemLoading &&
                            item?.item_id == selected_item?.item_id ? (
                              <ItemLoading loading={isItemLoading} />
                            ) : item?.quantity > 0 ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  backgroundColor: '#FF57224F',
                                  borderRadius: 25,
                                  paddingVertical: 2,
                                  paddingHorizontal: 2,
                                }}>
                                <TouchableOpacity
                                  onPress={() => {
                                    setSelected_item(item);
                                    setSelected_restaurant_id(
                                      item?.restaurant_id,
                                    );
                                    onDecrement(item);
                                  }}
                                  style={{
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                  }}>
                                  <AntDesign
                                    name="minus"
                                    color={Colors.primary_color}
                                    size={16}
                                  />
                                </TouchableOpacity>
                                <Text
                                  style={{
                                    color: Colors.primary_color,
                                    fontFamily: Fonts.PlusJakartaSans_Bold,
                                    fontSize: RFPercentage(2),
                                    marginTop: -2,
                                  }}>
                                  {item?.quantity}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    setSelected_item(item);
                                    setSelected_restaurant_id(
                                      item?.restaurant_id,
                                    );
                                    onIncrement(item);
                                  }}
                                  style={{
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                  }}>
                                  <AntDesign
                                    name="plus"
                                    color={Colors.primary_color}
                                    size={16}
                                  />
                                </TouchableOpacity>
                              </View>
                            ) : (
                              <TouchableOpacity
                                onPress={() => {
                                  console.log('item...', item?.restaurant_id);
                                  setSelected_item(item);
                                  setSelected_restaurant_id(
                                    item?.restaurant_id,
                                  );
                                  handelAddItem(item);
                                }}>
                                <Icons.AddCircle width={25} />
                              </TouchableOpacity>
                            )}
                          </>
                        }
                      />
                    );
                  }}
                />
              )}

              <View>
                <RBSheetRating
                  refRBSheet={refRBSheetRating}
                  title="Rate Restaurant"
                  rating={rating}
                  setRating={setRating}
                  onSubmit={() => {
                    refRBSheetRating?.current?.close();
                    handleSubmitRating();
                  }}
                  comment={ratingComment}
                  setComment={setRatingComment}
                />
              </View>
            </ScrollView>
          </View>

          <RBSheetGuestUser
            refRBSheet={ref_RBSheetGuestUser}
            btnText={'OK'}
            onSignIn={() => {
              ref_RBSheetGuestUser?.current?.close();
              navigation?.popToTop();
              navigation?.replace('SignIn');
            }}
            onSignUp={() => {
              ref_RBSheetGuestUser?.current?.close();
              navigation?.popToTop();
              navigation?.replace('SignUp');
            }}
          />

          <View>
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
            <RBSheetSuccess
              refRBSheet={ref_RBSheetSuccess}
              title={`"${selected_item?.item_name}" added to cart.`}
              btnText={'OK'}
              onPress={() => {
                ref_RBSheetSuccess?.current?.close();
                // navigation.goBack();
              }}
            />

            <RBSheetRestaurantClosed
              refRBSheet={ref_RBSheetResClosed}
              title={`“${
                restaurant_timings?.restaurant_details?.user_name
              }” is closed ${
                restaurant_timings?.closed_till
                  ? ' till ' + restaurant_timings?.closed_till
                  : '.'
              }`}
            />
          </View>
        </ScrollView>
      )}

      {showViewCartButton ? (
        <View
          style={{
            position: 'absolute',
            bottom: hp(4),
          }}>
          <CButton
            title="VIEW YOUR CART"
            // width={wp(40)}
            onPress={() => {
              if (join_as_guest) {
                ref_RBSheetGuestUser?.current?.open();
              } else {
                navigation?.navigate('MyCart');
              }
            }}
          />
        </View>
      ) : (
        <View
          style={{
            position: 'absolute',
            bottom: hp(4),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: wp(85),
          }}>
          <CButton
            title="CHAT"
            width={wp(40)}
            leftIcon={<Icons.ChatWhite />}
            onPress={() => {
              if (join_as_guest) {
                ref_RBSheetGuestUser?.current?.open();
              } else {
                navigation.navigate('Conversation', {
                  // userId: 'restaurant',
                  // name: 'Eatery Hotspot',
                  // image: Images.restaurant1,
                  type: 'restaurant',
                  userId: details?.restaurant_id,
                  name: details?.user_name,
                  image:
                    details?.images?.length == 0
                      ? null
                      : details?.images[0],
                  fcm_token: details?.fcm_token,
                });
              }
            }}
          />
          <CButton
            title="RATE"
            width={wp(40)}
            leftIcon={<Icons.RatingWhite width={18} />}
            onPress={() => {
              if (join_as_guest) {
                ref_RBSheetGuestUser?.current?.open();
              } else {
                refRBSheetRating.current.open();
              }
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },

  iconContainer: {
    width: wp(20),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: hp(6),
  },
  heading: {
    fontFamily: Fonts.PlusJakartaSans_Bold,
    color: Colors.primary_color,
    fontSize: RFPercentage(2.5),
    marginBottom: 10,
  },
  rowViewSB: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: Colors.Text,
    fontFamily: Fonts.PlusJakartaSans_Regular,
    marginLeft: 4,
    fontSize: RFPercentage(1.8),
    lineHeight: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: Colors.primary_color,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    paddingVertical: 5,
    marginRight: 15,
    paddingHorizontal: 10,
  },
  rowView: {
    flexDirection: 'row',
    marginVertical: 20,
  },

  cardText: {color: Colors.primary_color},
  rowView1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  heading: {
    color: '#000',
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(2),
  },
  description: {
    color: '#000',
    fontFamily: Fonts.PlusJakartaSans_Medium,
    fontSize: RFPercentage(1.5),
  },
});

export default RestaurantAllDetails;
