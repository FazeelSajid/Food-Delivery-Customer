import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import StackHeader from '../../../components/Header/StackHeader';
import { Colors, Fonts, Icons, Images } from '../../../constants';
import FoodCard from '../../../components/Cards/FoodCard';
import Chip from '../../../components/Chip.js';
import FoodCardWithRating from '../../../components/Cards/FoodCardWithRating';
import api from '../../../constants/api';
import Loader from '../../../components/Loader';
import { BASE_URL_IMAGE } from '../../../utils/globalVariables';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addItemToCart,
  clearCartItems,
  getCustomerCart,
  removeItemFromCart,
  updateCartItemQuantity,
} from '../../../utils/helpers/cartapis';
import { checkRestaurantTimings, showAlert } from '../../../utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import RBSheetOtherRestaurantCartItem from '../../../components/BottomSheet/RBSheetOtherRestaurantCartItem';
import {
  addItemToMYCart,
  addToCart,
  setCartRestaurantId,
  updateMyCartList,
} from '../../../redux/CartSlice';
import RBSheetSuccess from '../../../components/BottomSheet/RBSheetSuccess';
import ItemLoading from '../../../components/Loader/ItemLoading';
import RBSheetRestaurantClosed from '../../../components/BottomSheet/RBSheetRestaurantClosed';
import CRBSheetComponent from '../../../components/BottomSheet/CRBSheetComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RadioButton } from 'react-native-paper';

const AddItems = ({ navigation, route }) => {
  const ref_RBSheetSuccess = useRef();
  const dispatch = useDispatch();

  const { cart, cart_restaurant_id, my_cart } = useSelector(store => store.cart);
  const ref_cartAlert = useRef();
  const ref_RBSheetResClosed = useRef();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selected_restaurant_id, setSelected_restaurant_id] = useState('');
  const [selected_item, setSelected_item] = useState('');
  const [isItemLoading, setIsItemLoading] = useState(false);
  const [Item , setItem] = useState()
  const [restaurant_timings, setRestaurant_timings] = useState('');
  const {  customer_id, cuisines } = useSelector(store => store.store);

  const [itemObj, setItemObj] = useState({})



  const setCusineNameByItemCusineId = (cusineId) => {
    const cuisineName = cuisines?.filter(item => item?.cuisine_id === cusineId)[0]?.cuisine_name;
    // console.log(cuisineName);

    return cuisineName;
  }


  const btmSheetRef = useRef()


  const [selectedVariation, setSelectedVariation] = useState(null);

  // Function to handle radio button press


  const showBtmSheet = (item) => {
    setSelectedVariation(null)

    setItemObj({
      id: item.item_id,
      variations: item.item_prices,
      name: item?.item_name,
    })

    btmSheetRef?.current?.open()
  }
  const closeBtmSheet = () => {
    btmSheetRef?.current?.close()
    setItemObj({})
  }

  const handleOnRemove = () => {
    setLoading(true);
    // remove all items of previous restaurant
    clearCartItems()
      .then(response => {
        //add new item
        dispatch(setCartRestaurantId());
        console.log('new cart restaurant_id : ', selected_restaurant_id);
        add_item_to_cart(selected_item);
        //my_cart
        dispatch(updateMyCartList([]));
        const newData = data?.map(e => {
          return {
            ...e,
            quantity: 0,
          };
        });
        setData(newData);
      })
      .catch(error => {
        console.log('error : ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const validate = restaurant_id => {
    console.log({ cart_restaurant_id, restaurant_id });
    if (cart_restaurant_id == null) {
      console.log('cart_restaurant_id is null...');
      return true;
    } else if (cart_restaurant_id != restaurant_id) {
      console.log('cart_restaurant_id  : ', cart_restaurant_id, restaurant_id);
      ref_cartAlert.current.open();
      return false;
    } else {
      return true;
    }
  };

  const updateList = item => {
    const newData = data?.map(element => {
      if (element?.item_id == item?.item_id) {
        return {
          ...element,
          quantity: element.quantity ? element.quantity + 1 : 1,
        };
      } else {
        return {
          ...element,
        };
      }
    });
    setData(newData);
  };

  const handleRemoveItemFromCart = async item => {
    try {
      setIsItemLoading(true);
      console.log('item   :  ', item?.cart_item_id);
      let customer_id = await AsyncStorage.getItem('customer_id');
      let cart = await getCustomerCart(customer_id);
      console.log('cart  : ', cart);

      removeItemFromCart(cart?.cart_id, item?.item_id)
        .then(response => {
          if (response?.status == true) {
            console.log('response  :  ', response);
            const newData = data?.map(e => {
              if (e?.item_id == item.item_id) {
                return {
                  ...e,
                  quantity: 0,
                };
              } else {
                return { ...e };
              }
            });
            setData(newData);
            const filter = data.filter(
              element => element?.item_id != item?.item_id,
            );
            // setData(filter);
            dispatch(addToCart(filter));

            //my_cart
            // dispatch(removeItemFromMyCart(item?.cart_item_id));
            dispatch(updateMyCartList(filter));

            let filter1 = newData?.filter(e => e?.quantity > 0);
            if (filter1?.length == 0) {
              dispatch(setCartRestaurantId(null));
            }
          } else {
            setTimeout(() => {
              showAlert(response?.message);
            }, 500);
          }
        })
        .catch(error => {
          console.log('error: ', error);
        })
        .finally(() => {
          setIsItemLoading(false);
        });
    } catch (error) {
      setIsItemLoading(false);
      console.log('error in delete item  :  ', error);
    }
  };

  const onIncrement = async item => {
    setIsItemLoading(true);
    const newData = data?.map(element => {
      if (element?.item_id == item?.item_id) {
        return {
          ...element,
          quantity: element.quantity ? element.quantity + 1 : 1,
        };
      } else {
        return {
          ...element,
        };
      }
    });
    setData(newData);

    // also update quantity in database and redux state
    const filter = my_cart?.filter(e => e?.item_id == item?.item_id);
    if (filter?.length > 0) {
      let newQuantity = item?.quantity + 1;
      let obj = {
        cart_item_id: filter[0]?.cart_item_id,
        quantity: newQuantity,
      };
      console.log({ newQuantity });
      await updateCartItemQuantity(obj);
      // also update quantity in redux
      const newData1 = my_cart?.map(e => {
        if (e?.item_id == item?.item_id) {
          return {
            ...e,
            quantity: newQuantity,
          };
        } else {
          return { ...e };
        }
      });

      dispatch(updateMyCartList(newData1));
      dispatch(setCartRestaurantId(selected_restaurant_id));
      // ref_RBSheetSuccess?.current?.open();
    }
    setIsItemLoading(false);
  };

  const onDecrement = async item => {
    console.log('item : ', item?.quantity);
    if (item?.quantity <= 1) {
      //remove that item,
      handleRemoveItemFromCart(item);
      return;
    }

    setIsItemLoading(true);
    const newData = data?.map(element => {
      if (element?.item_id == item?.item_id) {
        return {
          ...element,
          quantity: element.quantity - 1,
        };
      } else {
        return {
          ...element,
        };
      }
    });
    setData(newData);

    // also update quantity in database and redux state
    const filter = my_cart?.filter(e => e?.item_id == item?.item_id);
    if (filter?.length > 0) {
      let obj = {
        cart_item_id: filter[0]?.cart_item_id,
        quantity: filter[0]?.quantity - 1,
      };
      await updateCartItemQuantity(obj);
      // also update quantity in redux
      const newData1 = my_cart?.map(item => {
        if (item?.item_id == route?.params?.id) {
          return {
            ...item,
            quantity: filter[0]?.quantity - 1,
          };
        } else {
          return { ...item };
        }
      });

      dispatch(updateMyCartList(newData1));
      dispatch(setCartRestaurantId(selected_restaurant_id));
      setIsItemLoading(false);
    }
    setIsItemLoading(false);
  };

  const add_item_to_cart = async (item, variation_id) => {
    setLoading(true);
    // let customer_id = await AsyncStorage.getItem('customer_id');
    console.log('customer_Id :  ', customer_id);
    let cart = await getCustomerCart(customer_id);
    let data = {
      item_id: item?.item_id,
      cart_id: cart?.cart_id,
      item_type: 'item',
      comments: '',
      quantity: 1,
      variation_id: variation_id
    };
    console.log('data   :  ', data);

    await addItemToCart(data)
      .then(response => {
        console.log('response ', response);
        if (response?.status == true) {
          // navigation?.navigate('MyCart');
          dispatch(setCartRestaurantId(selected_restaurant_id));
          //my_cart
          dispatch(addItemToMYCart(response?.result));

          // navigation.goBack();
          // cart_restaurant_id
          ref_RBSheetSuccess?.current?.open();
          updateList(item);
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
  };

  // const handelAddItem = async item => {
  //   add_item_to_cart(item);
  //   // if (item?.restaurant_timings?.isClosed) {
  //   //   setRestaurant_timings(item?.restaurant_timings);
  //   //   ref_RBSheetResClosed.current.open();
  //   //   return;
  //   // } else if (validate(item?.restaurant_id)) {
  //   //   add_item_to_cart(item);
  //   // }
  // };

  const getData = () => {
    setLoading(true);
    fetch(api.get_all_items_by_restaurant + 'res_4074614')
      .then(response => response.json())
      .then(async response => {
        let list = response?.result ? response?.result : [];
        // setData(list);
        let newList = [];
        for (const item of list) {
          const filter = my_cart?.filter(e => e?.item_id == item?.item_id);
          // getting restaurant timings
          // let time_obj = await checkRestaurantTimings(item?.restaurant_id);
          let obj = {
            ...item,
            quantity: filter?.length > 0 ? filter[0]?.quantity : 0,
            // restaurant_timings: time_obj,
          };
          newList.push(obj);
        }
        setData(newList);
      })
      .catch(err => console.log('error : ', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getData();
  }, []);

  const handlePress = async (item, id) => {
    setSelectedVariation(id);

    const filter = my_cart?.filter(
      item => item?.item_id == route?.params?.id,
    );
    if (filter?.length > 0) {
      let obj = {
        cart_item_id: filter[0]?.cart_item_id,
        quantity: filter[0]?.quantity + count,
      };
      await updateCartItemQuantity(obj);
      // also update quantity in redux
      const newData = my_cart?.map(item => {
        if (item?.item_id == route?.params?.id) {
          return {
            ...item,
            quantity: filter[0]?.quantity + count,
          };
        } else {
          return { ...item };
        }
      });
      dispatch(updateMyCartList(newData));
      dispatch(setCartRestaurantId(restaurantDetails?.restaurant_id));
      ref_RBSheetSuccess?.current?.open();
      closeBtmSheet()
    } else {
      add_item_to_cart(item, id);
      closeBtmSheet()

    }


  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <StatusBar
        backgroundColor={'#FFFFFF'}
        barStyle={'dark-content'}
        translucent={false}
      />

      <View style={{}}>
        <FlatList
          ListHeaderComponent={() => <StackHeader title={'Add Items'} />}
          showsVerticalScrollIndicator={false}
          // numColumns={2}
          // columnWrapperStyle={{
          //   justifyContent: 'space-between',
          //   paddingHorizontal: 20,
          // }}
          data={data}
          ItemSeparatorComponent={() => <View style={{ height: hp(3) }} />}
          renderItem={({ item }) => (
            <FoodCardWithRating
              disabled={true}
              // onPress={() =>
              //   navigation.navigate('MyOrdersDetail', {
              //     type: 'order_request',
              //   })
              // }

              image={
                item?.images?.length > 0 ? BASE_URL_IMAGE + item?.images[0] : ''
              }
              title={item?.item_name}
              price={item?.item_prices[0]?.price}
              showRating={false}
              rating={item?.rating}
              tag={setCusineNameByItemCusineId(item?.cuisine_id)}
              nextIconWidth={26}
              cardStyle={{
                marginHorizontal: 0,
                marginBottom: -8,
                width: wp(90),
                alignSelf: 'center',
              }}
              showNextButton={true}
              // showRating={true}
              priceContainerStyle={{ marginTop: 0 }}
              // nextComponent={
              //   <TouchableOpacity
              //     onPress={() => {
              //       setSelected_item(item);
              //       setSelected_restaurant_id(item?.restaurant_id);
              //       handelAddItem(item);
              //     }}>
              //     {item?.quantity > 0 ? null : <Icons.AddCircle width={25} />}
              //     {/* <Icons.AddCircle width={25} /> */}
              //   </TouchableOpacity>
              // }

              nextComponent={
                <>
                  {isItemLoading && item?.item_id == selected_item?.item_id ? (
                    <ItemLoading loading={isItemLoading} />
                  ) : item?.quantity > 0 ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#FF57224F',
                        borderRadius: 25,
                        paddingVertical: 2,
                        paddingHorizontal: 2,
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          setSelected_item(item);
                          setSelected_restaurant_id(item?.restaurant_id);
                          onDecrement(item);
                          setRestaurant_timings(item?.restaurant_timings);
                        }}
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                        }}>
                        <AntDesign
                          name="minus"
                          color={Colors.Orange}
                          size={16}
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          color: Colors.Orange,
                          fontFamily: Fonts.PlusJakartaSans_Bold,
                          fontSize: RFPercentage(2),
                          marginTop: -2,
                        }}>
                        {item?.quantity}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setSelected_item(item);
                          setSelected_restaurant_id(item?.restaurant_id);
                          onIncrement(item);
                          setRestaurant_timings(item?.restaurant_timings);
                        }}
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                        }}>
                        <AntDesign
                          name="plus"
                          color={Colors.Orange}
                          size={16}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        setItem(item)
                        showBtmSheet(item)
                        // updateItemQuantity(item);
                        // setSelected_item(item);
                        // setSelected_restaurant_id(item?.restaurant_id);
                        // handelAddItem(item);
                        // setRestaurant_timings(item?.restaurant_timings);
                      }}>
                      <Icons.AddCircle width={25} />
                    </TouchableOpacity>
                  )}
                </>
              }
            />

            // <FoodCard
            //   image={item?.image}
            //   title={item?.title}
            //   //   description={item?.description}
            //   price={item?.price}
            //   onPress={() =>
            //     navigation?.replace('NearByDealsDetails', {
            //       nav_type: 'add_item',
            //     })
            //   }
            // />
          )}
          ListFooterComponent={() => <View style={{ height: hp(3) }} />}
        />
      </View>

      <RBSheetOtherRestaurantCartItem
        refRBSheet={ref_cartAlert}
        title={'Remove your previous items?'}
        description={
          'You still have products from another restaurant.Shall we start over with a fresh cart?'
        }
        okText={'Remove'}
        cancelText={'No'}
        onOk={() => {
          handleOnRemove();
          ref_cartAlert?.current?.close();
        }}
        onCancel={() => {
          ref_cartAlert?.current?.close();
        }}
      />

      <RBSheetSuccess
        refRBSheet={ref_RBSheetSuccess}
        title={`${Item?.item_name} added to cart.`}
        btnText={'OK'}
        onPress={() => {
          ref_RBSheetSuccess?.current?.close();
          // navigation.goBack();
        }}
      />
      <RBSheetRestaurantClosed
        refRBSheet={ref_RBSheetResClosed}
        title={`“${restaurant_timings?.restaurant_details?.user_name
          }” is closed ${restaurant_timings?.closed_till
            ? ' till ' + restaurant_timings?.closed_till
            : '.'
          }`}
      />

       <CRBSheetComponent
        height={230}
        refRBSheet={btmSheetRef}
        content={
          <View style={{ width: wp(90) }} >
            <View style={styles.rowViewSB} >
              <Text style={[styles.variationTxt, { fontSize: RFPercentage(2) }]} >Select your variation</Text>
              <TouchableOpacity
                onPress={() => closeBtmSheet()}>
                <Ionicons name={'close'} size={22} color={'#1E2022'} />
              </TouchableOpacity>
            </View>
            {itemObj.variations?.map((variation, i) => (
              <View key={i} style={styles.rowViewSB}>
                <View style={styles.rowView} >
                  <RadioButton
                    color={Colors.Orange} // Custom color for selected button
                    uncheckedColor={Colors.Orange} // Color for unselected buttons
                    status={selectedVariation === variation.variation_id ? 'checked' : 'unchecked'}
                    onPress={() =>  handlePress(Item, variation.variation_id)}
                  />
                  <Text style={styles.variationText}>{variation.variation_name}</Text>
                </View>
                <Text style={styles.variationText}>£ {variation?.price}</Text>
              </View>
            ))}

          </View>
        }

      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  heading: {
    color: Colors.Text,
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(2.5),
    marginBottom: 10,
  },
  itemView: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(88),
  },
  imageContainer: {
    width: wp(30),
    height: hp(10),
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  title: {
    fontFamily: Fonts.PlusJakartaSans_Bold,
    color: Colors.Text,
    fontSize: RFPercentage(1.7),
    lineHeight: 25,
  },
  nameText: {
    fontFamily: Fonts.PlusJakartaSans_Medium,
    color: '#7E8CA0',
    fontSize: RFPercentage(2),
    lineHeight: 25,
  },
  ratingText: {
    fontFamily: Fonts.PlusJakartaSans_Bold,
    color: Colors.Text,
    fontSize: RFPercentage(2),
    lineHeight: 25,
    marginLeft: 5,
  },
  rowViewSB: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  variationText: {
    fontSize: RFPercentage(1.6),
    color: '#02010E',
    fontFamily: Fonts.PlusJakartaSans_Medium,
  },
  variationTxt: {
    color: '#02010E',
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(1.7),
    marginBottom: hp(1)
  },

});

export default AddItems;
