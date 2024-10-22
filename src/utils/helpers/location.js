import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import {googleMapKey} from '../globalVariables';
import api from '../../constants/api';

const removePlusCode = (address) => {
  
  
  const addressParts = address.split(',');
  
  // Check if the first part looks like a plus code (e.g., "M32J+RM")
  const firstPart = addressParts[0].trim();
  
  const plusCodePattern = /^[A-Z0-9]+\+[A-Z0-9]+$/;
  
  // If the first part matches the plus code pattern, remove it
  if (plusCodePattern.test(firstPart)) {
    addressParts.shift();  // Remove the first part
  }

  // Join the remaining parts back into a single address string
  return addressParts.join(',').trim();
};
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    try {
      Geolocation.getCurrentPosition(info => {
        let latitude = info.coords.latitude;
        let longitude = info.coords.longitude;
        // console.log(longitude, latitude, 'long lati');
        
        //getting address
        // Initialize the module (needs to be done only once)
        if (Geocoder.isInit == false) {
          Geocoder.init(googleMapKey); // use a valid API key
        }
        // Search by geo-location (reverse geo-code)
        Geocoder.from(latitude, longitude)
          .then(json => {
            let fullAddress = json.results[0].formatted_address;
            // console.log(json.results[0].address_components, 'adres');
            


            // Remove the plus code (e.g., "M32J+RM") if present
            let filteredAddress = removePlusCode(fullAddress);
            // console.log(filteredAddress, 'filtered address');
            let shortAdress = json.results[2].formatted_address
            let shortAddress = removePlusCode(shortAdress)
            

            let obj = {
              latitude: latitude,
              longitude: longitude,
              address: filteredAddress,
              shortAdress: shortAddress
            };

            // console.log(json.results[0]);
            // console.log(obj);
            
            resolve(obj);
          })
          .catch(error => {
            console.log('error  :  ', error);
            let obj = {
              latitude: 0.0,
              longitude: 0.0,
              address: '',
            };
            resolve(obj);
          });
      });
    } catch (error) {
      console.log('error  :  ', error);
      let obj = {
        latitude: 0.0,
        longitude: 0.0,
        address: '',
      };
      resolve(obj);
    }
  });
};

export const getAddressFromLatLng = (latitude, longitude) => {
  return new Promise((resolve, reject) => {
    try {
      console.log('latitude, longitude', latitude, longitude);
      // Initialize the module (needs to be done only once)
      if (Geocoder.isInit == false) {
        Geocoder.init(googleMapKey); // use a valid API key
      }

      Geocoder.from(latitude?.toFixed(4), longitude?.toFixed(4))
        .then(async json => {
          // console.log('region : ', json.results[0].formatted_address);
          // Use the geocoding package to get the address details
          const response = await Geocoder.from(latitude, longitude);
          const addressComponent = response.results[0].address_components;

          // Extract state/region from the address components
          let state = '';
          let region = '';
          for (const component of addressComponent) {
            if (component.types.includes('administrative_area_level_1')) {
              state = component.short_name;
            }
            if (component.types.includes('administrative_area_level_2')) {
              region = component.short_name;
            }
          }

          console.log({state, region});

          resolve(json.results[0].formatted_address);
        })
        .catch(error => {
          console.log('error  getAddressFromLatLng :  ', error);
          resolve('');
        });
    } catch (error) {
      resolve('');
    }
  });
};

export const getDeliveryCharges = async region => {
  return new Promise((resolve, reject) => {
    try {
      console.log('getDeliveryCharges  : ', region);
      fetch(api.get_delivery_charges + region?.trim())
        .then(response => response.json())
        .then(response => {
          console.log('response  : ', response);
          if (response?.status == false) {
            resolve(0);
          } else {
            resolve(response?.result[0]?.charges);
          }
        })
        .catch(err => {
          console.log('error : ', err);
          resolve(0);
        });
    } catch (error) {
      resolve(0);
    }
  });
};

export const getPlatformFee = async region => {
  return new Promise((resolve, reject) => {
    try {
      console.log('region to platform fee : ', region);
      // fetch(api.get_platform_fee + region?.trim())
      fetch(api.get_platform_fee)
        .then(response => response.json())
        .then(response => {
          console.log('platform fee response  :  ', response);
          if (response?.status == false) {
            resolve(0);
          } else {
            resolve(response?.result[0]?.charges);
          }
        })
        .catch(err => {
          console.log('error : ', err);
          resolve(0);
        });
    } catch (error) {
      resolve(0);
    }
  });
};

export const getEstimatedDeliveryTime = async (origin, destination) => {
  return new Promise((resolve, reject) => {
    try {
      const apiKey = googleMapKey;
      // const origin = 'Shamshabad, Rawalpindi';
      // const destination = 'I8 islamabad';
      console.log({origin, destination});
      fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`,
      )
        .then(response => response.json())
        .then(data => {
          const durationInSeconds = data.routes[0].legs[0].duration.value;
          const durationInMinutes = Math.ceil(durationInSeconds / 60);
          console.log(`Estimated Travel Time: ${durationInMinutes} minutes`);
          resolve(durationInMinutes);
        })
        .catch(error => {
          resolve(0);
          console.log('Error fetching directions:', error);
        });
    } catch (error) {
      resolve(0);
    }
  });
};
