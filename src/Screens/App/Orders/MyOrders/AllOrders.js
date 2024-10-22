import {StyleSheet, Text, View, FlatList} from 'react-native';
import React, {memo, useState, useEffect} from 'react';
import {Images} from '../../../../constants';
import OrdersCard from '../../../../components/Cards/OrdersCard';
import FoodCardWithRating from '../../../../components/Cards/FoodCardWithRating';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../../constants/api';
import Loader from '../../../../components/Loader';
import {BASE_URL_IMAGE} from '../../../../utils/globalVariables';
import {useSelector} from 'react-redux';
import NoDataFound from '../../../../components/NotFound/NoDataFound';

const AllOrders = ({data}) => {
  const orders = useSelector(store => store.order.all_orders);

  const navigation = useNavigation();
  // const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // const data = [
  //   {
  //     id: 0,
  //     image: Images.salad,
  //     title: 'Green Salad',
  //     rating: 4.5,
  //     price: 13.2,
  //     status: 'Order Placed',
  //   },
  //   {
  //     id: 1,
  //     image: Images.salad,
  //     title: 'Green Salad',
  //     rating: 4.5,
  //     price: 13.2,
  //     status: 'Preparing',
  //   },
  //   {
  //     id: 2,
  //     image: Images.salad,
  //     title: 'Green Salad',
  //     rating: 4.5,
  //     price: 13.2,
  //     status: 'Ready to Deliver',
  //   },
  //   {
  //     id: 3,
  //     image: Images.salad,
  //     title: 'Green Salad',
  //     rating: 4.5,
  //     price: 13.2,
  //     status: 'Out for Delivery',
  //   },
  //   {
  //     id: 4,
  //     image: Images.salad,
  //     title: 'Green Salad',
  //     rating: 4.5,
  //     price: 13.2,
  //     status: 'Order Placed',
  //   },
  //   {
  //     id: 5,
  //     image: Images.salad,
  //     title: 'Green Salad',
  //     rating: 4.5,
  //     price: 13.2,
  //     status: 'Order Placed',
  //   },
  //   {
  //     id: 6,
  //     image: Images.salad,
  //     title: 'Green Salad',
  //     rating: 4.5,
  //     price: 13.2,
  //     status: 'Order Placed',
  //   },
  //   {
  //     id: 7,
  //     image: Images.salad,
  //     title: 'Green Salad',
  //     rating: 4.5,
  //     price: 13.2,
  //     status: 'Order Placed',
  //   },
  // ];

  // const getData = async () => {
  //   let customer_id = await AsyncStorage.getItem('customer_id');
  //   console.log({customer_id});
  //   setLoading(true);
  //   fetch(api.get_all_order_by_customer_Id + customer_id)
  //     .then(response => response.json())
  //     .then(response => {
  //       let list = response?.result ? response?.result : [];

  //       const filter = list?.filter(item => item?.cart_items_Data?.length > 0);
  //       console.log('filter  :   ', filter);
  //       // setData([...data, ...list]);
  //       setData(filter);
  //     })
  //     .catch(err => console.log('error : ', err))
  //     .finally(() => setLoading(false));
  // };

  // useEffect(() => {
  //   getData();
  // }, []);

  const onOrderPress = item => {
    console.log('item  :  ', item?.order_status);
    if (item?.order_status == 'delivered') {
      navigation.navigate('OrderDetails', {
        type: 'completed',
        id: item?.order_id,
      });
    } else if (item?.order_status == 'cancelled') {
      navigation.navigate('OrderDetails', {
        type: 'cancelled',
        id: item?.order_id,
      });
    } else {
      navigation.navigate('OrderDetails', {
        type: 'all',
        id: item?.order_id,
      });
    }
  };

  return (
    <View style={{flex: 1}}>
      <Loader loading={loading} />
      <FlatList
        // data={data}
        data={orders}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <View style={{height: 10}} />}
        ListFooterComponent={() => <View style={{height: 10}} />}
        ListEmptyComponent={() => <NoDataFound />}
        renderItem={({item}) => {
          let cart_item =
            item?.cart_items_Data?.length > 0 ? item?.cart_items_Data[0] : null;
          return (
            <FoodCardWithRating
              // onPress={() =>
              //   navigation.navigate('OrderDetails', {
              //     type: 'all',
              //     id: item?.order_id,
              //   })
              // }
              onPress={() => onOrderPress(item)}
              // title={item?.title}
              // image={item?.image}
              image={
                cart_item && cart_item?.itemData?.images?.length > 0
                  ? BASE_URL_IMAGE + cart_item?.itemData?.images[0]
                  : ''
              }
              title={
                cart_item
                  ? cart_item?.item_type == 'deal'
                    ? cart_item?.itemData?.name
                    : cart_item?.itemData?.item_name
                  : ''
              }
              // price={cart_item ? cart_item?.itemData?.price : ''}
              price={item?.total_amount}
              showRating={false}
              // description={item?.description}
              // price={item?.price}
              label={item?.order_status}
              type={'all'}
              // showRatingOnBottom={true}
              // showNextButton={false}
              cardStyle={{marginTop: 15}}
              imageContainerStyle={{
                // width: 30,
                height: 60,
                marginVertical: 1.5,
                flex: 0.34,
              }}
            />
          );
        }}
      />
    </View>
  );
};

export default AllOrders;

const styles = StyleSheet.create({});
