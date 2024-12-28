import {StyleSheet, Text, View, ScrollView, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts} from '../../../constants';
import StackHeader from '../../../components/Header/StackHeader';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {WebView} from 'react-native-webview';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CButton from '../../../components/Buttons/CButton';

import {
  CardForm,
  CardField,
  StripeProvider,
  presentPaymentSheet,
  retrievePaymentIntent,
  useStripe,
  initStripe,
  confirmPayment,
  useConfirmPayment,
} from '@stripe/stripe-react-native';

import {showAlertLongLength} from '../../../utils/helpers';
import Loader from '../../../components/Loader';
import {GetCustomerStripeId} from '../../../utils/helpers/stripeCardApis';
import api from '../../../constants/api';

const SetupCard = ({navigation, route}) => {
  let STRIPE_PUBLISH_KEY =
    'pk_test_51Nx6pUA6RGl8ip1kgZziTjzFm5oZfO0mtqI1ceHH0wiB2WlM6diP8YlbQMABSFmr2zUkrWMn5wDvJoJMicmgbFjp00WMtlaTKo';
  const [cardDetails, setCardDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  let confirmCardPayment = useConfirmPayment();

  const fetchPaymentSheetParams = async () => {
    console.log('fetchPaymentSheetParams called...');
    let customer_stripe_id = await GetCustomerStripeId();
    console.log('customer_stripe_id  :  ', customer_stripe_id);
    const response = await fetch(api.setup_stripe_card + customer_stripe_id);
    let res = await response.json();
    console.log('fetchPaymentSheetParams', res);
    const {paymentIntent, ephemeralKey, customer} = res;

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    setLoading(true);
    const {paymentIntent, ephemeralKey, customer, publishableKey} =
      await fetchPaymentSheetParams();
    console.log({paymentIntent, ephemeralKey, customer});
    initStripe({
      publishableKey: STRIPE_PUBLISH_KEY,
    });

    const {error} = await initPaymentSheet({
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
          primary: Colors.primary_color,
          background: '#FFFFFF',
          componentBackground: '#FFFFFF',
          componentBorder: '#000000',
          componentDivider: '#000000',
          primaryText: '#232323',
          secondaryText: Colors.primary_color,
          componentText: Colors.primary_color,
          placeholderText: '#000000',
        },
      },

      merchantDisplayName: 'Food Delivery',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      // paymentIntentClientSecret: paymentIntent,
      setupIntentClientSecret: paymentIntent,
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
    const {error} = await presentPaymentSheet();
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
      navigation?.goBack();
    }
  };

  const handlePay = async () => {
    initializePaymentSheet();
    return;

    const {error} = await presentPaymentSheet({
      clientSecret:
        'pi_3Nx3R3Gui44lwdb41eTD9oAU_secret_QxBdYfXAXA2eUAuWJtcF57SNL',
    });

    console.log('paymentIntent  : ', paymentIntent);
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
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1, backgroundColor: Colors.White}}>
      <Loader loading={loading} />
      <StackHeader title={'Add card'} headerStyle={{paddingBottom: 10}} />
    </ScrollView>
  );
};

export default SetupCard;

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    paddingHorizontal: 25,
    marginTop: -10,
    paddingBottom: 20,
  },
  text: {
    color: Colors.secondary_text,
    fontFamily: Fonts.PlusJakartaSans_Regular,
    fontSize: RFPercentage(2),
    lineHeight: 25,
  },
});
