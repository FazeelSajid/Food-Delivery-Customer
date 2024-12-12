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
import PopUp from '../../../../components/Popup/PopUp';

const MyOrders = () => {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  

  const { showPopUp, popUpColor, PopUpMesage } = useSelector(store => store.store)

  // console.log(customer_id);
  

  const renderScene = SceneMap({
    first: AllOrders,
    second: CompletedOrders,
    third: CancelledOrders,
  });

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Upcoming'},
    {key: 'second', title: 'Completed'},
    {key: 'third', title: 'Cancelled'},
  ]);

  // const getData = async () => {
    
  //   fetch(api.get_all_order_by_customer_Id + customer_id)
  //     .then(response => response.json())
  //     .then(response => {
  //       let list = response?.result ? response?.result : [];
  //       console.log(response);
        
  //       // console.log(list, 'list');
        
  //       // const filter = list?.filter(item => item?.cart_items_Data?.length > 0);
  //       const filter = list
  //       // setData([...data, ...list]);
  //       // console.log(filter, 'filter');
        
  //       dispatch(setAllOrders(filter?.reverse()));
  //     })
  //     .catch(err => console.log('error : ', err))
  //     .finally(() => {
  //       setLoading(false);
  //       setRefreshing(false);
  //     });
  // };

  // const onRefresh = () => {
  //   setRefreshing(true);
  //   getData();
  // };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     setLoading(true);
  //     getData();
  //   }, []),
  // );

  return (
    <View style={{flex: 1, backgroundColor: Colors.secondary_color}}>
      {/* <Loader loading={loading} /> */}
      {showPopUp && <PopUp color={popUpColor} message={PopUpMesage} />}
      <MenuHeader title={'My Orders'} />
      {/* <ScrollView
        refreshControl={
          <RefreshControl
            colors={[Colors.primary_color, Colors.primary_colorLight]}
            refreshing={refreshing}
            onRefresh={() => onRefresh()}
          />
        }
        style={{flex: 1}}> */}
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
          sceneContainerStyle={{backgroundColor: Colors.secondary_color}}
          // pagerStyle={{backgroundColor: 'red'}}
          swipeEnabled={true}
          renderTabBar={props => (
            <TabBar
              {...props}
              style={{
                backgroundColor: Colors.secondary_color,
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
                    color: focused ? Colors.primary_color : Colors.secondary_text,
                    fontSize: hp(1.5),
                    fontFamily: focused
                      ? Fonts.Inter_Bold
                      : Fonts.Inter_Regular,
                    width: 68,
                     alignItems: 'center',
                    textAlign: 'center'
                  }}>
                  {route.title}
                </Text>
              )}
              // activeColor={'red'}
              // indicatorContainerStyle={{backgroundColor: 'red'}}

              indicatorStyle={{
                padding: 1.5,
                // marginBottom: -2,
                backgroundColor: Colors.primary_color,
                // width: '50%',
                // alignSelf: 'center',
                // width: 80,s
                alignSelf: 'center',
                // marginLeft: wp(3.5),
                // flex: 1,
              }}
            />
          )}
          // pressColor="red"
          // pressOpacity={0}
          // activeColor={'red'}
          indicatorContainerStyle={{
            backgroundColor: 'transparent',
          }}
          style={{height: hp(83.7)}}
        />
      {/* </ScrollView> */}
    </View>
  );
};

export default MyOrders;

const styles = StyleSheet.create({});
