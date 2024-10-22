import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../constants/api';

export const GetAllNotifications = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let customer_id = await AsyncStorage.getItem('customer_id');
      console.log({customer_id});
      fetch(api.get_all_notifications + customer_id)
        .then(response => response.json())
        .then(response => {
          if (response?.status == false) {
            resolve([]);
          } else {
            let list = response?.result ? response?.result : [];
            resolve(list?.reverse());
          }
        })
        .catch(err => {
          console.log('error : ', err);
          resolve([]);
        });
    } catch (error) {
      resolve([]);
    }
  });
};

export const Store_Rider_Notification = async (
  rider_id,
  notification_type,
  title,
  description,
  order_id,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = {
        rider_id: rider_id,
        notification_type: notification_type,
        title: title,
        description: description,
        order_id: order_id,
      };
      console.log('Store_Rider_Notification data : ', data);
      fetch(api.add_rider_notification, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(response => {
          console.log('Store_Rider_Notification  : ', response);
          if (response?.status == false) {
            resolve(false);
          } else {
            resolve(response);
          }
        })
        .catch(err => {
          console.log('error : ', err);
          resolve(false);
        });
    } catch (error) {
      resolve(false);
    }
  });
};

export const Store_Restaurant_Notification = async (
  restaurant_id,
  notification_type,
  title,
  description,
  order_id,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = {
        restaurant_id: restaurant_id,
        notification_type: notification_type,
        title: title,
        description: description,
        order_id: order_id,
      };
      console.log('data : ', data);
      fetch(api.add_restaurant_notification, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(response => {
          console.log('response res rating  : ', response);
          if (response?.status == false) {
            resolve(false);
          } else {
            resolve(response);
          }
        })
        .catch(err => {
          console.log('error Store_Restaurant_Notification : ', err);
          resolve(false);
        });
    } catch (error) {
      console.log('error Store_Restaurant_Notification  :  ', error);
      resolve(false);
    }
  });
};

export const Test1 = async (
  restaurant_id,
  notification_type,
  title,
  description,
  order_id,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = {
        restaurant_id: restaurant_id,
        notification_type: notification_type,
        title: title,
        description: description,
        order_id: order_id,
      };
      console.log('data : ', data);
      fetch(api.add_restaurant_notification, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(response => {
          console.log('response res rating  : ', response);
          if (response?.status == false) {
            resolve(false);
          } else {
            resolve(response);
          }
        })
        .catch(err => {
          console.log('error Store_Restaurant_Notification : ', err);
          resolve(false);
        });
    } catch (error) {
      console.log('error Store_Restaurant_Notification  :  ', error);
      resolve(false);
    }
  });
};

export const Test2 = async (
  restaurant_id,
  notification_type,
  title,
  description,
  order_id,
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = {
        restaurant_id: restaurant_id,
        notification_type: notification_type,
        title: title,
        description: description,
        order_id: order_id,
      };
      console.log('data : ', data);
      fetch(api.add_restaurant_notification, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(response => {
          console.log('response res rating  : ', response);
          if (response?.status == false) {
            resolve(false);
          } else {
            resolve(response);
          }
        })
        .catch(err => {
          console.log('error Store_Restaurant_Notification : ', err);
          resolve(false);
        });
    } catch (error) {
      console.log('error Store_Restaurant_Notification  :  ', error);
      resolve(false);
    }
  });
};
