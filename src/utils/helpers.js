// helpers.js

import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import Snackbar from 'react-native-snackbar';
import api from '../constants/api';
import moment from 'moment';
import { BASE_URL } from './globalVariables';
showAlert

export const chooseImageFromCamera = async () => {
  return new Promise(async (resolve, reject) => {
    var options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.5,
    };

    await launchCamera(options)
      .then(async res => {
        console.log('response :  ', res);

        if (res.didCancel) {
          console.log('User cancelled image picker');
          resolve(false);
        } else if (res.error) {
          console.log('ImagePicker Error: ', res.error);
          resolve(false);
        } else if (res.customButton) {
          console.log('User tapped custom button: ', res.customButton);
          resolve(false);
        } else {
          let image = {
            path: res.assets[0].uri,
            mime: res.assets[0].type,
            name: res.assets[0].fileName,
          };
          resolve(image);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

//
export const chooseVideoFromCamera = async () => {
  return new Promise(async (resolve, reject) => {
    var options = {
      storageOptions: {
        skipBackup: true,
        // path: "images",
      },
      mediaType: 'video',
      videoQuality: 'low',
      maxWidth: 300,
      maxHeight: 300,
      quality: 0.5,
    };

    await launchCamera(options)
      .then(async res => {
        console.log('response :  ', res);

        if (res.didCancel) {
          console.log('User cancelled image picker');
          resolve(false);
        } else if (res.error) {
          console.log('ImagePicker Error: ', res.error);
          resolve(false);
        } else if (res.customButton) {
          console.log('User tapped custom button: ', res.customButton);
          resolve(false);
        } else {
          let image = {
            path: res.assets[0].uri,
            mime: res.assets[0].type,
            name: res.assets[0].fileName,
          };
          resolve(image);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

// -------------------------------------- Firebase Notification

export const getUserFcmToken = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const authStatus = await messaging().requestPermission();
      console.log(authStatus, 'authStatus');

      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      console.log(enabled, 'enabled');

      if (enabled) {
        const fcmToken = await messaging().getToken();
        console.log(fcmToken, 'token');

        if (fcmToken) {
          resolve(fcmToken);
        } else {
          console.log('FCM Token is empty');
          resolve('');
        }
      } else {
        console.log('Permission not granted');
        resolve('');
      }
    } catch (error) {
      console.error('Error fetching FCM Token:', error);
      reject(error); // Add reject in case of an error
    }
  });
};


///
export const showAlert = (message, bgColor, numberOfLines) => {
  Snackbar.show({
    text: message,
    duration: Snackbar.LENGTH_SHORT,
    backgroundColor: bgColor ? bgColor : 'red',
    numberOfLines: numberOfLines ? numberOfLines : 2,
    // marginBottom:20,
  });
};

export const showAlertLongLength = (message, bgColor, numberOfLines) => {
  Snackbar.show({
    text: message,
    duration: Snackbar.LENGTH_LONG,
    backgroundColor: bgColor ? bgColor : 'red',
    numberOfLines: numberOfLines ? numberOfLines : 2,
    // marginBottom:20,
  });
};

export const uploadImage = image => {
  return new Promise(async (resolve, reject) => {
    var headers = {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    };

    const formData = new FormData();
    // let profile_Obj = {
    //   uri: image,
    //   name: imageName,
    //   type: imageType,
    // };
    formData.append('file_type', 'image');
    formData.append('image', image);
    await fetch(api.upload_image, {
      method: 'POST',
      headers: headers,
      body: formData,
    })
      .then(response => response.json())
      .then(async response => {
        if (response?.status == true) {
          resolve(response?.image_url);
        } else {
          resolve(false);
        }
      })
      .catch(error => {
        console.log('error uploadImage : ', error);
        resolve(false);
      });
  });
};

export const getRestaurantDetail = id => {
  // return new Promise((resolve, reject) => {
    console.log(api.get_restaurant_detail + id);
    
    try {
      fetch(api.get_restaurant_detail + id)
        .then(response => response.json())
        .then(response => {
          // resolve(response?.result);
          return response?.result
        })
        .catch(err => {
          console.log('error : ', err);
          return ''
        });
    } catch (error) {
      // resolve('');
    }
  // });
};

export const getCustomerDetail = id => {
  return new Promise((resolve, reject) => {
    try {
      fetch(api.get_customer_by_id + id)
        .then(response => response.json())
        .then(response => {
          resolve(response?.result);
          // console.log(response, 'customer');
          
        })
        .catch(err => {
          console.log('error : ', err);
          resolve('');
        });
    } catch (error) {
      resolve('');
    }
  });
};

export const getAllRestaurants = () => {
  return new Promise((resolve, reject) => {
    try {
      fetch(api.get_all_restaurants)
        .then(response => response.json())
        .then(response => {
          resolve(response?.result);
        })
        .catch(err => {
          console.log('error : ', err);
          resolve('');
        });
    } catch (error) {
      resolve('');
    }
  });
};

export const checkRestaurantTimings = id => {
  return new Promise(async (resolve, reject) => {
    try {
      // let restaurant_details = await getRestaurantDetail(id);
      // resolve(restaurant_details);

      fetch(api.get_restaurant_detail + id)
        .then(response => response.json())
        .then(response => {
          let list = response?.result?.restaurant_timing
            ? response?.result?.restaurant_timing
            : [];
          let restaurant_details = response?.result;
          var days = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
          ];
          var currentDate = new Date();
          var today_dayName = days[currentDate.getDay()];

          // calculating restaurant is currently open or closed
          // Get the current date and time

          const currentTime = currentDate.getTime();

          // Check if the restaurant has hours for the current day
          // const { open, close } = restaurant.hours[currentDayOfWeek];
          const newTime = moment(new Date()).subtract(60, 'minutes');

          console.log('newTime  : ', newTime);
          const filter = list?.filter(
            item => item?.week_day == today_dayName?.toLocaleLowerCase(),
          );
          if (filter?.length > 0) {
            if (
              filter?.filter[0]?.time_from == 'closed' ||
              filter?.filter[0]?.time_from == 'closed'
            ) {
              //restaurant  is closed for this day
              let obj = {
                isClosed: true,
                closed_till: null,
                today_opening_time: 'closed',
                today_closing_time: 'closed',
                time_list: list,
                restaurant_details: restaurant_details,
              };
              resolve(obj);
            }
            let open = new Date(filter[0]?.time_from);
            let close = new Date(filter[0]?.time_till);

            console.log('openTime ----- : ', moment(open).format('HH:MM A'));
            console.log('closeTime ---- : ', moment(close).format('HH:MM A'));
            // Parse the restaurant's opening and closing times into Date objects
            const restaurantOpenTime = new Date(open).getTime();
            const restaurantCloseTime = new Date(close).getTime();

            console.log({currentTime, restaurantOpenTime, restaurantCloseTime});

            let status =
              currentTime >= restaurantOpenTime &&
              currentTime <= restaurantCloseTime;
            console.log({status});
            let obj = {
              isClosed: !status,
              closed_till: moment(close).format('h:mm a'),
              today_opening_time: filter[0]?.time_from,
              today_closing_time: filter[0]?.time_till,
              time_list: list,
              restaurant_details: restaurant_details,
            };
            resolve(obj);
          } else {
            console.log('restaurants timings not found for today');
            let obj = {
              isClosed: true,
              closed_till: null,
              today_opening_time: null,
              today_closing_time: null,
              time_list: list,
              restaurant_details: restaurant_details,
            };

            resolve(obj);
          }
        })
        .catch(err => {
          console.log('error 251 : ', err);
          resolve('');
        });
    } catch (error) {
      resolve('');
    }
  });
};

// get customer shipping address
export const getCustomerShippingAddress = id => {
  return new Promise((resolve, reject) => {
    try {
      fetch(api.get_customer_location + id)
        .then(response => response.json())
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          console.log('error : ', err);
          resolve('');
        });
    } catch (error) {
      resolve('');
    }
  });
};

export const getLocationById = id => {
  return new Promise((resolve, reject) => {
    try {
      let url = api.get_location_by_id + id;
      console.log('url   :   ', url);
      fetch(url)
        .then(response => response.json())
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          console.log('error : ', err);
          resolve('');
        });
    } catch (error) {
      resolve('');
    }
  });
};



export const fetchApis = async (endPoint,method,setLoading, header, payload,  ) => {
  // const request = `${BASE_URL}${endPoint}`;
  setLoading(true)


  // console.log('Fetching apis...', endPoint, method);
  




  try {
    const response = await fetch(endPoint, {
      method: method,
      headers: header,
      body: payload  // Convert payload to JSON string
    });
    // console.log('Fetched apis...', response);
    // Check if the response is OK (status code 200 or 201)
    if (response.status === 200) {
      
      // Successfully processed request
      const jsonResponse = await response.json();
      setLoading(false)

      // console.log(jsonResponse.Response.apiResponse, 'jsonResponse');

      return jsonResponse;
    } else if (response.status === 400) {
      const errorData = await response.json();
      setLoading(false)
      showAlert(`Bad Request: ${errorData.message || 'Invalid data sent.'}`);
      console.log( errorData.message);
      
      
    } else if (response.status === 401) {
      // Unauthorized - invalid or missing token
      setLoading(false)
      showAlert( 'Unauthorized: Invalid or missing token.');
      console.log('fetchapi func, Unauthorized: Invalid or missing token');
      
      throw new Error('Unauthorized: Invalid or missing token.');
    } else if (response.status === 403) {
      showAlert('Forbidden: You do not have permission to perform this action.');
      console.log('fetchapi func, Forbidden: You do not have permission to perform this action.' )
      setLoading(false)
      
      // Forbidden - you do not have permission
      // throw new Error('Forbidden: You do not have permission to perform this action.');
    } else if (response.status === 404) {
      console.log(endPoint);
      
      showAlert( 'Not Found: The requested resource was not found.');
      setLoading(false)
      console.log('fetchapi func, Not Found: The requested resource was not found.');
      console.log(response.payload);
      
      
      // Not Found - invalid URL
      // throw new Error('Not Found: The requested resource was not found.');
    } else if (response.status === 500) {
      showAlert( 'Server Error: An error occurred on the server.');
      setLoading(false)
      console.log('Server Error: An error occurred on the server.');
      
      // Internal Server Error - server-side error
      // throw new Error('Server Error: An error occurred on the server.');
    } else {
      showAlert( `Unexpected error: ${response.statusText}`);
      setLoading(false)
      // Handle other status codes
      // throw new Error(`Unexpected error: ${response.statusText}`);
      console.log(`Unexpected error: ${response.statusText}`);
      
    }
    setLoading(false)


    // setTimeout(() => {
    //   showAlert({
    //     isLoading: false,
    //     errorPop: false,
    //     errorPopMsg: ``
    //   });
    // }, 1000);z

  } catch (error) {
    console.log(error instanceof TypeError);

    if (error instanceof TypeError  && error.TypeError === 'Network request failed') {
    console.log(error, 'error');

      showAlert( `Please check your internet connection.`);
      setLoading(false)

      // setTimeout(() => {
      //   showAlert({
      //     isLoading: false,
      //     errorPop: false,
      //     errorPopMsg: ``
      //   });
      // }, 1000);
      return
    }


  }

};