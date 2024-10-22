// const getDataArray = async () => {
//     try {
//       const jsonValue = await AsyncStorage.getItem("dataArray");
//       const retrievedArray = jsonValue != null ? JSON.parse(jsonValue) : [];

import AsyncStorage from '@react-native-async-storage/async-storage';

//     //   setDataArray(retrievedArray);
//     //   setCount(1);
//     } catch (error) {
//       console.log("Error retrieving data:", error);
//     }
//   };

//   const storeDataArray = async () => {
//     try {
//       const jsonValue = JSON.stringify(dataArray);
//       await AsyncStorage.setItem("dataArray", jsonValue);
//     } catch (error) {
//       console.log("Error storing data:", error);
//     }
//   };

//   const addDataToArray = () => {
//     const newItem = search;
//     const updatedArray = [newItem, ...dataArray];
//     setDataArray(updatedArray);
//   };
//   const removeItem = (index) => {
//     const updatedArray = dataArray.filter(
//       (item, itemIndex) => itemIndex !== index
//     );
//     // setDataArray(updatedArray);
//   };

//   const deleteArrayDataFromAsyncStorage = async () => {
//     try {
//       const keys = await AsyncStorage.getAllKeys();
//       const arrayDataKeys = keys.filter((key) => key.startsWith("dataArray"));
//       await AsyncStorage.multiRemove(arrayDataKeys);
//     //   setDataArray([]);
//     } catch (error) {
//       console.log("Error deleting array data from async storage:", error);
//     }
//   };

//  ___________________________ handle restaurant  top searches ____________________

export const addRestaurantTopSearch = async searchesArray => {
  await AsyncStorage.setItem('res_top_search', JSON.stringify(searchesArray));
};

export const removeRestaurantTopSearch = async searchesArray => {
  await AsyncStorage.setItem('res_top_search', JSON.stringify(searchesArray));
};

export const getRestaurantTopSearch = async () => {
  let list = await AsyncStorage.getItem('res_top_search');
  if (list) {
    return JSON.parse(list);
  } else {
    return [];
  }
};

//    ___________________________ handle deals  top searches ____________________

export const addDealsTopSearch = async searchesArray => {
  await AsyncStorage.setItem('deals_top_search', JSON.stringify(searchesArray));
};

export const removeDealsTopSearch = async searchesArray => {
  await AsyncStorage.setItem('deals_top_search', JSON.stringify(searchesArray));
};

export const getDealsTopSearch = async () => {
  let list = await AsyncStorage.getItem('deals_top_search');
  if (list) {
    return JSON.parse(list);
  } else {
    return [];
  }
};

//    ___________________________ handle order  top searches ____________________
let ORDER_TOP_SEARCH_KEY = 'order_top_search';
export const addOrderTopSearch = async searchesArray => {
  await AsyncStorage.setItem(
    ORDER_TOP_SEARCH_KEY,
    JSON.stringify(searchesArray),
  );
};
export const removeOrderTopSearch = async searchesArray => {
  await AsyncStorage.setItem(
    ORDER_TOP_SEARCH_KEY,
    JSON.stringify(searchesArray),
  );
};

export const getOrderTopSearch = async () => {
  let list = await AsyncStorage.getItem(ORDER_TOP_SEARCH_KEY);
  if (list) {
    return JSON.parse(list);
  } else {
    return [];
  }
};

// ____________________ Shipping Address  __________________

export const addShippingAddress = async shippingAddress => {
  await AsyncStorage.setItem(
    'shipping_address',
    JSON.stringify(shippingAddress),
  );
};
export const getShippingAddress = async () => {
  let data = await AsyncStorage.getItem('shipping_address');
  if (data) {
    return JSON.parse(data);
  } else {
    return null;
  }
};
