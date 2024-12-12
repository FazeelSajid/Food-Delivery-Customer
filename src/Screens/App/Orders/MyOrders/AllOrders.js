import {StyleSheet, Text, View, FlatList} from 'react-native';
import React, {memo, useState, useEffect} from 'react';
import {Colors, Images} from '../../../../constants';
import OrdersCard from '../../../../components/Cards/OrdersCard';
import FoodCardWithRating from '../../../../components/Cards/FoodCardWithRating';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../../constants/api';
import Loader from '../../../../components/Loader';
import {BASE_URL_IMAGE} from '../../../../utils/globalVariables';
import {useDispatch, useSelector} from 'react-redux';
import NoDataFound from '../../../../components/NotFound/NoDataFound';
import OrderCard from '../../../../components/Cards/OrderCard';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { RefreshControl } from 'react-native-gesture-handler';
import { setAllOrders } from '../../../../redux/OrderSlice';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { getUserFcmToken } from '../../../../utils/helpers';
const AllOrders = ({data}) => {
  const orders = useSelector(store => store.order.all_orders);
  const [UpcomingOrders, setUpcomingOrders] = useState()
  const [refreshing, setRefreshing] = useState(false);
  const customer_id = useSelector(store => store.store.customer_id)
  const dispatch = useDispatch();
 

  const getData = async () => {
    setRefreshing(true)
    
    fetch(api.get_all_order_by_customer_Id + customer_id)
      .then(response => response.json())
      .then(response => {
        let list = response?.result ? response?.result : [];
        // console.log(response);
        
        // console.log(list, 'list');
        
        // const filter = list?.filter(item => item?.cart_items_Data?.length > 0);
        // const filter = list
        // setData([...data, ...list]);
        // console.log(filter, 'filter');
        
        dispatch(setAllOrders(list?.reverse()));

        const filteredItems = list?.filter(
          item => item.order_status !== "cancelled" && item.order_status !== "delivered"
          
      );
      setUpcomingOrders(filteredItems);

      })
      .catch(err => console.log('error : ', err))
      .finally(() => {
        // setLoading(false);
        setRefreshing(false);
      });
  };

const func = async () => {
  let fcm_token = await getUserFcmToken();
  console.log({fcm_token});
}
  
  
 
  useFocusEffect(
    React.useCallback(() => {
      getData();
    //   const filteredItems = orders.filter(
    //     item => item.order_status !== "cancelled" && item.order_status !== "delivered"
    // );
    // setUpcomingOrders(filteredItems);
    // console.log({filteredItems});
    

    }, []),
  );


  const navigation = useNavigation();


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
        // id: item?.order_id,
        item: item,
      });
    } else if (item?.order_status == 'cancelled') {
      navigation.navigate('OrderDetails', {
        type: 'cancelled',
        // id: item?.order_id,
        item: item,
      });
    } else {
      navigation.navigate('OrderDetails', {
        type: 'all',
        // id: item?.order_id,
        item: item,
      });
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    getData();
    // func()
  };

  // console.log({UpcomingOrders});
  
  

  return (
    <View style={{flex: 1}}>
      {/* <Loader loading={loading} /> */}
     
    
      <FlatList
       refreshControl={
        <RefreshControl
          colors={[Colors.primary_color]}
          refreshing={refreshing}
          onRefresh={() => onRefresh()}
        />
      }
        data={UpcomingOrders}
        ItemSeparatorComponent={<View style={{height: hp(2)}} />}
        contentContainerStyle={{flexGrow: 1,  width: '90%', alignSelf: 'center', paddingVertical: wp(2) }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <View style={{height: 10}} />}
        ListFooterComponent={() => <View style={{height: 10}} />}
        ListEmptyComponent={() => <NoDataFound  loading={refreshing} text={"No Upcoming Orders"} textStyle={{fontSize: RFPercentage(3)}} />}
        renderItem={({item}) => {
          // console.log(item.order_status);
          
          let cart_item =
            item?.cart_items_Data?.length > 0 ? item?.cart_items_Data[0] : null;
          return (
            <OrderCard item={item} onPress={()=> onOrderPress(item)} />
          );
        }}
      />
    </View>
  );
};

export default AllOrders;

const styles = StyleSheet.create({});
