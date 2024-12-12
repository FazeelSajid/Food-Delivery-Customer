import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import React from 'react';
import {
  TabView,
  SceneMap,
  TabBar,
  TabBarIndicator,
} from 'react-native-tab-view';
import {Colors, Fonts, Images} from '../../../constants';
import StackHeader from '../../../components/Header/StackHeader';
import FavoriteItems from './FavoriteItems';
import FavoriteDeals from './FavoriteDeals';
import FavoriteRestaurants from './FavoriteRestaurants';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import PopUp from '../../../components/Popup/PopUp';

const Favorites = () => {
  const { showPopUp, popUpColor, PopUpMesage} = useSelector(store => store.store)

  const renderScene = SceneMap({
    first: FavoriteItems,
    second: FavoriteDeals,
    // third: FavoriteRestaurants,
  });

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Items'},
    {key: 'second', title: 'Deals'},
    // {key: 'third', title: 'Restaurants'},
  ]);

  const TAB_MARGIN = 24;
  const totalWidth = Dimensions.get('screen').width;

  return (
    <View style={{flex: 1, backgroundColor: Colors.secondary_color}}>
      <StackHeader title={'Favorites'} />
      {showPopUp && <PopUp color={popUpColor} message={PopUpMesage} />}
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        sceneContainerStyle={{backgroundColor: Colors.secondary_color}}
        // pagerStyle={{backgroundColor: 'red'}}
        swipeEnabled={true}
        pressColor={Colors.secondary_color}
        pressOpacity={1}
        // tabBaroption={{pressColor: 'transparent'}}
        renderTabBar={props => (
          <TabBar
            {...props}
            style={{
              backgroundColor: Colors.secondary_color,
              marginTop: -15,
              // paddingHorizontal: 20,
              elevation: 4,
            }}
            tabStyle={{
              alignItems: 'center',
              alignContent: 'center',
            }}
            renderLabel={({route, focused, color}) => (
              <Text
                style={{
                  color: focused ? Colors.primary_color : '#7E8CA0',
                  fontSize: hp(1.8),
                  fontFamily: focused
                    ? Fonts.PlusJakartaSans_Bold
                    : Fonts.Inter_Regular,
                  width: 120,
                  textAlign: 'center',
                }}>
                {route.title}
              </Text>
            )}
            // renderIndicator={indicatorProps => {
            //   const width = indicatorProps.getTabWidth(0) - TAB_MARGIN;
            //   return <TabBarIndicator {...indicatorProps} width={width} />;
            // }}
            activeColor={'#fff'}
            indicatorStyle={{
              padding: 1.5,
              // marginBottom: -2,
              backgroundColor: Colors.primary_color,
              // width: '50%',
              alignSelf: 'center',
              // width: totalWidth / 4,
              // left: totalWidth / 23,
            }}
          />
        )}
      />
      {/* <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      /> */}
    </View>
  );
};

export default Favorites;
