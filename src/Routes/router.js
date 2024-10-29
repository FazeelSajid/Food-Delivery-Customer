import React, { useRef } from 'react';
import { Text, View, TouchableOpacity, Image, StatusBar } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import OnBoarding from '../Screens/Auth/OnBoarding';
import SignIn from '../Screens/Auth/SignIn';
import SignUpWithPhone from '../Screens/Auth/SignUpWithPhone';
import SignUpWithEmail from '../Screens/Auth/SignupWithEmail';
import AddLocation from '../Screens/Location/AddLocation';
import SelectLocation from '../Screens/Location/SelectLocation';
import Dashboard from '../Screens/Home/Dashboard';
import Categories from '../Screens/Categories/Categories';

import Discover from '../Assets/svg/discover.svg';
import DiscoverActive from '../Assets/svg/discoverActive.svg';
// import Cart from '../Assets/svg/cart.svg';
// import CartActive from '../Assets/svg/cartActive.svg';
import Orders from '../Assets/svg/orders.svg';
import OrdersActive from '../Assets/svg/ordersActive.svg';
import Settings from '../Assets/svg/settings.svg';
import SettingsActive from '../Assets/svg/settingsActive.svg';
import LogoutIcon from '../Assets/svg/logout.svg';

//drawer svgs
import WalletIcon from '../Assets/svg/wallet.svg';
// import ChatIcon from '../Assets/svg/chat.svg';
import Heart from '../Assets/svg/heart.svg';
import ScanBarCode from '../Assets/svg/scanbarcode.svg';

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  getDrawerStatusFromState,
} from '@react-navigation/drawer';
import { Colors, Images } from '../constants';
import { useNavigation } from '@react-navigation/native';
import Favorites from '../Screens/App/Favorites';
import Chat from '../Screens/App/Chat';
import Wallet from '../Screens/App/Wallet';
import OrderHistory from '../Screens/App/Orders/OrderHistory';
import PromoCodes from '../Screens/App/PromoCodes';
import NearByDeals from '../Screens/App/Deals/NearByDeals';
import Cuisines from '../Screens/App/Cuisines';
import NearByDealsDetails from '../Screens/App/Deals/NearByDealsDetails';
import NearByRestaurants from '../Screens/App/Restaurants/NearByRestaurants';
import RestaurantDetails from '../Screens/App/Restaurants/RestaurantDetails';
import ShippingAddress from '../Screens/App/ShippingAddress';
import SpecificCuisines from '../Screens/App/Cuisines/SpecificCuisines';
import MyOrders from '../Screens/App/Orders/MyOrders';
import OrderDetails from '../Screens/App/Orders/OrderDetails';
import MyCart from '../Screens/App/MyCart';
import Checkout from '../Screens/App/Checkout';
import SelectPaymentMethod from '../Screens/App/SelectPaymentMethod';
import CardInfo from '../Screens/App/CardInfo';
import Notification from '../Screens/App/Notification';
import UpdateLocation from '../Screens/Location/UpdateLocation';
import Conversation from '../Screens/App/Chat/Conversation';
import Setting from '../Screens/App/Setting';
import UpdateProfile from '../Screens/App/UpdateProfile';
import Languages from '../Screens/App/Languages';
import PrivacyPolicy from '../Screens/App/PrivacyPolicy';
import TermsAndCondition from '../Screens/App/TermsAndCondition';
import AddItems from '../Screens/App/MyCart/AddItems';
import Verification from '../Screens/Auth/Verification';
import SearchNearByDeals from '../Screens/App/Deals/SearchNearByDeals';
import SearchRestaurants from '../Screens/App/Restaurants/SearchRestaurants';
import RBSheetConfirmation from '../components/BottomSheet/RBSheetConfirmation';
import AddComplaint from '../Screens/App/Orders/AddComplaint';
import EnableLocation from '../Screens/Auth/EnableLocation';
import ForgotPassword from '../Screens/Auth/ForgotPassword';
import ResetPassword from '../Screens/Auth/ResetPassword';
import Verification_Phone from '../Screens/Auth/Verification_Phone';
import Splash from '../Screens/Auth/Splash';
import ItemDetails from '../Screens/App/Items/ItemDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShippingAddressList from '../Screens/App/ShippingAddress/ShippingAddressList';
import SearchOrder from '../Screens/App/Orders/SearchOrder';
import { useDispatch, useSelector } from 'react-redux';
import RBSheetGuestUser from '../components/BottomSheet/RBSheetGuestUser';
import UpdateShippingAddress from '../Screens/App/ShippingAddress/UpdateShippingAddress';
import EmailVerification from '../Screens/Auth/EmailVerification';
import TestStripe from '../Screens/TestStripe';
import RestaurantAllDetails from '../Screens/App/Restaurants/RestaurantAllDetails';
import SetupCard from '../Screens/App/Wallet/SetupCard';
import Onboarding from '../Screens/Auth/OnBording/Onbording';
import AddAddress from '../Screens/App/AddAddress/AddAddress';
import Map from '../Screens/App/Map/Map';
import { resetState } from '../redux/AuthSlice';
import ManageAddress from '../Screens/App/ManageAddress/ManageAddress';
import UpdatePassord from '../Screens/App/UpdatePassword/UpdatePassord';
import Invite from '../Screens/App/Invite/Invite';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function DashboardTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        // tabBarStyle:{paddingVertical: 5,borderTopLeftRadius:15,borderTopRightRadius:15,backgroundColor:'white',position:'absolute',height:50},
        tabBarLabelStyle: ({ focused }) => {
          focused ? { paddingTop: 3 } : { paddingTop: 0 };
        },
        tabBarLabel: ({ focused }) => {
          return focused ? (
            <Text
              style={{
                fontSize: RFPercentage(1.4),
                fontFamily: 'PlusJakartaSans-Regular',
                fontWeight: '700',
                color: '#FF5722',
              }}>
              {route.name}
            </Text>
          ) : null;
        },
        // tabBarIcon: ({ focused }) => {
        //   return (

        //  route.name=="Dashboard"?<Discover fill={"#000000"}/>:
        //   route.name=="SignIn"?<Discover/>:
        //   route.name=="Categories"?<Discover/>:
        //   route.name=="AddLocation"?<Discover/>:""
        //   )
        // }
      })}>
      <Tab.Screen
        name="Discover"
        component={Dashboard}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? <DiscoverActive /> : <Discover />,
        }}
      />
      {/* <Tab.Screen
        name="My Cart"
        component={MyCart}
        options={{
          tabBarIcon: ({focused}) => (focused ? <CartActive /> : <Cart />),
        }}
      /> */}
      <Tab.Screen
        // name="My Orders"
        name="Order"
        component={MyOrders}
        options={{
          tabBarIcon: ({ focused }) => (focused ? <OrdersActive /> : <Orders />),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Setting}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? <SettingsActive /> : <Settings />,
        }}
      />
    </Tab.Navigator>
  );
}

const CustomDrawerContent = props => {
  const navigation = useNavigation();
  const ref_RBSheet = useRef();
  const { join_as_guest } = useSelector(store => store.store);
  const ref_RBSheetGuestUser = useRef(null);
  const dispatch= useDispatch()

  return (
    <DrawerContentScrollView
      {...props}
      style={{}}
      showsVerticalScrollIndicator={false}>
      {/* <StatusBar
        translucent={false}
        barStyle={'dark-content'}
        backgroundColor={Colors.White}
      /> */}
      <View
        style={{
          height: hp(100),
          backgroundColor: Colors.White,
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            // height: hp(25),
          }}>
          <Image
            source={Images.logo}
            style={{
              width: hp(25),
              height: hp(13),
              resizeMode: 'contain',
              marginVertical: hp(5),
            }}
          />
          <View
            style={{
              width: wp(67),
              height: hp(0.1),
              backgroundColor: '#00000021',
            }}
          />
        </View>

        <View style={{ flex: 1, marginVertical: 20 }}>
          <View style={{ marginLeft: 20 }}>
            <DrawerItem
              label="My Wallet"
              // labelStyle={{ color: 'red'}}
              onPress={() => {
                if (join_as_guest) {
                  ref_RBSheetGuestUser?.current?.open();
                } else {
                  navigation.navigate('Wallet');
                }
              }}
              icon={focused => <WalletIcon />}
            />
            {/* <DrawerItem
              label="Chats"
              // labelStyle={{ color: 'red'}}
              onPress={() => navigation.navigate('Chat')}
              icon={focused => <ChatIcon />}
            /> */}

            <DrawerItem
              label="My Favorites"
              // labelStyle={{ color: 'red'}}
              onPress={() => {
                if (join_as_guest) {
                  ref_RBSheetGuestUser?.current?.open();
                } else {
                  navigation.navigate('Favorites');
                }
              }}
              icon={focused => <Heart />}
            />
            {/* <DrawerItem
              label="Order History"
              // labelStyle={{ color: 'red'}}
              onPress={() => {
                if (join_as_guest) {
                  ref_RBSheetGuestUser?.current?.open();
                } else {
                  navigation.navigate('OrderHistory');
                }
              }}
              icon={focused => <Cart />}
            /> */}
            <DrawerItem
              label="Promocodes"
              // labelStyle={{ color: 'red'}}
              onPress={() => navigation.navigate('PromoCodes')}
              icon={focused => <ScanBarCode />}
            />
          </View>
          {!join_as_guest && (
            <View
              style={{
                flex: 0.85,
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => ref_RBSheet?.current?.open()}
                style={{
                  width: wp(60),
                  height: 40,
                  backgroundColor: Colors.Orange,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 20,
                  flexDirection: 'row',
                }}>
                <LogoutIcon />
                <Text style={{ color: 'white', marginLeft: 10 }}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <RBSheetConfirmation
      height={360}
        refRBSheet={ref_RBSheet}
        title={'Logout?'}
        description={'Do you want to logout?'}
        okText={'LOGOUT'}
        onOk={async () => {
          // ref_RBSheet?.current?.close();
                dispatch(resetState())
          // navigation?.popToTop();
          navigation?.replace('SignIn');
          // await AsyncStorage.removeItem('customer_id');
        }}
      />

      <RBSheetGuestUser
        refRBSheet={ref_RBSheetGuestUser}
        // title={'Attention'}
        // description={'Please Sign up before ordering'}
        btnText={'OK'}
        onSignIn={() => {
          ref_RBSheetGuestUser?.current?.close();
          navigation?.popToTop();
          navigation?.replace('SignIn');
          // navigation?.goBack();
        }}
        onSignUp={() => {
          ref_RBSheetGuestUser?.current?.close();
          navigation?.popToTop();
          navigation?.replace('SignUp');
          // navigation?.goBack();
        }}
      />
    </DrawerContentScrollView>
  );
};

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="x"
        component={DashboardTabs}
        options={{ title: 'Home' }}
      />
      <Drawer.Screen
        name="Discover"
        component={Dashboard}
        options={{ title: 'Home' }}
      />

      <Drawer.Screen name="Categories" component={Categories} />
    </Drawer.Navigator>
  );
};

function Router() {

  const customer_id = useSelector(store => store.store.customer_id)
  // console.log(customer_id, 'id');
  
  return (
    <Stack.Navigator
    initialRouteName={customer_id === null ? 'OnBoardings' : 'Drawer' }
      screenOptions={{
        headerShown: false,
      }}>
      {/* <Stack.Screen name="TestStripe" component={TestStripe} /> */}
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="OnBoarding" component={Onboarding} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUpWithPhone" component={SignUpWithPhone} />
      <Stack.Screen name="SignUpWithEmail" component={SignUpWithEmail } />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="Verification_Phone" component={Verification_Phone} />
      <Stack.Screen name="EmailVerification" component={EmailVerification} />


      <Stack.Screen name="EnableLocation" component={EnableLocation} />
      <Stack.Screen name="AddAddress" component={AddAddress} />
      <Stack.Screen name="ManageAddress" component={ManageAddress} />
      <Stack.Screen name="AddLocation" component={AddLocation} />
      <Stack.Screen name="SelectLocation" component={SelectLocation} />
      <Stack.Screen name="Categories" component={Categories} />
      <Stack.Screen name="NearByDeals" component={NearByDeals} />
      <Stack.Screen name="ItemDetails" component={ItemDetails} />
      <Stack.Screen name="Cuisines" component={Cuisines} />
      <Stack.Screen name="NearByDealsDetails" component={NearByDealsDetails} />
      <Stack.Screen name="NearByRestaurants" component={NearByRestaurants} />
      <Stack.Screen name="RestaurantDetails" component={RestaurantDetails} />

      <Stack.Screen
        name="RestaurantAllDetails"
        component={RestaurantAllDetails}
      />
      <Stack.Screen name="ShippingAddress" component={ShippingAddress} />
      <Stack.Screen
        name="UpdateShippingAddress"
        component={UpdateShippingAddress}
      />
      <Stack.Screen
        name="ShippingAddressList"
        component={ShippingAddressList}
      />

      <Stack.Screen name="SpecificCuisines" component={SpecificCuisines} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="CardInfo" component={CardInfo} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="UpdateLocation" component={UpdateLocation} />
      <Stack.Screen name="Conversation" component={Conversation} />
      <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
      <Stack.Screen name="UpdatePassord" component={UpdatePassord} />
      <Stack.Screen name="Languages" component={Languages} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="TermsAndCondition" component={TermsAndCondition} />
      <Stack.Screen
        name="SelectPaymentMethod"
        component={SelectPaymentMethod}
      />
      <Stack.Screen name="Verification" component={Verification} />
      <Stack.Screen name="MyCart" component={MyCart} />
      <Stack.Screen name="SearchNearByDeals" component={SearchNearByDeals} />
      <Stack.Screen name="SearchRestaurants" component={SearchRestaurants} />
      <Stack.Screen name="SearchOrder" component={SearchOrder} />

      {/* Drawer screens */}
      <Stack.Screen name="Wallet" component={Wallet} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Favorites" component={Favorites} />
      <Stack.Screen name="OrderHistory" component={OrderHistory} />
      <Stack.Screen name="PromoCodes" component={PromoCodes} />
      <Stack.Screen name="AddItems" component={AddItems} />
      <Stack.Screen name="Drawer" component={DrawerNavigation} />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name='Invite' component={Invite} />

      <Stack.Screen name="AddComplaint" component={AddComplaint} />
      <Stack.Screen name="SetupCard" component={SetupCard} />
      {/* <Stack.Screen
        name="SelectPaymentMethod"
        component={SelectPaymentMethod}
      /> */}
    </Stack.Navigator>
  );
}

export default Router;
