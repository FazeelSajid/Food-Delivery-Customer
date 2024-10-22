import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../constants/api';

export const GetCustomerStripeId = async () => {
  return new Promise(async (resolve, reject) => {
    let customer_id = await AsyncStorage.getItem('customer_id');
    console.log('customer_id  :   ', customer_id);
    fetch(api.create_customer_stripe_card + customer_id)
      .then(response => response.json())
      .then(async response => {
        console.log('response GetCustomerStripeId: ', response);
        if (response?.status == true) {
          let customer_id = response?.result?.customer_Stripe_Id;
          resolve(customer_id);
        } else {
          resolve(false);
        }
      })
      .catch(err => {
        console.log('error :   ', err);
        resolve(false);
      });
  });
};

export const GetCustomerStripeCards = async () => {
  return new Promise(async (resolve, reject) => {
    let customer_stripe_id = await GetCustomerStripeId();
    console.log('customer_stripe_id  : ', customer_stripe_id);
    fetch(api.get_customer_stripe_cards + customer_stripe_id)
      .then(response => response.json())
      .then(async response => {
        console.log('response  :  ', response);
        if (response?.status == true) {
          let list = response?.result?.data;
          resolve(list);
        } else {
          resolve([]);
        }
      })
      .catch(err => {
        console.log('err GetCustomerStripeCards : ', err);
        resolve([]);
      });
  });
};

// http://192.168.18.100:3017/payment/getPaymentMethods?stripe_customer_id=cus_OnAnLVRTejiETL
