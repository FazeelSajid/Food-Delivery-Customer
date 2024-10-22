import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Alert,
  TextInput,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Colors, Fonts, Icons, Images } from '../../../constants';
import StackHeader from '../../../components/Header/StackHeader';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CartSwipeListView from '../../../components/Lists/CartSwipeListView';
import CButton from '../../../components/Buttons/CButton';
import CRBSheetComponent from '../../../components/BottomSheet/CRBSheetComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CInput from '../../../components/TextInput/CInput';
import { RadioButton } from 'react-native-paper';
import RBSheetSuccess from '../../../components/BottomSheet/RBSheetSuccess';
import {
  getCustomerDetail,
  getCustomerShippingAddress,
  getRestaurantDetail,
  getUserFcmToken,
  showAlert,
  showAlertLongLength,
} from '../../../utils/helpers';
import {
  BASE_URL,
  STRIPE_PUBLISH_KEY,
  firebase_server_key,
} from '../../../utils/globalVariables';
import RBSheetGuestUser from '../../../components/BottomSheet/RBSheetGuestUser';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../components/Loader';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../../constants/api';
import { getShippingAddress } from '../../../utils/helpers/localStorage';
import { clearCartItems } from '../../../utils/helpers/cartapis';
import {
  addToCart,
  setCartRestaurantId,
  setOrderComment,
  setSelectedPaymentString,
  setSelectedPaymentType,
  updateMyCartList,
} from '../../../redux/CartSlice';
import { firebase } from '@react-native-firebase/auth';
import { setOtpConfirm } from '../../../redux/AuthSlice';
import CInputWithCountryCode from '../../../components/TextInput/CInputWithCountryCode';
import {
  AddPaymentToCustomerWallet,
  MakeOrderPayment,
} from '../../../utils/helpers/walletApis';
import {
  getDeliveryCharges,
  getEstimatedDeliveryTime,
  getPlatformFee,
} from '../../../utils/helpers/location';
import {
  initStripe,
  StripeProvider,
  usePaymentSheet,
  useStripe,
} from '@stripe/stripe-react-native';
import PaymentCard from '../../../components/Cards/PaymentCard';
import CustomButton from '../../../components/Buttons/customButton';

const Checkout = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const { join_as_guest } = useSelector(store => store.store);
  const {
    cart,
    cart_restaurant_id,
    selected_payment_type,
    selected_payment_string,
  } = useSelector(store => store.cart);

  const btmSheetRef = useRef()


  const ref_RBSheet = useRef();
  const ref_RBSheetPhoneNo = useRef(null);
  const ref_RBSheetPaymentOption = useRef(null);
  const ref_RBSheetGuestUser = useRef(null);

  const [loading, setLoading] = useState(false);
  const [phoneNo, setPhoneNo] = useState('');
  // const [location, setLocation] = useState('');
  // const [location_id, setLocation_id] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [checked, setChecked] = React.useState('cash');
  const [selectPaymentMethod, setSelectPaymentMethod] = useState('');

  const [newPhoneNO, setNewPhoneNO] = useState('');
  const [countryCode, setCountryCode] = useState('+92');

  const [total_amount, setTotal_amount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  // const [platform_fee, setPlatform_fee] = useState(0);
  const [delivery_charges, setDelivery_charges] = useState(0);
  // const [service_fee, setService_fee] = useState(4);
  const [service_fee, setService_fee] = useState(0);

  const [isValidPromoCode, setIsValidPromoCode] = useState(false);
  const [promoCodeDetail, setPromoCodeDetail] = useState(null);
  const [isPromocodeApplied, setIsPromocodeApplied] = useState(false);
  const [comments, setComments] = useState('');


  const [selected_card, setSelected_card] = useState('');
  const { customer_id, location } = useSelector(store => store.store);

  const location_id = location.id



  const [data, setData] = useState([
    {
      id: 0,
      image: Images.food1,
      title: 'Fresh Orange splash',
      description: 'Mix fresh real orange',
      price: 13.2,
      count: 1,
    },
    {
      id: 1,
      image: Images.food2,
      title: 'Fresh Orange splash',
      description: 'Mix fresh real orange',
      price: 13.2,
      count: 1,
    },
    {
      id: 2,
      image: Images.food3,
      title: 'Fresh Orange',
      description: 'Mix fresh real orange',
      price: 13.2,
      count: 1,
    },
  ]);

  // ____________________________ stripe payment ________________________________

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const fetchPaymentSheetParams = async () => {
    console.log('fetchPaymentSheetParams called...');
    const response = await fetch(`${BASE_URL}payment/pay`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: total_amount * 100,
        currency: 'usd',
      }),
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    setLoading(true);
    const { paymentIntent, ephemeralKey, customer, publishableKey } =
      await fetchPaymentSheetParams();
    initStripe({
      publishableKey: STRIPE_PUBLISH_KEY,
    });

    const { error } = await initPaymentSheet({
      appearance: {
        shapes: {
          borderRadius: 12,
          borderWidth: 0.5,
        },
        primaryButton: {
          shapes: {
            borderRadius: 20,
          },
        },
        colors: {
          primary: Colors.Orange,
          background: '#FFFFFF',
          componentBackground: '#FFFFFF',
          componentBorder: '#000000',
          componentDivider: '#000000',
          primaryText: Colors.Orange,
          secondaryText: Colors.Orange,
          componentText: Colors.Orange,
          placeholderText: '#000000',
        },
      },

      merchantDisplayName: 'Food Delivery',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      // allowsDelayedPaymentMethods: true,
      // defaultBillingDetails: {
      //   name: 'Jane Doe',
      // },
    });
    setLoading(false);
    if (!error) {
      // setLoading(true);
      console.log('setLoading');
      openPaymentSheet();
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    setLoading(false);
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
      if (error.code == 'Canceled') {
        // user cancel payment
        // for now we do nothing...
      } else {
        showAlertLongLength(error.message);
      }
    } else {
      // handle success
      console.log('Success', 'Your order is confirmed!');
      placeOrder();
    }
  };

  //________________________________________________________________

  const handleAddQuantity = async item => {
    const newData = data?.map(element => {
      if (element?.id == item.id) {
        return {
          ...element,
          count: element.count + 1,
        };
      } else {
        return {
          ...element,
        };
      }
    });
    setData(newData);
  };

  const handleRemoveQuantity = async item => {
    const newData = data?.map(element => {
      if (element?.id == item.id) {
        return {
          ...element,
          count: element.count - 1,
        };
      } else {
        return {
          ...element,
        };
      }
    });
    setData(newData);
  };

  const handleDelete = async item => {
    const filter = data.filter(element => element?.id != item?.id);
    setData(filter);
  };

  const ItemSeparator = () => (
    <View
      style={{
        height: hp(0.1),
        marginVertical: 10,
        backgroundColor: '#00000026',
      }}
    />
  );

  // useEffect(() => {
  //   console.log('route?.params?.selectPaymentMethod  : ', route?.params);
  //   route?.params?.selectPaymentMethod &&
  //     setSelectPaymentMethod(route?.params?.selectPaymentMethod);
  //   setChecked(route?.params?.checked);
  // }, [route?.params?.selectPaymentMethod]);

  const handlePlaceOrder = async () => {
    //send notification to restaurant and rider both that new order is placed
    handleSendPushNotification(`Customer placed a new order`);
  };

  // handle update phone :  for that we send otp to user number and then after verify we update the user phone number
  const handleSendCode = async () => {
    try {
      if (countryCode?.length == 0) {
        showAlert('Please Enter Country');
        return;
      } else if (newPhoneNO?.length == 0) {
        showAlert('Please Enter Phone Number');
        return;
      } else {
        // navigation?.navigate('Verification_Phone', {
        //   // confirmResult: response,
        //   phone_no: countryCode + newPhoneNO,
        //   screen: 'checkout',
        // });

        setLoading(true);
        firebase
          .auth()
          .signInWithPhoneNumber(countryCode + newPhoneNO)
          .then(response => {
            console.log('confirmResult  :  ', response);
            // setConfirmResult(response);
            // setTimeout(() => refOTP.current.focusField(0), 250);
            dispatch(setOtpConfirm(response));
            navigation?.navigate('Verification_Phone', {
              // confirmResult: response,
              phone_no: countryCode + newPhoneNO,
              screen: 'checkout',
            });
          })
          .catch(error => {
            showAlert(error.message);
            console.log(error);
          })
          .finally(() => setLoading(false));
      }
    } catch (error) {
      console.log('error :  ', error);
    }
  };

  const handleSendPushNotification = async text => {
    const receiver_fcm = await getUserFcmToken();
    if (receiver_fcm) {
      let body = {
        to: receiver_fcm,
        notification: {
          title: 'New Order',
          body: text ? text : '',
          // mutable_content: true,
          sound: 'default',
        },
        data: {
          // user_id: user,
          type: 'order',
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

  const clear_Cart_items = () => {
    clearCartItems()
      .then(response => {
        dispatch(setCartRestaurantId(null));
        dispatch(addToCart([]));
        dispatch(setOrderComment(''));
      })
      .catch(error => {
        console.log('error : ', error);
      });
  };

  const addPaymentToWallet = async amount => {
    await AddPaymentToCustomerWallet(amount)
      .then(response => {
        console.log('AddPaymentToCustomerWallet : ', response);
      })
      .catch(error => console.log(error));
  };

  const makeOrderPayment = async order_id => {
    console.log('order_id  : ', order_id);
    await MakeOrderPayment(order_id)
      .then(response => {
        console.log('makeOrderPayment : ', response);
      })
      .catch(error => console.log('makeOrderPayment', error));
  };

  // console.log(location_id);

  const placeOrder = async () => {
        
    if (!newPhoneNO) {
      ref_RBSheetPhoneNo?.current?.open()
    } else {
      
    

    // // addPaymentToWallet(6);
    // makeOrderPayment(200832);
    // return;
    // if (selected_payment_type == 'card') {
    //   showAlertLongLength(
    //     'Cart Payment is not handled yet. Try Cash on Delivery Option',
    //   );
    //   return;
    // }

    // "message": "customer_id , cart_items_ids , restaurant_id , phone_no ,
    // payment_option, total_amount must be Provided ", "status": false
    if (location_id?.length == 0) {
      navigation.navigate('ManageAddress');
    } else {
      setLoading(true);
      // let customer_Id = await AsyncStorage.getItem('customer_id');
      console.log('customer_Id  :  ', customer_id);
      //show on success   : ref_RBSheet?.current?.open();

      // Note : res_id is missing in cart detail so latter on we will create spearate order for every restaurant;

      // let res_details = await getRestaurantDetail(cart_restaurant_id);
      // let pickup_location = res_details?.location;
      // let dropOff_Location = location.address;
      // let delivery_time = await getEstimatedDeliveryTime(
      //   pickup_location,
      //   dropOff_Location,
      // );
      // console.log(
      //   '___________________ delivery_time : ____________',
      //   delivery_time,
      // );

      let items = cart ? cart : [];
      items = items?.map(item => item.cart_item_id);
      // items = items?.map(item => item.item_id);
      let data = {
        customer_id: customer_id,
        cart_items_ids: items,
        description: 'Order creating',
        location_id: location_id,
        address: location.address,
        restaurant_id: cart_restaurant_id,
        phone_no: newPhoneNO,
        promo_code: isValidPromoCode ? promoCodeDetail?.promo_code_id : '',
        payment_option: selected_payment_type,
        // payment_option: 'card',
        // customer_payment: 1, // card -> total amount :  cash->0
        total_amount: parseInt(total_amount),
        comments: comments,
        Estimated_delivery_time: 45,
        // Estimated_delivery_time: delivery_time,
        // delivery_charges: delivery_charges,
        // platform_fees: platform_fee == 0 ? 5 : platform_fee,
      };

      // setLoading(false);
      // return;
      // let data = {
      //   customer_id: '200658',
      //   cart_items_ids: [200685],
      //   description: 'Order creating',
      //   location_id: 200033,
      //   address: 'Address 1',
      //   restaurant_id: 'res_5691714',
      //   phone_no: 92349892347,
      //   promo_code: 200033,
      //   payment_option: 'card',
      //   customer_payment: 1,
      //   total_amount: '2000',
      //   comments: 'comments',
      //   Estimated_delivery_time: 30,
      // };
      console.log(data);

      fetch(api.create_order, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(async response => {
          if (response.status == true) {
            // clear_Cart_items(); //remove all items from cart
            dispatch(setCartRestaurantId(null));
            dispatch(addToCart([]));
            dispatch(updateMyCartList([]));
            dispatch(setOrderComment(''));
            if (selected_payment_type == 'card') {
              addPaymentToWallet(parseInt(total_amount));
              makeOrderPayment(response?.result?.order_id);
            }
            ref_RBSheet?.current?.open();
          } else {
            setTimeout(() => {
              showAlert(response.message);
            }, 200);
          }
          console.log('create order response  :  ', response);
        })
        .catch(err => {
          console.log('Error in create order :  ', err);
          showAlert('Something went wrong ');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }
  };

  const calculateTotalAmount = () => {
    try {
      let total = 0;
      for (const item of cart) {
        console.log('item?.itemData?.price :  ', item?.itemData?.variationData?.price);
        let price = item?.itemData?.price ? parseInt(item?.itemData?.variationData?.price) : 0;
        let quantity = item?.quantity ? parseInt(item?.quantity) : 1;
        total = total + price * quantity;
        console.log('total : ', total);
      }

      setSubtotal(total.toFixed(2));
      // let totalAmount = total + service_fee;
      // let totalAmount = total + delivery_charges + platform_fee;
      // console.log(totalAmount, 'total amount');

      setTotal_amount(total.toFixed(2));
    } catch (error) {
      console.log('error in calculating total amount : ', error);
    }
  };

  const handleEditAddress = async () => {
    let shipping_address = await getShippingAddress();
    console.log('shipping_address  :  ', shipping_address?.location_id);
    if (shipping_address) {
      navigation.navigate('ShippingAddressList');
    } else {
      navigation?.navigate('ShippingAddress');
    }

    // setLoading(true);
    // let customer_Id = await AsyncStorage.getItem('customer_id');
    // getCustomerShippingAddress(customer_Id)
    //   .then(response => {
    //     let list = response?.result ? response?.result : [];
    //     if (list?.length == 0) {
    //       navigation?.navigate('ShippingAddress');
    //     } else {
    //       navigation.navigate('ShippingAddressList');
    //     }
    //   })
    //   .catch(error => {
    //     console.log('error : ', error);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
    // navigation.navigate('ShippingAddressList');
  };

  const getCustomerData = async () => {
    setLoading(true);
    // let customer_Id = await AsyncStorage.getItem('customer_id');
    await getCustomerDetail(customer_id)
      .then(async response => {
        setPhoneNo(response?.phone_no);
        // setLocation(response?.location);
        // //also getting shipping address details
        // getCustomerShippingAddress(customer_Id).then(res => {
        //   if (res?.status == true) {
        //     let result = res?.result[0];
        //     setLocation_id(result?.location_id);
        //   }
        // });
        // let shipping_address = await getShippingAddress();
        // let delivery_charges1 = await getDeliveryCharges(
        //   shipping_address?.area,
        // );
        // let platform_fee1 = await getPlatformFee(shipping_address?.area);

        // setDelivery_charges(delivery_charges1);
        // setPlatform_fee(platform_fee1);
        // setService_fee(delivery_charges1 + platform_fee)
        // let location_id = shipping_address?.location_id;
        // setLocation_id(location_id);
        // setLocation(shipping_address?.address);
      })
      .catch(err => {
        console.log('err : ', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // useEffect(() => {
  //   getCustomerData();
  // }, []);

  useEffect(() => {
    calculateTotalAmount();
  }, [service_fee]);

  const getSelectedCard = async () => {
    let card = await AsyncStorage.getItem('selected_card');
    if (card) {
      card = JSON.parse(card);
      setSelected_card(card);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      // dispatch(setSelectedPaymentType(''));
      // dispatch(setSelectedPaymentString(''));

      // calculateTotalAmount();
      getCustomerData();
      //
      getSelectedCard();
    }, []),
  );

  const handleVerifyPromoCode = async promoCode => {
    setIsValidPromoCode(true);
    fetch(
      api.verify_promo_code +
      `?promo_code=${promoCode}&restaurant_id=${cart_restaurant_id}`,
    )
      .then(response => response.json())
      .then(response => {
        Keyboard.dismiss();
        if (response.status == false) {
          // console.log(response);
          
          setIsValidPromoCode(false);
          calculateTotalAmount();
        } else {
          setIsPromocodeApplied(true);
          setIsValidPromoCode(true);
          setPromoCodeDetail(response?.result[0]);
          // Input: Total amount
          const totalAmount = subtotal; // Replace this with your actual total amount

          // Calculate the discount
          const discountPercentage = 30 / 100; // 30 percent as a decimal
          const discount = totalAmount * discountPercentage;

          // Calculate the discounted price
          const discountedPrice = totalAmount - discount;

          // Output the result
          // console.log(`Total amount: $${totalAmount}`);
          // console.log(`Discounted amount: $${discountedPrice}`);

          setSubtotal(discountedPrice.toFixed(2));
          let totalAmount1 = discountedPrice + service_fee;
          setTotal_amount(totalAmount1.toFixed(2));
        }
      })
      .catch(err => console.log('error : ', err));
  };

  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     console.log('promocode : ', promoCode);
  //     // Send Axios request here
  //     handleVerifyPromoCode(promoCode);
  //   }, 200);

  //   return () => clearTimeout(delayDebounceFn);
  // }, [promoCode]);

  const showBtmSheet = () => {
    btmSheetRef?.current?.open()
  }
  const closeBtmSheet = () => {
    btmSheetRef?.current?.close()
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.White }}>
      <Loader loading={loading} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StackHeader title={'Checkout'} />
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={styles.heading}>Delivering To</Text>
          <View style={styles.itemView}>
            <View style={styles.imageContainer}>
              <Icons.Location height={20} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.subText}>{location.address}</Text>
            </View>
            <TouchableOpacity
              // onPress={() => navigation.navigate('UpdateLocation')}
              // onPress={() => navigation.navigate('ShippingAddress')}
              onPress={() => {
                if (join_as_guest) {
                  ref_RBSheetGuestUser?.current?.open();
                } else {
                  showBtmSheet()
                }
              }}
              style={{ marginLeft: 10 }}>
              <Icons.Edit />
            </TouchableOpacity>
          </View>
          <View style={styles.itemView}>
            <View style={styles.imageContainer}>
              <Icons.Phone height={15} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.subText}>
                {phoneNo ? phoneNo : '0000 000000'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (join_as_guest) {
                  ref_RBSheetGuestUser?.current?.open();
                } else {
                  ref_RBSheetPhoneNo?.current?.open();
                }
              }}
              style={{ marginLeft: 10 }}>
              <Icons.Edit />
            </TouchableOpacity>
          </View>
        </View>
        <ItemSeparator />
        <View style={[styles.rowViewSB, { width: wp(80), alignSelf: 'center', alignItems: 'center', marginTop: 10,marginBottom: 10 }]} >
          <TextInput placeholder='Promo Code' placeholderTextColor={'#B0B0B0'} style={{ borderRadius: 25, backgroundColor: '#F5F6FA', width: wp(60), paddingLeft: wp(5), marginRight: wp(2), color: Colors.Black  }} value={promoCode}  onChangeText={text => setPromoCode(text)} />
          <CustomButton text={'Apply'} textStyle={{ color: Colors.White, fontSize: RFPercentage(2) }} containerStyle={{ backgroundColor: Colors.Orange, paddingHorizontal: wp(5), paddingVertical: hp(1.3), borderRadius: 25 }} onPress={()=> handleVerifyPromoCode(promoCode)} pressedRadius={25} />


        </View>

        {isPromocodeApplied && (
          <Text
          style={{
            color: 'green',
            fontSize: 12,
            marginLeft: 50,
            marginTop: -5,
            marginBottom: 10,
            // marginRight: 20
          }}>
            Promo code applied
          </Text>
        )}

        {!isValidPromoCode && promoCode?.length > 0 && (
          <Text
            style={{
              color: 'red',
              fontSize: 12,
              marginLeft: 50,
              marginTop: -5,
              marginBottom: 10,
              // marginRight: 20
            }}>
            Promo code is invalid
          </Text>
        )}

        <CInput
          placeholder="Comments (optional)"
          multiline={true}
          numberOfLines={6}
          textAlignVertical="top"
          value={comments}
          onChangeText={text => setComments(text)}
        />

        <View style={{ paddingHorizontal: 20 }}>
          {selected_payment_string?.length == 0 ? (
            <TouchableOpacity
              onPress={() => {
                if (join_as_guest) {
                  ref_RBSheetGuestUser?.current?.open();
                } else {
                  ref_RBSheetPaymentOption?.current?.open();
                }
              }}
              style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  color: Colors.Orange,
                  fontFamily: Fonts.Inter_SemiBold,
                  fontSize: RFPercentage(1.8),
                  textTransform: 'capitalize',
                }}>
                {selected_payment_string?.length == 0
                  ? 'Select Payment Option'
                  : `${selected_payment_string}`}
              </Text>
              <Ionicons
                name="chevron-forward"
                color={Colors.Orange}
                size={18}
              />
            </TouchableOpacity>
          ) : (
            <>
              <Text
                style={{
                  color: Colors.Orange,
                  fontFamily: Fonts.PlusJakartaSans_Bold,
                  fontSize: RFPercentage(2),
                }}>
                Payment Method
              </Text>
              {selected_payment_type == 'cash' ? (
                <>
                  <Text
                    style={{
                      color: '#02010E',
                      fontFamily: Fonts.PlusJakartaSans_Medium,
                      fontSize: RFPercentage(2),
                    }}>
                    Cash on Delivery
                  </Text>
                </>
              ) : selected_payment_type == 'card' ? (
                <>
                  <PaymentCard
                    // title="Card Payment"
                    title={selected_card?.card?.brand}
                    style={{
                      width: wp(90),
                      // borderWidth: 1,
                      // paddingLeft: 0,
                      marginLeft: -1,
                      // marginTop: 1,
                    }}
                    showEditButton={true}
                    onEditPress={() =>
                      navigation.navigate('SelectPaymentMethod')
                    }
                  />
                </>
              ) : (
                <>
                  <Text
                    style={{
                      color: '#02010E',
                      fontFamily: Fonts.PlusJakartaSans_Medium,
                      fontSize: RFPercentage(2),
                    }}>
                    Wallet Payment
                  </Text>
                </>
              )}
            </>
          )}

          <View style={{ height: hp(14) }} />
          {/* <Text style={styles.heading}>Detail Order</Text>
          <CartSwipeListView
            data={data}
            onDecrement={item => handleRemoveQuantity(item)}
            onIncrement={item => handleAddQuantity(item)}
            onDelete={item => handleDelete(item)}
          /> */}

          <View style={{ marginVertical: 10 }}>
            <View style={styles.rowViewSB}>
              <Text style={styles.subText1}>Subtotal</Text>
              <Text style={styles.subText1}>${subtotal}</Text>
            </View>
            <View style={styles.rowViewSB}>
              {/* <Text style={styles.subText1}>Delivery Charges</Text> */}
              {/* <Text style={styles.subText1}>${delivery_charges}</Text> */}
            </View>
            <View style={styles.rowViewSB}>
              {/* <Text style={styles.subText1}>Platform Fee</Text>
              <Text style={styles.subText1}>${platform_fee}</Text> */}
            </View>
            {/* <View style={styles.rowViewSB}>
              <Text style={styles.subText1}>Service Charges</Text>
              <Text style={styles.subText1}>${service_fee}</Text>
            </View> */}

            <ItemSeparator />
            <View style={styles.rowViewSB}>
              <Text style={styles.title}>Total</Text>
              <Text style={styles.title}>${total_amount}</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingBottom: 20,
          }}>
          <CButton
            title="PLACE ORDER"
            // onPress={() => navigation.replace('ShippingAddress')}
            onPress={() => {
              if (join_as_guest) {
                ref_RBSheetGuestUser?.current?.open();
              } else if (selected_payment_string?.length > 0) {
                if (selected_payment_type == 'card') {
                  initializePaymentSheet(); // stripe payment
                } else {
                  placeOrder();
                }
              } else {
                ref_RBSheetPaymentOption?.current?.open();
              }
            }}
          />
        </View>

        <CRBSheetComponent
          refRBSheet={ref_RBSheetPhoneNo}
          height={260}
          content={
            <View style={{ width: wp(90) }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 20,
                  paddingHorizontal: 10,
                }}>
                <Text
                  style={{
                    color: Colors.Text,
                    fontFamily: Fonts.PlusJakartaSans_Bold,
                    fontSize: RFPercentage(1.9),
                  }}>
                  Update Phone Number
                </Text>
                <TouchableOpacity
                  onPress={() => ref_RBSheetPhoneNo?.current?.close()}>
                  <Ionicons name={'close'} size={22} color={'#1E2022'} />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: Colors.Text,
                    fontFamily: Fonts.Inter_SemiBold,
                    fontSize: RFPercentage(1.8),
                    marginHorizontal: 10,
                    marginBottom: 15,
                  }}>
                  Phone Number
                </Text>
                {/* <CInput
                  placeholder="0000 0000000"
                  keyboardType="numeric"
                  height={42}
                  value={newPhoneNO}
                  onChangeText={text => setNewPhoneNO(text)}
                /> */}
                <CInputWithCountryCode
                  phoneNo={newPhoneNO}
                  setPhoneNo={setNewPhoneNO}
                  setCountryCode={setCountryCode}
                  countryCode={countryCode}
                />

                <CButton
                  title="Update"
                  marginTop={12}
                  onPress={() => {
                    ref_RBSheetPhoneNo?.current?.close();
                    handleSendCode();
                  }}
                />
              </View>
            </View>
          }
        />
        <CRBSheetComponent
          refRBSheet={ref_RBSheetPaymentOption}
          height={250}
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
                    dispatch(setSelectedPaymentType('cash'));
                    dispatch(setSelectedPaymentString('cash on Delivery'));
                    setChecked('cash');
                    setSelectPaymentMethod('cash on Delivery');
                    ref_RBSheetPaymentOption?.current?.close();
                  }}
                  style={styles.rowView}>
                  <RadioButton
                    value="first"
                    uncheckedColor={Colors.Orange}
                    color={Colors.Orange}
                    status={
                      selected_payment_type === 'cash' ? 'checked' : 'unchecked'
                    }
                    onPress={() => {
                      dispatch(setSelectedPaymentType('cash'));
                      dispatch(setSelectedPaymentString('cash on Delivery'));
                      setChecked('cash');
                      setSelectPaymentMethod('cash on Delivery');
                      ref_RBSheetPaymentOption?.current?.close();
                    }}
                  />
                  <Text
                    style={{
                      color: '#56585B',
                      fontFamily: Fonts.PlusJakartaSans_Regular,
                      marginTop: -2,
                      fontSize: RFPercentage(1.8),
                    }}>
                    Cash on Delivery
                  </Text>
                </TouchableOpacity>
                {/* <ItemSeparator />
                <TouchableOpacity
                  onPress={() => {
                    dispatch(setSelectedPaymentType('card'));
                    dispatch(setSelectedPaymentString('Card Payment'));
                    ref_RBSheetPaymentOption?.current?.close();
                  }}
                  style={styles.rowView}>
                  <RadioButton
                    value="card"
                    uncheckedColor={Colors.Orange}
                    color={Colors.Orange}
                    status={
                      selected_payment_type === 'card' ? 'checked' : 'unchecked'
                    }
                    onPress={() => {
                      dispatch(setSelectedPaymentType('card'));
                      dispatch(setSelectedPaymentString('Card Payment'));
                      ref_RBSheetPaymentOption?.current?.close();
                    }}
                  />
                  <Text
                    style={{
                      color: '#56585B',
                      fontFamily: Fonts.PlusJakartaSans_Regular,
                      marginTop: -2,
                      fontSize: RFPercentage(1.8),
                    }}>
                    Card Payment
                  </Text>
                </TouchableOpacity>
                <ItemSeparator />
                <TouchableOpacity
                  onPress={() => {
                    dispatch(setSelectedPaymentType('wallet'));
                    dispatch(setSelectedPaymentString('Wallet Payment'));
                    ref_RBSheetPaymentOption?.current?.close();
                  }}
                  style={styles.rowView}>
                  <RadioButton
                    value="card"
                    uncheckedColor={Colors.Orange}
                    color={Colors.Orange}
                    status={
                      selected_payment_type === 'wallet'
                        ? 'checked'
                        : 'unchecked'
                    }
                    onPress={() => {
                      dispatch(setSelectedPaymentType('wallet'));
                      dispatch(setSelectedPaymentString('Wallet Payment'));
                      ref_RBSheetPaymentOption?.current?.close();
                    }}
                  />
                  <Text
                    style={{
                      color: '#56585B',
                      fontFamily: Fonts.PlusJakartaSans_Regular,
                      marginTop: -2,
                      fontSize: RFPercentage(1.8),
                    }}>
                    Wallet Payment
                  </Text>
                </TouchableOpacity> */}
              </View>
            </View>
          }
        />

        <RBSheetSuccess
          refRBSheet={ref_RBSheet}
          title={'Order Placed  Successfully'}
          btnText={'OK'}
          onPress={() => {
            ref_RBSheet?.current?.close();
            navigation?.popToTop();
            navigation?.replace('Drawer');
            // navigation?.goBack();
          }}
        />

        <RBSheetGuestUser
          refRBSheet={ref_RBSheetGuestUser}
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

                // getRestaurants();
                // getDeals();
                // console.log(address);
                navigation.navigate('ManageAddress')
                closeBtmSheet()

                // navigation.navigate('AddAddress', { address })


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
      </ScrollView>
    </View>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  heading: {
    color: Colors.Text,
    fontFamily: Fonts.Inter_SemiBold,
    fontSize: RFPercentage(2),
    marginTop: 10,
  },
  itemView: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    padding: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageContainer: {
    width: 40,
    height: 40,
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
    fontFamily: Fonts.Inter_Regular,
    fontSize: RFPercentage(1.7),
  },
  subText1: {
    color: '#0C0B0B',
    fontFamily: Fonts.Inter_Regular,
    fontSize: RFPercentage(2),
    lineHeight: 30,
  },
  title: {
    color: '#191A26',
    fontSize: RFPercentage(2.3),
    fontFamily: Fonts.Inter_Bold,
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
  rowViewSB1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  rbSheetHeading: {
    color: Colors.Text,
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(1.9),
  },
  btmsheettext: {
    color: '#56585B',
    fontFamily: Fonts.PlusJakartaSans_Regular,
    marginLeft: wp(5),
    fontSize: RFPercentage(1.9),
  },
});
