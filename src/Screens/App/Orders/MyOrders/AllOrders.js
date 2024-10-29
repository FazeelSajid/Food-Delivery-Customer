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
import OrderCard from '../../../../components/Cards/OrderCard';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
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
        item: item,
      });
    } else if (item?.order_status == 'cancelled') {
      navigation.navigate('OrderDetails', {
        type: 'cancelled',
        id: item?.order_id,
        item: item,
      });
    } else {
      navigation.navigate('OrderDetails', {
        type: 'all',
        id: item?.order_id,
        item: item,
      });
    }
  };

  return (
    <View style={{flex: 1}}>
      <Loader loading={loading} />
     
    
      <FlatList
        data={orders}
        ItemSeparatorComponent={<View style={{height: hp(2)}} />}
        contentContainerStyle={{flexGrow: 1,  width: '90%', alignSelf: 'center' }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <View style={{height: 10}} />}
        ListFooterComponent={() => <View style={{height: 10}} />}
        ListEmptyComponent={() => <NoDataFound />}
        renderItem={({item}) => {
          let cart_item =
            item?.cart_items_Data?.length > 0 ? item?.cart_items_Data[0] : null;
          return (
            <OrderCard item={item} type = {item.order_status} onPress={()=> onOrderPress(item)} />
          );
        }}
      />
    </View>
  );
};

export default AllOrders;

const styles = StyleSheet.create({});
