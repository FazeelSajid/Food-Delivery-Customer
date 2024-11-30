import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  StatusBar,
  Dimensions,
  TurboModuleRegistry,
  Alert,
  Linking,
  RefreshControl,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Colors, Icons, Images, Fonts } from '../../../constants';
import StackHeader from '../../../components/Header/StackHeader';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import AllOrders from './AllOrders';
import RefundedOrders from './RefundedOrders';
import CButton from '../../../components/Buttons/CButton';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../constants/api';
import { fetchApis, handlePopup, showAlert, showAlertLongLength } from '../../../utils/helpers';
import Loader from '../../../components/Loader';
import {
  AddPaymentToCustomerWallet,
  GetWalletAmount,
} from '../../../utils/helpers/walletApis';
import { useDispatch, useSelector } from 'react-redux';
import { setAllOrders } from '../../../redux/OrderSlice';
import { useFocusEffect } from '@react-navigation/native';
import PaymentCard from '../../../components/Cards/PaymentCard';
import { BASE_URL, BASE_URL_IMAGE, STRIPE_PUBLISH_KEY } from '../../../utils/globalVariables';
import NoDataFound from '../../../components/NotFound/NoDataFound';
import FoodCardWithRating from '../../../components/Cards/FoodCardWithRating';
import CRBSheetComponent from '../../../components/BottomSheet/CRBSheetComponent';
import CInput from '../../../components/TextInput/CInput';
import {
  initStripe,
  useConfirmPayment,
  useStripe,
} from '@stripe/stripe-react-native';
import { GetCustomerStripeCards, GetCustomerStripeId } from '../../../utils/helpers/stripeCardApis';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ItemSeparator from '../../../components/Separator/ItemSeparator';
import { RadioButton } from 'react-native-paper';
import PopUp from '../../../components/Popup/PopUp';
import { setWalletTotalAmount } from '../../../redux/AuthSlice';
import WebView from 'react-native-webview';

const Wallet = ({ navigation, route }) => {
  const { customer_id, walletTotalAmount , customer_detail} = useSelector(store => store.store);
  const [accountLinkUrl, setAccountLinkUrl] = useState(null); 
  const [connectedAccountId, setConnectedAccountId] = useState()
  const [refreshing, setRefreshing] = useState(false)
  const ref_RBWithdrawSheet = useRef();
  const { showPopUp, popUpColor, PopUpMesage } = useSelector(store => store.store)
  // cus_OnAmBpSP6erYtF
  const ref_RBTopUpSheet = useRef();
  const orders = useSelector(store => store.order.all_orders);
  const dispatch = useDispatch();
  const [transactions, setTrasactions] = useState([])
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [cardList, setCardList] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [topUpAmount, setTopUpAmount] = useState();
  const [WithdrawAmount, setWithdrawAmount] = useState('');
  const btmSheetRef = useRef()
  const showBtmSheet = () => {
    btmSheetRef?.current?.open()
  }
  const closeBtmSheet = () => {
    btmSheetRef?.current?.close()
  }
  // console.log(customer_detail.user_name);



  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  // let confirmCardPayment = useConfirmPayment();

  // const totalWidth = Dimensions.get('screen').width;
  // const renderScene = SceneMap({
  //   first: AllOrders,
  //   second: RefundedOrders,
  // });

  // const layout = useWindowDimensions();
  // const [index, setIndex] = React.useState(0);
  // const [routes] = React.useState([
  //   { key: 'first', title: 'All Orders' },
  //   { key: 'second', title: 'Refunded Orders' },
  // ]);
  
  // const fetchPaymentDetail = async data => {
  //   try {
  //     let url = BASE_URL + 'payment/pay3';
  //     const response = await fetch(url, {
  //       method: 'POST',
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data),
  //     });
  //     let res = await response.json();
  //     console.log(res);
  //     const client_secret = res?.paymentIntent?.client_secret;
  //     console.log('client_secret : ', client_secret);
  //     return {
  //       client_secret,
  //     };
  //   } catch (error) {
  //     showAlert(error);
  //   }
  // };
  const fetchPaymentSheetParams = async () => {
    // console.log('fetchPaymentSheetParams called...');

    let customer_stripe_id = await GetCustomerStripeId(customer_id);
    console.log({ customer_stripe_id });


    try {
      const response = await fetch(`${BASE_URL}payment/pay`, {
        method: 'POST',
        headers: {

          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: topUpAmount * 100,  // Amount in cents
          currency: 'usd',
          stripe_customer_id: customer_stripe_id
        }),
      });

      // Check if the response is successful
      if (!response.ok) {
        console.error('Failed to fetch payment sheet parameters:', response.statusText);
        return null;
      }

      // Parse the response as JSON
      const responseData = await response.json();

      // Check if the API returned an error status in the response JSON
      if (responseData.status === false) {
        console.error('Error in response:', responseData.message);
        return null;
      }

      // Assuming the responseData contains the fields: paymentIntent, ephemeralKey, and customer
      const { paymentIntent, ephemeralKey, customer } = responseData;

      // console.log('Fetched Payment Params:', { paymentIntent, ephemeralKey, customer });

      return {
        paymentIntent,
        ephemeralKey,
        customer,
      };
    } catch (error) {
      console.error('Error in getting Stripe params from wallet screen:', error);
      return null;
    }
  };

  const createConnectedAccount = async () => {
      try {
          const response = await fetch(`${BASE_URL}payment/createConnectedAccount?customer_id=${customer_id}`, {
              method: "GET",
             
          });
          const result = await response.json();
  
          if (result.status) {
            
            
              return result.accountId // Return the connected account ID
          } else {
              throw new Error(result.message);
          }
      } catch (error) {
        handlePopup(dispatch, 'Error while creating connnected account', 'red' )
          
          console.error("Error creating connected account:", error);
          return null;
      }
  };
  
  const WithDrawPayment = async (AccId) => {
      try {
          const response = await fetch(`${BASE_URL}payment/transferPayment`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(
                {
                  amount: parseInt(WithdrawAmount),
                  currency:"usd",
                  stripe_account_id: AccId
              }
              )
          });
          const result = await response.json();
  
          if (result.status) {
              // Open the Stripe onboarding URL in the browser
              handlePopup(dispatch, "Withdrawal successfull", 'green' )
              dispatch(setWalletTotalAmount(parseInt(walletTotalAmount) - parseInt(WithdrawAmount)))
              setAccountLinkUrl(null)
          } else {
            handlePopup(dispatch, result.message, 'red' )
              // throw new Error(result.message);
             
          }
      } catch (error) {
         
          console.error("Error creating WithDraw:", error);
      }
  };
  const createAccountLink = async () => {
    try {
        const response = await fetch(`${BASE_URL}payment/createAccountLink?customer_id=${customer_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await response.json();

        if (result.status) {
            // Alert.alert("Redirecting", "Please complete your account setup.");
            // Open the Stripe onboarding URL in the browser
            setAccountLinkUrl(result.result.url)
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        // Alert.alert("Error", error.message || "Failed to create account link.");
        console.error("Error creating account link:", error);
    }
};

  const handleAccountSetup = async () => {
    // Step 1: Create a connected account
    const connectedAccountId = await createConnectedAccount(customer_id);
    console.log({connectedAccountId});
    

    if (connectedAccountId) {
        // Step 2: Create an account link for onboarding
        await createAccountLink()
    }
};

// Usage: Add a button in your component that triggers handleAccountSetup
// Pass the customer's ID as a parameter


  

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    setLoading(false);
    if (error) {
      console.log(error);
      
      // Alert.alert(`Error code: ${error.code}`, error.message);
      if (error.code == 'Canceled') {
        // user cancel payment
        // for now we do nothing...
      } else {
        showAlertLongLength(error.message);
      }
    } else {
      // handle success
      // console.log('Success', 'Your order is confirmed!');
      await AddPaymentToCustomerWallet(topUpAmount, customer_id)
          .then(response => {
            console.log('AddPaymentToCustomerWallet : ', response);
            handlePopup(dispatch, 'Payment added successfully', 'green' )
            dispatch(setWalletTotalAmount(response?.result?.available_amount))
            // setTimeout(() => {
            //   showAlertLongLength('Payment added successfully', 'green');
            // }, 300);
            // setTotalAmount(response?.result?.available_amount);

            setTopUpAmount('');
          })
          .catch(error => console.log(error))
          .finally(() => {
            setLoading(false);
          });
      // placeOrder();
    }
  };

  const initializePaymentSheet = async () => {
    setLoading(true);
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();
      console.log({ paymentIntent, ephemeralKey, customer }, 'initialize payment sheet params' );
        
      
    initStripe({
      publishableKey: STRIPE_PUBLISH_KEY,
    });

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
        colors: {
          // primary: Colors.Orange,
          // background: '#FFFFFF',
          // componentBackground: '#FFFFFF',
          // componentBorder: '#000000',
          // componentDivider: '#000000',
          // primaryText: Colors.Orange,
          // secondaryText: Colors.Orange,
          // componentText: Colors.Orange,
          placeholderText: Colors.White,
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
      console.log('openning.... payment sheet');
      openPaymentSheet();
    }
  };

  // const handleTopUp = async () => {
  //   console.log({ selectedPaymentMethod });
  //   if (topUpAmount?.length == 0) {
  //     showAlert('Please Enter Top-Up Amount');
  //   } else if (selectedPaymentMethod?.length == 0) {
  //     setTimeout(() => {
  //       showAlert('Please select payment method');
  //     }, 200);
  //   } else {
  //     setLoading(true);
  //     // do payment
  //     let data = {
  //       amount: topUpAmount * 100, // convert cents to dollars
  //       currency: 'usd',
  //       customer: selectedPaymentMethod?.customer,
  //       // payment_method: selectedPaymentMethod?.id,
  //     };
  //     console.log('data  :  ', data);
  //     const { client_secret } = await fetchPaymentDetail(data);
  //     console.log('client_secret here :   ', client_secret);
  //     initStripe({
  //       publishableKey:
  //         'pk_test_51Nx6pUA6RGl8ip1kgZziTjzFm5oZfO0mtqI1ceHH0wiB2WlM6diP8YlbQMABSFmr2zUkrWMn5wDvJoJMicmgbFjp00WMtlaTKo',
  //     });
  //     let clientSecret = client_secret;
  //     const { paymentIntent, error } = await confirmCardPayment.confirmPayment(
  //       clientSecret,
  //     );
  //     if (error) {
  //       setLoading(false);

  //       showAlertLongLength(
  //         error?.localizedMessage
  //           ? error?.localizedMessage
  //           : 'Something went wrong',
  //       );
  //     } else {
  //       //payment successfully done
  //       // now add payment to wallet
  //       // Alert.alert('Payment done successfully');
  //       await AddPaymentToCustomerWallet(topUpAmount, customer_id)
  //         .then(response => {
  //           console.log('AddPaymentToCustomerWallet : ', response);
  //           setTimeout(() => {
  //             showAlertLongLength('Payment added successfully', 'green');
  //           }, 300);
  //           // setTotalAmount(response?.result?.available_amount);
  //           // setTopUpAmount('');
  //         })
  //         .catch(error => console.log(error))
  //         .finally(() => {
  //           setLoading(false);
  //         });
  //     }
  //     console.log({ paymentIntent });
  //     console.log('error  _______________  : ', error);
  //   }
  // };

  // const getCustomerCards = async () => {
  //   // // let url = BASE_URL + 'payment/pay2';
  //   // let url =
  //   //   'http://192.168.18.100:3017/payment/getPaymentMethods?stripe_customer_id=cus_OnAnLVRTejiETL';
  //   // console.log('url  :   ', url);
  //   // fetch(
  //   //   url,
  //   //   //   , {
  //   //   //   method: 'POST',
  //   //   //   // body: JSON.stringify(data),
  //   //   //   headers: {
  //   //   //     'Content-type': 'application/json; charset=UTF-8',
  //   //   //   },
  //   //   // }
  //   // )
  //   //   .then(response => response.json())
  //   //   .then(response => {
  //   //     if (response?.status == true) {
  //   //       let list = response?.result?.data;
  //   //       setCardList(list);
  //   //     }
  //   //   })
  //   //   .catch(err => console.log('error in getting customer card: ', err));

  //   let list = await GetCustomerStripeCards(customer_id);
  //   // console.log('list    :  ', list);
  //   setCardList(list);

  // };

  
  const getData = async () => {
    setLoading(true);
    try {
      let amount = await GetWalletAmount(customer_id);
      dispatch(setWalletTotalAmount(amount));
  
      const response = await fetch(api.getCustomerTransactionHistory + customer_id);
      const data = await response.json();
  
      if (data.status === true) {
        let list = data?.transactions || [];
        setTrasactions(list);
        // console.log({list});
        
      } else {
        handlePopup(dispatch, data.message, 'red');
      }
    } catch (error) {
      handlePopup(dispatch, 'Something went wrong', 'red');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    // setLoading(true);
    // getData(); 
  }, []);
  // console.log(customer_id);

  const toggleSelection = async (param) => {

    // setSelectedPaymentMethod(param)



    if (param === 'stripe') {
      setSelectedPaymentMethod(param)
      // signUpWith === param ? dispatch(setSignUpWith('')) : dispatch(setSignUpWith(param))
      // navigation.navigate('SignUpWithstripe')
      initializePaymentSheet()
      setTimeout(() => {
        closeBtmSheet()
      }, 300);
    }
    if (param === 'paypal') {
      // signUpWith === 'paypal' ? dispatch(setSignUpWith('')) : dispatch(setSignUpWith(param))
      // navigation.navigate('SignUpWithEmail')
      setTimeout(() => {
        closeBtmSheet()
      }, 300);
      setSelectedPaymentMethod(param)

      const body = { 
        "items": [
            {
                "name": customer_detail?.user_name,
                "sku": "item",
                "price": topUpAmount,
                "currency": "USD",
                "quantity": 1
            }
        ],
        "amount": {
            "currency": "USD",
            "total": topUpAmount
        },
        "description": "This is the payment description.",
        "redirect_urls": {
            
            "return_url": "http://localhost:8082/success",
            "cancel_url": "http://localhost:8082/return"
        }
    }
    console.log(body);
    
      const CreatePayment = await  fetchApis(BASE_URL+'payment/createPayment', 'POST', setLoading,{"Content-Type": "application/json"},body ,dispatch )
      if (CreatePayment.status) {
        setAccountLinkUrl(CreatePayment.approval_url)
      // console.log(CreatePayment, 'asdas');
        
      }
      
      
    }
  }


  useFocusEffect(
    React.useCallback(() => {
      // getCustomerCards();
      getData(); 
    }, []),
  );




  const getQueryParams = (url) => {
    const queryParams = {};
    const queryString = url.split('?')[1];
    if (queryString) {
      queryString.split('&').forEach((param) => {
        const [key, value] = param.split('=');
        queryParams[key] = decodeURIComponent(value);
      });
    }
    return queryParams;
  };

 const handleNavigationStateChange = async (navState) => {
  console.log('Navigated URL:', navState.url);

  if (navState.url.includes('http://localhost:8082/success')) {
    // Call your withdrawal payment function
    // WithDrawPayment(connectedAccountId);
    setAccountLinkUrl(null);


    console.log('Success URL:', navState.url);

    // Parse the URL and extract parameters
    const queryParams = getQueryParams(navState.url);
    const paymentId = queryParams['paymentId'];
    const payerId = queryParams['PayerID'];

    const body = {
      "paymentId": paymentId,
      "payerId": payerId
  }
    const Deposit = await fetchApis(BASE_URL+'payment/capturePayment', 'POST', setLoading,{"Content-Type": "application/json"},body, dispatch  )
    // console.log({Deposit});
    if (Deposit.status) {
      await AddPaymentToCustomerWallet(topUpAmount, customer_id)
      .then(response => {
        // console.log('AddPaymentToCustomerWallet : ', response);
        handlePopup(dispatch, 'Payment added successfully', 'green' )
        dispatch(setWalletTotalAmount(response?.result?.available_amount))
       
        setTopUpAmount('');
      })
      .catch(error => console.log(error))
      .finally(() => {
        setLoading(false);
      });
    }
    

    // console.log('Payment ID:', paymentId);
    // console.log('Payer ID:', payerId);

    // Perform necessary state updates or actions
  }
   else if (navState.url.includes('http://localhost:8082/return')) {
    // Navigate to 'MyWallet' screen
    navigation.navigate('MyWallet');
    
    // Reset state and handle withdrawal
    setAccountLinkUrl(null);
    // WithDrawPayment(connectedAccountId); 
  }
};

  // console.log('somethisn');



  
  return (
    <View  style={{ flex: 1, backgroundColor: Colors.White }}>
      <Loader loading={loading} bgColor={'rgba(0, 0, 0, 0.5)'} />
      {
        accountLinkUrl ? <WebView
        source={{ uri: accountLinkUrl }}
        startInLoadingState={true}
        onLoadStart={() => setLoading(true)}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadEnd={() => setLoading(false)}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          // console.warn("WebView error: ", nativeEvent);
          // Alert.alert("Error", "Failed to load the onboarding page.");
        }}
        style={{ flex: 1 }}
      /> : <View style={{flex: 1}}>
         <ScrollView refreshControl={<RefreshControl  onRefresh={()=> getData()} colors={[Colors.Orange]} />} contentContainerStyle={{flexGrow: 1}} >
          <View style={styles.headerContainer}>

         
      {showPopUp && <PopUp color={popUpColor} message={PopUpMesage} />}
        <StackHeader
          title={'My Wallet'}
          titleColor={'white'}
          backIconColor={'white'}
          translucent={true}
          headerView={{ marginTop: StatusBar.currentHeight }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,

          }}>
          <View
            style={{
              paddingBottom: 20,
            }}>
            <Text
              style={{
                fontFamily: Fonts.Inter_SemiBold,
                color: Colors.White,
                fontSize: RFPercentage(4),
                lineHeight: 45,
              }}>
              $ {walletTotalAmount}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.PlusJakartaSans_Medium,
                color: Colors.White,
                fontSize: RFPercentage(1.5),
                opacity: 0.95,
              }}>
              Total Amount
            </Text>
          </View>
          <View>
          {/* <CButton
            title="Withdraw"
            bgColor="#FFF"
            width={90}
            height={35}
            marginTop={-1}
            textStyle={{ color: Colors.Orange, textTransform: 'none' }}
            // style={{backgroundColor: Colors.Orange, borderColor: Colors.White, borderWidth: 2}}
            onPress={() => ref_RBWithdrawSheet?.current?.open()}
          /> */}
          <CButton
            title="Top-up"
            bgColor="#FFF"
            width={90}
            height={35} 
            marginTop={6}
            textStyle={{ color: Colors.Orange, textTransform: 'none' }}
            onPress={() => ref_RBTopUpSheet?.current?.open()}
          />
          
            
          </View>
         
        </View>
        </View>
  
      

        {/* <View style={{ paddingVertical: 20,  flex: 1,}}> */}
          <Text style={styles.heading}>Recent Activities</Text>
          <View  style={styles.transactionsContianer}>
          <FlatList
            data={transactions}
            showsVerticalScrollIndicator={false}
           contentContainerStyle ={{flexGrow: 1}}
           style={{flex: 1}}
            // ListHeaderComponent={() => <View style={{height: 10}} />}
            ListFooterComponent={() => <View style={{height: 30}} />}
            ListEmptyComponent={() => !loading && <NoDataFound svgHeight={hp(15)} text={'No Transactions'} textStyle={{ fontSize: RFPercentage(2.5) }} />}            // contentContainerStyle={styles.transactionsContianer}
            renderItem={({item}) => {
              // console.log(1);
              
              // let cart_item =
              //   item?.cart_items_Data?.length > 0
              //     ? item?.cart_items_Data[0]
              //     : null;
              return (
                <View style={{marginBottom: wp(5), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} >
                  <View style={{}} >
                    <Text style={styles.transactionId}>{item.transaction_id}</Text>
                    <Text style={styles.transactionType}>{item.transaction_type === 'deposit' ? 'Deposit' : 'Sent'}</Text>
                  </View>
                  <Text style={[styles.transactionsAmount, item.transaction_type === 'deposit' && {color:'#19BA46' }]} >{item.transaction_type === 'deposit' ? '+' : '-'} ${item.amount}</Text>
                </View>
                // <FoodCardWithRating
                //   disabled={true}
                //   image={
                //     cart_item && cart_item?.itemData?.images?.length > 0
                //       ? BASE_URL_IMAGE + cart_item?.itemData?.images[0]
                //       : ''
                //   }
                //   title={
                //     cart_item
                //       ? cart_item?.item_type == 'deal'
                //         ? cart_item?.itemData?.name
                //         : cart_item?.itemData?.item_name
                //       : ''
                //   }
                //   // price={cart_item ? cart_item?.itemData?.price : ''}
                //   price={item?.total_amount}
                //   // showRatingOnBottom={true}
                //   showRating={false}
                //   showNextButton={false}
                //   cardStyle={{marginTop: 15}}
                //   imageContainerStyle={{
                //     height: 55,
                //     marginVertical: 1.5,
                //     flex: 0.3,
                //   }}
                // />
              );
            }}
          />
          </View>
         
        {/* </View>  */}
        </ScrollView>
      <CRBSheetComponent
        refRBSheet={ref_RBTopUpSheet}
        height={hp(38)}
        content={
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={{ paddingHorizontal: 20 }}>
              <View style={{ ...styles.rowViewSB, marginBottom: 20 }}>
                <Text
                  style={{
                    color: '#0A212B',
                    fontFamily: Fonts.PlusJakartaSans_Bold,
                    fontSize: RFPercentage(2.5),
                  }}>
                  Top-up
                </Text>
              </View>
              <View style={{ paddingHorizontal: 10 }}>
                <Text
                  style={{
                    color: Colors.Orange,
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
                    color: '#A2A2A2',
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
                      if (topUpAmount) {
                        ref_RBTopUpSheet?.current?.close();

                        setTimeout(() => {
                          showBtmSheet()
                        }, 300);
                      }
                   
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
      <CRBSheetComponent
            refRBSheet={ref_RBWithdrawSheet}
            height={hp(35)}
            content={
              <ScrollView keyboardShouldPersistTaps="handled">
                <View style={{paddingHorizontal: 20}}>
                  <View style={{...styles.rowViewSB, marginBottom: 20}}>
                    <Text
                      style={{
                        color: '#0A212B',
                        fontFamily: Fonts.PlusJakartaSans_Bold,
                        fontSize: RFPercentage(2.5),
                      }}>
                      Withdraw
                    </Text>
                  </View>
                  <View style={{paddingHorizontal: 10, marginTop: 15}}>
                    <CInput
                      placeholder="Enter Amount"
                      textAlignVertical="top"
                      keyboardType="numeric"
                      value={WithdrawAmount}
                      onChangeText={text => setWithdrawAmount(text)}
                    />

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flex: 1,
                        paddingHorizontal: 10,
                        marginTop: 10,
                      }}>
                      <CButton
                        title="CANCEL"
                        transparent={true}
                        width={wp(35)}
                        height={hp(5.5)}
                        onPress={() => ref_RBWithdrawSheet?.current?.close()}
                      />
                      <CButton
                        title="NEXT"
                        width={wp(35)}
                        height={hp(5.5)}
                        onPress={() => {
                          ref_RBWithdrawSheet?.current?.close();
                          handleAccountSetup()
                        }}
                      />
                    </View>
                  </View>
                </View>
              </ScrollView>
            }
          />
      <CRBSheetComponent
        height={200}
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

            <TouchableOpacity style={styles.rowView} onPress={() => toggleSelection('stripe')} >
              <RadioButton color={Colors.Orange} uncheckedColor={Colors.Orange} status={selectedPaymentMethod === 'stripe' ? 'checked' : 'unchecked'} onPress={() => toggleSelection('stripe')} />
              <Text
                style={{
                  color: '#56585B',
                  fontFamily: Fonts.PlusJakartaSans_Regular,
                  fontSize: RFPercentage(2),
                  marginLeft: wp(4)
                }}>
                Stripe
              </Text>

            </TouchableOpacity  >
            <ItemSeparator />
            <TouchableOpacity style={styles.rowView} onPress={() => toggleSelection('paypal')}>
              <RadioButton color={Colors.Orange} uncheckedColor={Colors.Orange} status={selectedPaymentMethod === 'paypal' ? 'checked' : 'unchecked'} onPress={() => toggleSelection('paypal')} />
              <Text
                style={{
                  color: '#56585B',
                  fontFamily: Fonts.PlusJakartaSans_Regular,
                  fontSize: RFPercentage(2),
                  marginLeft: wp(4)
                }}>
                Paypal
              </Text>

            </TouchableOpacity  >
          </View>
        }

      />
        
        </View>}
     
    </View>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  heading: {
    color: Colors.Orange,
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(2.3),
    marginHorizontal: 20,
    marginVertical : hp(2)
    // backgroundColor: 'green'
  },
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
    marginLeft: 15,
    flex: 1,
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  priceText: {
    color: Colors.Orange,
    fontFamily: Fonts.Inter_SemiBold,
    fontSize: RFPercentage(2.5),
  },
  // heading: {
  //   color: '#292323',
  //   fontFamily: Fonts.Inter_Medium,
  //   fontSize: RFPercentage(2),
  // },
  subText: {
    color: '#8D93A1',
    fontFamily: Fonts.PlusJakartaSans_Medium,
    fontSize: RFPercentage(2),
  },
  rbSheetHeading: {
    color: Colors.Text,
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(2),
  },
  rowViewSB1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionsContianer:{
    borderColor: Colors.borderGray,
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: wp(5),
    marginVertical: hp(0),
    flexGrow: 1,
    padding: hp(1),
    height: '10%'

  },
  transactionId:{
    color: Colors.Black,
    fontFamily: Fonts.PlusJakartaSans_SemiBold,
    fontSize: RFPercentage(1.7),
    marginLeft: 10,
  },
  transactionType:{
    color: Colors.darkTextColor,
    fontFamily: Fonts.PlusJakartaSans_Medium,
    fontSize: RFPercentage(1.7),
    marginLeft: 10,
  },
  transactionsAmount:{
    color: '#FF212E',
    fontFamily: Fonts.PlusJakartaSans_SemiBold,
    fontSize: RFPercentage(2),
    marginRight: 10,
  },
  headerContainer: { backgroundColor: Colors.Orange, height: hp(30) },

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
//   useWindowDimensions,
//   StatusBar,
//   Dimensions,
//   TurboModuleRegistry,
// } from 'react-native';
// import React, {useState, useEffect} from 'react';
// import {Colors, Icons, Images, Fonts} from '../../../constants';
// import StackHeader from '../../../components/Header/StackHeader';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import {RFPercentage} from 'react-native-responsive-fontsize';
// import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
// import AllOrders from './AllOrders';
// import RefundedOrders from './RefundedOrders';
// import CButton from '../../../components/Buttons/CButton';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import api from '../../../constants/api';
// import {showAlert} from '../../../utils/helpers';
// import Loader from '../../../components/Loader';
// import {GetWalletAmount} from '../../../utils/helpers/walletApis';
// import {useDispatch} from 'react-redux';
// import {setAllOrders} from '../../../redux/OrderSlice';
// import {useFocusEffect} from '@react-navigation/native';

// const Wallet = () => {
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(false);
//   const [totalAmount, setTotalAmount] = useState(0);

//   const totalWidth = Dimensions.get('screen').width;
//   const renderScene = SceneMap({
//     first: AllOrders,
//     second: RefundedOrders,
//   });

//   const layout = useWindowDimensions();
//   const [index, setIndex] = React.useState(0);
//   const [routes] = React.useState([
//     {key: 'first', title: 'All Orders'},
//     {key: 'second', title: 'Refunded Orders'},
//   ]);

//   const getData = async () => {
//     setLoading(true);
//     let amount = await GetWalletAmount();
//     setTotalAmount(amount);

//     // getting all orders list
//     let customer_id = await AsyncStorage.getItem('customer_id');
//     console.log({customer_id});

//     fetch(api.get_all_order_by_customer_Id + customer_id)
//       .then(response => response.json())
//       .then(response => {
//         let list = response?.result ? response?.result : [];
//         const filter = list?.filter(item => item?.cart_items_Data?.length > 0);
//         dispatch(setAllOrders(filter?.reverse()));
//       })
//       .catch(err => console.log('error : ', err))
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   // useEffect(() => {
//   //   getData();
//   // }, []);

//   useFocusEffect(
//     React.useCallback(() => {
//       getData();
//     }, []),
//   );

//   return (
//     <View style={{flex: 1, backgroundColor: Colors.White}}>
//       <Loader loading={loading} />
//       <View style={{backgroundColor: Colors.Orange, height: hp(27)}}>
//         <StackHeader
//           title={'My Wallet'}
//           titleColor={'white'}
//           backIconColor={'white'}
//           translucent={true}
//           headerView={{marginTop: StatusBar.currentHeight}}
//         />
//         <View
//           style={{
//             flex: 1,
//             alignItems: 'center',
//             justifyContent: 'flex-end',
//             paddingBottom: 20,
//           }}>
//           <Text
//             style={{
//               fontFamily: Fonts.Inter_SemiBold,
//               color: Colors.White,
//               fontSize: RFPercentage(4),
//               lineHeight: 45,
//             }}>
//             {/* $ 3,567 */}${totalAmount}
//           </Text>
//           <Text
//             style={{
//               fontFamily: Fonts.PlusJakartaSans_Medium,
//               color: Colors.White,
//               fontSize: RFPercentage(1.5),
//               opacity: 0.95,
//             }}>
//             Total Amount
//           </Text>
//         </View>
//       </View>

//       <View style={{flex: 1}}>
//         <TabView
//           navigationState={{index, routes}}
//           renderScene={renderScene}
//           onIndexChange={setIndex}
//           initialLayout={{width: layout.width}}
//           sceneContainerStyle={{backgroundColor: Colors.White}}
//           swipeEnabled={true}
//           pressColor="white"
//           renderTabBar={props => (
//             <TabBar
//               {...props}
//               style={{
//                 backgroundColor: Colors.White,
//                 // marginTop: -15,
//                 // paddingHorizontal: 20,
//                 elevation: 4,
//                 // backgroundColor: 'red',
//               }}
//               tabStyle={{
//                 alignItems: 'center',
//                 alignContent: 'center',
//                 // width: 120,
//                 // marginHorizontal: wp(5),
//                 // alignSelf: 'center',
//               }}
//               renderLabel={({route, focused, color}) => (
//                 <Text
//                   style={{
//                     color: focused ? Colors.Orange : '#4D4D5680',
//                     fontSize: hp(1.8),
//                     fontFamily: focused
//                       ? Fonts.PlusJakartaSans_Bold
//                       : Fonts.Inter_Regular,
//                     width: 120,
//                     textAlign: 'center',
//                   }}>
//                   {route.title}
//                 </Text>
//               )}
//               activeColor={'#fff'}
//               // indicatorStyle={{
//               //   padding: 1.5,
//               //   backgroundColor: Colors.Orange,
//               // }}
//               indicatorStyle={{
//                 padding: 1.5,
//                 backgroundColor: Colors.Orange,
//                 width: totalWidth / 2.7,
//                 left: totalWidth / 15.5,
//               }}
//             />
//           )}
//         />
//       </View>
//     </View>
//   );
// };

// export default Wallet;

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
//     width: 50,
//     height: 50,
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
//   priceText: {
//     color: Colors.Orange,
//     fontFamily: Fonts.Inter_SemiBold,
//     fontSize: RFPercentage(2.5),
//   },
//   heading: {
//     color: '#292323',
//     fontFamily: Fonts.Inter_Medium,
//     fontSize: RFPercentage(2),
//   },
//   subText: {
//     color: '#8D93A1',
//     fontFamily: Fonts.PlusJakartaSans_Medium,
//     fontSize: RFPercentage(2),
//   },
// });
