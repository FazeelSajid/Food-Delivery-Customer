import {StyleSheet, Text, View, FlatList} from 'react-native';
import React, {memo, useState, useEffect} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import api from '../../../../constants/api';
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
const AllOrders = ({data}) => {
  const orders = useSelector(store => store.order.all_orders);
  const [UpcomingOrders, setUpcomingOrders] = useState()
  const [refreshing, setRefreshing] = useState(false);
  const {customer_id, Colors} = useSelector(store => store.store)
  const dispatch = useDispatch();
 

  const getData = async () => {
    setRefreshing(true)
    
    fetch(api.get_all_order_by_customer_Id + customer_id)
      .then(response => response.json())
      .then(response => {
        let list = response?.result ? response?.result : [];
        
        
        dispatch(setAllOrders(list?.reverse()));

        const filteredItems = list?.filter(
          item => item.order_status !== "cancelled" && item.order_status !== "delivered"
          
      );
      setUpcomingOrders(filteredItems);

      })
      .catch(err => console.log('error : ', err))
      .finally(() => {
        setRefreshing(false);
      });
  };


  
 
  useFocusEffect(
    React.useCallback(() => {
      getData();
  
    

    }, []),
  );


  const navigation = useNavigation();


  const onOrderPress = item => {
    console.log('item  :  ', item?.order_status);
    if (item?.order_status == 'delivered') {
      navigation.navigate('OrderDetails', {
        type: 'completed',
        item: item,
      });
    } else if (item?.order_status == 'cancelled') {
      navigation.navigate('OrderDetails', {
        type: 'cancelled',
        item: item,
      });
    } else {
      navigation.navigate('OrderDetails', {
        type: 'all',
        item: item,
      });
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    getData();
  };

  
  

  return (
    <View style={{flex: 1}}>
     
    
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
