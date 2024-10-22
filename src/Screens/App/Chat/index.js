import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import React from 'react';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {Colors, Fonts, Images} from '../../../constants';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import StackHeader from '../../../components/Header/StackHeader';
import Riders from './Riders';
import Restaurants from './Restaurants';
import {Badge} from 'react-native-paper';

const Chat = () => {
  const renderScene = SceneMap({
    first: Riders,
    second: Restaurants,
  });

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Riders'},
    {key: 'second', title: 'Restaurants'},
  ]);
  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <StackHeader title={'My Chats'} />
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
            }}
            tabStyle={{alignItems: 'center', alignContent: 'center'}}
            renderLabel={({route, focused, color}) => (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    color: focused ? Colors.Orange : '#7E8CA0',
                    fontSize: hp(1.8),
                    fontFamily: Fonts.PlusJakartaSans_Bold,
                  }}>
                  {route.title}
                </Text>
                {route?.title == 'Riders' && (
                  <Badge
                    style={{
                      width: 30,
                      height: 17,
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      margin: 0,
                      backgroundColor: '#7E8CA0',
                      lineHeight: 11,
                      marginLeft: 8,
                    }}>
                    3
                  </Badge>
                )}
              </View>
            )}
            activeColor={'#fff'}
            indicatorStyle={{
              padding: 1.5,
              // marginBottom: -2,
              backgroundColor: Colors.Orange,
              // width: '50%',
              // alignSelf: 'center',
            }}
          />
        )}
      />
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({});
