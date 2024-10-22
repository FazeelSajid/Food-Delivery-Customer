import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {Colors, Fonts, Images} from '../../../../constants';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AllOrders from './AllOrders';
import CompletedOrders from './CompletedOrders';
import CancelledOrders from './CancelledOrders';
import MenuHeader from '../../../../components/Header/MenuHeader';
import api from '../../../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {setAllOrders} from '../../../../redux/OrderSlice';
import Loader from '../../../../components/Loader';
import {useFocusEffect} from '@react-navigation/native';

const MyOrders = () => {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const customer_id = useSelector(store => store.store.customer_id)

  // console.log(customer_id);
  

  const renderScene = SceneMap({
    first: AllOrders,
    second: CompletedOrders,
    third: CancelledOrders,
  });

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'All Orders'},
    {key: 'second', title: 'Completed'},
    {key: 'third', title: 'Cancelled'},
  ]);

  const getData = async () => {
    console.log(api.get_all_order_by_customer_Id +customer_id);
    
    fetch(api.get_all_order_by_customer_Id + '201570')
      .then(response => response.json())
      .then(response => {
        let list = response?.result ? response?.result : [];
        console.log(list, 'list');
        
        const filter = list?.filter(item => item?.cart_items_Data?.length > 0);
        // setData([...data, ...list]);
        console.log(filter, 'filter');
        
        setData(filter);
        // dispatch(setAllOrders(filter?.reverse()));
      })
      .catch(err => console.log('error : ', err))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    getData();
  };
  // useEffect(() => {
  //   getData();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      getData();
    }, []),
  );

  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <Loader loading={loading} />
      <MenuHeader title={'My Orders'} />
      <ScrollView
        refreshControl={
          <RefreshControl
            colors={[Colors.Orange, Colors.OrangeLight]}
            refreshing={refreshing}
            onRefresh={() => onRefresh()}
          />
        }
        style={{flex: 1}}>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
          sceneContainerStyle={{backgroundColor: Colors.White}}
          // pagerStyle={{backgroundColor: 'red'}}
          swipeEnabled={true}
          renderTabBar={props => (
            <TabBar
              {...props}
              style={{
                backgroundColor: Colors.White,
                marginTop: -15,
                // paddingHorizontal: 20,
                elevation: 4,
                // borderWidth: 1,
                // borderColor: 'red',
              }}
              tabStyle={{alignItems: 'center', alignContent: 'center'}}
              renderLabel={({route, focused, color}) => (
                <Text
                  style={{
                    color: focused ? Colors.Orange : '#979797',
                    fontSize: hp(1.5),
                    fontFamily: focused
                      ? Fonts.Inter_Bold
                      : Fonts.Inter_Regular,
                    width: 68,
                  }}>
                  {route.title}
                </Text>
              )}
              activeColor={'#fff'}
              // indicatorContainerStyle={{backgroundColor: 'red'}}

              indicatorStyle={{
                padding: 1.5,
                // marginBottom: -2,
                backgroundColor: Colors.Orange,
                // width: '50%',
                // alignSelf: 'center',
                // width: 80,s
                alignSelf: 'center',
                // marginLeft: wp(3.5),
                // flex: 1,
              }}
            />
          )}
          pressColor="white"
          // pressOpacity={0}
          activeColor={'#fff'}
          indicatorContainerStyle={{
            backgroundColor: 'transparent',
          }}
          style={{height: hp(83.7)}}
        />
      </ScrollView>
    </View>
  );
};

export default MyOrders;

const styles = StyleSheet.create({});
