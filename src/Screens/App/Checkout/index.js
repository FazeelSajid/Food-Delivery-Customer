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
  TextInput,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import {  Fonts, Icons, Images } from '../../../constants';
import StackHeader from '../../../components/Header/StackHeader';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CButton from '../../../components/Buttons/CButton';
import CRBSheetComponent from '../../../components/BottomSheet/CRBSheetComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CInput from '../../../components/TextInput/CInput';
import { RadioButton } from 'react-native-paper';
import RBSheetSuccess from '../../../components/BottomSheet/RBSheetSuccess';
import {handlePopup,} from '../../../utils/helpers';
import {
  BASE_URL,
  STRIPE_PUBLISH_KEY,
  firebase_server_key,
} from '../../../utils/globalVariables';
import RBSheetGuestUser from '../../../components/BottomSheet/RBSheetGuestUser';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../components/Loader';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../../constants/api';
import {
  addToCart,
  setCartRestaurantId,
  setOrderComment,
  setSelectedPaymentString,
  setSelectedPaymentType,
  updateMyCartList,
} from '../../../redux/CartSlice';
import { setBill, setWalletTotalAmount } from '../../../redux/AuthSlice';
import CInputWithCountryCode from '../../../components/TextInput/CInputWithCountryCode';
import {
  AddPaymentToCustomerWallet,
  MakeOrderPayment,
} from '../../../utils/helpers/walletApis';

import {
  initStripe,

  useStripe,
} from '@stripe/stripe-react-native';
import CustomButton from '../../../components/Buttons/customButton';
import { GetCustomerStripeId } from '../../../utils/helpers/stripeCardApis';
import PopUp from '../../../components/Popup/PopUp';

const Checkout = ({ navigation, route }) => {
  // const [Bill, setBill] = useState({
  //   total_amount: 0,
  //   subtotal: 0,
  //   cartItemIds: [],
  //   delivery_charges: 0,
  //   gst_charges: 0,
  //   total_amount: 0
  // })
  // const [total_amount, setTotal_amount] = useState(0);
  // const [subtotal, setSubtotal] = useState(0);
  // const [platform_fee, setPlatform_fee] = useState(0);
  // const [delivery_charges, setDelivery_charges] = useState(0);
  // const [service_fee, setService_fee] = useState(4);
  // const [location, setLocation] = useState('');
  // const [location_id, setLocation_id] = useState('');
  // const [checked, setChecked] = React.useState('cash');
  // const [selectPaymentMethod, setSelectPaymentMethod] = useState('');
  // const openPaymentSheet = async () => {
  //   // console.log('openpaymentSheet');
  //   const { error } = await presentPaymentSheet();


  //   setLoading(false);
  //   if (error) {
  //     Alert.alert(`Error code: ${error.code}`, error.message);
  //     console.log(error);

  //     if (error.code == 'Canceled') {
  //       // user cancel payment
  //       // for now we do nothing...
  //     } else {
  //       handlePopup(dispatch,error.message , 'red' )
  //     }
  //   } else {
  //     // handle success
  //     console.log('Success', 'Your order is confirmed!');
  //     placeOrder();
  //   }
  // };

  // const initializePaymentSheet = async () => {

  //   if (!newPhoneNO) {
  //     ref_RBSheetPhoneNo?.current?.open()
  //   } else if (walletTotalAmount < Bill.total_amount) {
  //     WithDrawBtmSheet?.current?.open();
  //     return
  // }else {
  //   setLoading(true);
  //   const { paymentIntent, ephemeralKey, customer } =
  //     await fetchPaymentSheetParams(Bill.total_amount);
  //   initStripe({
  //     publishableKey: STRIPE_PUBLISH_KEY,
  //   });

  //   console.log({ paymentIntent, ephemeralKey, customer });


  //   const { error } = await initPaymentSheet({
  //     appearance: {
  //       // shapes: {
  //       //   borderRadius: 12,
  //       //   borderWidth: 0.5,
  //       // },
  //       // primaryButton: {
  //       //   shapes: {
  //       //     borderRadius: 20,
  //       //   },
  //       // },
  //       // colors: {
  //       //   primary: Colors.primary_color,
  //       //   background: '#FFFFFF',
  //       //   componentBackground: '#FFFFFF',
  //       //   componentBorder: '#000000',
  //       //   componentDivider: '#000000',
  //       //   primaryText: Colors.primary_color,
  //       //   secondaryText: Colors.primary_color,
  //       //   componentText: Colors.primary_color,
  //       //   placeholderText: '#000000',
  //       // },
  //     },
  //     merchantDisplayName: 'Food Delivery',
  //     customerId: customer,
  //     customerEphemeralKeySecret: ephemeralKey,
  //     paymentIntentClientSecret: paymentIntent,
  //     // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
  //     //methods that complete payment after a delay, like SEPA Debit and Sofort.
  //     // allowsDelayedPaymentMethods: true,
  //     // defaultBillingDetails: {
  //     //   name: 'Jane Doe',
  //     // },
  //   });
  //   setLoading(false);
  //   if (!error) {
  //     // setLoading(true);
  //     // console.log('setLoading');
  //     openPaymentSheet();
  //   }
  // }};
  // const handlePlaceOrder = async () => {
  //   //send notification to restaurant and rider both that new order is placed
  //   handleSendPushNotification(`Customer placed a new order`);
  // };
  // handle update phone :  for that we send otp to user number and then after verify we update the user phone number

  // const handleSendPushNotification = async text => {
  //   const receiver_fcm = await getUserFcmToken();
  //   if (receiver_fcm) {
  //     let body = {
  //       to: receiver_fcm,
  //       notification: {
  //         title: 'New Order',
  //         body: text ? text : '',
  //         // mutable_content: true,
  //         sound: 'default',
  //       },
  //       data: {
  //         // user_id: user,
  //         type: 'order',
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
  // const clear_Cart_items = () => {
  //   clearCartItems()
  //     .then(response => {
  //       dispatch(setCartRestaurantId(null));
  //       dispatch(addToCart([]));
  //       dispatch(setOrderComment(''));
  //     })
  //     .catch(error => {
  //       console.log('error : ', error);
  //     });
  // };
  // const handleVerifyPromoCode = async promoCode => {
  //   console.log({ promoCode });

  //   setInValidPromoCode(true);
  //   fetch(
  //     api.verify_promo_code +
  //     `?promo_code=${promoCode}`,
  //   )
  //     .then(response => response.json())
  //     .then(response => {
  //       console.log(response);

  //       Keyboard.dismiss();
  //       if (response.status == false) {
  //         // console.log(response);

  //         setInValidPromoCode(false);
  //         // calculateTotalAmount();
  //       } else {
  //         setIsPromocodeApplied(true);
  //         setInValidPromoCode(true);
  //         setPromoCodeDetail(response?.result[0]);
  //         // Input: Total amount
  //         const totalAmount = subtotal; // Replace this with your actual total amount

  //         // Calculate the discount
  //         const discountPercentage = 30 / 100; // 30 percent as a decimal
  //         const discount = totalAmount * discountPercentage;

  //         // Calculate the discounted price
  //         const discountedPrice = totalAmount - discount;

  //         // Output the result
  //         // console.log(`Total amount: $${totalAmount}`);
  //         // console.log(`Discounted amount: $${discountedPrice}`);

  //         setSubtotal(discountedPrice.toFixed(2));
  //         let totalAmount1 = discountedPrice + service_fee;
  //         setTotal_amount(totalAmount1.toFixed(2));
  //       }
  //     })
  //     .catch(err => console.log('error : ', err));
  // };
  // const handleEditAddress = async () => {
  //   let shipping_address = await getShippingAddress();
  //   console.log('shipping_address  :  ', shipping_address?.location_id);
  //   if (shipping_address) {
  //     navigation.navigate('ShippingAddressList');
  //   } else {
  //     navigation?.navigate('ShippingAddress');
  //   }

  //   // setLoading(true);
  //   // let customer_Id = await AsyncStorage.getItem('customer_id');
  //   // getCustomerShippingAddress(customer_Id)
  //   //   .then(response => {
  //   //     let list = response?.result ? response?.result : [];
  //   //     if (list?.length == 0) {
  //   //       navigation?.navigate('ShippingAddress');
  //   //     } else {
  //   //       navigation.navigate('ShippingAddressList');
  //   //     }
  //   //   })
  //   //   .catch(error => {
  //   //     console.log('error : ', error);
  //   //   })
  //   //   .finally(() => {
  //   //     setLoading(false);
  //   //   });
  //   // navigation.navigate('ShippingAddressList');
  // };

  // const getCustomerData = async () => {
  //   setLoading(true);
  //   // let customer_Id = await AsyncStorage.getItem('customer_id');
  //   await getCustomerDetail(customer_id)
  //     .then(async response => {
  //       setPhoneNo(response?.phone_no);
  //       // setLocation(response?.location);
  //       // //also getting shipping address details
  //       // getCustomerShippingAddress(customer_Id).then(res => {
  //       //   if (res?.status == true) {
  //       //     let result = res?.result[0];
  //       //     setLocation_id(result?.location_id);
  //       //   }
  //       // });
  //       // let shipping_address = await getShippingAddress();
  //       // let delivery_charges1 = await getDeliveryCharges(
  //       //   shipping_address?.area,
  //       // );
  //       // let platform_fee1 = await getPlatformFee(shipping_address?.area);

  //       // setDelivery_charges(delivery_charges1);
  //       // setPlatform_fee(platform_fee1);
  //       // setService_fee(delivery_charges1 + platform_fee)
  //       // let location_id = shipping_address?.location_id;
  //       // setLocation_id(location_id);
  //       // setLocation(shipping_address?.address);
  //     })
  //     .catch(err => {
  //       console.log('err : ', err);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };


  // useEffect(() => {
  //   getCustomerData();
  // }, []);
  // const getSelectedCard = async () => {
  //   let card = await AsyncStorage.getItem('selected_card');
  //   if (card) {
  //     card = JSON.parse(card);
  //     // setSelected_card(card);
  //   }
  // };
  // const getSelectedCard = async () => {
  //   let card = await AsyncStorage.getItem('selected_card');
  //   if (card) {
  //     card = JSON.parse(card);
  //     // setSelected_card(card);
  //   }
  // };
  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     console.log('promocode : ', promoCode);
  //     // Send Axios request here
  //     handleVerifyPromoCode(promoCode);
  //   }, 200);

  //   return () => clearTimeout(delayDebounceFn);
  // }, [promoCode]);

  const dispatch = useDispatch();
  const { showPopUp, popUpColor, PopUpMesage, walletTotalAmount, join_as_guest, promos, Bill, customer_detail, Colors } = useSelector(store => store.store)
  const [topUpAmount, setTopUpAmount] = useState('');
  const {
    cart,
    cart_restaurant_id,
    selected_payment_type,
  } = useSelector(store => store.cart);
  const btmSheetRef = useRef()
  const WithDrawBtmSheet = useRef()
  const ref_RBSheet = useRef();
  const ref_RBSheetPhoneNo = useRef(null);
  const ref_RBSheetPaymentOption = useRef(null);
  const ref_RBSheetGuestUser = useRef(null);
  const ref_RBTopUpSheet = useRef(null);
  const [loading, setLoading] = useState(false);
  const [phoneNo, setPhoneNo] = useState();
  const [promoCode, setPromoCode] = useState('');
  const [newPhoneNO, setNewPhoneNO] = useState(customer_detail?.phone_no);
  const [countryCode, setCountryCode] = useState('+92');
  const [service_fee, setService_fee] = useState(0);
  const [inValidPromoCode, setInValidPromoCode] = useState(false);
  const [promoCodeDetail, setPromoCodeDetail] = useState(null);
  const [isPromocodeApplied, setIsPromocodeApplied] = useState(false);
  const [comments, setComments] = useState('');
  const [selected_card, setSelected_card] = useState('');
  const { customer_id, location } = useSelector(store => store.store);
  const [cartItemIds, setCartItemIds] = useState([])
  const location_id = location.id
  const [bill, setbill] = useState({})

  // console.log(selected_payment_type);


  const addPaymentToWallet = async amount => {
    await AddPaymentToCustomerWallet(amount, customer_id)
      .then(response => {
        console.log('AddPaymentToCustomerWallet : ', response);
        dispatch(setWalletTotalAmount(response?.result?.available_amount))
      })
      .catch(error => console.log(error));
  };
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const fetchPaymentSheetParams = async (total_amount) => {

    let customer_stripe_id = await GetCustomerStripeId(customer_id);
    console.log({ customer_stripe_id });

    try {
      const response = await fetch(`${BASE_URL}payment/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total_amount * 100,  // Amount in cents
          currency: 'usd',
          stripe_customer_id: customer_stripe_id
        }),
      });

      if (!response.ok) {
        console.error('Failed to fetch payment sheet parameters:', response.statusText);
        setLoading(false);
        handlePopup(dispatch, 'Something is went wrong', 'red');
        return null;
      }

      const responseData = await response.json();

      if (responseData.status === false) {
        console.error('Error in response:', responseData.message);
        setLoading(false);
        handlePopup(dispatch, 'Something is went wrong', 'red');
        return null;
      }
      const { paymentIntent, ephemeralKey, customer } = responseData;
      return {
        paymentIntent,
        ephemeralKey,
        customer,
      };
    } catch (error) {
      console.error('Error in getting Stripe params from wallet screen:', error);
      setLoading(false);
      handlePopup(dispatch, 'Something is went wrong', 'red');
      return null;
    }
  };

  const openPaymentSheetForTopUp = async () => {
    const { error } = await presentPaymentSheet();


    setLoading(false);
    if (error) {
      handlePopup(dispatch, 'Something went wrong', 'red')
      console.log(error);

      if (error.code == 'Canceled') {
      } else {
        handlePopup(dispatch, error.message, 'red')
      }
    } else {
      console.log('Success', 'Your order is confirmed!');
      addPaymentToWallet(topUpAmount)
    }
  };

  const initializePaymentSheetForTopUp = async () => {
    setLoading(true);
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams(topUpAmount);
    initStripe({
      publishableKey: STRIPE_PUBLISH_KEY,
    });

    console.log({ paymentIntent, ephemeralKey, customer });


    const { error } = await initPaymentSheet({
      appearance: {
        // shapes: {
        //   borderRadius: 12,
        //   borderWidth: 0.5,
        // },
        // primaryButton: {
        //   shapes: {
        //     borderRadius: 20,
        //   },
        // },
        // colors: {
        //   primary: Colors.primary_color,
        //   background: '#FFFFFF',
        //   componentBackground: '#FFFFFF',
        //   componentBorder: '#000000',
        //   componentDivider: '#000000',
        //   primaryText: Colors.primary_color,
        //   secondaryText: Colors.primary_color,
        //   componentText: Colors.primary_color,
        //   placeholderText: '#000000',
        // },
      },
      merchantDisplayName: 'Food Delivery',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
    });
    setLoading(false);
    if (!error) {
      openPaymentSheetForTopUp()
    }
  };

  const ItemSeparator = () => (
    <View
      style={{
        height: hp(0.1),
        marginVertical: 10,
        backgroundColor: Colors.borderGray,
      }}
    />
  );

  const makeOrderPayment = async order_id => {
    await MakeOrderPayment(order_id, customer_id)
      .then(response => {
        console.log({ response }, { order_id, customer_id }, 'make orderPayment');


        if (response.status === true) {
          handlePopup(dispatch, response.message, 'green')
          dispatch(setWalletTotalAmount(walletTotalAmount - Bill.total_amount))
        } else {
          handlePopup(dispatch, response.error, 'red')
        }
      })
      .catch(error => console.log('makeOrderPayment', error));
  };
  const placeOrder = async () => {
    if (!newPhoneNO) {
      ref_RBSheetPhoneNo?.current?.open()
    } else {

      if (!location_id) {
        showBtmSheet()
      } else if (!selected_payment_type) {
        ref_RBSheetPaymentOption?.current?.open();
      }

      else {
        setLoading(true);
        console.log('customer_Id  :  ', customer_id);
        let items = cart ? cart : [];
        items = items?.map(item => item.cart_item_id);
        let data = {
          customer_id: customer_id,
          cart_items_ids: items,
          description: 'Order creating',
          location_id: location_id,
          address: location.address,
          restaurant_id: cart_restaurant_id,
          phone_no: countryCode + newPhoneNO,
          promo_code: isPromocodeApplied ? promoCode : '',
          payment_option: selected_payment_type,
          customer_payment: selected_payment_type === 'card' ? parseInt(bill.total_amount, 10) : 0, // card -> total amount :  cash->0
          sub_total: parseInt(bill.subtotal, 10),
          comments: comments,
          Estimated_delivery_time: 45,

        };


        fetch(api.create_order, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
          .then(response => response.json())
          .then(async response => {
            console.log(data);

            console.log(response.result);

            if (response.error == false) {

              dispatch(setCartRestaurantId(null));
              dispatch(addToCart([]));
              dispatch(updateMyCartList([]));
              dispatch(setOrderComment(''));
              if (selected_payment_type == 'card') {
                makeOrderPayment(response?.result?.order_id,);
              }
              ref_RBSheet?.current?.open();

            } else {
              setTimeout(() => {
                handlePopup(dispatch, response.message, 'red');
              }, 200);
            }
          })
          .catch(err => {
            console.log('Error in create order :  ', err);
            handlePopup(dispatch, 'Something went wrong', 'red');
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };

  const extractCartItemIds = (itemsArray) => {
    return itemsArray.map(item => item.cart_item_id);
  };

  const calculateTotalAmount = () => {

    const cartItemIds = extractCartItemIds(cart)
    dispatch(setBill({ cartItemIds: cartItemIds }))

    try {
      let total = 0;
      for (const item of cart) {
        // console.log(item);

        // console.log('item?.itemData?.price :  ', item?.itemData?.variationData?.price);
        // let price = item?.itemData?.price ? parseInt(item?.itemData?.variationData?.price) : 0
        let price = parseInt(item?.itemData?.variationData?.price ? item?.itemData?.variationData?.price : item?.itemData?.price)
        let quantity = item?.quantity ? parseInt(item?.quantity) : 1;
        total = total + price * quantity;
        // console.log({price, quantity,});


        // console.log('total : ', total);
      }

      dispatch(setBill({ subtotal: total.toFixed(2) })
      )      // setSubtotal(total.toFixed(2));
      // let totalAmount = total + service_fee;
      // let totalAmount = total + delivery_charges + platform_fee;
      // console.log(totalAmount, 'total amount');

      // setTotal_amount(total.toFixed(2));
    } catch (error) {
      console.log('error in calculating total amount : ', error);
    }
  };

  useEffect(() => {
    setbill(Bill)
  }, [Bill]);

  useFocusEffect(
    React.useCallback(() => {
      calculateTotalAmount();
    }, []),
  );


  const verifyPromoCode = async (promoCodee) => {
    if (selected_payment_type.length === 0) {
      ref_RBSheetPaymentOption?.current?.open();
    } else {
      const checkPromoCode = promos.find(item => item.code === promoCode)

      if (checkPromoCode) {

        try {
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
            promo_code: promoCode, // optional
            payment_option: selected_payment_type,
            sub_total: subtotal.toFixed(2),
            location_id: location.id,
          };
          console.log('Promo code ', body);

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
                    delivery_charges: response?.result?.delivery_charges.toFixed(2),
                    gst_charges: response?.result?.gst_charges.toFixed(2),
                    total_amount: response?.result?.total_amount.toFixed(2),
                    discount_charges: response?.result?.discount.toFixed(2),
                  })
                );
                setInValidPromoCode(false);
                setIsPromocodeApplied(true)
              } else {
                setIsPromocodeApplied(false)
                calculatePreOrderdetails(false, false)
                handlePopup(dispatch, response.message, 'red')
                setInValidPromoCode(true);
                setIsPromocodeApplied(false)
              }
            })
            .catch(error => {
              console.log(error);

              handlePopup(dispatch, 'Something went wrong', 'red')
            });
        } catch (error) {
          console.log('Error in calculating subtotal or API request: ', error);
          handlePopup(dispatch, 'Something went wrong', 'red')
        }
        finally {
        }

      } else {
        handlePopup(dispatch, 'Invalid Promo Code', 'red')
        setInValidPromoCode(true);
        setIsPromocodeApplied(false)
        calculatePreOrderdetails(false, false);
        // dispatch(setSelectedPaymentType(''))

      }
    }
  }


  const showBtmSheet = () => {
    btmSheetRef?.current?.open()
  }
  const closeBtmSheet = () => {
    btmSheetRef?.current?.close()
  }


  const handlePaymentTypeChange = (type, string) => {
    dispatch(setSelectedPaymentType(type));
    dispatch(setSelectedPaymentString(string));
    ref_RBSheetPaymentOption?.current?.close();
    calculatePreOrderdetails(type)
  };



  const calculatePreOrderdetails = (paymentType, promoCod) => {
    if (!location_id) {
      showBtmSheet();
    } else {
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

        // Prepare request body
        const body = {
          customer_id: customer_id,
          cart_items_ids: cartItemIds,
          promo_code: promoCod ? promoCode : null, // optional
          payment_option: paymentType || selected_payment_type,
          sub_total: subtotal.toFixed(2),
          location_id: location.id,
        };

        console.log('calculate pre order', { body });

        // API call to calculate pre-order details
        fetch(api.calculatePreOrder, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
          .then(response => response.json())
          .then(response => {
            console.log({ response });
            console.log(api.calculatePreOrder);

            if (!response.error) {
              console.log({ response });

              dispatch(
                setBill({
                  delivery_charges: response?.result?.delivery_charges.toFixed(2),
                  gst_charges: response?.result?.gst_charges.toFixed(2),
                  total_amount: response?.result?.total_amount.toFixed(2),
                  discount_charges: response?.result?.discount.toFixed(2),
                })
              );
            }
          })
          .catch(error => {
            handlePopup(dispatch, 'Something went wrong', 'red')
          });
      } catch (error) {
        handlePopup(dispatch, 'Something went wrong', 'red')
      }
      finally {
      }
    }
  };


const styles = StyleSheet.create({
  heading: {
    color: Colors.primary_text,
    fontFamily: Fonts.Inter_SemiBold,
    fontSize: RFPercentage(2),
    marginTop: 10,
  },
  itemView: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.secondary_text}12`,
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
    resizeMode: 'contain',
  },
  subText: {
    color: Colors.secondary_text,
    fontFamily: Fonts.Inter_Regular,
    fontSize: RFPercentage(1.7),
  },
  subText1: {
    color: Colors.primary_text,
    fontFamily: Fonts.Inter_Regular,
    fontSize: RFPercentage(2),
    lineHeight: 30,
  },
  walletBalance: {
    color: Colors.primary_text,
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(2),
    lineHeight: 15,
    letterSpacing: wp(0.3)
  },
  title: {
    color: Colors.primary_text,
    fontSize: RFPercentage(2.3),
    fontFamily: Fonts.Inter_Bold,
  },
  paymentType: {
    color: Colors.primary_text,
    fontSize: RFPercentage(2.3),
    fontFamily: Fonts.PlusJakartaSans_Medium,
    marginLeft: wp(4),
    textAlign: 'center'
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
    color: Colors.primary_text,
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(1.9),
  },
  btmsheettext: {
    color: Colors.secondary_text,
    fontFamily: Fonts.PlusJakartaSans_Regular,
    marginLeft: wp(5),
    fontSize: RFPercentage(1.9),
  },
  wallet: {
    marginTop: hp(1.5),
    flexDirection: 'row'
  }
});


  return (
    <View style={{ flex: 1, backgroundColor: Colors.secondary_color }}>
      <Loader loading={loading} />
      {showPopUp && <PopUp color={popUpColor} message={PopUpMesage} />}

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <StackHeader title={'Checkout'} />
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={styles.heading}>Delivering To</Text>
          <View style={styles.itemView}>
            <View style={styles.imageContainer}>
              <Icons.Location height={20} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.subText}>{location_id ? location.address : "Select Location"}</Text>
              {
                location_id && <View style={{ flexDirection: 'row' }} >
                  <Text style={[styles.subText]}>Distance: </Text>
                  <Text style={[styles.subText]}>{location.distance}</Text>
                </View>
              }

            </View>
            <TouchableOpacity
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
                {newPhoneNO ? newPhoneNO : '0000 000000'}
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
        <View style={[styles.rowViewSB, { width: wp(80), alignSelf: 'center', alignItems: 'center', marginTop: 10, marginBottom: 10 }]} >
          <TextInput placeholder='Promo Code' placeholderTextColor={Colors.secondary_text} style={{ borderRadius: 10, backgroundColor: `${Colors.secondary_text}12`, width: wp(60), paddingLeft: wp(5), marginRight: wp(2), color: Colors.primary_text }} value={promoCode} onChangeText={text => setPromoCode(text)} />
          <CustomButton text={'Apply'} textStyle={{ color: Colors.button.primary_button_text, fontSize: RFPercentage(2) }} containerStyle={{ backgroundColor: Colors.button.primary_button, paddingHorizontal: wp(5), paddingVertical: hp(1.3), borderRadius: 10 }} onPress={() => verifyPromoCode(promoCode)} pressedRadius={10} isLoading={false} loaderColor={Colors.button.primary_button_text} />
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

        {inValidPromoCode && (
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
          containerStyle={{ borderRadius: 10 }}
          onChangeText={text => setComments(text)}
        />

        <View style={{ paddingHorizontal: 20 }}>
          {selected_payment_type?.length == 0 ? (
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
                  color: Colors.button.primary_button,
                  fontFamily: Fonts.Inter_SemiBold,
                  fontSize: RFPercentage(1.8),
                  textTransform: 'capitalize',
                }}>
                Select Payment Option
              </Text>
              <Ionicons
                name="chevron-forward"
                color={Colors.button.primary_button}
                size={18}
              />
            </TouchableOpacity>
          ) : selected_payment_type === 'card' ? (
            <View >
              <Text
                style={{
                  color: Colors.primary_color,
                  fontFamily: Fonts.PlusJakartaSans_Bold,
                  fontSize: RFPercentage(2.4),
                }}>
                Payment Method
              </Text>
              <View style={styles.rowViewSB} >
                <TouchableOpacity style={styles.wallet} onPress={() => {
                  if (join_as_guest) {
                    ref_RBSheetGuestUser?.current?.open();
                  } else {
                    ref_RBSheetPaymentOption?.current?.open();
                  }
                }}>
                  <Icons.WalletActive />
                  <Text style={styles.paymentType}>Wallet Payment</Text>
                </TouchableOpacity>
                <View>
                  <Text style={styles.subText1} >Total Balance</Text>
                  <Text style={[styles.walletBalance, { lineHeight: 15, textAlign: 'center' }]} >${walletTotalAmount}</Text>
                </View>




              </View>

            </View>

          ) : <View >
            <Text
              style={{
                color: Colors.primary_color,
                fontFamily: Fonts.PlusJakartaSans_Bold,
                fontSize: RFPercentage(2.4),
              }}>
              Payment Method
            </Text>
            <View style={styles.rowViewSB} >
              <TouchableOpacity style={styles.wallet} onPress={() => {
                if (join_as_guest) {
                  ref_RBSheetGuestUser?.current?.open();
                } else {
                  ref_RBSheetPaymentOption?.current?.open();
                }
              }}>
                <Text style={styles.paymentType}>Cash On Delivery</Text>
              </TouchableOpacity>


            </View>

          </View>

          }

        </View>
        <View style={{ marginBottom: 10, marginTop: wp(15), marginHorizontal: 20, backgroundColor: `${Colors.secondary_text}12`, paddingHorizontal: 15, borderRadius: 10, paddingBottom: 5 }}>
          <View style={styles.rowViewSB}>
            <Text style={styles.subText1}>Subtotal</Text>
            <Text style={styles.subText1}>£{Bill.subtotal}</Text>
          </View>
          <View style={styles.rowViewSB}>
            <Text style={styles.subText1}>Delivery Charges</Text>
            <Text style={styles.subText1}>£{Bill.delivery_charges}</Text>
          </View>
          <View style={styles.rowViewSB}>
            <Text style={styles.subText1}>GST Charges</Text>
            <Text style={styles.subText1}>£{Bill.gst_charges}</Text>
          </View>
          {isPromocodeApplied &&
            <View style={styles.rowViewSB}>
              <Text style={styles.subText1}>Discount</Text>
              <Text style={styles.subText1}>£{Bill.discount_charges}</Text>
            </View>
          }


          <ItemSeparator />
          <View style={styles.rowViewSB}>
            <Text style={styles.title}>Total</Text>
            <Text style={styles.title}>£{Bill.total_amount}</Text>
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
            onPress={() => {
              if (join_as_guest) {
                ref_RBSheetGuestUser?.current?.open();
              } else if (selected_payment_type == 'card') {
                if (walletTotalAmount < Bill.total_amount) {
                  WithDrawBtmSheet?.current?.open();
                  return
                } else placeOrder()
              } else {
                placeOrder();
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
                    color: Colors.primary_text,
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
                    color: Colors.primary_text,
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
                    // handleSendCode();
                  }}
                />
              </View>
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
                    handlePaymentTypeChange('cash', 'cash on Delivery')
                  }}
                  style={styles.rowView}>
                  <RadioButton
                    value="first"
                    uncheckedColor={Colors.button.primary_button}
                    color={Colors.button.primary_button}
                    status={
                      selected_payment_type === 'cash' ? 'checked' : 'unchecked'
                    }
                    onPress={() => {
                      handlePaymentTypeChange('cash', 'cash on Delivery')

                    }}
                  />
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
                    handlePaymentTypeChange('card', 'Wallet Payment')
                  }}
                  style={styles.rowView}>
                  <RadioButton
                    value="card"
                    uncheckedColor={Colors.button.primary_button}
                    color={Colors.button.primary_button}
                    status={
                      selected_payment_type === 'card' ? 'checked' : 'unchecked'
                    }
                    onPress={() => {
                      handlePaymentTypeChange('card', 'Wallet Payment')
                    }}
                  />
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
            ref_RBSheetGuestUser?.current?.close();
            navigation?.popToTop();
            navigation?.replace('SignIn');
            // navigation?.goBack();
          }}
          onSignUp={() => {
            ref_RBSheetGuestUser?.current?.close();
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
        <CRBSheetComponent
          height={310}
          refRBSheet={WithDrawBtmSheet}
          content={
            <View style={{ width: wp(90) }} >
              <View style={[styles.rowViewSB1, { alignItems: 'flex-end' }]}>
                <TouchableOpacity
                  onPress={() => WithDrawBtmSheet?.current?.close()}>
                  <Ionicons name={'close'} size={22} color={'#1E2022'} />
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: 'center' }} >
                <Icons.Alert height={80} />
                <Text style={{ marginTop: hp(3), fontSize: RFPercentage(2.4), color: Colors.primary_text, textAlign: 'center' }}>
                  You don't have enough amount in wallet</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: wp(80),
                  alignSelf: 'center'
                }}>
                <CButton
                  title={'Cancel'}
                  width={wp(36)}
                  height={hp(5.5)}
                  marginTop={hp(5)}
                  onPress={() => WithDrawBtmSheet?.current?.close()}
                  transparent={true}
                />
                <CButton
                  title={'Top-Up'}
                  width={wp(36)}
                  height={hp(5.5)}
                  marginTop={hp(5)}
                  onPress={() => {
                    WithDrawBtmSheet?.current?.close()
                    setTimeout(() => {
                      ref_RBTopUpSheet?.current?.open()
                    }, 200);

                  }}
                />
              </View>


            </View>
          }
        />
        <CRBSheetComponent
          refRBSheet={ref_RBTopUpSheet}
          height={hp(38)}
          content={
            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={{ paddingHorizontal: 20 }}>
                <View style={{ ...styles.rowViewSB, marginBottom: 20 }}>
                  <Text
                    style={{
                      color: Colors.primary_text,
                      fontFamily: Fonts.PlusJakartaSans_Bold,
                      fontSize: RFPercentage(2.5),
                    }}>
                    Top-up
                  </Text>
                </View>
                <View style={{ paddingHorizontal: 10 }}>
                  <Text
                    style={{
                      color: Colors.primary_color,
                      fontFamily: Fonts.PlusJakartaSans_Bold,
                      fontSize: RFPercentage(2.2),
                      marginBottom: 14,
                    }}>
                    Current Balance: $ {walletTotalAmount}
                  </Text>
                  <CInput
                    placeholder="Top-up Amount"
                    textAlignVertical="top"
                    keyboardType="numeric"
                    value={topUpAmount}
                    onChangeText={text => setTopUpAmount(text)}
                  />
                  <Text
                    style={{
                      color: Colors.secondary_text,
                      marginTop: -15,
                      fontSize: RFPercentage(1.5),
                      marginLeft: 14,
                    }}>
                    Enter an amount from $ 100-$1,000
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flex: 1,
                      paddingHorizontal: 10,
                      marginTop: 15,
                    }}>
                    <CButton
                      title="CANCEL"
                      transparent={true}
                      width={wp(35)}
                      height={hp(5.5)}
                      onPress={() => ref_RBTopUpSheet?.current?.close()}
                    />
                    <CButton
                      title="NEXT"
                      width={wp(35)}
                      height={hp(5.5)}
                      onPress={() => {
                        ref_RBTopUpSheet?.current?.close();
                        initializePaymentSheetForTopUp()


                        // navigation.navigate('CardInfo', {
                        //   type: 'top_up',
                        // });
                      }}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
          }
        />
      </ScrollView>
    </View>
  );
};

export default Checkout;

