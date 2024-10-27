import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {Colors, Fonts, Icons, Images} from '../../../constants';
import StackHeader from '../../../components/Header/StackHeader';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import ImageSlider from '../../../components/Slider/ImageSlider';
import CButton from '../../../components/Buttons/CButton';
import CRBSheetComponent from '../../../components/BottomSheet/CRBSheetComponent';
import CInput from '../../../components/TextInput/CInput';
import {Avatar} from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';

import {Rating, AirbnbRating} from 'react-native-ratings';
import PriceText from '../../../components/Text';
import SuccessModal from '../../../components/Modal/SuccessModal';
import HeaderImageSlider from '../../../components/Slider/HeaderImageSlider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RBSheetSuccess from '../../../components/BottomSheet/RBSheetSuccess';
import {RadioButton} from 'react-native-paper';
import {
  getUserFcmToken,
  showAlert,
  showAlertLongLength,
} from '../../../utils/helpers';
import {
  BASE_URL_IMAGE,
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

const OrderDetails = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);

  const [orderDetails, setOrderDetails] = useState(null);
  const [fistCartItemDetail, setFistCartItemDetail] = useState(null);
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

  const [data, setData] = useState([
    // {
    //   id: 0,
    //   image: Images.food8,
    // },
    // {
    //   id: 1,
    //   image: Images.food8,
    // },
    // {
    //   id: 2,
    //   image: Images.food8,
    // },
    // {
    //   id: 3,
    //   image: Images.food8,
    // },
  ]);

  const handleCancelOrder = () => {
    setLoading(true);
    let data = {
      order_id: route?.params?.id,
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
        console.log('response  :  ', response);
        if (response?.error == false) {
          setVisible(true);
        } else {
          showAlert(response?.message);
        }
      })
      .catch(err => {
        console.log('Error in accept/reject order :  ', err);
        showAlert('Something went wrong');
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
    let customer_id = await AsyncStorage.getItem('customer_id');
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
        console.log('response  :   ', response);
        if (response?.status == false) {
          // showAlert(response?.message);
          setLoading(false);
          setTimeout(() => {
            showAlertLongLength(response?.message);
          }, 1000);
        } else {
          let fcm_token = orderDetails?.restaurantData?.fcm_token;
          let restaurant_id = orderDetails?.restaurant_id;
          let title = 'Rating';
          let description = `${orderDetails?.customerData?.user_name} gives you ${rating} star rating`;
          let notification_type = 'rating';
          let order_id = route?.params?.id;

          handleSendPushNotification(description, fcm_token); // sending push notification
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
          setTimeout(() => {
            showAlertLongLength('Rating Submitted successfully', 'green');
          }, 1000);
        }
      })
      .catch(err => {
        console.log('Error in Login :  ', err);
        showAlert('Something went wrong!');
        setLoading(false);
      });
  };

  const handleRateRider = async () => {
    setLoading(true);
    let customer_id = await AsyncStorage.getItem('customer_id');
    //send notification to restaurant
    // handleSendPushNotification(`Customer gives you ${rating} star rating`);
    let data = {
      rider_id: orderDetails?.rider_id,
      rating: rating,
      customer_id: customer_id,
      comment: ratingComment,
    };
    console.log('data in rate rider  : ', data);

    fetch(api.rate_rider, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(async response => {
        console.log('response  :   ', response);
        if (response?.status == false) {
          // showAlert(response?.message);
          setLoading(false);

          setTimeout(() => {
            showAlertLongLength(response?.message);
          }, 1000);
        } else {
          let fcm_token = orderDetails?.riderData?.fcm_token;
          let rider_id = orderDetails?.rider_id;
          let title = 'Rating';
          let description = `${orderDetails?.customerData?.user_name} gives you ${rating} star rating`;
          let notification_type = 'rating';
          let order_id = route?.params?.id;

          handleSendPushNotification(description, fcm_token); // sending push notification
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
          setTimeout(() => {
            showAlertLongLength('Rating Submitted successfully', 'green');
          }, 1000);
        }
      })
      .catch(err => {
        console.log('Error in Login :  ', err);
        showAlert('Something went wrong!');
        setLoading(false);
      });
  };

  const handleSubmitRating = async () => {
    if (rating > 0) {
      if (isRateResturant) {
        console.log('rate resturant');
        handleRateRestaurant();
      } else {
        console.log('rate rider');
        handleRateRider();
      }
    }

    console.log('handleSubmitRating  :  called.....', rating, ratingComment);
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

  const handleSendPushNotification = async (text, receiver_fcm) => {
    console.log({text, receiver_fcm});
    // const receiver_fcm = await getUserFcmToken();
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
          console.log('push notification response :  ', res);
        })
        .catch(err => {
          console.log('error :  ', err);
        });
    } else {
      console.log('receiver_fcm not found');
    }
  };

  const getDetail = id => {
    console.log(api.get_order_by_id + id);
    
    setLoading(true);
    fetch(api.get_order_by_id + id)
      .then(response => response.json())
      .then(response => {
        console.log('response :  ', response);
        if (response.error == false) {
          setOrderDetails(response.result);
          let cart_item =
            response.result?.cart_items_Data?.length > 0
              ? response.result?.cart_items_Data[0]
              : null;
          setItemImages(cart_item?.itemData?.images);
          setFistCartItemDetail(cart_item);
        } else {
          setOrderDetails(null);
        }
      })
      .catch(err => console.log('error : ', err))
      .finally(() => setLoading(false));
  };

  console.log(orderDetails, 'orderDetails')

  useEffect(() => {
    let id = route?.params?.id;
    console.log('order details id :  ', id);
    if (id) {
      getDetail(id);
    }
  }, []);

  const calculateSubTotal = (totalAmount, platform_fee, delivery_charges) => {
    let service_charges = platform_fee + delivery_charges;
    let subtotal =
      service_charges > totalAmount
        ? service_charges - totalAmount
        : totalAmount - service_charges;
    return subtotal;
  };
  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        {/* <StackHeader title={'Order Details'} /> */}
        {/* <HeaderImageSlider data={data} /> */}
        <HeaderImageSlider data={itemImages && itemImages} />

        <View style={{flex: 1}}>
          {/* <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              paddingHorizontal: 20,
            }}>
            <Text style={{...styles.heading, marginRight: 70}}>
              Shrimp Pad Thai Sauce ABC Barbeque
            </Text>
            <PriceText text={9.67} fontSize={RFPercentage(2.5)} />
          </View>
          <ImageSlider data={data} /> */}

          <View style={{...styles.rowViewSB, paddingHorizontal: 20}}>
            <View>
              <Text
                style={{
                  color: '#191A26',
                  fontFamily: Fonts.PlusJakartaSans_Bold,
                  fontSize: RFPercentage(2),
                  lineHeight: 30,
                }}>
                Order #{orderDetails?.order_id}
              </Text>
              {route?.params?.type == 'cancelled' ? (
                <Text
                  style={{
                    color: '#6C6C6C',
                    fontFamily: Fonts.PlusJakartaSans_Regular,
                    fontSize: RFPercentage(1.7),
                  }}>
                  {/* Cancelled on 02 Oct, 2023 */}
                  Cancelled on{' '}
                  {moment(new Date(orderDetails?.updated_at)).format(
                    'Do,MMM YYYY',
                  )}
                </Text>
              ) : route?.params?.type == 'completed' ? (
                <Text
                  style={{
                    color: '#6C6C6C',
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
                      color: '#6C6C6C',
                      fontFamily: Fonts.PlusJakartaSans_Regular,
                      fontSize: RFPercentage(1.7),
                    }}>
                    Order Status:{' '}
                    <Text
                      style={{
                        color: Colors.Orange,
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
            <View style={{flexDirection: 'row'}}>
              <Icons.MapPinActive />
              <View style={{marginTop: 0}}>
                <Text style={styles.location_description}>Order from</Text>
                <Text style={styles.location_heading}>
                  {orderDetails?.restaurantData?.user_name}
                </Text>
              </View>
            </View>
            <View style={styles.verticalDottedLine} />
            <View style={{flexDirection: 'row', marginTop: 25}}>
              <Icons.MapPinActive />
              <View style={{}}>
                <Text style={styles.location_description}>Delivered to</Text>
                <Text style={styles.location_heading}>
                  {orderDetails?.locationData?.address}
                </Text>
              </View>
            </View>
          </View>

          <SectionSeparator />
          <View style={{padding: 20}}>
            {orderDetails?.cart_items_Data &&
              orderDetails?.cart_items_Data?.map((item, key) => (
                <View style={{...styles.rowView, marginBottom: 5}}>
                  <Ionicons
                    name={'close'}
                    size={15}
                    color={Colors.Orange}
                    style={{marginBottom: -3}}
                  />
                  <Text
                    style={{
                      color: Colors.Orange,
                      fontFamily: Fonts.PlusJakartaSans_Bold,
                      fontSize: RFPercentage(2),
                      marginLeft: 5,
                      marginHorizontal: 10,
                    }}>
                    {item?.quantity}
                  </Text>
                  <Text
                    style={{
                      color: '#191A26',
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
                      color: Colors.Orange,
                      fontFamily: Fonts.PlusJakartaSans_SemiBold,
                      fontSize: RFPercentage(2),
                    }}>
                    $ {item?.itemData?.price * item?.quantity}
                  </Text>
                </View>
              ))}
          </View>
          <SectionSeparator />

          {route?.params?.type == 'cancelled' ? null : (
            <>
              <View style={{padding: 20}}>
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
                <View style={{...styles.rowViewSB, marginTop: -5}}>
                  <Text style={styles.total_amountText}>Total</Text>
                  <Text style={styles.total_amountText}>
                    $ {orderDetails?.total_amount}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  color: Colors.Orange,
                  fontFamily: Fonts.PlusJakartaSans_Bold,
                  fontSize: RFPercentage(2.3),
                  marginHorizontal: 20,
                }}>
                Payment Methods
              </Text>
              {/* <View
                style={{
                  borderWidth: 1,
                  borderColor: '#E6E7EB',
                  paddingVertical: 5,
                  flex: 1,
                  marginHorizontal: 20,
                  borderRadius: 10,
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  overflow: 'hidden',
                  flexDirection: 'row',
                  marginVertical: 10,
                }}>
                <Image
                  source={Images.master_card}
                  style={{height: 50, width: 50, resizeMode: 'contain'}}
                />
                <Text
                  style={{
                    color: '#02010E',
                    fontFamily: Fonts.PlusJakartaSans_Medium,
                    fontSize: RFPercentage(2),
                    marginLeft: 15,
                  }}>
                  Master Card
                </Text>
              </View> */}
              {orderDetails?.payment_option == 'cash' ? (
                <PaymentCard type="cash" title="Cash On Delivery" />
              ) : (
                <PaymentCard />
              )}

              {route?.params?.type == 'completed' ? null : (
                <View style={{paddingHorizontal: 20}}>
                  <View style={styles.itemView}>
                    <View style={styles.imageContainer}>
                      <Icons.Van />
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={{...styles.title, marginBottom: 5}}>
                        Estimate Delivery Time
                      </Text>
                      <Text
                        style={{
                          ...styles.title,
                          color: Colors.Orange,
                          fontFamily: Fonts.Inter_SemiBold,
                        }}>
                        {/* 40 mins */}
                        {orderDetails?.estimated_delivery_time
                          ? `${orderDetails?.estimated_delivery_time} mins`
                          : '0 mins'}
                      </Text>
                    </View>
                  </View>
                  {orderDetails?.restaurantData?.restaurant_id && (
                    <View style={styles.itemView}>
                      <Avatar.Image
                        style={{backgroundColor: Colors.Orange}}
                        size={45}
                        // source={Images.user}
                        // source={{
                        //   uri:
                        //     BASE_URL_IMAGE +
                        //     orderDetails?.restaurantData?.images[0],
                        // }}
                      />
                      <View style={styles.textContainer}>
                        <Text style={{...styles.subText, marginLeft: 5}}>
                          {/* Rider's name here */}
                          {orderDetails?.restaurantData?.user_name}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('Conversation', {
                            type: 'restaurant',
                            userId: orderDetails?.restaurantData?.restaurant_id,
                            name: orderDetails?.restaurantData?.user_name,
                            image:
                              BASE_URL_IMAGE +
                              orderDetails?.restaurantData?.images[0],
                            fcm_token: orderDetails?.restaurantData?.fcm_token,
                          })
                        }>
                        <Icons.ChatActive />
                      </TouchableOpacity>
                    </View>
                  )}

                  {orderDetails?.riderData?.rider_id &&
                    orderDetails?.order_status == 'out_for_delivery' && (
                      <View style={styles.itemView}>
                        <Avatar.Image
                          style={{backgroundColor: Colors.Orange}}
                          size={45}
                          source={{
                            uri:
                              BASE_URL_IMAGE + orderDetails?.riderData?.photo,
                          }}
                        />
                        <View style={styles.textContainer}>
                          <Text style={{...styles.subText, marginLeft: 5}}>
                            {orderDetails?.riderData?.name}
                          </Text>
                        </View>

                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('Conversation', {
                              type: 'rider',
                              userId: orderDetails?.riderData?.rider_id,
                              name: orderDetails?.riderData?.name,
                              image:
                                BASE_URL_IMAGE + orderDetails?.riderData?.photo,
                              fcm_token: orderDetails?.riderData?.fcm_token,
                            })
                          }>
                          <Icons.ChatActive />
                        </TouchableOpacity>
                      </View>
                    )}
                </View>
              )}
            </>
          )}

          {route?.params?.type == 'history' && (
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

          {/* <View
            style={{
              ...styles.rowViewSB,
              marginBottom: 15,
              paddingHorizontal: 20,
            }}>
            <Text style={styles.heading1}>
              {fistCartItemDetail
                ? fistCartItemDetail?.item_type == 'deal'
                  ? fistCartItemDetail?.itemData?.name
                  : fistCartItemDetail?.itemData?.item_name
                : ''}
            </Text>
            <Text style={styles.priceText}>{orderDetails?.total_amount}</Text>
          </View> */}

          {/* <View style={{paddingHorizontal: 20}}>
            {route?.params?.type == 'history' ? null : (
              <View style={styles.itemView}>
                <View style={styles.imageContainer}>
                  <Icons.Van />
                </View>
                <View style={styles.textContainer}>
                  <Text style={{...styles.title, marginBottom: 5}}>
                    Estimate Delivery Time
                  </Text>
                  <Text
                    style={{
                      ...styles.title,
                      color: Colors.Orange,
                      fontFamily: Fonts.Inter_SemiBold,
                    }}>
                 
                    {orderDetails
                      ? `${orderDetails?.estimated_delivery_time} mins`
                      : ''}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.itemView}>
              <View style={styles.imageContainer}>
                <Icons.Location />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.subText}>
                  {orderDetails ? orderDetails?.locationData?.address : ''}
                </Text>
              </View>
            </View>
          </View> */}

          {/* <View style={{paddingHorizontal: 20, flex: 1}}>
            {orderDetails?.restaurantData?.restaurant_id && (
              <View style={styles.itemView}>
                <Avatar.Image
                  style={{backgroundColor: Colors.Orange}}
                  size={45}
               
                  source={{
                    uri:
                      BASE_URL_IMAGE + orderDetails?.restaurantData?.images[0],
                  }}
                />
                <View style={styles.textContainer}>
                  <Text style={{...styles.subText, marginLeft: 5}}>
                    
                    {orderDetails?.restaurantData?.user_name}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Conversation', {
                      type: 'restaurant',
                      userId: orderDetails?.restaurantData?.restaurant_id,
                      name: orderDetails?.restaurantData?.user_name,
                      image:
                        BASE_URL_IMAGE +
                        orderDetails?.restaurantData?.images[0],
                      fcm_token: orderDetails?.restaurantData?.fcm_token,
                    })
                  }>
                  <Icons.ChatActive />
                </TouchableOpacity>
              </View>
            )}
          </View> */}

          {/* {route?.params?.type == 'all' ? (
            <View style={{paddingHorizontal: 20, flex: 1}}>
              {orderDetails?.riderData?.rider_id &&
                orderDetails?.order_status == 'out_for_delivery' && (
                  <View style={styles.itemView}>
                    <Avatar.Image
                      style={{backgroundColor: Colors.Orange}}
                      size={45}
                     
                      source={{
                        uri: BASE_URL_IMAGE + orderDetails?.riderData?.photo,
                      }}
                    />
                    <View style={styles.textContainer}>
                      <Text style={{...styles.subText, marginLeft: 5}}>
                     
                        {orderDetails?.riderData?.name}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('Conversation', {
                          type: 'rider',
                          userId: orderDetails?.riderData?.rider_id,
                          name: orderDetails?.riderData?.name,
                          image:
                            BASE_URL_IMAGE + orderDetails?.riderData?.photo,
                          fcm_token: orderDetails?.riderData?.fcm_token,
                        })
                      }>
                      <Icons.ChatActive />
                    </TouchableOpacity>
                  </View>
                )}

              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  marginBottom: 50,
                }}>
                <CButton
                  title="Cancel Order"
                  onPress={() => handleCancelOrder()}
                />
              </View>
            </View>
          ) : route?.params?.type == 'cancelled' ? (
            <View style={{paddingHorizontal: 20, paddingBottom: 20}}></View>
          ) : route?.params?.type == 'history' ? (
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
          ) : (
            <View
              style={{
                flex: 1,
                paddingHorizontal: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: hp(10),
                paddingBottom: 20,
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
          )} */}
        </View>
        <View>
          {/* _________________________Complaint Sheet _________________________ */}
          <CRBSheetComponent
            refRBSheet={ref_ComplaintSheet}
            content={
              <ScrollView keyboardShouldPersistTaps="handled">
                <View style={{...styles.rowViewSB, marginBottom: 20}}>
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
              <View style={{width: wp(90)}}>
                <View style={{...styles.rowViewSB, marginBottom: 18}}>
                  <Text style={styles.rbSheetHeading}>
                    Who you wants to Rate
                  </Text>
                  <TouchableOpacity
                    onPress={() => ref_RatingOptionSheet?.current?.close()}>
                    <Ionicons name={'close'} size={22} color={'#1E2022'} />
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                  <TouchableOpacity
                    onPress={() => onRiderSelect()}
                    style={styles.rowView}>
                    <RadioButton
                      value="first"
                      uncheckedColor={Colors.Orange}
                      color={Colors.Orange}
                      status={checked === 'rider' ? 'checked' : 'unchecked'}
                      onPress={() => onRiderSelect()}
                    />
                    <Text
                      style={{
                        color: '#56585B',
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
                      backgroundColor: '#00000021',
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => onDriverSelect()}
                    style={styles.rowView}>
                    <RadioButton
                      value="first"
                      uncheckedColor={Colors.Orange}
                      color={Colors.Orange}
                      status={checked === 'driver' ? 'checked' : 'unchecked'}
                      onPress={() => onDriverSelect()}
                    />
                    <Text
                      style={{
                        color: '#757575',
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
              <View style={{width: wp(90)}}>
                <Text
                  style={{
                    color: Colors.Text,
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

                <View style={{flex: 1}}>
                  {/* <AirbnbRating
                  count={5}
                  //   reviews={['Terrible', 'Bad', 'Meh', 'OK', 'Good']}
                  defaultRating={3}
                  size={20}
                /> */}

                  <AirbnbRating
                    count={5}
                    showRating={false}
                    defaultRating={1}
                    size={30}
                    // starImage={<Images.food1 />}
                    ratingContainerStyle={{marginBottom: 20}}
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
        <View style={{height: hp(15)}} />
      </ScrollView>
      {route?.params?.type == 'all' && (
        <CButton
          title="Cancel Order"
          onPress={() => handleCancelOrder()}
          style={{position: 'absolute', top: hp(90), zIndex: 999}}
        />
      )}

      {route?.params?.type == 'completed' && (
        <View
          style={{
            position: 'absolute',
            top: hp(90),
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

const styles = StyleSheet.create({
  heading1: {
    fontFamily: Fonts.PlusJakartaSans_Bold,
    color: '#191A26',
    fontSize: RFPercentage(2.2),
  },
  priceText: {
    fontFamily: Fonts.PlusJakartaSans_ExtraBold,
    color: Colors.Orange,
    fontSize: RFPercentage(2.5),
  },

  container: {
    flex: 1,
    backgroundColor: Colors.White,
    alignItems: 'center',
    // paddingHorizontal: 20,
  },
  heading: {
    fontFamily: Fonts.PlusJakartaSans_SemiBold,
    color: '#191A26',
    fontSize: RFPercentage(2.2),
    flex: 1,
  },
  price: {
    fontFamily: Fonts.PlusJakartaSans_Bold,
    color: Colors.Orange,
    fontSize: RFPercentage(2.4),
    flex: 0.6,
    textAlign: 'right',
  },

  itemView: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#F6F6F6',
    backgroundColor: '#F5F6FA',
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
    backgroundColor: '#FF572233',
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
    color: '#8D93A1',
    fontFamily: Fonts.Inter_Regular,
    fontSize: RFPercentage(2),
  },
  subText1: {
    fontFamily: Fonts.Inter_Regular,
    fontSize: RFPercentage(1.5),
    color: '#898A8D',
    textTransform: 'capitalize',
  },
  title: {
    color: '#191A26',
    fontSize: RFPercentage(2),
    fontFamily: Fonts.Inter_Medium,
  },
  title1: {
    color: '#191A26',
    fontFamily: Fonts.Inter_Medium,
    fontSize: RFPercentage(1.8),
    marginLeft: 12,
  },
  title2: {
    color: Colors.Orange,
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(1.9),
    marginLeft: 12,
  },
  rbSheetHeading: {
    color: Colors.Text,
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(2.4),
  },

  location_container: {
    marginVertical: 15,
    // flex: 1,
    paddingHorizontal: 20,
  },
  circle: {
    // height: 40,
    // width: 40,
    // borderRadius: 40 / 2,
    // // backgroundColor: 'red',
    // marginRight: 15,
    // alignItems: 'center',
    // justifyContent: 'center',
  },

  verticalDottedLine: {
    // height: 45,
    minHeight: 47,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.Orange,
    borderStyle: 'dashed',
    width: 1,
    // marginLeft: 19,
    marginLeft: 8,
    position: 'absolute',
    left: 19.5,
    top: 13,
  },
  location_heading: {
    color: Colors.Orange,
    fontFamily: Fonts.Inter_Medium,
    fontSize: RFPercentage(2),
    width: wp(70),
    marginLeft: 15,
  },
  location_description: {
    color: '#808D9E',
    fontFamily: Fonts.Inter_Regular,
    fontSize: RFPercentage(1.5),
    width: wp(70),
    marginLeft: 15,
  },
  subText2: {
    color: '#0C0B0B',
    fontFamily: Fonts.Inter_Regular,
    fontSize: RFPercentage(2),
    // lineHeight: 30,
  },
  total_amountText: {
    color: '#292323',
    fontFamily: Fonts.Inter_Bold,
    fontSize: RFPercentage(2),
    // lineHeight: 30,
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
// import React, {useState, useEffect, useRef} from 'react';
// import {Colors, Fonts, Icons, Images} from '../../../constants';
// import StackHeader from '../../../components/Header/StackHeader';
// import {RFPercentage} from 'react-native-responsive-fontsize';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import {SwiperFlatList} from 'react-native-swiper-flatlist';
// import ImageSlider from '../../../components/Slider/ImageSlider';
// import CButton from '../../../components/Buttons/CButton';
// import CRBSheetComponent from '../../../components/BottomSheet/CRBSheetComponent';
// import CInput from '../../../components/TextInput/CInput';
// import {Avatar} from 'react-native-paper';
// import Entypo from 'react-native-vector-icons/Entypo';

// import {Rating, AirbnbRating} from 'react-native-ratings';
// import PriceText from '../../../components/Text';
// import SuccessModal from '../../../components/Modal/SuccessModal';
// import HeaderImageSlider from '../../../components/Slider/HeaderImageSlider';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import RBSheetSuccess from '../../../components/BottomSheet/RBSheetSuccess';
// import {RadioButton} from 'react-native-paper';
// import {
//   getUserFcmToken,
//   showAlert,
//   showAlertLongLength,
// } from '../../../utils/helpers';
// import {
//   BASE_URL_IMAGE,
//   firebase_server_key,
// } from '../../../utils/globalVariables';
// import api from '../../../constants/api';
// import Loader from '../../../components/Loader';
// import moment from 'moment';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {
//   Store_Restaurant_Notification,
//   Store_Rider_Notification,
// } from '../../../utils/helpers/notificationApis';

// const OrderDetails = ({navigation, route}) => {
//   const [loading, setLoading] = useState(false);

//   const [orderDetails, setOrderDetails] = useState(null);
//   const [fistCartItemDetail, setFistCartItemDetail] = useState(null);
//   const [itemImages, setItemImages] = useState([]);

//   const ref_RBSheetAlert = useRef();
//   const [rbSheetAlertText, setRbSheetAlertText] = useState('');
//   const [visible, setVisible] = useState(false); // to show cancel order success modal
//   const ref_ComplaintSheet = useRef(null);
//   const ref_RatingOptionSheet = useRef(null);
//   const ref_RatingSheet = useRef(null);
//   const [isRateResturant, setIsRateResturant] = useState(false);

//   const [checked, setChecked] = React.useState('rider');

//   const [rating, setRating] = useState(0);
//   const [ratingComment, setRatingComment] = useState('');

//   const [data, setData] = useState([
//     // {
//     //   id: 0,
//     //   image: Images.food8,
//     // },
//     // {
//     //   id: 1,
//     //   image: Images.food8,
//     // },
//     // {
//     //   id: 2,
//     //   image: Images.food8,
//     // },
//     // {
//     //   id: 3,
//     //   image: Images.food8,
//     // },
//   ]);

//   const handleCancelOrder = () => {
//     setLoading(true);
//     let data = {
//       order_id: route?.params?.id,
//       order_status: 'cancelled',
//     };
//     console.log(data);
//     fetch(api.update_order_status, {
//       method: 'PUT',
//       body: JSON.stringify(data),
//       headers: {
//         'Content-type': 'application/json; charset=UTF-8',
//       },
//     })
//       .then(response => response.json())
//       .then(async response => {
//         console.log('response  :  ', response);
//         if (response?.status == true) {
//           setVisible(true);
//         } else {
//           showAlert(response?.message);
//         }
//       })
//       .catch(err => {
//         console.log('Error in accept/reject order :  ', err);
//         showAlert('Something went wrong');
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   const onRiderSelect = () => {
//     setIsRateResturant(false);
//     ref_RatingOptionSheet?.current?.close();
//     ref_RatingSheet?.current?.open();
//     setChecked('rider');
//   };

//   const onDriverSelect = () => {
//     setIsRateResturant(true);
//     ref_RatingOptionSheet?.current?.close();
//     ref_RatingSheet?.current?.open();
//     setChecked('driver');
//   };

//   const handleRateRestaurant = async () => {
//     setLoading(true);
//     let customer_id = await AsyncStorage.getItem('customer_id');
//     //send notification to restaurant
//     // handleSendPushNotification(`Customer gives you ${rating} star rating`);
//     let data = {
//       restaurant_id: orderDetails?.restaurant_id,
//       rating: rating,
//       customer_id: customer_id,
//       comment: ratingComment,
//     };
//     console.log('data  : ', data);

//     fetch(api.rate_restaurant, {
//       method: 'POST',
//       body: JSON.stringify(data),
//       headers: {
//         'Content-type': 'application/json; charset=UTF-8',
//       },
//     })
//       .then(response => response.json())
//       .then(async response => {
//         console.log('response  :   ', response);
//         if (response?.status == false) {
//           // showAlert(response?.message);
//           setLoading(false);
//           setTimeout(() => {
//             showAlertLongLength(response?.message);
//           }, 1000);
//         } else {
//           let fcm_token = orderDetails?.restaurantData?.fcm_token;
//           let restaurant_id = orderDetails?.restaurant_id;
//           let title = 'Rating';
//           let description = `${orderDetails?.customerData?.user_name} gives you ${rating} star rating`;
//           let notification_type = 'rating';
//           let order_id = route?.params?.id;

//           handleSendPushNotification(description, fcm_token); // sending push notification
//           console.log(
//             'Store_Restaurant_Notification____________________ called.....',
//           );
//           // storing notification to db
//           Store_Restaurant_Notification(
//             restaurant_id,
//             notification_type,
//             title,
//             description,
//             order_id,
//           );

//           setLoading(false);
//           setRatingComment('');
//           setTimeout(() => {
//             showAlertLongLength('Rating Submitted successfully', 'green');
//           }, 1000);
//         }
//       })
//       .catch(err => {
//         console.log('Error in Login :  ', err);
//         showAlert('Something went wrong!');
//         setLoading(false);
//       });
//   };

//   const handleRateRider = async () => {
//     setLoading(true);
//     let customer_id = await AsyncStorage.getItem('customer_id');
//     //send notification to restaurant
//     // handleSendPushNotification(`Customer gives you ${rating} star rating`);
//     let data = {
//       rider_id: orderDetails?.rider_id,
//       rating: rating,
//       customer_id: customer_id,
//       comment: ratingComment,
//     };
//     console.log('data in rate rider  : ', data);

//     fetch(api.rate_rider, {
//       method: 'POST',
//       body: JSON.stringify(data),
//       headers: {
//         'Content-type': 'application/json; charset=UTF-8',
//       },
//     })
//       .then(response => response.json())
//       .then(async response => {
//         console.log('response  :   ', response);
//         if (response?.status == false) {
//           // showAlert(response?.message);
//           setLoading(false);

//           setTimeout(() => {
//             showAlertLongLength(response?.message);
//           }, 1000);
//         } else {
//           let fcm_token = orderDetails?.riderData?.fcm_token;
//           let rider_id = orderDetails?.rider_id;
//           let title = 'Rating';
//           let description = `${orderDetails?.customerData?.user_name} gives you ${rating} star rating`;
//           let notification_type = 'rating';
//           let order_id = route?.params?.id;

//           handleSendPushNotification(description, fcm_token); // sending push notification
//           // storing notification to db
//           Store_Rider_Notification(
//             rider_id,
//             notification_type,
//             title,
//             description,
//             order_id,
//           );

//           setLoading(false);
//           setRatingComment('');
//           setTimeout(() => {
//             showAlertLongLength('Rating Submitted successfully', 'green');
//           }, 1000);
//         }
//       })
//       .catch(err => {
//         console.log('Error in Login :  ', err);
//         showAlert('Something went wrong!');
//         setLoading(false);
//       });
//   };

//   const handleSubmitRating = async () => {
//     if (rating > 0) {
//       if (isRateResturant) {
//         console.log('rate resturant');
//         handleRateRestaurant();
//       } else {
//         console.log('rate rider');
//         handleRateRider();
//       }
//     }

//     console.log('handleSubmitRating  :  called.....', rating, ratingComment);
//     // if (rating > 0) {
//     //   if (isRateResturant) {
//     //     //send notification to restaurant
//     //     handleSendPushNotification(`Customer gives you ${rating} star rating`);
//     //   } else {
//     //     //send notification to rider
//     //     handleSendPushNotification(`Customer gives you ${rating} star rating`);
//     //   }
//     // }
//   };

//   const handleSendPushNotification = async (text, receiver_fcm) => {
//     console.log({text, receiver_fcm});
//     // const receiver_fcm = await getUserFcmToken();
//     if (receiver_fcm) {
//       let body = {
//         to: receiver_fcm,
//         notification: {
//           title: 'Rating',
//           body: text ? text : '',
//           // mutable_content: true,
//           sound: 'default',
//         },
//         data: {
//           // user_id: user,
//           type: 'chat',
//         },
//         priority: 'high',
//       };

//       var requestOptions = {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `key=${firebase_server_key}`,
//         },
//         body: JSON.stringify(body),
//       };

//       fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
//         .then(response => response.text())
//         .then(response => {
//           let res = JSON.parse(response);
//           console.log('push notification response :  ', res);
//         })
//         .catch(err => {
//           console.log('error :  ', err);
//         });
//     } else {
//       console.log('receiver_fcm not found');
//     }
//   };

//   const getDetail = id => {
//     setLoading(true);
//     fetch(api.get_order_by_id + id)
//       .then(response => response.json())
//       .then(response => {
//         if (response.status == true) {
//           setOrderDetails(response.result);
//           let cart_item =
//             response.result?.cart_items_Data?.length > 0
//               ? response.result?.cart_items_Data[0]
//               : null;
//           setItemImages(cart_item?.itemData?.images);
//           setFistCartItemDetail(cart_item);
//         } else {
//           setOrderDetails(null);
//         }
//       })
//       .catch(err => console.log('error : ', err))
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     let id = route?.params?.id;
//     console.log('order details id :  ', id);
//     if (id) {
//       getDetail(id);
//     }
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Loader loading={loading} />
//       <ScrollView contentContainerStyle={{flexGrow: 1}}>
//         {/* <StackHeader title={'Order Details'} /> */}
//         {/* <HeaderImageSlider data={data} /> */}
//         <HeaderImageSlider data={itemImages && itemImages} />

//         <View style={{flex: 1}}>
//           {/* <View
//             style={{
//               alignItems: 'center',
//               flexDirection: 'row',
//               paddingHorizontal: 20,
//             }}>
//             <Text style={{...styles.heading, marginRight: 70}}>
//               Shrimp Pad Thai Sauce ABC Barbeque
//             </Text>
//             <PriceText text={9.67} fontSize={RFPercentage(2.5)} />
//           </View>
//           <ImageSlider data={data} /> */}

//           <View
//             style={{
//               ...styles.rowViewSB,
//               marginBottom: 15,
//               paddingHorizontal: 20,
//             }}>
//             <Text style={styles.heading1}>
//               {fistCartItemDetail
//                 ? fistCartItemDetail?.item_type == 'deal'
//                   ? fistCartItemDetail?.itemData?.name
//                   : fistCartItemDetail?.itemData?.item_name
//                 : ''}
//             </Text>
//             <Text style={styles.priceText}>
//               {/* $ {fistCartItemDetail ? fistCartItemDetail?.itemData?.price : ''} */}
//               {orderDetails?.total_amount}
//             </Text>
//           </View>

//           <View style={{paddingHorizontal: 20}}>
//             {route?.params?.type == 'history' ? null : (
//               <View style={styles.itemView}>
//                 <View style={styles.imageContainer}>
//                   <Icons.Van />
//                 </View>
//                 <View style={styles.textContainer}>
//                   <Text style={{...styles.title, marginBottom: 5}}>
//                     Estimate Delivery Time
//                   </Text>
//                   <Text
//                     style={{
//                       ...styles.title,
//                       color: Colors.Orange,
//                       fontFamily: Fonts.Inter_SemiBold,
//                     }}>
//                     {/* 40 mins */}
//                     {orderDetails
//                       ? `${orderDetails?.estimated_delivery_time} mins`
//                       : ''}
//                   </Text>
//                 </View>
//               </View>
//             )}

//             <View style={styles.itemView}>
//               <View style={styles.imageContainer}>
//                 <Icons.Location />
//               </View>
//               <View style={styles.textContainer}>
//                 <Text style={styles.subText}>
//                   {orderDetails ? orderDetails?.locationData?.address : ''}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           <View style={{paddingHorizontal: 20, flex: 1}}>
//             {orderDetails?.restaurantData?.restaurant_id && (
//               <View style={styles.itemView}>
//                 <Avatar.Image
//                   style={{backgroundColor: Colors.Orange}}
//                   size={45}
//                   // source={Images.user}
//                   source={{
//                     uri:
//                       BASE_URL_IMAGE + orderDetails?.restaurantData?.images[0],
//                   }}
//                 />
//                 <View style={styles.textContainer}>
//                   <Text style={{...styles.subText, marginLeft: 5}}>
//                     {/* Rider's name here */}
//                     {orderDetails?.restaurantData?.user_name}
//                   </Text>
//                 </View>
//                 <TouchableOpacity
//                   onPress={() =>
//                     navigation.navigate('Conversation', {
//                       type: 'restaurant',
//                       userId: orderDetails?.restaurantData?.restaurant_id,
//                       name: orderDetails?.restaurantData?.user_name,
//                       image:
//                         BASE_URL_IMAGE +
//                         orderDetails?.restaurantData?.images[0],
//                       fcm_token: orderDetails?.restaurantData?.fcm_token,
//                     })
//                   }>
//                   <Icons.ChatActive />
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>

//           {route?.params?.type == 'all' ? (
//             <View style={{paddingHorizontal: 20, flex: 1}}>
//               {orderDetails?.riderData?.rider_id &&
//                 orderDetails?.order_status == 'out_for_delivery' && (
//                   <View style={styles.itemView}>
//                     <Avatar.Image
//                       style={{backgroundColor: Colors.Orange}}
//                       size={45}
//                       // source={Images.user}
//                       source={{
//                         uri: BASE_URL_IMAGE + orderDetails?.riderData?.photo,
//                       }}
//                     />
//                     <View style={styles.textContainer}>
//                       <Text style={{...styles.subText, marginLeft: 5}}>
//                         {/* Rider's name here */}
//                         {orderDetails?.riderData?.name}
//                       </Text>
//                     </View>

//                     <TouchableOpacity
//                       onPress={() =>
//                         navigation.navigate('Conversation', {
//                           type: 'rider',
//                           userId: orderDetails?.riderData?.rider_id,
//                           name: orderDetails?.riderData?.name,
//                           image:
//                             BASE_URL_IMAGE + orderDetails?.riderData?.photo,
//                           fcm_token: orderDetails?.riderData?.fcm_token,
//                         })
//                       }>
//                       <Icons.ChatActive />
//                     </TouchableOpacity>
//                   </View>
//                 )}

//               <View
//                 style={{
//                   flex: 1,
//                   justifyContent: 'flex-end',
//                   marginBottom: 50,
//                 }}>
//                 <CButton
//                   title="Cancel Order"
//                   onPress={() => handleCancelOrder()}
//                 />
//               </View>
//             </View>
//           ) : route?.params?.type == 'cancelled' ? (
//             <View style={{paddingHorizontal: 20, paddingBottom: 20}}>
//               {/* <Text style={{...styles.heading, color: Colors.Orange}}>
//                 Cancelled By
//               </Text>

//               <View style={{...styles.rowView, marginVertical: 15}}>
//                 <Avatar.Image source={Images.user4} size={45} />
//                 <Text style={styles.title1}>Rider Name</Text>
//               </View>

//               <Text style={{...styles.subText1, lineHeight: 17}}>
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
//                 ultrices sagittis arcu a malesuada Lorem ipsum dolor sit amet,
//                 consectetur adipiscing elit. Sed ultrices sagittis arcu a
//                 malesuada
//               </Text> */}
//             </View>
//           ) : route?.params?.type == 'history' ? (
//             <View
//               style={{
//                 paddingHorizontal: 20,
//                 marginVertical: 10,
//                 width: wp(100),
//               }}>
//               <View style={styles.rowViewSB}>
//                 <Text style={styles.title2}>Date Of Order:</Text>
//                 <Text style={styles.subText1}>
//                   {orderDetails?.created_at
//                     ? moment(orderDetails?.created_at).format('DD/MM/YYYY')
//                     : ''}
//                 </Text>
//               </View>
//               <View style={styles.rowViewSB}>
//                 <Text style={styles.title2}>Order Status:</Text>
//                 <Text style={styles.subText1}>
//                   {orderDetails?.order_status}
//                 </Text>
//               </View>
//             </View>
//           ) : (
//             <View
//               style={{
//                 flex: 1,
//                 paddingHorizontal: 20,
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 marginTop: hp(10),
//                 paddingBottom: 20,
//               }}>
//               <CButton
//                 title="Add Complaint"
//                 width={wp(42)}
//                 // onPress={() => ref_ComplaintSheet?.current?.open()}
//                 onPress={() => {
//                   navigation.navigate('AddComplaint', {
//                     id: route?.params?.id,
//                   });
//                 }}
//               />
//               <CButton
//                 title="Rate"
//                 width={wp(42)}
//                 onPress={() => ref_RatingOptionSheet?.current?.open()}
//               />
//             </View>
//           )}
//         </View>
//         <View>
//           {/* _________________________Complaint Sheet _________________________ */}
//           <CRBSheetComponent
//             refRBSheet={ref_ComplaintSheet}
//             content={
//               <ScrollView keyboardShouldPersistTaps="handled">
//                 <View style={{...styles.rowViewSB, marginBottom: 20}}>
//                   <Text style={styles.rbSheetHeading}>Add Complaint</Text>
//                   <TouchableOpacity
//                     onPress={() => ref_ComplaintSheet?.current?.close()}>
//                     <Ionicons name={'close'} size={22} color={'#1E2022'} />
//                   </TouchableOpacity>
//                 </View>
//                 <CInput
//                   placeholder="Enter Complaint"
//                   multiline={true}
//                   numberOfLines={6}
//                   textAlignVertical="top"
//                 />
//                 <CButton
//                   title="Add"
//                   onPress={() => {
//                     setRbSheetAlertText('Complaint Added Successfully');
//                     ref_ComplaintSheet?.current?.close();
//                     ref_RBSheetAlert.current?.open();
//                   }}
//                 />
//               </ScrollView>
//             }
//           />
//           {/* ______________________Rating Options Sheet ______________________________________ */}
//           <CRBSheetComponent
//             refRBSheet={ref_RatingOptionSheet}
//             height={190}
//             content={
//               <View style={{width: wp(90)}}>
//                 <View style={{...styles.rowViewSB, marginBottom: 18}}>
//                   <Text style={styles.rbSheetHeading}>
//                     Who you wants to Rate
//                   </Text>
//                   <TouchableOpacity
//                     onPress={() => ref_RatingOptionSheet?.current?.close()}>
//                     <Ionicons name={'close'} size={22} color={'#1E2022'} />
//                   </TouchableOpacity>
//                 </View>
//                 <View style={{flex: 1}}>
//                   <TouchableOpacity
//                     onPress={() => onRiderSelect()}
//                     style={styles.rowView}>
//                     <RadioButton
//                       value="first"
//                       uncheckedColor={Colors.Orange}
//                       color={Colors.Orange}
//                       status={checked === 'rider' ? 'checked' : 'unchecked'}
//                       onPress={() => onRiderSelect()}
//                     />
//                     <Text
//                       style={{
//                         color: '#56585B',
//                         fontFamily: Fonts.PlusJakartaSans_Regular,
//                         fontSize: RFPercentage(1.8),
//                         marginTop: -2,
//                       }}>
//                       Rate Rider
//                     </Text>
//                     {/* <Entypo name="chevron-small-right" size={25} /> */}
//                   </TouchableOpacity>
//                   <View
//                     style={{
//                       marginVertical: 7,
//                       height: 0.8,
//                       backgroundColor: '#00000021',
//                     }}
//                   />
//                   <TouchableOpacity
//                     onPress={() => onDriverSelect()}
//                     style={styles.rowView}>
//                     <RadioButton
//                       value="first"
//                       uncheckedColor={Colors.Orange}
//                       color={Colors.Orange}
//                       status={checked === 'driver' ? 'checked' : 'unchecked'}
//                       onPress={() => onDriverSelect()}
//                     />
//                     <Text
//                       style={{
//                         color: '#757575',
//                         fontFamily: Fonts.PlusJakartaSans_Medium,
//                       }}>
//                       Rate Restaurant
//                     </Text>
//                     {/* <TouchableOpacity
//                       style={{}}
//                       onPress={() => {
//                         setIsRateResturant(true);
//                         ref_RatingOptionSheet?.current?.close(),
//                           ref_RatingSheet?.current?.open();
//                       }}>
//                       <Entypo name="chevron-small-right" size={25} />
//                     </TouchableOpacity> */}
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             }
//           />

//           <CRBSheetComponent
//             refRBSheet={ref_RatingSheet}
//             height={370}
//             content={
//               <View style={{width: wp(90)}}>
//                 <Text
//                   style={{
//                     color: Colors.Text,
//                     fontFamily: Fonts.PlusJakartaSans_Bold,
//                     fontSize: RFPercentage(2.4),
//                     marginBottom: 20,
//                   }}>
//                   {isRateResturant ? 'Rate Restaruant' : '  Rate Rider'}
//                 </Text>
//                 <TouchableOpacity
//                   style={{
//                     position: 'absolute',
//                     right: 0,
//                     top: -10,
//                     padding: 10,
//                   }}
//                   onPress={() => ref_RatingSheet?.current?.close()}>
//                   <Ionicons name={'close'} size={22} color={'#1E2022'} />
//                 </TouchableOpacity>

//                 <View style={{flex: 1}}>
//                   {/* <AirbnbRating
//                   count={5}
//                   //   reviews={['Terrible', 'Bad', 'Meh', 'OK', 'Good']}
//                   defaultRating={3}
//                   size={20}
//                 /> */}

//                   <AirbnbRating
//                     count={5}
//                     showRating={false}
//                     defaultRating={1}
//                     size={30}
//                     // starImage={<Images.food1 />}
//                     ratingContainerStyle={{marginBottom: 20}}
//                     onFinishRating={value => {
//                       setRating(value);
//                     }}
//                   />
//                   {/* <Rating
//                   //   showRating
//                   //   onFinishRating={this.ratingCompleted}
//                   style={{paddingBottom: 20, marginHorizontal: 5}}
//                   starContainerStyle={{margin: 20}}
//                   ratingContainerStyle={{margin: 20}}
//                   // size={3}
//                   // reviewSize={5}
//                   ratingColor="red"
//                   ratingCount={3}
//                   imageSize={30}
//                   onFinishRating={value => {
//                     console.log('rating : ', value);
//                   }}
//                 /> */}
//                   <CInput
//                     placeholder="Enter comments"
//                     placeholderTextColor="#1E2022"
//                     multiline={true}
//                     numberOfLines={6}
//                     textAlignVertical="top"
//                     value={ratingComment}
//                     onChangeText={text => setRatingComment(text)}
//                   />
//                   <CButton
//                     title="Submit"
//                     onPress={() => {
//                       ref_RatingSheet?.current?.close();
//                       handleSubmitRating();
//                     }}
//                   />
//                 </View>
//               </View>
//             }
//           />
//         </View>
//       </ScrollView>
//       <SuccessModal
//         visible={visible}
//         setVisible={setVisible}
//         description={'Order Cancelled Successfully!'}
//         onOK={() => navigation?.goBack()}
//       />

//       <RBSheetSuccess
//         refRBSheet={ref_RBSheetAlert}
//         title={rbSheetAlertText}
//         btnText={'OK'}
//         onPress={() => {
//           ref_RBSheetAlert?.current?.close();
//           // navigation?.popToTop();
//           // navigation?.replace('Drawer');
//         }}
//       />
//     </View>
//   );
// };

// export default OrderDetails;

// const styles = StyleSheet.create({
//   heading1: {
//     fontFamily: Fonts.PlusJakartaSans_Bold,
//     color: '#191A26',
//     fontSize: RFPercentage(2.2),
//   },
//   priceText: {
//     fontFamily: Fonts.PlusJakartaSans_ExtraBold,
//     color: Colors.Orange,
//     fontSize: RFPercentage(2.5),
//   },

//   container: {
//     flex: 1,
//     backgroundColor: Colors.White,
//     alignItems: 'center',
//     // paddingHorizontal: 20,
//   },
//   heading: {
//     fontFamily: Fonts.PlusJakartaSans_SemiBold,
//     color: '#191A26',
//     fontSize: RFPercentage(2.2),
//     flex: 1,
//   },
//   price: {
//     fontFamily: Fonts.PlusJakartaSans_Bold,
//     color: Colors.Orange,
//     fontSize: RFPercentage(2.4),
//     flex: 0.6,
//     textAlign: 'right',
//   },

//   itemView: {
//     marginVertical: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     // backgroundColor: '#F6F6F6',
//     backgroundColor: '#F5F6FA',
//     padding: 10,
//     paddingHorizontal: 10,
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   imageContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 10,
//     overflow: 'hidden',
//     backgroundColor: '#FF572233',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   textContainer: {
//     marginLeft: 10,
//     flex: 1,
//   },
//   image: {
//     height: '100%',
//     width: '100%',
//     resizeMode: 'contain',
//   },
//   rowView: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   rowViewSB: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginVertical: 5,
//   },
//   subText: {
//     color: '#8D93A1',
//     fontFamily: Fonts.Inter_Regular,
//     fontSize: RFPercentage(2),
//   },
//   subText1: {
//     fontFamily: Fonts.Inter_Regular,
//     fontSize: RFPercentage(1.5),
//     color: '#898A8D',
//     textTransform: 'capitalize',
//   },
//   title: {
//     color: '#191A26',
//     fontSize: RFPercentage(2),
//     fontFamily: Fonts.Inter_Medium,
//   },
//   title1: {
//     color: '#191A26',
//     fontFamily: Fonts.Inter_Medium,
//     fontSize: RFPercentage(1.8),
//     marginLeft: 12,
//   },
//   title2: {
//     color: Colors.Orange,
//     fontFamily: Fonts.PlusJakartaSans_Bold,
//     fontSize: RFPercentage(1.9),
//     marginLeft: 12,
//   },
//   rbSheetHeading: {
//     color: Colors.Text,
//     fontFamily: Fonts.PlusJakartaSans_Bold,
//     fontSize: RFPercentage(2.4),
//   },
// });
