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
// import FoodCard from '../../../components/Cards/FoodCard';
import Chip from '../../../components/Chip.js';
import FoodCardWithRating from '../../../components/Cards/FoodCardWithRating';
import api from '../../../constants/api';
import Loader from '../../../components/Loader';
import { BASE_URL_IMAGE } from '../../../utils/globalVariables';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addItemToCart,
  clearCartItems,
  getCartItems,
  getCustomerCart,
  removeCartItemQuantity,
  removeItemFromCart,
  updateCartItemQuantity,
} from '../../../utils/helpers/cartapis';
import { checkRestaurantTimings, handlePopup, showAlert } from '../../../utils/helpers';
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
import OrangeSuccessCheck from '../../../Assets/svg/orangeSuccessCheck.svg';
import AddButton from '../../../Assets/svg/addButton.svg';
import FoodCards from '../../../components/Cards/FoodCards';
import { addFavoriteitem, removeFavoriteitem } from '../../../utils/helpers/FavoriteApis';
import PopUp from '../../../components/Popup/PopUp';
import NoDataFound from '../../../components/NotFound/NoDataFound';
import { RefreshControl } from 'react-native-gesture-handler';

const AddItems = ({ navigation, route }) => {
  const ref_RBSheetSuccess = useRef();
  const dispatch = useDispatch();
  const {  cart_restaurant_id, my_cart } = useSelector(store => store.cart);
  const ref_cartAlert = useRef();
  const ref_RBSheetResClosed = useRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected_restaurant_id, setSelected_restaurant_id] = useState('');
  const [selected_item, setSelected_item] = useState('');
  const [isItemLoading, setIsItemLoading] = useState(false);
  const [Item, setItem] = useState()
  const [restaurant_timings, setRestaurant_timings] = useState('');
  const {customer_id, showPopUp, popUpColor, PopUpMesage, cuisines, items} = useSelector(store => store.store)
  const { favoriteItems } = useSelector(store => store.favorite);
  const [itemObj, setItemObj] = useState({})
  const [numColumns, setNumColumns] = useState(2)
  const [Variations, setVariations] = useState([])
  const btmSheetRef = useRef()
  const removeBtmSheet = useRef()
  const [selectedVariation, setSelectedVariation] = useState(null);

 

  const showBtmSheet = async (item) => {
    setSelectedVariation(null)
   setItemObj({
      id: item.item_id,
      variations: item.item_prices,
      name: item?.item_name,
    })
       console.log(itemObj)

    if (item.item_prices.length > 1) {
      btmSheetRef?.current?.open()
    } else {
      handleAddToCart(item.item_prices[0].variation_id, item.item_id, item?.item_name,)
    }
   
  }
  // console.log(my_cart[0]);
  
  const showRmoveBtmSheet = async (item) => {
    // console.log({item});
    console.log(item?.item_name,);
    setSelectedVariation(null)
   setItemObj({
      id: item.item_id,
      variations: item?.item_prices,
      name: item?.item_name,
    })
      //  console.log(itemObj)

    if (item.item_prices.length > 1) {
      removeBtmSheet?.current?.open()
      const matchingVariations = my_cart
      .filter(itm => itm.item_id === item.item_id) 
      .map(item => {

        console.log(item);
        
        
        return({
        variation_id: item.variation_id,
        variation_name: item?.itemData?.variationData?.variation_name,
        price: parseFloat(item?.itemData?.variationData?.price),
        quantity: item.quantity,
        sub_total: item.sub_total,
        cart_item_id: item.cart_item_id,
        cart_id: item.cart_id,
        item_id: item.item_id
  
      })});
  // console.log({matchingVariations});
  
      setVariations(matchingVariations)
    } else {
      handleAddToCartDecrement(item.item_prices[0].variation_id, item.item_id, item?.item_name,)
    }
   
  }
  const closeBtmSheet = () => {
    btmSheetRef?.current?.close()
    setItemObj({})
  }
  const closeRmoveBtmSheet = () => {
    removeBtmSheet?.current?.close()
    setItemObj({})
  }



  const add_item_to_cart = async (id, type, name, item_id) => {
    let cart = await getCustomerCart(customer_id, dispatch);
    // console.log('______cart    :  ', cart?.cart_id);
    console.log({item_id});
    


    let dataa = type === 'item' ? {
      item_id: item_id ? item_id : itemObj.id ,
      cart_id: cart?.cart_id?.toString(),
      item_type: type,
      comments: 'Adding item in cart',
      quantity: 1,
      variation_id: id
    } : {
      item_id: id,
      cart_id: cart?.cart_id?.toString(),
      item_type: 'deal',
      comments: '',
      quantity: 1,
    };

    console.log(dataa);
    


    await addItemToCart(dataa, dispatch)
      .then(async response => {
        console.log('response ', response);
        if (response?.status == true) {
          const newDataa = data?.map(element => {
            if (element?.item_id == item_id) {
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
          setData(newDataa);
          dispatch(addItemToMYCart(response?.result));
          setSelectedVariation(null)

          handlePopup(dispatch,`${name ? name : itemObj.name} is added to cart`, 'green');
          let cartItems = await getCartItems(cart.cart_id, dispatch);
          dispatch(updateMyCartList(cartItems));
        
        } else {
          handlePopup(dispatch,response?.message, 'red');
        }
      })
      .catch(error => {
        console.log('error  :  ', error);
      })
      .finally(() => {
        setLoading(false)
      });
  };

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
          // console.log("filter", filter);
          
          // getting restaurant timings
          // let time_obj = await checkRestaurantTimings(item?.restaurant_id);
          const totalQuantity = filter.reduce((sum, item) => sum + (item.quantity || 0), 0);
          let obj = {
            ...item,
            quantity: totalQuantity,
            // restaurant_timings: time_obj,
          };
          // console.log("filter", obj);
          newList.push(obj);
        }
        setData(newList);
      })
      .catch(err =>  handlePopup(dispatch, 'Something is went wrong', 'red')    )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getData();
    // closeRmoveBtmSheet()
  }, []);

  const handleAddToCart = async (variation_id, item_id, name) => {
    setSelectedVariation(variation_id)
    console.log(variation_id, item_id);
    

    if (variation_id === null) {
      showBtmSheet()
    } else {
      const filter = my_cart?.filter(
        item => item?.item_id == item_id
      );
    

      if (filter?.length > 0) {
        const checkVariation = filter?.filter(
          item =>
            item?.variation_id == variation_id,
        )

        // console.log({checkVariation});
        

        if (checkVariation.length === 0) {
        add_item_to_cart(variation_id, 'item',name, item_id);
          closeBtmSheet()
        } else {

          let obj = {
            cart_item_id: checkVariation[0]?.cart_item_id,
            quantity: checkVariation[0]?.quantity + 1,
          };
          closeBtmSheet()
          await updateCartItemQuantity(obj, dispatch)
            .then(async(response) => {
              if (response.status === true) {
                handlePopup(dispatch,`${name ?  name : itemObj.name} quantity updated`, 'green' )
                const newDataa = data?.map(element => {
                  if (element?.item_id == item_id) {
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
                setData(newDataa);
                // const newData = my_cart?.map(item => {
                //   // console.log( "item:  ",item);
                  
                //   if (item?.cart_item_id == checkVariation[0]?.cart_item_id) {
                //     return {
                //       ...item,
                //       quantity: item?.quantity + 1,
                //     };
                //   } else {
                //     return { ...item };
                //   }
                // });
                let cartItems = await getCartItems(checkVariation[0]?.cart_id, dispatch);
                dispatch(updateMyCartList(cartItems));
              }
            })
        }
      } else {
        add_item_to_cart(variation_id, 'item',name, item_id);
        closeBtmSheet()
      }
    }
  };

  


  const handleDelete = async (item) => {
    const filter = my_cart?.filter(
      item => item?.item_id == item.item_id
    );
    const response = await removeCartItemQuantity({item_id: filter[0]?.cart_item_id, cart_id: filter[0]?.cart_id })
    if (response.status) {
      closeRmoveBtmSheet()
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
      // let cartItems = await getCartItems(filter[0]?.cart_id, dispatch);
      // dispatch(updateMyCartList(cartItems));
      // // setData(filter);
      // dispatch(addToCart(cartItems)); 

      const cartData = my_cart?.filter(item => item.cart_item_id !== filter[0]?.cart_item_id);
      dispatch(updateMyCartList(cartData));

      //my_cart
      // dispatch(removeItemFromMyCart(item?.cart_item_id));
      handlePopup(dispatch, `${item.item_name} removed from cart`,'green' )
    }else{
      handlePopup(dispatch, `Unable to remove ${item.item_name} from cart`, 'red' )
      closeRmoveBtmSheet()
    }

    
    // console.log({filter});
  }
    const handleAddToCartDecrement = async (variation_id, item_id, name) => {
    setSelectedVariation(variation_id)
    // console.log({variation_id, item_id});
    // let cart = await getCustomerCart(customer_id, dispatch);
    // console.log({cart});
    

    if (variation_id === null) {
      showRmoveBtmSheet()
    } else {
      const filter = my_cart?.filter(
        item => item?.item_id == item_id
      );

    

      if (filter?.length > 0) {
        const checkVariation = filter?.filter(
          item =>
            item?.variation_id == variation_id,
        )
        // console.log({filter});

        

        // console.log(checkVariation[0].itemData.item_name, 'variation');
        closeRmoveBtmSheet()
        // console.log('hgcgfc');

        

        if (checkVariation.length > 0) {
        console.log('hgcgfc');

          if (checkVariation[0]?.quantity === 1) {
            await removeCartItemQuantity({item_id: checkVariation[0]?.cart_item_id, cart_id: checkVariation[0]?.cart_id })
            .then(response => {
              if (response.status) {
                const newDataa = data?.map(element => {
                  if (element?.item_id == item_id) {
                    return {
                      ...element,
                      quantity: element.quantity ? element.quantity - 1 : 1,
                    };
                  } else {
                    return {
                      ...element,
                    };
                  }
                });
                setData(newDataa);
                const newData = my_cart?.filter(item => item.cart_item_id !== checkVariation[0]?.cart_item_id);
                dispatch(updateMyCartList(newData));
                handlePopup(dispatch,`1 ${name ?  name : itemObj?.name} removed from cart`, 'green' )
            } else {
              
            }})
          }else{
            let obj = {
              cart_item_id: checkVariation[0]?.cart_item_id,
              quantity: checkVariation[0]?.quantity - 1,
            };
         
            // console.log({obj});
            
            await updateCartItemQuantity(obj, dispatch)
              .then(response => {
                console.log({response});
                
                if (response.status === true) {
                  handlePopup(dispatch,`1 ${name ?  name : itemObj?.name} removed from cart`, 'green' )
                  const newDataa = data?.map(element => {
                    if (element?.item_id == item_id) {
                      return {
                        ...element,
                        quantity: element.quantity ? element.quantity - 1 : 1,
                      };
                    } else {
                      return {
                        ...element,
                      };
                    }
                  });
                  setData(newDataa);
                  const newData = my_cart?.map(item => {
                    // console.log( "item:  ",item);
                    
                    if (item?.cart_item_id == checkVariation[0]?.cart_item_id) {
                      return {
                        ...item,
                        quantity: item?.quantity - 1,
                      };
                    } else {
                      return { ...item };
                    }
                  });
                  dispatch(updateMyCartList(newData));
                }
              })
          }

          
        }
      }
      //  else {
      //   add_item_to_cart(variation_id, 'item',name, item_id);
      //   closeBtmSheet()
      // }
    }
  };

  const isItemFavorite = (id) => {
    return favoriteItems.some(item => item?.item?.item_id === id);
  };

  
  // const onIncrement = async item => {
  //   setIsItemLoading(true);
  //   const newData = data?.map(element => {
  //     if (element?.item_id == item?.item_id) {
  //       return {
  //         ...element,
  //         quantity: element.quantity ? element.quantity + 1 : 1,
  //       };
  //     } else {
  //       return {
  //         ...element,
  //       };
  //     }
  //   });
  //   setData(newData);

  //   // also update quantity in database and redux state
  //   const filter = my_cart?.filter(e => e?.item_id == item?.item_id);
  //   if (filter?.length > 0) {
  //     let newQuantity = item?.quantity + 1;
  //     let obj = {
  //       cart_item_id: filter[0]?.cart_item_id,
  //       quantity: newQuantity,
  //     };
  //     console.log({ newQuantity });
  //     await updateCartItemQuantity(obj, dispatch);
  //     // also update quantity in redux
  //     const newData1 = my_cart?.map(e => {
  //       if (e?.item_id == item?.item_id) {
  //         return {
  //           ...e,
  //           quantity: newQuantity,
  //         };
  //       } else {
  //         return { ...e };
  //       }
  //     });

  //     dispatch(updateMyCartList(newData1));
  //     dispatch(setCartRestaurantId(selected_restaurant_id));
  //     // ref_RBSheetSuccess?.current?.open();
  //   }
  //   setIsItemLoading(false);
  // };

  // const onDecrement = async item => {
  //   console.log('item : ', item?.quantity);
  //   if (item?.quantity <= 1) {
  //     //remove that item,
  //     handleRemoveItemFromCart(item);
  //     return;
  //   }

  //   setIsItemLoading(true);
  //   const newData = data?.map(element => {
  //     if (element?.item_id == item?.item_id) {
  //       return {
  //         ...element,
  //         quantity: element.quantity - 1,
  //       };
  //     } else {
  //       return {
  //         ...element,
  //       };
  //     }
  //   });
  //   setData(newData);

  //   // also update quantity in database and redux state
  //   const filter = my_cart?.filter(e => e?.item_id == item?.item_id);
  //   if (filter?.length > 0) {
  //     let obj = {
  //       cart_item_id: filter[0]?.cart_item_id,
  //       quantity: filter[0]?.quantity - 1,
  //     };
  //     await updateCartItemQuantity(obj, dispatch);
  //     // also update quantity in redux
  //     const newData1 = my_cart?.map(item => {
  //       if (item?.item_id == route?.params?.id) {
  //         return {
  //           ...item,
  //           quantity: filter[0]?.quantity - 1,
  //         };
  //       } else {
  //         return { ...item };
  //       }
  //     });

  //     dispatch(updateMyCartList(newData1));
  //     dispatch(setCartRestaurantId(selected_restaurant_id));
  //     setIsItemLoading(false);
  //   }
  //   setIsItemLoading(false);
  // };

  // const add_item_to_cart = async (item, variation_id) => {
  //   setLoading(true);
  //   // let customer_id = await AsyncStorage.getItem('customer_id');
  //   console.log('customer_Id :  ', customer_id);
  //   let cart = await getCustomerCart(customer_id, dispatch);
  //   let data = {
  //     item_id: item?.item_id,
  //     cart_id: cart?.cart_id,
  //     item_type: 'item',
  //     comments: '',
  //     quantity: 1,
  //     variation_id: variation_id
  //   };
  //   console.log('data   :  ', data);

  //   await addItemToCart(data, dispatch)
  //     .then(response => {
  //       console.log('response ', response);
  //       if (response?.status == true) {
  //         // navigation?.navigate('MyCart');
  //         dispatch(setCartRestaurantId(selected_restaurant_id));
  //         //my_cart
  //         dispatch(addItemToMYCart(response?.result));

  //         // navigation.goBack();
  //         // cart_restaurant_id
  //         ref_RBSheetSuccess?.current?.open();
  //         updateList(item);
  //       } else {
  //         showAlert(response?.message);
  //       }
  //     })
  //     .catch(error => {
  //       console.log('error  :  ', error);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

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
  // const handleRemoveItemFromCart = async item => {
  //   try {
  //     setIsItemLoading(true);
  //     console.log('item   :  ', item?.cart_item_id);
  //     // let customer_id = await AsyncStorage.getItem('customer_id');
  //     let cart = await getCustomerCart(customer_id, dispatch);
  //     console.log('cart  : ', cart);

  //     removeItemFromCart(cart?.cart_id, item?.item_id, dispatch)
  //       .then(response => {
  //         if (response?.status == true) {
  //           console.log('response  :  ', response);
  //           const newData = data?.map(e => {
  //             if (e?.item_id == item.item_id) {
  //               return {
  //                 ...e,
  //                 quantity: 0,
  //               };
  //             } else {
  //               return { ...e };
  //             }
  //           });
  //           setData(newData);
  //           const filter = data.filter(
  //             element => element?.item_id != item?.item_id,
  //           );
  //           // setData(filter);
  //           dispatch(addToCart(filter));

  //           //my_cart
  //           // dispatch(removeItemFromMyCart(item?.cart_item_id));
  //           dispatch(updateMyCartList(filter));

  //           let filter1 = newData?.filter(e => e?.quantity > 0);
  //           if (filter1?.length == 0) {
  //             dispatch(setCartRestaurantId(null));
  //           }
  //         } else {
  //           setTimeout(() => {
  //             showAlert(response?.message);
  //           }, 500);
  //         }
  //       })
  //       .catch(error => {
  //         console.log('error: ', error);
  //       })
  //       .finally(() => {
  //         setIsItemLoading(false);
  //       });
  //   } catch (error) {
  //     setIsItemLoading(false);
  //     console.log('error in delete item  :  ', error);
  //   }
  // };

  // const handlePress = async (item, id) => {
  //   setSelectedVariation(id);

  //   const filter = my_cart?.filter(
  //     item => item?.item_id == route?.params?.id,
  //   );
  //   if (filter?.length > 0) {
  //     let obj = {
  //       cart_item_id: filter[0]?.cart_item_id,
  //       quantity: filter[0]?.quantity + count,
  //     };
  //     await updateCartItemQuantity(obj, dispatch);
  //     // also update quantity in redux
  //     const newData = my_cart?.map(item => {
  //       if (item?.item_id == route?.params?.id) {
  //         return {
  //           ...item,
  //           quantity: filter[0]?.quantity + count,
  //         };
  //       } else {
  //         return { ...item };
  //       }
  //     });
  //     dispatch(updateMyCartList(newData));
  //     dispatch(setCartRestaurantId(restaurantDetails?.restaurant_id));
  //     ref_RBSheetSuccess?.current?.open();
  //     closeBtmSheet()
  //   } else {
  //     add_item_to_cart(item, id);
  //     closeBtmSheet()

  //   }


  // };
  
  // const handleOnRemove = () => {
  //   setLoading(true);
  //   clearCartItems()
  //     .then(response => {
  //       //add new item
  //       dispatch(setCartRestaurantId());
  //       console.log('new cart restaurant_id : ', selected_restaurant_id);
  //       add_item_to_cart(selected_item);
  //       //my_cart
  //       dispatch(updateMyCartList([]));
  //       const newData = data?.map(e => {
  //         return {
  //           ...e,
  //           quantity: 0,
  //         };
  //       });
  //       setData(newData);
  //     })
  //     .catch(error => {
  //       console.log('error : ', error);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

  // const validate = restaurant_id => {
  //   console.log({ cart_restaurant_id, restaurant_id });
  //   if (cart_restaurant_id == null) {
  //     console.log('cart_restaurant_id is null...');
  //     return true;
  //   } else if (cart_restaurant_id != restaurant_id) {
  //     console.log('cart_restaurant_id  : ', cart_restaurant_id, restaurant_id);
  //     ref_cartAlert.current.open();
  //     return false;
  //   } else {
  //     return true;
  //   }
  // };

  // const updateList = item => {
  //   const newData = data?.map(element => {
  //     if (element?.item_id == item?.item_id) {
  //       return {
  //         ...element,
  //         quantity: element.quantity ? element.quantity + 1 : 1,
  //       };
  //     } else {
  //       return {
  //         ...element,
  //       };
  //     }
  //   });
  //   setData(newData);
  // };
 
  // const setCusineNameByItemCusineId = (cusineId) => {
  //   const cuisineName = cuisines?.filter(item => item?.cuisine_id === cusineId)[0]?.cuisine_name;
  //   // console.log(cuisineName);

  //   return cuisineName;
  // }

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      {showPopUp && <PopUp color={popUpColor} message={PopUpMesage} />}
      <StatusBar
        backgroundColor={'#FFFFFF'}
        barStyle={'dark-content'}
        translucent={false}
      />

      <View style={{}}>
        <FlatList
          refreshControl={<RefreshControl refreshing={false} onRefresh={()=> getData()} colors={[Colors.primary_color]} />}
          ListFooterComponent={() => <View style={{ height: hp(3) }} />}
          ListHeaderComponent={() => <StackHeader title={'Add Items'} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={() =>!loading && <NoDataFound svgHeight={hp(15)} text={'No Items'} textStyle={{fontSize : RFPercentage(2.5)}}  /> }
          // numColumns={2}
          // columnWrapperStyle={{
          //   justifyContent: 'space-between',
          //   paddingHorizontal: 20,
          // }}
          data={data}
          ItemSeparatorComponent={() => <View style={{ height: hp(3) }} />}
          key={numColumns}
          numColumns={numColumns}
          renderItem={({ item }) => {
            const fav = isItemFavorite(item?.item_id)
            return (
              <>

                <FoodCards
                  isFavorite={fav}
                  image={item?.images[0]}
                  description={item.description}
                  price={item?.item_prices ? item?.item_prices[0]?.price : item?.item_variations[0]?.price}
                  heartPress={() => fav ? removeFavoriteitem(item?.item_id, customer_id, favoriteItems, dispatch, showAlert) : addFavoriteitem(item?.item_id, customer_id, dispatch, showAlert)}
                  title={item?.item_name}
                  item={item}
                  id={item?.item_id}
                  onPress={() =>
                    navigation?.navigate('ItemDetails', {
                      id: item?.item_id,
                    })
                  }
                  addToCart={() => showBtmSheet(item)}
                  newComponent={
                    <>
                      {isItemLoading && item?.item_id == selected_item?.item_id ? (
                        <ItemLoading loading={isItemLoading} />
                      ) : item?.quantity > 0 ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: `${Colors.primary_color}30`,
                            borderRadius: 25,
                            paddingVertical: 2,
                            paddingHorizontal: 2,
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              // setSelected_item(item);
                              // setSelected_restaurant_id(item?.restaurant_id);
                              // onDecrement(item);
                              // setRestaurant_timings(item?.restaurant_timings);
                              item?.quantity === 1? handleDelete(item): showRmoveBtmSheet(item)
                              
                             
                            }}
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 5,
                            }}>
                            <AntDesign
                              name="minus"
                              color={Colors.primary_color}
                              size={16}
                            />
                          </TouchableOpacity>
                          <Text
                            style={{
                              color: Colors.primary_color,
                              fontFamily: Fonts.PlusJakartaSans_Bold,
                              fontSize: RFPercentage(2),
                              marginTop: -2,
                            }}>
                            {item?.quantity}
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              // setSelected_item(item);
                              // setSelected_restaurant_id(item?.restaurant_id);
                              // onIncrement(item);
                              // setRestaurant_timings(item?.restaurant_timings);
                              showBtmSheet(item)
                            }}
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 5,
                            }}>
                            <AntDesign
                              name="plus"
                              color={Colors.primary_color}
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
                          <AddButton width={wp(10)} height={hp(5)} />
                        </TouchableOpacity>
                      )}
                    </>
                  }

                />

              </>
            )
          }
          }

        />
      </View>



      <RBSheetSuccess
        refRBSheet={ref_RBSheetSuccess}
        height={290}
        title={`${Item?.item_name} added to cart.`}
        btnText={'OK'}
        svg={<OrangeSuccessCheck />}
        onPress={() => {
          ref_RBSheetSuccess?.current?.close();
          // navigation.goBack();
        }}
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
                    color={Colors.primary_color} // Custom color for selected button
                    uncheckedColor={Colors.primary_color} // Color for unselected buttons
                    status={selectedVariation === variation.variation_id ? 'checked' : 'unchecked'}
                    onPress={() => handleAddToCart(variation.variation_id, itemObj.id)}
                  />
                  <Text style={styles.variationText}>{variation.variation_name}</Text>
                </View>
                <Text style={styles.variationText}>£ {variation?.price}</Text>
              </View>
            ))}

          </View>
        }

      />
      <CRBSheetComponent
        height={230}
        refRBSheet={removeBtmSheet}
        content={
          <View style={{ width: wp(90) }} >
            <View style={styles.rowViewSB} >
              <Text style={[styles.variationTxt, { fontSize: RFPercentage(2) }]} >Select your variation</Text>
              <TouchableOpacity
                onPress={() => closeRmoveBtmSheet()}>
                <Ionicons name={'close'} size={22} color={'#1E2022'} />
              </TouchableOpacity>
            </View>
            {Variations?.map((variation, i) => (
              <View key={i} style={styles.rowViewSB}>
                <View style={styles.rowView} >
                  <RadioButton
                    color={Colors.primary_color} // Custom color for selected button
                    uncheckedColor={Colors.primary_color} // Color for unselected buttons
                    status={selectedVariation === variation.variation_id ? 'checked' : 'unchecked'}
                    onPress={() => handleAddToCartDecrement(variation?.variation_id, variation.item_id)}
                  />
                  <Text style={styles.variationText}>{variation?.variation_name}</Text>
                </View>
                <Text style={styles.variationText}>£ {variation?.price}</Text>
              </View>
            ))}

          </View>
        }

      />


            {/* <RBSheetOtherRestaurantCartItem
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
       <RBSheetRestaurantClosed
        refRBSheet={ref_RBSheetResClosed}
        title={`“${restaurant_timings?.restaurant_details?.user_name
          }” is closed ${restaurant_timings?.closed_till
            ? ' till ' + restaurant_timings?.closed_till
            : '.'
          }`}
      /> */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary_color,
    alignItems: 'center',
  },
  heading: {
    color: Colors.primary_text,
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
  // title: {
  //   fontFamily: Fonts.PlusJakartaSans_Bold,
  //   color: Colors.Text,
  //   fontSize: RFPercentage(1.7),
  //   lineHeight: 25,
  // },
  // nameText: {
  //   fontFamily: Fonts.PlusJakartaSans_Medium,
  //   color: '#7E8CA0',
  //   fontSize: RFPercentage(2),
  //   lineHeight: 25,
  // },
  // ratingText: {
  //   fontFamily: Fonts.PlusJakartaSans_Bold,
  //   color: Colors.primary_text,
  //   fontSize: RFPercentage(2),
  //   lineHeight: 25,
  //   marginLeft: 5,
  // },
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
    color: Colors.primary_text,
    fontFamily: Fonts.PlusJakartaSans_Medium,
  },
  variationTxt: {
    color: Colors.primary_text,
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(1.7),
    marginBottom: hp(1)
  },

});

export default AddItems;
