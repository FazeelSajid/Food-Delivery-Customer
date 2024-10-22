import {StyleSheet, Text, View, FlatList} from 'react-native';
import React, {memo, useState, useEffect} from 'react';
import {Images} from '../../../constants';
import OrdersCard from '../../../components/Cards/OrdersCard';
import FoodCardWithRating from '../../../components/Cards/FoodCardWithRating';
import {GetRefundedOrders} from '../../../utils/helpers/walletApis';
import {BASE_URL_IMAGE} from '../../../utils/globalVariables';

const RefundedOrders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState([]);
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

  const getData = async () => {
    setLoading(true);
    let list = await GetRefundedOrders();
    setData(list);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <View style={{height: 10}} />}
        ListFooterComponent={() => <View style={{height: 30}} />}
        renderItem={({item}) => {
          let cart_item =
            item?.cart_items_Data?.length > 0 ? item?.cart_items_Data[0] : null;
          return (
            <FoodCardWithRating
              disabled={true}
              // title={item?.title}
              // image={item?.image}
              // description={item?.description}
              // price={item?.price}
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
              // showRatingOnBottom={true}
              showRating={false}
              showNextButton={false}
              cardStyle={{marginTop: 15}}
              imageContainerStyle={{
                height: 55,
                marginVertical: 1.5,
                flex: 0.3,
              }}
            />
          );
        }}
      />
    </View>
  );
};

export default memo(RefundedOrders);

const styles = StyleSheet.create({});
