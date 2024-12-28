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
import { Fonts, Images} from '../../../../constants';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AllOrders from './AllOrders';
import CompletedOrders from './CompletedOrders';
import CancelledOrders from './CancelledOrders';
import MenuHeader from '../../../../components/Header/MenuHeader';
import {useDispatch, useSelector} from 'react-redux';
import PopUp from '../../../../components/Popup/PopUp';

const MyOrders = () => {
  const { showPopUp, popUpColor, PopUpMesage, Colors } = useSelector(store => store.store)
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

  

  return (
    <View style={{flex: 1, backgroundColor: Colors.secondary_color}}>
      {showPopUp && <PopUp color={popUpColor} message={PopUpMesage} />}
      <MenuHeader title={'My Orders'} />
      
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
              indicatorStyle={{
                padding: 1.5,
                backgroundColor: Colors.primary_color,
                alignSelf: 'center',
              }}
            />
          )}
          indicatorContainerStyle={{
            backgroundColor: 'transparent',
          }}
          style={{height: hp(83.7)}}
        />
    </View>
  );
};

export default MyOrders;

const styles = StyleSheet.create({});
