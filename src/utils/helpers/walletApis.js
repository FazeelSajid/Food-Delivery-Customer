import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../constants/api';

export const GetWalletAmount = async (customer_id) => {
  return new Promise(async (resolve, reject) => {
    // let customer_id = await AsyncStorage.getItem('customer_id');
    fetch(api.get_available_payment_of_customer + customer_id)
      .then(response => response.json())
      .then(response => {
        // console.log('wallet response: :',response);
        
        if (response?.status == false) {
          resolve(0);
        } else {
          resolve(response?.result?.available_amount);
        }
      })
      .catch(err => {
        console.log('error : ', err);
        resolve(0);
      });
  });
};

export const AddPaymentToCustomerWallet = amount => {
  return new Promise(async (resolve, reject) => {
    try {
      let customer_id = await AsyncStorage.getItem('customer_id');
      let data = {
        customer_id: customer_id,
        amount: amount,
      };
      fetch(api.add_payment_to_customer_wallet, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(async response => {
          resolve(response);
        })
        .catch(err => {
          console.log('Error in Login :  ', err);
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const MakeOrderPayment = order_id => {
  return new Promise(async (resolve, reject) => {
    try {
      let customer_id = await AsyncStorage.getItem('customer_id');
      let data = {
        customer_id: customer_id,
        order_id: order_id,
      };
      console.log(' MakeOrderPayment data  : ', data);
      fetch(api.make_order_payment_for_customer, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(async response => {
          resolve(response);
        })
        .catch(err => {
          console.log('Error in MakeOrderPayment :  ', err);
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const GetRefundedOrders = async () => {
  return new Promise(async (resolve, reject) => {
    let customer_id = await AsyncStorage.getItem('customer_id');
    fetch(api.get_refunded_orders_of_customer + customer_id)
      .then(response => response.json())
      .then(response => {
        if (response?.status == false) {
          resolve([]);
        } else {
          let list = response?.result ? response?.result : [];
          resolve(list);
        }
      })
      .catch(err => {
        console.log('error : ', err);
        resolve([]);
      });
  });
};
