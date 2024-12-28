import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  RefreshControl
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {Icons, Fonts, Images} from '../../../constants';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import StackHeader from '../../../components/Header/StackHeader';
import CInput from '../../../components/TextInput/CInput';
import FoodCardWithRating from '../../../components/Cards/FoodCardWithRating';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ItemSeparator from '../../../components/Separator/ItemSeparator';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../constants/api';
import Loader from '../../../components/Loader';
import {BASE_URL_IMAGE} from '../../../utils/globalVariables';
import {useDispatch, useSelector} from 'react-redux';
import {setOrderHistory} from '../../../redux/OrderSlice';
import FoodCardOrderHistory from '../../../components/Cards/FoodCardOrderHistory';
import {checkRestaurantTimings, showAlert} from '../../../utils/helpers';
import RBSheetRestaurantClosed from '../../../components/BottomSheet/RBSheetRestaurantClosed';
import {
  addItemToMYCart,
  addToCart,
  setCartRestaurantId,
  updateMyCartList,
} from '../../../redux/CartSlice';
import {
  addItemToCart,
  clearCartItems,
  getCustomerCart,
  updateCartItemQuantity,
} from '../../../utils/helpers/cartapis';
import PopUp from '../../../components/Popup/PopUp';

const OrderHistory = ({navigation, route}) => {
  const dispatch = useDispatch();

  const { cart_restaurant_id, } = useSelector(store => store.cart);

  const ref_RBSheetResClosed = useRef();

  const ref_RBSheetSuccess = useRef();
  const {customer_id, showPopUp, popUpColor, PopUpMesage, Colors} = useSelector(store => store.store)
  const [isSearch, setIsSearch] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refresh, setRefresh] = useState(false);

  const [loading, setLoading] = useState(false);

  const [restaurant_timings, setRestaurant_timings] = useState('');
  // const customer_id = useSelector(store => store.store.customer_id)
  // const customer_id = 201730


  const [data, setData] = useState([]); 

  const onRefresh =() =>{
    setRefresh(true);
    getData();
  }

  //-------------------------------------------------- RE-ORDER --------------------------------------------------

  const handleOnRemove = restaurant_id => {
    setLoading(true);
    // remove all items of previous restaurant
    clearCartItems()
      .then(response => {
        //add new item
        dispatch(setCartRestaurantId(restaurant_id));
        console.log('new cart restaurant_id : ', restaurant_id);
        // //my_cart
        // dispatch(clearMyCart());
        //my_cart
        dispatch(updateMyCartList([]));

        add_item_to_cart();
      })
      .catch(error => {
        console.log('error : ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const validate = restaurant_id => {
    if (cart_restaurant_id == null) {
      return true;
    } else if (cart_restaurant_id != restaurant_id) {
      console.log('cart_restaurant_id  : ', cart_restaurant_id, restaurant_id);
      ref_cartAlert.current.open();
      return false;
    } else {
      return true;
    }
  };

  const add_item_to_cart = async (
    item_id,
    restaurant_id,
    count,
    item_type,
    isLast,
  ) => {
    setLoading(true);
    // let customer_id = await AsyncStorage.getItem('customer_id');
    let cart = await getCustomerCart(customer_id,dispatch);

    if (count == 0) {
      showAlert('Please select quantity');
      setLoading(false);
    } else {
      let data = {
        item_id: item_id,
        cart_id: cart?.cart_id?.toString(),
        item_type: item_type,
        comments: 'Adding item in cart',
        quantity: count?.toString(),
      };

      console.log('data   :  ', data);

      await addItemToCart(data, dispatch)
        .then(response => {
          console.log('response  addItemToCart ', response);
          if (response?.status == true) {
            // navigation?.navigate('MyCart');
            // cart_restaurant_id
            dispatch(setCartRestaurantId(restaurant_id));
            //my_cart
            dispatch(addItemToMYCart(response?.result));
            if (isLast) {
              navigation?.navigate('MyCart');
            }
            // ref_RBSheetSuccess?.current?.open();
          } else {
            showAlert(response?.message);
          }
        })
        .catch(error => {
          console.log('error  :  ', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };


  //-------------------------------------------------- RE-ORDER --------------------------------------------------

  const handleReOrder = async item => {
    setLoading(true);
    let time_obj = await checkRestaurantTimings(
      item?.restaurantData?.restaurant_id,
    );

    console.log('time_obj?.isClosed : ', time_obj?.isClosed);
    setLoading(false);
    if (time_obj?.isClosed) {
      setRestaurant_timings(time_obj);
      ref_RBSheetResClosed.current.open();
      return;
    } else {
      setLoading(true);
      // console.log('order detail   : ', item?.cart_items_Data);
      // await clearCartItems();
      dispatch(setCartRestaurantId(null));

      //my_cart
      dispatch(updateMyCartList([]));

      dispatch(addToCart([]));
      let length = item?.cart_items_Data?.length;
      let count = 0;
      for (const element of item?.cart_items_Data) {
        count++;
        console.log('element?.item_id :  ', element?.item_id);
        let isLast = count >= length ? true : false;
        // handleAddToCart(
        add_item_to_cart(
          element?.item_id,
          item?.restaurantData?.restaurant_id,
          element?.quantity,
          element?.item_type,
          isLast,
        );
      }

      console.log('here..................');
      // navigation?.navigate('MyCart');
      setLoading(false);
    }
  };

  const handleSearch = query => {
  
    const filteredData = data?.filter(
      item =>
        (item?.cart_items_Data?.length > 0 &&
          item?.cart_items_Data[0]?.itemData?.name === 'test') ||
        item?.cart_items_Data[0]?.itemData?.item_name === 'test',
    );
    setFilteredData(filteredData);
  };

  const handleCloseSearch = async () => {
    setIsSearch(false);
    setFilteredData([]);
    setSearchQuery('');
  };

  const getData = async () => {
    // let customer_id = await AsyncStorage.getItem('customer_id');
    // console.log({customer_id});
    fetch(api.get_all_order_by_customer_Id + customer_id)
      .then(response => response.json())
      .then(response => {
        let list = response?.result ? response?.result : [];
       
        // const filter = list?.filter(item => item?.cart_items_Data?.length > 0);
        let completed_orders = list?.filter(
          item => item?.order_status == 'delivered',
        );
        console.log(completed_orders, 'orders list');
        
        // setData(filter?.reverse());
        // dispatch(setOrderHistory(filter?.reverse()));
        setData(completed_orders?.reverse());
        dispatch(setOrderHistory(completed_orders?.reverse()));
      })
      .catch(err => console.log('error : ', err))
      .finally(() => 
      {
        setRefresh(false)
        setLoading(false)
      }
        
      );
  };

  useEffect(() => {
    setLoading(true);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, []),
  );

  return (
    <View style={{flex: 1, backgroundColor: Colors.secondary_color}}>
      <Loader loading={loading} />
      {showPopUp && <PopUp color={popUpColor} message={PopUpMesage} />}
      <ScrollView refreshControl={ 
         <RefreshControl
            colors={[Colors.primary_color]}
            refreshing={refresh}
            onRefresh={() => onRefresh()}
          />} contentContainerStyle={{flexGrow: 1}}>
        <StackHeader
          title={'Orders History'}
          showTitle={!isSearch}
          iconContainerStyle={{
            marginTop: isSearch ? -12 : 8,
          }}
          headerStyle={{
            paddingVertical: isSearch ? 0 : 10,
          }}
          onBackPress={() =>
            isSearch ? handleCloseSearch() : navigation?.goBack()
          }
          rightIcon={
            <>
              {isSearch ? (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    width: wp(70),
                    marginTop: 7,
                  }}>
                  <CInput
                    width={wp(75)}
                    height={38}
                    placeholder={'Search here'}
                    value={searchQuery}
                    onChangeText={text => handleSearch(text)}
                    leftContent={
                      <Icons.SearchIconInActive
                        style={{marginLeft: -12}}
                        width={32}
                      />
                    }
                   
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{paddingLeft: 15}}
                  onPress={() => navigation?.navigate('SearchOrder')}>
                  <Icons.SearchIcon />
                </TouchableOpacity>
              )}
            </>
          }
        />
        <View
          style={{
            flex: 1,
            marginTop: -15,
            paddingBottom: 30,
          }}>
          {isSearch ? (
            <View style={{paddingHorizontal: 30, marginTop: -15}}>
              <Text
                style={{
                  color: Colors.primary_color,
                  fontFamily: Fonts.PlusJakartaSans_Bold,
                  marginBottom: 18,
                }}>
                Top Searches
              </Text>
              <FlatList
                data={[1, 2, 3, 4]}
                ItemSeparatorComponent={() => <ItemSeparator />}
                renderItem={({}) => {
                  return (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icons.TopSearch width={12} />
                      <Text
                        style={{
                          marginHorizontal: 10,
                          flex: 1,
                          color: '#0A212B',
                          fontFamily: Fonts.PlusJakartaSans_Regular,
                          fontSize: RFPercentage(1.55),
                        }}>
                        Lorem ipsum dolor sit amet, consectetur a
                      </Text>
                      <TouchableOpacity style={{paddingLeft: 10}}>
                        <AntDesign name="close" color={'#0A212B'} size={15} />
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </View>
          ) : (
            <FlatList
              data={isSearch ? filteredData : data}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              ListHeaderComponent={() => (
                <Text
                  style={{
                    color: '#191A26',
                    fontSize: RFPercentage(2),
                    fontFamily: Fonts.PlusJakartaSans_SemiBold,
                    marginLeft: 20,
                  }}>
                  Past Orders
                </Text>
              )}
              renderItem={({item, index}) => {
                let cart_item =
                  item?.cart_items_Data?.length > 0
                    ? item?.cart_items_Data[0]
                    : null;
                return (
                  <FoodCardOrderHistory
                   
                    onPress={() =>
                      navigation.navigate('OrderDetails', {
                        type: 'history',
                        id: item?.order_id,
                      })
                    }
                    onReOrderPress={() => {
                      // if (cart_item?.restaurantData?.restaurant_id) {
                      //   navigation?.navigate('RestaurantAllDetails', {
                      //     id: cart_item?.restaurantData?.restaurant_id,
                      //   });
                      // } else {
                      //   showAlert('Restaurant not found');
                      // }

                      // navigation?.navigate('RestaurantAllDetails', {
                      //   id: 'res_2983350',
                      // });
                      // ref_RBSheetResClosed?.current?.open();
                      handleReOrder(item);
                    }}
                    image={
                      cart_item && cart_item?.itemData?.images?.length > 0
                        ? cart_item?.itemData?.images[0]
                        : ''
                    }
                    title={
                      cart_item
                        ? cart_item?.item_type == 'deal'
                          ? cart_item?.itemData?.name
                          : cart_item?.itemData?.item_name
                        : ''
                    }
                    price={item?.total_amount}
                    orderDate={item?.updated_at}
                    itemsList={item?.cart_items_Data}
                    rating={item?.restaurantData?.rating}
                    // showRating={true}
                    // label={item?.status}
                    // label={item?.order_status}
                    type={'history'}
                    cardStyle={{marginTop: 15}}
                    imageContainerStyle={{
                      // width: 30,
                      height: 60,
                      marginVertical: 1.5,
                      flex: 0.34,
                    }}
                  />
                );
              }}
            />
          )}
        </View>

        <RBSheetRestaurantClosed
          refRBSheet={ref_RBSheetResClosed}
          title={`“${
            restaurant_timings?.restaurant_details?.user_name
          }” is closed ${
            restaurant_timings?.closed_till
              ? ' till ' + restaurant_timings?.closed_till
              : '.'
          }`}
        />
      </ScrollView>
    </View>
  );
};

export default OrderHistory;
