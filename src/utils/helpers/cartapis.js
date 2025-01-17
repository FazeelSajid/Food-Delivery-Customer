import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../constants/api';
import { handlePopup } from '../helpers';
import { setCustomerCartId } from '../../redux/AuthSlice';

export const getCustomerCart = (id, dispatch) => {
  return new Promise((resolve, reject) => {
    // console.log(api.get_customer_cart + id);

    // console.log(typeof(id));
    // console.log(id);
    
    
    
    try {
      fetch(api.get_customer_cart + id)
        .then(response => response.json())
        .then(response => {
          // console.log(response);
          
          resolve(response?.customer);
          dispatch(setCustomerCartId(response?.customer?.cart_id))
        })
        .catch(err => {
          handlePopup(dispatch, 'Something is went wrong', 'red')
          resolve('');
        });
    } catch (error) {
      resolve('');
    }
  });
};

export const addItemToCart = (data, dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      fetch(api.add_item_to_cart, {
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
      handlePopup(dispatch, 'Something is went wrong', 'red')

    }
  });
};

export const removeItemFromCart = (cart_id, item_id, dispatch) => {
  // console.log({cart_id, item_id});
  return new Promise((resolve, reject) => {
    try {
      fetch(
        api.remove_item_from_cart + `?cart_id=${cart_id}&cart_item_id=${item_id}`,
        {
          method: 'DELETE',
          // body: JSON.stringify(data),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        },
      )
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
      handlePopup(dispatch, 'Something is went wrong', 'red')

    }
  });
};

export const updateCartItemQuantity = (data, dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      fetch(api.update_cart_item_quantity, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(async response => {
          resolve(response);
          console.log(response);
          
        })
        .catch(err => {
          console.log('Error in updateCartItemQuantiy :  ', err);
          reject(err);
        });
    } catch (error) {
      reject(error);
      handlePopup(dispatch, 'Something is went wrong', 'red')

    }
  });
};
export const removeCartItemQuantity = (data, dispatch) => {

  // console.log({data}, api.remove_item_from_cart + `?cart_id=${data.cart_id}&cart_item_id=${data.item_id}`);
  

  return new Promise((resolve, reject) => {
    try {
      fetch( api.remove_item_from_cart + `?cart_id=${data.cart_id}&cart_item_id=${data.item_id}`,
        {
          method: 'DELETE',
          // body: JSON.stringify(data),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        },)
        .then(response => response.json())
        .then(async response => {
          resolve(response);
          console.log(response);
          
        })
        .catch(err => {
          console.log('Error in updateCartItemQuantiy :  ', err);
          reject(err);
        });
    } catch (error) {
      reject(error);
      handlePopup(dispatch, 'Something is went wrong', 'red')

    }
  });
};

export const getCartItems = (cart_id, dispatch) => {
  return new Promise((resolve, reject) => {
    try {
      fetch(api.get_cart_items + cart_id)
        .then(response => response.json())
        .then(response => {
          console.log({response});
          
          if (response?.status == false) {
            resolve([]);
          } else {
            resolve(response?.result);
          }
        })
        .catch(err => {
          console.log('error : ', err);
          resolve([]);
        });
    } catch (error) {
      resolve([]);
      handlePopup(dispatch, 'Something is went wrong', 'red')

    }
  });
};

export const clearCartItems = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let customer_id = await AsyncStorage.getItem('customer_id');
      let cart = await getCustomerCart(customer_id);

      fetch(api.get_cart_items + cart?.cart_id)
        .then(response => response.json())
        .then(async response => {
          if (response?.status == true) {
            for (const item of response?.result) {
              let cart_id = item?.cart_id;
              let item_id = item?.item_id;
              await removeItemFromCart(cart_id, item_id);
            }
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(err => {
          console.log('error : ', err);
          resolve(false);
        });
    } catch (error) {
      resolve(false);
      handlePopup(dispatch, 'Something is went wrong', 'red')

    }
  });
};

export const getEstimatedTime = () => {
  return new Promise((resolve, reject) => {
    try {
      const apiKey = 'AIzaSyBGvjugu0JYiETwUrX1xLhsvTECFeI4pf0';
      const origin = 'Rawalpindi';
      const destination = 'Lahore';
      fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`,
      )
        .then(response => response.json())
        .then(response => {
          resolve(response?.result);
        })
        .catch(err => {
          console.log('error : ', err);
          resolve([]);
        });
    } catch (error) {
      resolve([]);
      handlePopup(dispatch, 'Something is went wrong', 'red')

    }
  });
};
