import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Loader from '../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {setCustomerDetail, setCustomerId} from '../../redux/AuthSlice';
import {
  addToCart,
  setCartRestaurantId,
  updateMyCartList,
} from '../../redux/CartSlice';
import {getCartItems, getCustomerCart} from '../../utils/helpers/cartapis';

const Splash = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {customer_detail, customer_id,} =useSelector(store => store.store);

  const get_Cart_Items = async () => {
    try {
      // let customer_id = await AsyncStorage.getItem('customer_id');
      let cart = await getCustomerCart(customer_id, dispatch);
      let cartItems = await getCartItems(cart?.cart_id, dispatch);
      if (cartItems) {
        dispatch(addToCart(cartItems));
        //my_cart
        dispatch(updateMyCartList(cartItems));
        if (cartItems?.length > 0) {
          dispatch(setCartRestaurantId(cartItems[0]?.itemData?.restaurant_id));
        }
      }
    } catch (error) {
      console.log('Error in getCartItems :  ', error);
    }
  };

  const getData = async () => {
    // let customer_id = await AsyncStorage.getItem('customer_id');
    // let customer_detail = await AsyncStorage.getItem('customer_detail');

    if (customer_id && customer_detail) {
      get_Cart_Items();

      dispatch(setCustomerId(customer_id));
      dispatch(setCustomerDetail(customer_detail));
      //   navigation?.popToTop();

      navigation?.replace('Drawer');
    } else {
      //   navigation?.popToTop();
      navigation?.replace('OnBoarding');
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return <Loader />;
};

export default Splash;
