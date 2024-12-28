import {StyleSheet, Text, View, FlatList} from 'react-native';
import React, {memo, useState, useEffect} from 'react';
import { useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import NoDataFound from '../../../../components/NotFound/NoDataFound';
import OrderCard from '../../../../components/Cards/OrderCard';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';

const CancelledOrders = () => {
  const orders = useSelector(store => store.order.all_orders);
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const { Colors} = useSelector(store => store.store)

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
        contentContainerStyle={{flexGrow: 1,  width: '90%', alignSelf: 'center', paddingVertical: wp(2) }}
        ListHeaderComponent={() => <View style={{height: 10}} />}
        ListFooterComponent={() => <View style={{height: 10}} />}
        ListEmptyComponent={() => <NoDataFound   text={"No Order cancelled"} textStyle={{fontSize: RFPercentage(3)}} />}
        renderItem={({item}) => {
          // let cart_item =
          //   item?.cart_items_Data?.length > 0 ? item?.cart_items_Data[0] : null;
          return (

            <OrderCard item={item}  onPress={() =>
              navigation.navigate('OrderDetails', {
                type: 'cancelled',
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

export default memo(CancelledOrders);

const styles = StyleSheet.create({});
