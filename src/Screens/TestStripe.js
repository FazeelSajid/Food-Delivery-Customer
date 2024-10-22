import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
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
import {BASE_URL} from '../utils/globalVariables';
import {showAlertLongLength} from '../utils/helpers';
import CButton from '../components/Buttons/CButton';
import {Colors} from '../constants';
import Loader from '../components/Loader';

const TestStripe = () => {
  let STRIPE_PUBLISH_KEY =
    'pk_test_51Nx6pUA6RGl8ip1kgZziTjzFm5oZfO0mtqI1ceHH0wiB2WlM6diP8YlbQMABSFmr2zUkrWMn5wDvJoJMicmgbFjp00WMtlaTKo';
  const [cardDetails, setCardDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  let confirmCardPayment = useConfirmPayment();

  const fetchPaymentSheetParams = async () => {
    console.log('fetchPaymentSheetParams called...');
    const response = await fetch(`http://192.168.1.37:3017/payment/pay1`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 1 * 100,
        currency: 'usd',
      }),
    });
    let res = await response.json();
    console.log(res);
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

  // "customer": "cus_OkbCHg5AVj7N9N",
  //  "ephemeralKey": "ek_test_YWNjdF8xTWwzd0pHdWk0NGx3ZGI0LFJzQmFqMTRBZW96VTFrbm5wQzQxOURscEFUZlRKSUM_00X8CLfaXl",
  //  "paymentIntent": "seti_1Nx5zxGui44lwdb4N3NGxLI1_secret_OkbC7GEmprBkLn6hOWKhVBjjihqX7pw"}

  const handleRecoveryFlow = async () => {
    try {
      // console.log('confirmCardPayment  : ', confirmCardPayment);
      // return;
      initStripe({
        publishableKey: STRIPE_PUBLISH_KEY,
      });
      let clientSecret =
        'pi_3NzXsCA6RGl8ip1k0oiSc4hA_secret_rr973uaPobkDwq6V5YQDsu3Zl';
      const {paymentIntent, error} = await confirmCardPayment.confirmPayment(
        clientSecret,
      );
      console.log({paymentIntent});
      console.log('error  _______________  : ', error);
      return;

      // let clientSecret =
      //   'pi_3NyzxuA6RGl8ip1k1SC8LQ5Q_secret_EmsaIVAkmiJJB9bLgSbn5rI6K';
      // const {paymentIntent, error} = await retrievePaymentIntent(clientSecret);
      // console.log({paymentIntent});
      // console.log('error  _______________  : ', error);
      // if (error) {
      //   Alert.alert(`Error: ${error.code}`, error.message);
      // } else if (paymentIntent) {
      //   // Default to a generic error message
      //   let failureReason = 'Payment failed, try again.';
      //   if (paymentIntent.lastPaymentError.type === 'Card') {
      //     failureReason = paymentIntent.lastPaymentError.message;
      //   }

      //   // If the last payment error is authentication_required, let the customer
      //   // complete the payment without asking them to reenter their details.
      //   if (
      //     paymentIntent.lastPaymentError?.code === 'authentication_required'
      //   ) {
      //     // Let the customer complete the payment with the existing PaymentMethod
      //     const {error} = await confirmPayment(paymentIntent.clientSecret, {
      //       paymentMethodType: 'Card',
      //       paymentMethodData: {
      //         billingDetails,
      //         paymentMethodId: paymentIntent.lastPaymentError?.paymentMethod.id,
      //       },
      //     });

      //     if (error) {
      //       // handle error
      //     }
      //   } else {
      //     // Collect a new PaymentMethod from the customer
      //   }
      // }
    } catch (error) {
      console.log('Error  : ', error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Loader loading={loading} />

      {/* <CardField
        postalCodeEnabled={true}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#FFFF00',
          textColor: '#000000',
        }}
        style={{
          width: '90%',
          height: 50,
          marginVertical: 30,
        }}
        onCardChange={cardDetails => {
          console.log('cardDetails', cardDetails);
        }}
        onFocus={focusedField => {
          console.log('focusField', focusedField);
        }}
      /> */}

      {/* <CardForm style={{height: 170, width: '90%'}} /> */}
      <CButton title="Pay Now" onPress={() => handlePay()} />
      <CButton title="Recover" onPress={() => handleRecoveryFlow()} />
    </View>
  );
};

export default TestStripe;

const styles = StyleSheet.create({});
