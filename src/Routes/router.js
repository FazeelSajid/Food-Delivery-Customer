import React, { useRef } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SignIn from '../Screens/Auth/SignIn';
import SignUpWithPhone from '../Screens/Auth/SignUpWithPhone';
import SignUpWithEmail from '../Screens/Auth/SignupWithEmail';
import Dashboard from '../Screens/Home/Dashboard';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { Icons, Images } from '../constants';
import { useNavigation } from '@react-navigation/native';
import Favorites from '../Screens/App/Favorites';
import Wallet from '../Screens/App/Wallet';
import PromoCodes from '../Screens/App/PromoCodes';
import NearByDeals from '../Screens/App/Deals/NearByDeals';
import NearByDealsDetails from '../Screens/App/Deals/NearByDealsDetails';
// import RestaurantDetails from '../Screens/App/Restaurants/RestaurantDetails';
// import ShippingAddress from '../Screens/App/ShippingAddress';
import MyOrders from '../Screens/App/Orders/MyOrders';
import OrderDetails from '../Screens/App/Orders/OrderDetails';
import MyCart from '../Screens/App/MyCart';
import Checkout from '../Screens/App/Checkout';
// import SelectPaymentMethod from '../Screens/App/SelectPaymentMethod';
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
// import SearchRestaurants from '../Screens/App/Restaurants/SearchRestaurants';
import RBSheetConfirmation from '../components/BottomSheet/RBSheetConfirmation';
import AddComplaint from '../Screens/App/Orders/AddComplaint';
// import EnableLocation from '../Screens/Auth/XEnableLocation';
import ForgotPassword from '../Screens/Auth/ForgotPassword';
import ResetPassword from '../Screens/Auth/ResetPassword';
import Verification_Phone from '../Screens/Auth/Verification_Phone';
import Splash from '../Screens/Auth/Splash';
import ItemDetails from '../Screens/App/Items/ItemDetails';
// import ShippingAddressList from '../Screens/App/ShippingAddress/ShippingAddressList';
import { useDispatch, useSelector } from 'react-redux';
import RBSheetGuestUser from '../components/BottomSheet/RBSheetGuestUser';
// import UpdateShippingAddress from '../Screens/App/ShippingAddress/UpdateShippingAddress';
// import EmailVerification from '../Screens/Auth/xEmailVerification';
// import TestStripe from '../Screens/TestStripe';
// import RestaurantAllDetails from '../Screens/App/Restaurants/RestaurantAllDetails';
// import SetupCard from '../Screens/App/Wallet/XSetupCard';
import Onboarding from '../Screens/Auth/OnBording/Onbording';
import Map from '../Screens/App/Map/Map';
import { resetState } from '../redux/AuthSlice';
import ManageAddress from '../Screens/App/ManageAddress/ManageAddress';
import UpdatePassord from '../Screens/App/UpdatePassword/UpdatePassord';
import Invite from '../Screens/App/Invite/Invite';
import SeeAllItems from '../Screens/App/SeeAllItems/SeeAlItems';
import Messages from '../Screens/App/Chat/Messages';
import ImageUpload from '../Screens/App/Chat/ImageUpload';
import TrackOrder from '../Screens/App/Orders/TrackOrder';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function DashboardTabs() {
  const { Colors } = useSelector(store => store.store)
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
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
                color: Colors.primary_color,
              }}>
              {route.name}
            </Text>
          ) : null;
        },

      })}>
      <Tab.Screen
        name="Discover"
        component={Dashboard}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? <Icons.DiscoverActive /> : <Icons.Discover />,
        }}
      />

      <Tab.Screen
        name="Order"
        component={MyOrders}
        options={{
          tabBarIcon: ({ focused }) => (focused ? <Icons.OrdersActive /> : <Icons.Order />),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Setting}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? <Icons.SettingsActive /> : <Icons.Settings />,
        }}
      />
    </Tab.Navigator>
  );
}

const CustomDrawerContent = props => {
  const navigation = useNavigation();
  const ref_RBSheet = useRef();
  const { join_as_guest, Colors } = useSelector(store => store.store);
  const ref_RBSheetGuestUser = useRef(null);
  const dispatch = useDispatch()


  return (
    <DrawerContentScrollView
      {...props}
      style={{}}
      showsVerticalScrollIndicator={false}>


      <View
        style={{
          height: hp(100),
          backgroundColor: Colors.secondary_color,
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
              backgroundColor: Colors.borderGray,
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
              icon={focused => <Icons.Wallet />}
            />
            <DrawerItem
              label="Chats"
              onPress={() => {
                if (join_as_guest) {
                  ref_RBSheetGuestUser?.current?.open();
                } else {
                  navigation.navigate('Chat')
                }
              }

              }
              icon={focused => <Icons.Chat />}

            />

            <DrawerItem
              label="My Favorites"
              onPress={() => {
                if (join_as_guest) {
                  ref_RBSheetGuestUser?.current?.open();
                } else {
                  navigation.navigate('Favorites');
                }
              }}
              icon={focused => <AntDesign name="hearto" size={24} color={Colors.primary_text} />}
            />

            <DrawerItem
              label="Promocodes"
              // labelStyle={{ color: 'red'}}
              onPress={() => navigation.navigate('PromoCodes')}
              icon={focused => <Icons.ScanBarCode />}
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
                  backgroundColor: Colors.primary_color,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 20,
                  flexDirection: 'row',
                }}>
                <Icons.LogoutIcon />
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
          dispatch(resetState())
          navigation?.replace('SignIn');
        }}
      />

      <RBSheetGuestUser
        refRBSheet={ref_RBSheetGuestUser}
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

    </Drawer.Navigator>
  );
};

function Router() {

  const { customer_id } = useSelector(store => store.store)
  // console.log(customer_id, 'id');

  return (
    <Stack.Navigator
      initialRouteName={customer_id === null ? 'OnBoardings' : 'Drawer'}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="OnBoarding" component={Onboarding} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUpWithPhone" component={SignUpWithPhone} />
      <Stack.Screen name="SignUpWithEmail" component={SignUpWithEmail} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="Verification_Phone" component={Verification_Phone} />
      {/* <Stack.Screen name="EmailVerification" component={EmailVerification} /> */}
      {/* <Stack.Screen name="EnableLocation" component={EnableLocation} /> */}
      <Stack.Screen name="ManageAddress" component={ManageAddress} />
      <Stack.Screen name="NearByDeals" component={NearByDeals} />
      <Stack.Screen name="ItemDetails" component={ItemDetails} />
      <Stack.Screen name="NearByDealsDetails" component={NearByDealsDetails} />
      {/* <Stack.Screen name="RestaurantDetails" component={RestaurantDetails} /> */}
      <Stack.Screen name="ImageUpload" component={ImageUpload} />
      {/* <Stack.Screen name="RestaurantAllDetails" component={RestaurantAllDetails} /> */}
      {/* <Stack.Screen name="ShippingAddress" component={ShippingAddress} /> */}
      {/* <Stack.Screen name="UpdateShippingAddress" component={UpdateShippingAddress} /> */}
      {/* <Stack.Screen name="ShippingAddressList" component={ShippingAddressList} /> */}
      <Stack.Screen name="OrderDetails" component={OrderDetails} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="UpdateLocation" component={UpdateLocation} />
      <Stack.Screen name="Conversation" component={Conversation} />
      <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
      <Stack.Screen name="UpdatePassord" component={UpdatePassord} />
      <Stack.Screen name="Languages" component={Languages} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="TermsAndCondition" component={TermsAndCondition} />
      {/* <Stack.Screen name="SelectPaymentMethod" component={SelectPaymentMethod} /> */}
      <Stack.Screen name="Verification" component={Verification} />
      <Stack.Screen name="MyCart" component={MyCart} />
      <Stack.Screen name="SearchNearByDeals" component={SearchNearByDeals} />
      {/* <Stack.Screen name="SearchRestaurants" component={SearchRestaurants} /> */}
      <Stack.Screen name="Wallet" component={Wallet} />
      <Stack.Screen name="SeeAllitems" component={SeeAllItems} />
      <Stack.Screen name="Chat" component={Messages} />
      <Stack.Screen name="Favorites" component={Favorites} />
      <Stack.Screen name="PromoCodes" component={PromoCodes} />
      <Stack.Screen name="AddItems" component={AddItems} />
      <Stack.Screen name="Drawer" component={DrawerNavigation} />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name='Invite' component={Invite} />
      <Stack.Screen name='TrackOrder' component={TrackOrder} />
      <Stack.Screen name="AddComplaint" component={AddComplaint} />
      {/* <Stack.Screen name="SetupCard" component={SetupCard} /> */}
    </Stack.Navigator>
  );
}

export default Router;
