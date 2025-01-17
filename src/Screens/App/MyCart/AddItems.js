import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import StackHeader from '../../../components/Header/StackHeader';
import {  Fonts, Icons } from '../../../constants';
import api from '../../../constants/api';
import Loader from '../../../components/Loader';
import {
  addItemToCart,
  getCartItems,
  removeCartItemQuantity,
  updateCartItemQuantity,
} from '../../../utils/helpers/cartapis';
import { fetchApisGet, handlePopup, showAlert } from '../../../utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import {
  addItemToMYCart,
  updateMyCartList,
} from '../../../redux/CartSlice';
import RBSheetSuccess from '../../../components/BottomSheet/RBSheetSuccess';
import ItemLoading from '../../../components/Loader/ItemLoading';
import CRBSheetComponent from '../../../components/BottomSheet/CRBSheetComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RadioButton } from 'react-native-paper';
import FoodCards from '../../../components/Cards/FoodCards';
import { addFavoriteitem, removeFavoriteitem } from '../../../utils/helpers/FavoriteApis';
import PopUp from '../../../components/Popup/PopUp';
import NoDataFound from '../../../components/NotFound/NoDataFound';
import { RefreshControl } from 'react-native-gesture-handler';

const AddItems = ({ navigation, route }) => {
  const ref_RBSheetSuccess = useRef();
  const dispatch = useDispatch();
  const {  cart_restaurant_id, my_cart } = useSelector(store => store.cart);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected_item, setSelected_item] = useState('');
  const [isItemLoading, setIsItemLoading] = useState(false);
  const [Item, setItem] = useState()
  const {customer_id, showPopUp, popUpColor, PopUpMesage, customerCartId, Colors} = useSelector(store => store.store)
  const { favoriteItems } = useSelector(store => store.favorite);
  const [itemObj, setItemObj] = useState({})
  const [numColumns, setNumColumns] = useState(2)
  const [Variations, setVariations] = useState([])
  const removeBtmSheet = useRef()
  const [selectedVariation, setSelectedVariation] = useState(null);

 

  const showRmoveBtmSheet = async (item) => {
    console.log(item?.item_name,);
    setSelectedVariation(null)
   setItemObj({
      id: item.item_id,
      variations: item?.item_prices,
      name: item?.item_name,
    })

    if (item.item_prices.length > 1) {
      removeBtmSheet?.current?.open()
      const matchingVariations = my_cart
      .filter(itm => itm.item_id === item.item_id) 
      .map(item => ({
        variation_id: item.variation_id,
        variation_name: item.itemData.variationData.variation_name,
        price: parseFloat(item.itemData.variationData.price),
        quantity: item.quantity,
        sub_total: item.sub_total,
        cart_item_id: item.cart_item_id,
        cart_id: item.cart_id,
        item_id: item.item_id
  
      }));

      const array3 = (
      
      Array.isArray(item?.item_prices)
        ? item?.item_prices
        : []
    ).map(item2 => {
      if (!item2) return {}; // Fallback for undefined `item2`

      const match = matchingVariations?.find(item1 => item1?.variation_id === item2?.variation_id);
      return match || item2; // Use match if found, else fallback to item2
    });
  
      setVariations(array3)
    } else {
      handleAddToCartDecrement(item.item_prices[0].variation_id, item.item_id, item?.item_name,)
    }
   
  }

  const closeRmoveBtmSheet = () => {
    removeBtmSheet?.current?.close()
    setItemObj({})
  }

  const checkVariationInCart = async (array, id) => {
    if (!itemObj.id) return;

    // Fetch and update cart items
    // const cartItems = await getCartItems(customerCartId, dispatch);
    let cartItems;
    const response = await fetchApisGet(api.get_cart_items + customerCartId, false, dispatch)
    if (response.status) {
      console.log(response);

      dispatch(updateMyCartList(response.result));
      cartItems = response.result;
    }


    // Filter items matching the route ID
    const filteredItems = cartItems?.filter(item => item?.item_id === itemObj.id);


    // Calculate total quantity

    // Create matching variations
    const matchingVariations = filteredItems?.map(item => ({
      variation_id: item?.variation_id,
      variation_name: item?.itemData?.variationData?.variation_name,
      price: parseFloat(item?.itemData?.variationData?.price || 0),
      quantity: item?.quantity || 0,
      sub_total: item?.sub_total || 0,
      cart_item_id: item?.cart_item_id,
      cart_id: item?.cart_id,
      item_id: item?.item_id,
    }));

    // Map item prices with matching variations
    const array3 = (Array.isArray(array)
    ? array
    : Array.isArray( itemObj.variations)
      ? itemObj.variations
      : []
  ).map(item2 => {
    if (!item2) return {}; // Fallback for undefined `item2`

      const match = matchingVariations?.find(item1 => item1?.variation_id === item2?.variation_id);
      return match || item2; // Use match if found, else fallback to item2
    });

    console.log({ matchingVariations });
    console.log({ array3 });

    setVariations(array3);
  };




  const add_item_to_cart = async (id, type, name, item_id) => {
    let dataa = type === 'item' ? {
      item_id: item_id ? item_id : itemObj.id ,
      cart_id: customerCartId.toString(),
      item_type: type,
      comments: 'Adding item in cart',
      quantity: 1,
      variation_id: id
    } : {
      item_id: id,
      cart_id: customerCartId.toString(),
      item_type: 'deal',
      comments: '',
      quantity: 1,
    };

    


    await addItemToCart(dataa, dispatch)
      .then(async  response => {
        console.log('response ', response);
        if (response?.status == true) {
          checkVariationInCart()
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
          let cartItems = await getCartItems(customerCartId, dispatch);
            dispatch(updateMyCartList(cartItems));


          handlePopup(dispatch,`${name ? name : itemObj.name} is added to cart`, 'green');
        
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
        let newList = [];
        for (const item of list) {
          const filter = my_cart?.filter(e => e?.item_id == item?.item_id);
          const totalQuantity = filter.reduce((sum, item) => sum + (item.quantity || 0), 0);
          let obj = {
            ...item,
            quantity: totalQuantity,
          };
          newList.push(obj);
        }
        setData(newList);
      })
      .catch(err =>  handlePopup(dispatch, 'Something is went wrong', 'red')    )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getData();
  }, []);

  const handleAddToCart = async (variation_id, item_id, name) => {
    setSelectedVariation(variation_id)
    console.log(variation_id, item_id);
    

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
        if (checkVariation.length === 0) {
        add_item_to_cart(variation_id, 'item',name, item_id);
        } else {

          let obj = {
            cart_item_id: checkVariation[0]?.cart_item_id,
            quantity: checkVariation[0]?.quantity + 1,
          };
          await updateCartItemQuantity(obj, dispatch)
            .then(async(response) => {
              if (response.status === true) {
                checkVariationInCart()
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
                let cartItems = await getCartItems(checkVariation[0]?.cart_id, dispatch);
                dispatch(updateMyCartList(cartItems));
              }
            })
        }
      } else {
        add_item_to_cart(variation_id, 'item',name, item_id);
      }
    }
  };

  


  const handleDelete = async (item) => {
    const filter = my_cart?.filter(
      item => item?.item_id == item.item_id
    );
    const response = await removeCartItemQuantity({item_id: filter[0]?.cart_item_id, cart_id: filter[0]?.cart_id })
    if (response.status) {
      checkVariationInCart()
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
      
      const cartData = my_cart?.filter(item => item.cart_item_id !== filter[0]?.cart_item_id);
      dispatch(updateMyCartList(cartData));
      handlePopup(dispatch, `${itemObj.name} removed from cart`,'green' )
    }else{
      handlePopup(dispatch, `Unable to remove ${item.item_name} from cart`, 'red' )
      closeRmoveBtmSheet()
    }
  }
    const handleAddToCartDecrement = async (variation_id, item_id, name) => {
    setSelectedVariation(variation_id)
  

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
        if (checkVariation.length > 0) {
          if (checkVariation[0]?.quantity === 1) {
            await removeCartItemQuantity({item_id: checkVariation[0]?.cart_item_id, cart_id: checkVariation[0]?.cart_id })
            .then(response => {
              if (response.status) {
                checkVariationInCart()
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
            } 
            })
          }else{
            let obj = {
              cart_item_id: checkVariation[0]?.cart_item_id,
              quantity: checkVariation[0]?.quantity - 1,
            };
            await updateCartItemQuantity(obj, dispatch)
              .then(response => {
                console.log({response});
                
                if (response.status === true) {
                  checkVariationInCart()
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
    }
  };

  const isItemFavorite = (id) => {
    return favoriteItems.some(item => item?.item?.item_id === id);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.secondary_color,
      alignItems: 'center',
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
    addbtn: {
      backgroundColor: Colors.button.primary_button,
      paddingHorizontal: wp(2),
      paddingVertical: wp(2),
      borderRadius: wp('50%'),
    }
  
  });
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
                              if ( item?.quantity === 1) {
                                handleDelete(item)
                              } else {
                                if (item.item_prices.length > 1) {
                                  showRmoveBtmSheet(item) 
                                } else {
                                  handleAddToCartDecrement(item.item_prices[0].variation_id, item.item_id, item?.item_name,)
                                }
                              }
                             
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
                              if (item.item_prices.length > 1) {
                                showRmoveBtmSheet(item) 
                              } else {
                                handleAddToCart(item.item_prices[0].variation_id, item.item_id, item?.item_name,)
                              }
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
                        style={styles.addbtn}
                        onPress={() => {
                          if (item.item_prices.length > 1) {
                            setItem(item);
                            showRmoveBtmSheet(item);
                          } else {
                            handleAddToCart(
                              item.item_prices[0].variation_id,
                              item.item_id,
                              item?.item_name
                            );
                          }
                        }}
                      >
                        <AntDesign name="plus" size={12} color={Colors.button.primary_button_text} />
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
        svg={<Icons.OrangeSuccessCheckLogoutIcon/>}
        onPress={() => {
          ref_RBSheetSuccess?.current?.close();
        }}
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
              <View key={i} style={[styles.rowViewSB, { borderBottomColor: Colors.borderGray, borderBottomWidth: wp(0.3), paddingBottom: wp(1) }]}>
                <TouchableOpacity style={styles.rowView} >
                  <View>

                  </View>
                  <RadioButton
                    color={Colors.primary_color} // Custom color for selected button
                    uncheckedColor={Colors.primary_color} // Color for unselected buttons
                    status={selectedVariation?.variation_id === variation?.variation_id ? 'checked' : 'unchecked'}
                  />
                  <Text style={styles.variationText}>{variation.variation_name}</Text>
                </TouchableOpacity>

                {
                  variation?.cart_item_id ? <View
                    style={{
                      ...styles.rowView,
                      backgroundColor: `${Colors.primary_color}`,
                      borderRadius: 15,
                      paddingVertical: 5,
                      flex: 0.3,
                      alignSelf: 'flex-end',
                      justifyContent: 'space-around'
                    }}>
                    <TouchableOpacity
                      onPress={() =>  handleAddToCartDecrement(variation?.variation_id, variation.item_id)}
                      style={{
                        backgroundColor: `${Colors.secondary_color}40`,
                        borderRadius: wp(3),
                      }}>
                      <AntDesign name="minus" color={Colors.secondary_color} size={16} />
                    </TouchableOpacity>
                    <Text
                      style={{
                        color: Colors.secondary_color,
                        fontFamily: Fonts.PlusJakartaSans_Bold,
                        fontSize: RFPercentage(1.5),
                        marginTop: -2,
                        backgroundColor: `${Colors.secondary_color}40`,
                        borderRadius: wp(3),
                        paddingHorizontal: wp(1.5),

                      }}>
                      {variation?.quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>  handleAddToCart(variation.variation_id, itemObj.id)}
                      style={{
                        backgroundColor: `${Colors.secondary_color}40`,
                        borderRadius: wp(3),
                        paddingHorizontal: wp(0),
                      }}>
                      <AntDesign name="plus" color={Colors.secondary_color} size={16} />
                    </TouchableOpacity>
                  </View> : <TouchableOpacity
                    onPress={() =>  handleAddToCart(variation.variation_id, itemObj.id)}
                    style={{
                      backgroundColor: `${Colors.primary_color}`,
                      borderRadius: wp(3),
                      padding: wp(0.5),
                      marginRight: wp(2)
                    }}>
                    <AntDesign name="plus" color={Colors.secondary_color} size={16} />
                  </TouchableOpacity>
                }



              </View>
            ))}

          </View>
        }

      />


          

    </View>
  );
};



export default AddItems;
