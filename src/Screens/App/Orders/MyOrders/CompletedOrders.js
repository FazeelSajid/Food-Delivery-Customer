import {StyleSheet, Text, View, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
// import {Images} from '../../../../constants';
// import OrdersCard from '../../../../components/Cards/OrdersCard';
// import FoodCardWithRating from '../../../../components/Cards/FoodCardWithRating';
import { useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
// import {BASE_URL_IMAGE} from '../../../../utils/globalVariables';
import NoDataFound from '../../../../components/NotFound/NoDataFound';
import OrderCard from '../../../../components/Cards/OrderCard';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';

const CompletedOrders = () => {
  const orders = useSelector(store => store.order.all_orders);
  const [data, setData] = useState([]);

  const navigation = useNavigation();

  console.log('7678');
  


  useEffect(() => {
    let filter = orders?.filter(item => item?.order_status == 'delivered');
    setData(filter);
    // setData(orders);
  }, [orders]);

  return (
    <View style={{flex: 1}}>
      <FlatList
        // data={orders}
        data={data}
        contentContainerStyle={{flexGrow: 1,  width: '90%', alignSelf: 'center', paddingVertical: wp(2) }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <View style={{height: 10}} />}
        ListFooterComponent={() => <View style={{height: 10}} />}
        ListEmptyComponent={() => <NoDataFound   text={"No Completed Orders"} textStyle={{fontSize: RFPercentage(3)}} />}
        renderItem={({item}) => {
          console.log(item.order_status);
          
          
          return (
            <OrderCard item={item} type = {item.order_status}  onPress={() =>
              navigation.navigate('OrderDetails', {
                type: 'completed',
                id: item?.order_id,
                item: item
              })
            } />
          );
        }}
      />
    </View>
  );
};

export default CompletedOrders;

const styles = StyleSheet.create({});
