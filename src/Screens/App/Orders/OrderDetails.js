import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import {  Fonts, Icons, Images } from '../../../constants';
import StackHeader from '../../../components/Header/StackHeader';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import ImageSlider from '../../../components/Slider/ImageSlider';
import CButton from '../../../components/Buttons/CButton';
import CRBSheetComponent from '../../../components/BottomSheet/CRBSheetComponent';
import CInput from '../../../components/TextInput/CInput';
import { Avatar } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';

import { Rating, AirbnbRating } from 'react-native-ratings';
import PriceText from '../../../components/Text';
import SuccessModal from '../../../components/Modal/SuccessModal';
import HeaderImageSlider from '../../../components/Slider/HeaderImageSlider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RBSheetSuccess from '../../../components/BottomSheet/RBSheetSuccess';
import { RadioButton } from 'react-native-paper';
import {
  fetchApisGet,
  getUserFcmToken,
  handlePopup,
  showAlert,
  showAlertLongLength,
} from '../../../utils/helpers';
import {
  firebase_server_key,
} from '../../../utils/globalVariables';
import api from '../../../constants/api';
import Loader from '../../../components/Loader';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Store_Restaurant_Notification,
  Store_Rider_Notification,
} from '../../../utils/helpers/notificationApis';
import SectionSeparator from '../../../components/Separator/SectionSeparator';
import ItemSeparator from '../../../components/Separator/ItemSeparator';
import PaymentCard from '../../../components/Cards/PaymentCard';
import { useDispatch, useSelector } from 'react-redux';
import PopUp from '../../../components/Popup/PopUp';

const OrderDetails = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const customer_id = useSelector(store => store.store.customer_id)
  const { showPopUp, popUpColor, PopUpMesage, contacts,Colors } = useSelector(store => store.store)
  const dispatch = useDispatch()
  const [orderDetails, setOrderDetails] = useState(null);
  const [itemImages, setItemImages] = useState([]);
  const ref_RBSheetAlert = useRef();
  const [rbSheetAlertText, setRbSheetAlertText] = useState('');
  const [visible, setVisible] = useState(false); // to show cancel order success modal
  const ref_ComplaintSheet = useRef(null);
  const ref_RatingOptionSheet = useRef(null);
  const ref_RatingSheet = useRef(null);
  const [isRateResturant, setIsRateResturant] = useState(false);
  const [checked, setChecked] = React.useState('rider');
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [typee, setTypee] = useState(route?.params?.type);

  // console.log(orderDetails.riderData);
  // console.log(orderDetails.restaurantData.restaurant_id);


  function getRoomIdByRestaurantId(restaurantId) {
    for (const item of contacts) {
        if (item.restaurant_id === restaurantId) {
            return item.room_id; // Return the room_id if the restaurant_id matches
        }
    }
    return null; // Return null if no match is found
  }

  function getRoomIdByRiderId(riderId) {
    for (const item of contacts) {
        if (item.rider_id === riderId) {
            return item.room_id; // Return the room_id if the rider_id matches
        }
    }
    return null; // Return null if no match is found
}
  const RestaruantContact = { "customer_id": customer_id, "receiver_id": orderDetails?.restaurantData?.restaurant_id, "receiver_type": "restaurant", "restaurant_id": orderDetails?.restaurantData?.restaurant_id, "rider_id": null, "room_id": getRoomIdByRestaurantId(orderDetails?.restaurantData?.restaurant_id), "sender_id": customer_id, "sender_type": "customer", "restaurant_name": orderDetails?.restaurantData?.user_name, order_id:orderDetails?.order_id }
  const riderContact = { "customer_id": customer_id, "receiver_id": orderDetails?.riderData?.rider_id, "receiver_type": "rider", "restaurant_id": null, "rider_id": orderDetails?.riderData?.rider_id, "room_id": getRoomIdByRiderId(orderDetails?.riderData?.rider_id), "sender_id": customer_id, "sender_type": "customer", "rider_name": orderDetails?.riderData?.name, order_id:orderDetails?.order_id }

  const handleSelectContact = async (contact) => {

    // setRoomId(contact.room_id); 
    // setMessages([]); 

    navigation.navigate('Conversation', {
      contact: contact,
      name: contact?.restaurant_name || contact?.rider_name
    })
  };

  

  const handleCancelOrder = () => {
    setLoading(true);
    let data = {
      order_id: orderDetails?.order_id,
      order_status: 'cancelled',
    };
    // console.log(data);
    fetch(api.update_order_status, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(async response => {
        // console.log('response  :  ', response);
        if (response?.error == false) {
          setVisible(true);
        } else {

          // showAlert(response?.message);
          handlePopup(dispatch, response?.message, 'red')
        }
      })
      .catch(err => {
        console.log('Error in accept/reject order :  ', err);
        handlePopup(dispatch, 'Something went wrong', 'red')
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onRiderSelect = () => {
    setIsRateResturant(false);
    ref_RatingOptionSheet?.current?.close();
    ref_RatingSheet?.current?.open();
    setChecked('rider');
  };

  const onDriverSelect = () => {
    setIsRateResturant(true);
    ref_RatingOptionSheet?.current?.close();
    ref_RatingSheet?.current?.open();
    setChecked('driver');
  };

  const handleRateRestaurant = async () => {
    setLoading(true);
    // let customer_id = await AsyncStorage.getItem('customer_id');
    //send notification to restaurant
    // handleSendPushNotification(`Customer gives you ${rating} star rating`);
    let data = {
      restaurant_id: orderDetails?.restaurant_id,
      rating: rating,
      customer_id: customer_id,
      comment: ratingComment,
    };
    console.log('data  : ', data);

    fetch(api.rate_restaurant, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(async response => {
        // console.log('response  :   ', response);
        if (response?.status == false) {
          setLoading(false);
          handlePopup(dispatch, response?.message, 'red')
          // setTimeout(() => {
          //   showAlertLongLength(response?.message);

          // }, 1000);
        } else {
          let fcm_token = orderDetails?.restaurantData?.fcm_token;
          let restaurant_id = orderDetails?.restaurant_id;
          let title = 'Rating';
          let description = `${orderDetails?.customerData?.user_name} gives you ${rating} star rating`;
          let notification_type = 'rating';
          let order_id = orderDetails?.order_id

          // handleSendPushNotification(description, fcm_token); // sending push notification
          console.log(
            'Store_Restaurant_Notification____________________ called.....',
          );
          // storing notification to db
          Store_Restaurant_Notification(
            restaurant_id,
            notification_type,
            title,
            description,
            order_id,
          );

          setLoading(false);
          setRatingComment('');
          handlePopup(dispatch, 'Rating Submitted successfully', 'green')

        }
      })
      .catch(err => {

        handlePopup(dispatch, 'Something went wrong', 'red')
        setLoading(false);
      });
  };

  const handleRateRider = async () => {
    setLoading(true);
    // let customer_id = await AsyncStorage.getItem('customer_id');
    //send notification to restaurant
    // handleSendPushNotification(`Customer gives you ${rating} star rating`);
    let data = {
      rider_id: orderDetails?.rider_id,
      rating: rating,
      customer_id: customer_id,
      comments: ratingComment,
      order_id: orderDetails?.order_id
    };
    console.log('Body in rate rider  : ', data);

    fetch(api.rate_rider, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(async response => {
        // console.log('response Rate Rider  :   ', response);
        if (response?.status == false) {
          setLoading(false);
          handlePopup(dispatch, 'Something went wrong', 'red')

        } else {
          let fcm_token = orderDetails?.riderData?.fcm_token;
          let rider_id = orderDetails?.rider_id;
          let title = 'Rating';
          let description = `${orderDetails?.customerData?.user_name} gives you ${rating} star rating`;
          let notification_type = 'rating';
          let order_id = orderDetails?.order_id

          // handleSendPushNotification(description, fcm_token); // sending push notification
          // storing notification to db
          Store_Rider_Notification(
            rider_id,
            notification_type,
            title,
            description,
            order_id,
          );

          setLoading(false);
          setRatingComment('');
          handlePopup(dispatch, 'Rating Submitted successfully', 'green')

        }
      })
      .catch(err => {
        console.log('Error in Rider Rating :  ', err);
        handlePopup(dispatch, 'Something went wrong', 'red')
        setLoading(false);
      });

  };

  const handleSubmitRating = async () => {
    if (rating > 0) {
      if (isRateResturant) {
        // console.log('rate resturant');
        handleRateRestaurant();
      } else {
        // console.log('rate rider');
        handleRateRider();
      }
    }

    // console.log('handleSubmitRating  :  called.....', rating, ratingComment);
    // if (rating > 0) {
    //   if (isRateResturant) {
    //     //send notification to restaurant
    //     handleSendPushNotification(`Customer gives you ${rating} star rating`);
    //   } else {
    //     //send notification to rider
    //     handleSendPushNotification(`Customer gives you ${rating} star rating`);
    //   }
    // }
  };

  // const handleSendPushNotification = async (text, receiver_fcm) => {
  //   console.log({ text, receiver_fcm });
  //   // const receiver_fcm = await getUserFcmToken();
  //   if (receiver_fcm) {
  //     let body = {
  //       to: receiver_fcm,
  //       notification: {
  //         title: 'Rating',
  //         body: text ? text : '',
  //         // mutable_content: true,
  //         sound: 'default',
  //       },
  //       data: {
  //         // user_id: user,
  //         type: 'chat',
  //       },
  //       priority: 'high',
  //     };

  //     var requestOptions = {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `key=${firebase_server_key}`,
  //       },
  //       body: JSON.stringify(body),
  //     };

  //     fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
  //       .then(response => response.text())
  //       .then(response => {
  //         let res = JSON.parse(response);
  //         console.log('push notification response :  ', res);
  //       })
  //       .catch(err => {
  //         console.log('error :  ', err);
  //       });
  //   } else {
  //     console.log('receiver_fcm not found');
  //   }
  // };

  const getDetail = async (id) => {
    console.log(api.get_order_by_id + id);

   const response = await fetchApisGet(api.get_order_by_id + id, setLoading , dispatch)
    if (response.error == false) {
      console.log(response?.result?.order_status);
      
      if (response?.result?.order_status === 'cancelled' ) {
        // console.log('cancelled');
        
        setTypee('cancelled')
      }
      else if (response?.result?.order_status === "delivered") {
        setTypee('completed')
      }
      else {
        setTypee('all')
      }
      setOrderDetails(response.result);
      let cart_item =
        response.result?.cart_items_Data?.length > 0
          ? response.result?.cart_items_Data[0]
          : null;
      setItemImages(cart_item?.itemData?.images);
    } else {
      setOrderDetails(null);
    }
    // fetch(api.get_order_by_id + id)
    //   .then(response => response.json())
    //   .then(response => {
    //     // console.log('response :  ', response);
    //     if (response.error == false) {
    //       setOrderDetails(response.result);
    //       let cart_item =
    //         response.result?.cart_items_Data?.length > 0
    //           ? response.result?.cart_items_Data[0]
    //           : null;
    //       setItemImages(cart_item?.itemData?.images);
    //       setFistCartItemDetail(cart_item);
    //     } else {
    //       setOrderDetails(null);
    //     }
    //   })
    //   .catch(err => console.log('error : ', err))
    //   .finally(() => setLoading(false));
  };


  useEffect(() => {
    let id = route?.params?.id;
    if (id) {
      getDetail(id)
    }
    else{
      let item = route?.params?.item;
      // console.log('order details id :  ', item);
      setOrderDetails(item)
  
  
      let cart_item =
        item?.cart_items_Data?.length > 0
          ? item?.cart_items_Data[0]
          : null;
      setItemImages(cart_item?.itemData?.images);
    }
  
   
  }, []);

  function getInitials(input) {
    // Split the string into words
    const words = input.trim().split(' ');

    // Check the number of words
    if (words.length === 1) {
      // If only one word, return the first letter in uppercase
      return words[0][0].toUpperCase();
    } else {
      // If two or more words, return the first letters of the first two words in uppercase
      return words[0][0].toUpperCase() + words[1][0].toUpperCase();
    }
  }



  const styles = StyleSheet.create({
    heading1: {
      fontFamily: Fonts.PlusJakartaSans_Bold,
      color: Colors.primary_text,
      fontSize: RFPercentage(2.2),
    },
    priceText: {
      fontFamily: Fonts.PlusJakartaSans_ExtraBold,
      color: Colors.primary_color,
      fontSize: RFPercentage(2.5),
    },
  
    container: {
      flex: 1,
      backgroundColor: Colors.secondary_color,
      alignItems: 'center',
      // paddingHorizontal: 20,
    },
    heading: {
      fontFamily: Fonts.PlusJakartaSans_SemiBold,
      color: Colors.primary_text,
      fontSize: RFPercentage(2.2),
      flex: 1,
    },
    price: {
      fontFamily: Fonts.PlusJakartaSans_Bold,
      color: Colors.primary_color,
      fontSize: RFPercentage(2.4),
      flex: 0.6,
      textAlign: 'right',
    },
  
    itemView: {
      marginVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      // backgroundColor: '#F6F6F6',
      backgroundColor: `${Colors.secondary_text}10`,
      padding: 10,
      paddingHorizontal: 10,
      borderRadius: 10,
      overflow: 'hidden',
    },
    imageContainer: {
      width: 50,
      height: 50,
      borderRadius: 10,
      overflow: 'hidden',
      backgroundColor: `${Colors.primary_color}30`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textContainer: {
      marginLeft: 10,
      flex: 1,
    },
    image: {
      height: '100%',
      width: '100%',
      resizeMode: 'contain',
    },
    rowView: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowViewSB: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 5,
    },
    subText: {
      color: Colors.secondary_text,
      fontFamily: Fonts.Inter_Regular,
      fontSize: RFPercentage(2),
    },
    subText1: {
      fontFamily: Fonts.Inter_Regular,
      fontSize: RFPercentage(1.5),
      color: Colors.secondary_text,
      textTransform: 'capitalize',
    },
    title: {
      color: Colors.primary_text,
      fontSize: RFPercentage(2),
      fontFamily: Fonts.Inter_Medium,
    },
    title1: {
      color: Colors.primary_text,
      fontFamily: Fonts.Inter_Medium,
      fontSize: RFPercentage(1.8),
      marginLeft: 12,
    },
    title2: {
      color: Colors.primary_color,
      fontFamily: Fonts.PlusJakartaSans_Bold,
      fontSize: RFPercentage(1.9),
      marginLeft: 12,
    },
    rbSheetHeading: {
      color: Colors.primary_text,
      fontFamily: Fonts.PlusJakartaSans_Bold,
      fontSize: RFPercentage(2.4),
    },
  
    location_container: {
      marginVertical: 15,
      // flex: 1,
      paddingHorizontal: 20,
    },
   
  
    verticalDottedLine: {
      // height: 45,
      minHeight: 30,
      flex: 1,
      borderWidth: 1,
      borderColor: Colors.primary_color,
      borderStyle: 'dashed',
      width: 1,
      // marginLeft: 19,
      marginLeft: 8,
      position: 'absolute',
      left: 22,
      top: 33,
    },
    location_heading: {
      color: Colors.primary_color,
      fontFamily: Fonts.Inter_Medium,
      fontSize: RFPercentage(2),
      width: wp(70),
      marginLeft: 15,
    },
    location_description: {
      color: Colors.secondary_text,
      fontFamily: Fonts.Inter_Regular,
      fontSize: RFPercentage(1.5),
      width: wp(70),
      marginLeft: 15,
    },
    subText2: {
      color: Colors.primary_text,
      fontFamily: Fonts.Inter_Regular,
      fontSize: RFPercentage(2),
      // lineHeight: 30,
    },
    total_amountText: {
      color: Colors.primary_text,
      fontFamily: Fonts.PlusJakartaSans_Bold,
      fontSize: RFPercentage(2),
      // lineHeight: 30,
    },
  });
  
  
  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      {showPopUp && <PopUp color={popUpColor} message={PopUpMesage} />}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
       
        <HeaderImageSlider data={itemImages && itemImages} />

        <View style={{ flex: 1, backgroundColor: `${Colors.primary_color}10`, width: '90%', overflow: 'hidden', alignSelf: 'center', borderRadius: wp(3) }}>
         

          <View style={{ ...styles.rowViewSB, paddingHorizontal: 20 }}>
            <View>
              <Text
                style={{
                  color: Colors.primary_text,
                  fontFamily: Fonts.PlusJakartaSans_Bold,
                  fontSize: RFPercentage(2),
                  lineHeight: 30,
                }}>
                Order #{orderDetails?.order_id}
              </Text>
              {typee == 'cancelled' ? (
                <Text
                  style={{
                    color: Colors.secondary_text,
                    fontFamily: Fonts.PlusJakartaSans_Regular,
                    fontSize: RFPercentage(1.7),
                  }}>
                  {/* Cancelled on 02 Oct, 2023 */}
                  Cancelled on{' '}
                  {moment(new Date(orderDetails?.updated_at)).format(
                    'Do,MMM YYYY',
                  )}
                </Text>
              ) : typee == 'completed' ? (
                <Text
                  style={{
                    color: Colors.secondary_text,
                    fontFamily: Fonts.PlusJakartaSans_Regular,
                    fontSize: RFPercentage(1.7),
                  }}>
                  {/* Delivered on 02 Oct, 2023 */}
                  Delivered on{' '}
                  {moment(new Date(orderDetails?.updated_at)).format(
                    'Do,MMM YYYY',
                  )}
                </Text>
              ) : (
                <>
                  <Text
                    style={{
                      color: Colors.secondary_text,
                      fontFamily: Fonts.PlusJakartaSans_Regular,
                      fontSize: RFPercentage(1.7),
                    }}>
                    Order Status:{' '}
                    <Text
                      style={{
                        color: Colors.primary_color,
                        fontFamily: Fonts.PlusJakartaSans_SemiBold,
                        fontSize: RFPercentage(1.7),
                        textTransform: 'capitalize',
                      }}>
                      {orderDetails?.order_status}
                    </Text>
                  </Text>
                </>
              )}
            </View>
            <Text style={styles.priceText}>$ {orderDetails?.total_amount}</Text>
          </View>

          <View style={styles.location_container}>
            <View style={{ flexDirection: 'row' }}>
              <Icons.MapMarker width={wp(6)} />
              <View style={{ marginTop: 0 }}>
                <Text style={styles.location_heading}>Order from</Text>
                <Text style={styles.location_description}>
                  {orderDetails?.restaurantData?.user_name}
                </Text>
              </View>
            </View>
            <View style={styles.verticalDottedLine} />
            <View style={{ flexDirection: 'row', marginTop: hp(0) }}>
              <Icons.MapMarker width={wp(6)} />
              <View style={{}}>
                <Text style={styles.location_heading}>Delivered to</Text>
                <Text style={styles.location_description}>
                  {orderDetails?.locationData?.address}
                </Text>
              </View>
            </View>
          </View>

          <SectionSeparator />
          <View style={{ padding: 20 }}>
            {orderDetails?.cart_items_Data &&
              orderDetails?.cart_items_Data?.map((item, key) => {
                // console.log(item?.itemData,' dfsdfwe');
                // {item?.item_type == 'deal' ? item.price * item?.quantity : item?.variationData?.price * item?.quantity}

                return (
                  <View key={key} style={{ ...styles.rowView, marginBottom: 5 }}>
                    <Ionicons
                      name={'close'}
                      size={15}
                      color={Colors.primary_color}
                      style={{ marginBottom: -3 }}
                    />
                    <Text
                      style={{
                        color: Colors.primary_color,
                        fontFamily: Fonts.PlusJakartaSans_Bold,
                        fontSize: RFPercentage(2),
                        marginLeft: 5,
                        marginHorizontal: 10,
                      }}>
                      {item?.quantity}
                    </Text>
                    <Text
                      style={{
                        color: Colors.primary_text,
                        fontFamily: Fonts.PlusJakartaSans_Bold,
                        fontSize: RFPercentage(2),
                      }}>
                      {item
                        ? item?.item_type == 'deal'
                          ? item?.itemData?.name
                          : item?.itemData?.item_name
                        : ''}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        textAlign: 'right',
                        color: Colors.primary_color,
                        fontFamily: Fonts.PlusJakartaSans_SemiBold,
                        fontSize: RFPercentage(2),
                      }}>
                      $ {item?.item_type == 'deal' ? item.sub_total * item?.quantity : item?.sub_total * item?.quantity}
                    </Text>
                  </View>
                )
              })}
          </View>
          <SectionSeparator />


          <>
            <View style={{ padding: 20 }}>
              <View style={styles.rowViewSB}>
                <Text style={styles.subText2}>Subtotal</Text>
                <Text style={styles.subText2}>
                  ${orderDetails?.sub_total}
                  {/* ${' '}
                    {calculateSubTotal(
                      orderDetails?.total_amount,
                      orderDetails?.platform_fees,
                      orderDetails?.delivery_charges,
                    )} */}
                  {/* {parseInt(orderDetails?.total_amount) -
                      (parseInt(orderDetails?.platform_fees) +
                        parseInt(orderDetails?.delivery_charges))} */}
                </Text>
              </View>

              <View style={styles.rowViewSB}>
                <Text style={styles.subText2}>Delivery Charges</Text>
                <Text style={styles.subText2}>
                  $ {orderDetails?.delivery_charges}
                  {/* ${' '}
                    {parseInt(orderDetails?.platform_fees) +
                      parseInt(orderDetails?.delivery_charges)} */}
                </Text>
              </View>
              <View style={styles.rowViewSB}>
                <Text style={styles.subText2}>Gst Charges</Text>
                <Text style={styles.subText2}>
                  $ {orderDetails?.gst}
                  {/* ${' '}
                    {parseInt(orderDetails?.platform_fees) +
                      parseInt(orderDetails?.delivery_charges)} */}
                </Text>
              </View>
              <ItemSeparator />
              <View style={{ ...styles.rowViewSB, marginTop: -5 }}>
                <Text style={styles.total_amountText}>Total</Text>
                <Text style={styles.total_amountText}>
                  $ {orderDetails?.total_amount}
                </Text>
              </View>
              {
                orderDetails?.comments && <View style={{ marginTop: hp(2) }} >
                  <Text style={[styles.total_amountText, { fontFamily: Fonts.PlusJakartaSans_Bold, marginBottom: hp(1), color: Colors.primary_color }]}>Special Instructions: </Text>
                  <Text style={[styles.subText2, { fontFamily: Fonts.PlusJakartaSans_Regular, fontSize: RFPercentage(1.6) }]}>Please drop the food at the reception desk. I’ll collect it later. </Text>
                </View>
              }

            </View>


            <Text
              style={{
                color: Colors.primary_color,
                fontFamily: Fonts.PlusJakartaSans_Bold,
                fontSize: RFPercentage(2.3),
                marginHorizontal: 20,
              }}>
              Payment Methods
            </Text>
           
            {orderDetails?.payment_option == 'cash' ? (
              <PaymentCard type="cash" title="Cash On Delivery" />
            ) : (
              <PaymentCard />
            )}


            <View style={{ paddingHorizontal: 20 }}>
              {typee == 'all' && <View style={styles.itemView}>
                <View style={styles.imageContainer}>
                  <Icons.Van />
                </View>
                <View style={styles.textContainer}>
                  <Text style={{ ...styles.title, marginBottom: 5 }}>
                    Estimate Delivery Time
                  </Text>
                  <Text
                    style={{
                      ...styles.title,
                      color: Colors.primary_color,
                      fontFamily: Fonts.Inter_SemiBold,
                    }}>
                    {/* 40 mins */}
                    {orderDetails?.estimated_delivery_time
                      ? `${orderDetails?.estimated_delivery_time} mins`
                      : '0 mins'}
                  </Text>
                </View>
              </View>}


              {
                typee != 'completed' && <View>
                   {orderDetails?.restaurantData?.restaurant_id && (
                <TouchableOpacity onPress={()=> handleSelectContact(RestaruantContact)}  style={styles.itemView}>
                  <View style={{ backgroundColor: Colors.button.primary_button, paddingHorizontal: wp(4), paddingVertical: wp(2.2), borderRadius: wp(10), }} ><Text style={{ color: Colors.button.primary_button_text, fontSize: RFPercentage(2.4), padding: 0 }} >{getInitials(orderDetails?.restaurantData?.user_name)}</Text></View>
                  <View style={styles.textContainer}>
                    <Text style={{ ...styles.subText, marginLeft: 5 }}>
                      {/* Rider's name here */}
                      {orderDetails?.restaurantData?.user_name}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleSelectContact(RestaruantContact)}>
                    <Icons.ChatActive />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}

              {orderDetails?.riderData?.rider_id && (
                <View style={styles.itemView}>
                  <View style={{ backgroundColor: Colors.button.primary_button, paddingHorizontal: wp(4), paddingVertical: wp(2.2), borderRadius: wp(10), }} ><Text style={{ color: Colors.button.primary_button_text, fontSize: RFPercentage(2.4), padding: 0 }} >{getInitials(orderDetails?.riderData?.name)}</Text></View>

                  <View style={styles.textContainer}>
                    <Text style={{ ...styles.subText, marginLeft: 5 }}>
                      {orderDetails?.riderData?.name}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      handleSelectContact(riderContact)
                    }>
                    <Icons.ChatActive />
                  </TouchableOpacity>
                </View>
              )}

                </View>
              }

             


            </View>

          </>


          {typee == 'history' && (
            <View
              style={{
                paddingHorizontal: 20,
                marginVertical: 10,
                width: wp(100),
              }}>
              <View style={styles.rowViewSB}>
                <Text style={styles.title2}>Date Of Order:</Text>
                <Text style={styles.subText1}>
                  {orderDetails?.created_at
                    ? moment(orderDetails?.created_at).format('DD/MM/YYYY')
                    : ''}
                </Text>
              </View>
              <View style={styles.rowViewSB}>
                <Text style={styles.title2}>Order Status:</Text>
                <Text style={styles.subText1}>
                  {orderDetails?.order_status}
                </Text>
              </View>
            </View>
          )}

        
        </View>
        <View>
          {/* _________________________Complaint Sheet _________________________ */}
          <CRBSheetComponent
            refRBSheet={ref_ComplaintSheet}
            content={
              <ScrollView keyboardShouldPersistTaps="handled">
                <View style={{ ...styles.rowViewSB, marginBottom: 20 }}>
                  <Text style={styles.rbSheetHeading}>Add Complaint</Text>
                  <TouchableOpacity
                    onPress={() => ref_ComplaintSheet?.current?.close()}>
                    <Ionicons name={'close'} size={22} color={'#1E2022'} />
                  </TouchableOpacity>
                </View>
                <CInput
                  placeholder="Enter Complaint"
                  multiline={true}
                  numberOfLines={6}
                  textAlignVertical="top"
                />
                <CButton
                  title="Add"
                  onPress={() => {
                    setRbSheetAlertText('Complaint Added Successfully');
                    ref_ComplaintSheet?.current?.close();
                    ref_RBSheetAlert.current?.open();
                  }}
                />
              </ScrollView>
            }
          />
          {/* ______________________Rating Options Sheet ______________________________________ */}
          <CRBSheetComponent
            refRBSheet={ref_RatingOptionSheet}
            height={190}
            content={
              <View style={{ width: wp(90) }}>
                <View style={{ ...styles.rowViewSB, marginBottom: 18 }}>
                  <Text style={styles.rbSheetHeading}>
                    Who you wants to Rate
                  </Text>
                  <TouchableOpacity
                    onPress={() => ref_RatingOptionSheet?.current?.close()}>
                    <Ionicons name={'close'} size={22} color={'#1E2022'} />
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() => onRiderSelect()}
                    style={styles.rowView}>
                    <RadioButton
                      value="first"
                      uncheckedColor={Colors.button.primary_button}
                      color={Colors.button.primary_button}
                      status={checked === 'rider' ? 'checked' : 'unchecked'}
                      onPress={() => onRiderSelect()}
                    />
                    <Text
                      style={{
                        color: Colors.secondary_text ,
                        fontFamily: Fonts.PlusJakartaSans_Regular,
                        fontSize: RFPercentage(1.8),
                        marginTop: -2,
                      }}>
                      Rate Rider
                    </Text>
                    {/* <Entypo name="chevron-small-right" size={25} /> */}
                  </TouchableOpacity>
                  <View
                    style={{
                      marginVertical: 7,
                      height: 0.8,
                      backgroundColor: Colors.secondary_text,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => onDriverSelect()}
                    style={styles.rowView}>
                    <RadioButton
                      value="first"
                      uncheckedColor={Colors.button.primary_button}
                      color={Colors.button.primary_button}
                      status={checked === 'driver' ? 'checked' : 'unchecked'}
                      onPress={() => onDriverSelect()}
                    />
                    <Text
                      style={{
                        color: Colors.secondary_text,
                        fontFamily: Fonts.PlusJakartaSans_Medium,
                      }}>
                      Rate Restaurant
                    </Text>
                    {/* <TouchableOpacity
                      style={{}}
                      onPress={() => {
                        setIsRateResturant(true);
                        ref_RatingOptionSheet?.current?.close(),
                          ref_RatingSheet?.current?.open();
                      }}>
                      <Entypo name="chevron-small-right" size={25} />
                    </TouchableOpacity> */}
                  </TouchableOpacity>
                </View>
              </View>
            }
          />

          <CRBSheetComponent
            refRBSheet={ref_RatingSheet}
            height={370}
            content={
              <View style={{ width: wp(90) }}>
                <Text
                  style={{
                    color: Colors.primary_text,
                    fontFamily: Fonts.PlusJakartaSans_Bold,
                    fontSize: RFPercentage(2.4),
                    marginBottom: 20,
                  }}>
                  {isRateResturant ? 'Rate Restaruant' : '  Rate Rider'}
                </Text>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: -10,
                    padding: 10,
                  }}
                  onPress={() => ref_RatingSheet?.current?.close()}>
                  <Ionicons name={'close'} size={22} color={'#1E2022'} />
                </TouchableOpacity>

                <View style={{ flex: 1 }}>
               
                  <AirbnbRating
                    count={5}
                    showRating={false}
                    defaultRating={1}
                    size={30}
                    // starImage={<Images.food1 />}
                    ratingContainerStyle={{ marginBottom: 20 }}
                    onFinishRating={value => {
                      setRating(value);
                    }}
                  />
                  {/* <Rating
                  //   showRating
                  //   onFinishRating={this.ratingCompleted}
                  style={{paddingBottom: 20, marginHorizontal: 5}}
                  starContainerStyle={{margin: 20}}
                  ratingContainerStyle={{margin: 20}}
                  // size={3}
                  // reviewSize={5}
                  ratingColor="red"
                  ratingCount={3}
                  imageSize={30}
                  onFinishRating={value => {
                    console.log('rating : ', value);
                  }}
                /> */}
                  <CInput
                    placeholder="Enter comments"
                    placeholderTextColor="#1E2022"
                    multiline={true}
                    numberOfLines={6}
                    textAlignVertical="top"
                    value={ratingComment}
                    onChangeText={text => setRatingComment(text)}
                  />
                  <CButton
                    title="Submit"
                    onPress={() => {
                      ref_RatingSheet?.current?.close();
                      handleSubmitRating();
                    }}
                  />
                </View>
              </View>
            }
          />
        </View>
        <View style={typee == 'cancelled' ? { height: hp(2) } : { height: hp(10) }} />
      </ScrollView>
      {typee == 'all' && (
        orderDetails?.order_status === 'out_for_delivery' ? (
          <View
            style={{
              position: 'absolute',
              top: hp(93),
              zIndex: 999,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: wp(90),
            }}>
            <CButton
              title="Cancel Order"
              onPress={() => handleCancelOrder()}
              width={wp(42)}
            />
            <CButton
              title="Track Order"
              width={wp(42)}
            onPress={() => navigation.navigate('TrackOrder', {item: orderDetails})}
            />
          </View>

        ) : <CButton
          title="Cancel Order"
          onPress={() => handleCancelOrder()}
          style={{ position: 'absolute', top: hp(95), zIndex: 999 }}
        />
      )}
      {typee == 'completed' && (
        <View
          style={{
            position: 'absolute',
            top: hp(93),
            zIndex: 999,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: wp(90),
          }}>
          <CButton
            title="Add Complaint"
            width={wp(42)}
            // onPress={() => ref_ComplaintSheet?.current?.open()}
            onPress={() => {
              navigation.navigate('AddComplaint', {
                id: route?.params?.id,
              });
            }}
          />
          <CButton
            title="Rate"
            width={wp(42)}
            onPress={() => ref_RatingOptionSheet?.current?.open()}
          />
        </View>
      )}

      <SuccessModal
        visible={visible}
        setVisible={setVisible}
        description={'Order Cancelled Successfully!'}
        onOK={() => navigation?.goBack()}
      />

      <RBSheetSuccess
        refRBSheet={ref_RBSheetAlert}
        title={rbSheetAlertText}
        btnText={'OK'}
        onPress={() => {
          ref_RBSheetAlert?.current?.close();
          // navigation?.popToTop();
          // navigation?.replace('Drawer');
        }}
      />
    </View>
  );
};

export default OrderDetails;

