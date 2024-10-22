import {StyleSheet, Text, View, FlatList} from 'react-native';
import React, {memo, useState, useEffect} from 'react';
import {Images} from '../../../../constants';
import OrdersCard from '../../../../components/Cards/OrdersCard';
import FoodCardWithRating from '../../../../components/Cards/FoodCardWithRating';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {BASE_URL_IMAGE} from '../../../../utils/globalVariables';
import NoDataFound from '../../../../components/NotFound/NoDataFound';

const CancelledOrders = () => {
  const orders = useSelector(store => store.order.all_orders);
  const navigation = useNavigation();
  const [data, setData] = useState([]);

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

  // useFocusEffect(
  //   React.useCallback(() => {
  //     let filter = orders?.filter(item => item?.order_status == 'cancelled');
  //     setData(filter);
  //   }, []),
  // );

  useEffect(() => {
    let filter = orders?.filter(item => item?.order_status == 'cancelled');
    setData(filter);
  }, [orders]);

  return (
    <View style={{flex: 1}}>
      <FlatList
        // data={orders}
        data={data}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <View style={{height: 10}} />}
        ListFooterComponent={() => <View style={{height: 10}} />}
        ListEmptyComponent={() => <NoDataFound />}
        renderItem={({item}) => {
          let cart_item =
            item?.cart_items_Data?.length > 0 ? item?.cart_items_Data[0] : null;
          return (
            <FoodCardWithRating
              onPress={() =>
                navigation.navigate('OrderDetails', {
                  type: 'cancelled',
                  id: item?.order_id,
                })
              }
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
              label={item?.status}
              type={'all'}
              cardStyle={{marginTop: 15}}
              imageContainerStyle={{
                // width: 30,
                height: 60,
                marginVertical: 1.5,
                flex: 0.34,
              }}

              // title={item?.title}
              // image={item?.image}
              // description={item?.description}
              // price={item?.price}
              // // label={item?.status}
              // type={'cancelled'}
              // showRatingOnBottom={true}
              // showNextButton={false}
              // cardStyle={{marginTop: 15}}
              // imageContainerStyle={{
              //   // width: 30,
              //   height: 60,
              //   marginVertical: 1.5,
              //   flex: 0.34,
              // }}
            />

            // <OrdersCard
            //   title={item?.title}
            //   image={item?.image}
            //   description={item?.description}
            //   price={item?.price}
            //   type={'cancelled'}
            // />
          );
        }}
      />
    </View>
  );
};

export default memo(CancelledOrders);

const styles = StyleSheet.create({});
