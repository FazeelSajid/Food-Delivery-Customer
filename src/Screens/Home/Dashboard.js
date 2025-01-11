import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ScrollView,
  RefreshControl,
  Image,
  Button,
} from 'react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Images, Fonts, Icons } from '../../constants';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import CInput from '../../components/TextInput/CInput';
import api from '../../constants/api';
import Loader from '../../components/Loader';
import {
  getCurrentLocation,
} from '../../utils/helpers/location';
import NoDataFound from '../../components/NotFound/NoDataFound';
import { fetchApisGet, handlePopup, showAlert } from '../../utils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { setLocation, setPromos, setCurrentLocation, setWalletTotalAmount, setSetAllLocation, setContacts, setColors } from '../../redux/AuthSlice';
import { Badge, RadioButton } from 'react-native-paper';
import CRBSheetComponent from '../../components/BottomSheet/CRBSheetComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PagerView from 'react-native-pager-view';
import { setcuisines, setdeals } from '../../redux/AuthSlice';
import WhiteCart from '../../Assets/svg/WhiteCart.svg';
import { addFavoriteDeal, addFavoriteitem, getFavoriteDeals, getFavoriteItem, removeFavoriteitem } from '../../utils/helpers/FavoriteApis';
import { removeFavoriteDeal } from '../../utils/helpers/FavoriteApis';
import FoodCards from '../../components/Cards/FoodCards';
import { addItemToCart, getCartItems, getCustomerCart, removeCartItemQuantity, updateCartItemQuantity } from '../../utils/helpers/cartapis';
import { addItemToMYCart, addToCart, setCartRestaurantId, updateMyCartList } from '../../redux/CartSlice';
import RBSheetSuccess from '../../components/BottomSheet/RBSheetSuccess';
import DealCard from '../../components/Cards/DealCard';
import ItemLoading from '../../components/Loader/ItemLoading';
import { GetWalletAmount } from '../../utils/helpers/walletApis';
import PopUp from '../../components/Popup/PopUp';
import RBSheetGuestUser from '../../components/BottomSheet/RBSheetGuestUser';
import socket from '../../utils/Socket';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { BASE_URL } from '../../utils/globalVariables';



const Dashboard = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { customer_id, cuisines, items, deals, promos, currentLocation, showPopUp, popUpColor, PopUpMesage, join_as_guest, customerCartId, Colors } = useSelector(store => store.store);
  const { cart_restaurant_id, my_cart } = useSelector(store => store.cart);
  const { favoriteItems, favoriteDeals } = useSelector(store => store.favorite);
  const [isSearch, setIsSearch] = useState(false);
  const [itemObj, setItemObj] = useState({})
  const [Variations, setVariations] = useState([])
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [itemLoading, setItemLoading] = useState(false);
  const [dealLoading, setDealLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [searchedItems, setSearchedItems] = useState([]);
  const [showSearchedData, setShowSearchedData] = useState(false);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [item, setItems] = useState([])
  const [allSelected, setAllSelected] = useState(true)
  const locationBtmSheetRef = useRef()
  const [Cuisine, setCuisine] = useState([]);
  const [promoCodes, setPromoCodes] = useState([])
  const pagerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const btmSheetRef = useRef()
  const ref_RBSheetSuccess = useRef();
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [numColumns, setNumColumns] = useState(2)
  const [searchLoading, setSearchLoading] = useState()
  const ref_RBSheetGuestUser = useRef(null);
  const [isItemLoading, setIsItemLoading] = useState(false);


  const onPageSelected = (e) => {
    setCurrentPage(e.nativeEvent.position);
  };
  const [searchBtns, setSearchBtns] = useState({
    all: true,
    category: false,
    price: false,
    priceUp: false,
    priceDown: false,
  })
  const handlePriceSort = () => {
    let sortedItems = [...searchedItems];

    if (searchBtns.priceUp) {
      sortedItems.sort((a, b) => a.price - b.price);
    } else if (searchBtns.priceDown) {
      sortedItems.sort((a, b) => b.price - a.price);
    }
    setSearchedItems(sortedItems);
  };
  const handlePriceToggle = () => {
    if (!searchBtns.price) {
      setSearchBtns({ price: true, priceUp: true, priceDown: false });
    } else if (searchBtns.priceUp) {
      setSearchBtns({ price: true, priceUp: false, priceDown: true });
    } else if (searchBtns.priceDown) {
      setSearchBtns({ price: false, priceUp: false, priceDown: false });
    }

    handlePriceSort();
  };

  const renderPaginationDots = () => {
    return (
      <View
        style={[styles.paginationContainer]}>
        {promoCodes.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: currentPage === index ? Colors.primary_color : Colors.secondary_text,
                width: currentPage === index ? wp(6.5) : wp(2),
              },
            ]}
          />
        ))}
      </View>
    );
  };
  const showLocationBtmSheet = () => {
    locationBtmSheetRef?.current?.open()
  }
  const closeLocationBtmSheet = () => {
    locationBtmSheetRef?.current?.close()
  }
  const ItemSeparator = () => (
    <View
      style={{
        height: hp(0.1),
        marginVertical: 10,
        backgroundColor: Colors.borderGray,
      }}
    />
  );
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
      : Array.isArray(itemObj.variations)
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

  const handleAddToCartDecrement = async (variation_id, item_id, name) => {
    setSelectedVariation(variation_id)



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




        if (checkVariation.length > 0) {

          if (checkVariation[0]?.quantity === 1) {
            await removeCartItemQuantity({ item_id: checkVariation[0]?.cart_item_id, cart_id: checkVariation[0]?.cart_id })
              .then(response => {
                if (response.status) {
                  checkVariationInCart()
                  const newDataa = item?.map(element => {
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
                  setItems(newDataa);

                  const newData = my_cart?.filter(item => item.cart_item_id !== checkVariation[0]?.cart_item_id);
                  dispatch(updateMyCartList(newData));
                  handlePopup(dispatch, `1 ${name ? name : itemObj?.name} removed from cart`, 'green')
                }

              })
          } else {
            let obj = {
              cart_item_id: checkVariation[0]?.cart_item_id,
              quantity: checkVariation[0]?.quantity - 1,
            };

            // console.log({obj});

            await updateCartItemQuantity(obj, dispatch)
              .then(response => {
                console.log({ response });

                if (response.status === true) {
                  checkVariationInCart()
                  handlePopup(dispatch, `1 ${name ? name : itemObj?.name} removed from cart`, 'green')
                  const newDataa = item?.map(element => {
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
                  setItems(newDataa);
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

  const showBtmSheet = async (item) => {

    setSelectedVariation(null)
    setItemObj({
      id: item.item_id,
      variations: item?.item_prices,
      name: item?.item_name,
    })

    if (item.item_prices.length > 1) {
      btmSheetRef?.current?.open()
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
        if (!item2) return {};

        const match = matchingVariations?.find(item1 => item1?.variation_id === item2?.variation_id);
        return match || item2;
      });

      setVariations(array3)
    } else {
      handleAddToCartDecrement(item.item_prices[0].variation_id, item.item_id, item?.item_name,)
    }


  }
  const closeBtmSheet = () => {
    btmSheetRef?.current?.close()
    setItemObj({})
  }
  const add_item_to_cart = async (id, type, name, item_id) => {
    let dataa = type === 'item' ? {
      item_id: item_id ? item_id : itemObj.id,
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
      .then(async response => {
        console.log('response ', response);
        if (response?.status == true) {
          checkVariationInCart()
          const newDataa = item?.map(element => {
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
          setItems(newDataa);
          dispatch(addItemToMYCart(response?.result));
          setSelectedVariation(null)
          let cartItems = await getCartItems(customerCartId, dispatch);
          dispatch(updateMyCartList(cartItems));
          handlePopup(dispatch, `${name ? name : itemObj.name} is added to cart`, 'green');

        } else {
          handlePopup(dispatch, response?.message, 'red');
        }
      })
      .catch(error => {
        console.log('error  :  ', error);
      })
      .finally(() => {
        setLoading(false)
      });
  };
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
        if (checkVariation.length === 0) {
          add_item_to_cart(variation_id, 'item', name, item_id);
        } else {

          let obj = {
            cart_item_id: checkVariation[0]?.cart_item_id,
            quantity: checkVariation[0]?.quantity + 1,
          };
          await updateCartItemQuantity(obj, dispatch)
            .then(async (response) => {
              if (response.status === true) {
                checkVariationInCart()
                handlePopup(dispatch, `${name ? name : itemObj.name} quantity updated`, 'green')
                const newDataa = item?.map(element => {
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
                setItems(newDataa);
                let cartItems = await getCartItems(checkVariation[0]?.cart_id, dispatch);
                dispatch(updateMyCartList(cartItems));
              }
            })
        }
      } else {
        add_item_to_cart(variation_id, 'item', name, item_id);
      }
    }
  };

  const handleDelete = async (id, name) => {

    const filter = my_cart?.filter(
      item => item?.item_id == id
    );
    const response = await removeCartItemQuantity({ item_id: filter[0]?.cart_item_id, cart_id: filter[0]?.cart_id })
    if (response.status) {
      checkVariationInCart()

      console.log('response  :  ', response);
      const newData = item?.map(e => {
        if (e?.item_id == id) {
          return {
            ...e,
            quantity: 0,
          };
        } else {
          return { ...e };
        }
      });
      setItems(newData);
      const cartData = my_cart?.filter(item => item.cart_item_id !== filter[0]?.cart_item_id);
      dispatch(updateMyCartList(cartData));
      handlePopup(dispatch, `${name ? name : itemObj.name} removed from cart`, 'green')
    } else {
      handlePopup(dispatch, `Unable to remove ${item.item_name} from cart`, 'red')
      closeBtmSheet()
    }
  }

  const handleDealAddToCart = async (deal) => {
    setItemObj({
      id: deal.deal_id,
      name: deal?.name,
    })
    if (join_as_guest) {
      ref_RBSheetGuestUser?.current?.open()
    } else {
      const filter = my_cart?.filter(
        item => item?.item_id == deal.deal_id,
      );
      if (filter?.length > 0) {
        let obj = {
          cart_item_id: filter[0]?.cart_item_id,
          quantity: filter[0]?.quantity + 1,
        };
        await updateCartItemQuantity(obj, dispatch)
          .then(response => {
            if (response.status === true) {
              handlePopup(dispatch, `${itemObj.name} quantity updated`, 'green')
              const newData = my_cart?.map(item => {
                if (item?.item_id == deal.deal_id) {
                  return {
                    ...item,
                    quantity: filter[0]?.quantity + 1,
                  };
                } else {
                  return { ...item };
                }
              });
              dispatch(updateMyCartList(newData));

            }
          })
      } else {
        add_item_to_cart(deal.deal_id, 'deal', deal?.name)
      }
    }
  };
  const handleOpenSearch = () => {
    setSearchQuery('');
    setShowSearchedData(true);
    setIsSearch(true);
  };
  const handleCloseSearch = () => {
    setIsSearch(false);
    setShowSearchedData(false);
  };
  const searchItemsByName = text => {
    return new Promise((resolve, reject) => {
      setSearchLoading(true)
      try {
        fetch(api.search_item + text)
          .then(response => response.json())
          .then(response => {
            resolve(response?.result);
          })
          .catch(err => {
            console.log('error : ', err);
            resolve([]);
          });
      } catch (error) {
        resolve([]);
        handlePopup(dispatch, 'Something is went wrong', 'red')
      }
      finally {
        setSearchLoading(false)
      }
    });
  };
  const searchDealsByName = text => {

    return new Promise((resolve, reject) => {
      setSearchLoading(true)
      try {
        fetch(api.search_deal_by_name + text)
          .then(response => response.json())
          .then(response => {
            resolve(response?.result);
          })
          .catch(err => {
            console.log('error : ', err);
            resolve([]);
            handlePopup(dispatch, 'Something is went wrong', 'red')
          });
      } catch (error) {
        resolve([]);
        handlePopup(dispatch, 'Something is went wrong', 'red')
      } finally {
        setSearchLoading(false);
      }
    });
  };
  const searchApi = async query => {
    setShowSearchedData(true);
    setSearchLoading(true)
    if (query) {
      // setLoading(true);
      let items = await searchItemsByName(query);
      let deals = await searchDealsByName(query);

      console.log(typeof (deals));
      // console.log(deals);

      if (!items) {
        setSearchedItems([]);
      } else {
        setSearchedItems(items);
      }

      if (!deals) {
        setFilteredDeals([]);
      } else {
        setFilteredDeals(deals);
      }


      setShowSearchedData(true);

      setLoading(false);
    }
  };
  const setCusineNameByItemCusineId = (cusineId) => {
    const cuisineName = Cuisine?.filter(item => item?.cuisine_id === cusineId)[0]?.cuisine_name;
    return cuisineName;
  }

  const handleSearch = () => {
    if (searchQuery?.length === 0) {
      setLoading(false);
      setSearchedItems([]);
      setFilteredDeals([]);
    } else {
      searchApi(searchQuery);
    }
  };

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('getContacts', { customer_id });
    });
    socket.on('contacts', (contactsData) => {
      dispatch(setContacts(contactsData));

    });
    socket.on('error', (error) => {
      console.error('Socket Error:', error.message);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const getAllItemByCuisine = async cuisine_id => {
    const response = await fetchApisGet(api.get_all_item_by_cuisine + cuisine_id, setLoading, dispatch);
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
    setItems(newList);
  };

  const handleSelect = (id, selected, all) => {
    setShowSearchedData(false);

    if (all) {
      setAllSelected(true);
      getAllItems();
      const newData = Cuisine?.map(element => ({
        ...element,
        selected: false,
      }));
      setCuisine(newData);
    } else {
      setAllSelected(false);
      if (!selected) {
        getAllItemByCuisine(id);
      } else {
        handleSelect(false, false, true)
      }
      const newData = Cuisine?.map(item => {
        if (item?.cuisine_id == id) {
          return {
            ...item,
            selected: item?.selected === true ? false : true,
          };
        } else {
          return {
            ...item,
            selected: false,
          };
        }
      });
      setCuisine(newData);
    }
  };

  const func = async () => {
    let amount = await GetWalletAmount(customer_id);
    dispatch(setWalletTotalAmount(amount))
    await getCustomerCart(customer_id, dispatch);

  }

  const getPromo = async () => {
    const response = await fetchApisGet(api.get_all_promocodes, setLoading, dispatch);
    let list = response?.result ? response?.result : [];
    dispatch(setPromos(list))
    setPromoCodes(list);
  };
  const getAllCuisines = async () => {
    const response = await fetchApisGet(api.get_all_cuisines, setLoading, dispatch);
    let list = response?.result ? response?.result : [];
    dispatch(setcuisines(list))
    setCuisine(list);
  };
  const getDeals = async () => {
    setDealLoading(true)
    const response = await fetchApisGet(api.get_all_deals_by_restaurant + 'res_4074614', setDealLoading, dispatch);
    let list = response?.result ? response?.result : [];
    dispatch(setdeals(list))

  };
  const getCurrentLocatin = async () => {
    const { latitude, longitude, address, shortAdress } = await getCurrentLocation()
    dispatch(setCurrentLocation({
      latitude: latitude,
      longitude: longitude,
      address: address,
      shortAddress: shortAdress
    }))
  }
  const getAllItems = async () => {
    setItemLoading(true)
    const response = await fetchApisGet(api.get_all_items, setItemLoading, dispatch);

    let list = response?.result ? response?.result : [];
    let newList = [];
    for (const item of list) {
      const filter = my_cart?.filter(e => e?.item_id == item?.item_id);
      let obj = {
        ...item,
        quantity: filter?.length > 0 ? filter[0]?.quantity : 0,
      };
      newList.push(obj);
    }
    setItems(newList);
  };
  const onRefresh = async () => {
    setRefresh(true);
    getAllItems()
    getDeals();
    getPromo()
    getAllCuisines()
    getFavoriteItem(customer_id, dispatch);
    getFavoriteDeals(customer_id, dispatch);
    func()
    setRefresh(false)
  };

  useEffect(() => {
    getPromo()
    setCuisine(cuisines)
    getDeals();
    handleSelect(false, false, true)
    getAllCuisines();
    get_Cart_Items()
    getCurrentLocatin()

  }, []);


  useFocusEffect(
    useCallback(() => {
      getFavoriteItem(customer_id, dispatch);
      getFavoriteDeals(customer_id, dispatch);
      func();
    }, [customer_id, dispatch])
  );

  const isItemFavorite = (id) => {
    return favoriteItems.some(item => item?.item?.item_id === id);
  };
  const isDealFavorite = (id) => {
    return favoriteDeals.some(item => item?.deal?.deal_id === id);
  };
  const shortenString = (str) => {
    if (str?.length > 35) {
      return str.substring(0, 35) + '...';
    }
    return str;
  }

  const get_Cart_Items = async () => {
    try {
      setLoading(true);
      let cart = await getCustomerCart(customer_id, dispatch);
      let cartItems = await getCartItems(cart?.cart_id, dispatch);
      if (cartItems) {
        dispatch(addToCart(cartItems));
        dispatch(updateMyCartList(cartItems));
        if (!cart_restaurant_id && cartItems?.length > 0) {
          dispatch(setCartRestaurantId(cartItems[0]?.itemData?.restaurant_id));
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error in getCartItems :  ', error);
    }
  };

  const handleSubmit = async () => {
    const data = {
      house_number: '',
      street_number: '',
      area: '',
      floor: '',
      instructions: '',
      customer_id: customer_id,
      label: "Home",
      address: currentLocation?.shortAddress,
      longitude: currentLocation?.longitude,
      latitude: currentLocation?.latitude,

    }
    console.log(data, 'data');

    fetch(api.add_location, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(async response => {
        // console.log(response);
        console.log({ response }, 'Submit customer_location');


        if (response.status === false) {
          handlePopup(dispatch, 'Something is went wrong', 'red')
          return;

        } else {
          handlePopup(dispatch, 'Address added successfully', 'green');
          dispatch(setLocation({
            address: currentLocation?.shortAddress,
            longitude: currentLocation?.longitude,
            latitude: currentLocation?.latitude,
            shortAddress: currentLocation?.shortAddress,
            id: response?.result?.location_id
          }))
        }
      })
      .catch(err => {
      })
      .finally(() => {
      });

  }
  const getCustomerLocations = () => {
    fetch(api.get_customer_location + customer_id, {
      method: 'GET',
      headers: {
      }
    })
      .then(response => response.json())
      .then(response => {
        if (response.status === false) {
          handlePopup(dispatch, response?.message, 'red');
          getCurrentLocatin();  // Fetch and dispatch current location
          handleSubmit();
        } else {
          const locations = response?.customerData?.locations || [];

          console.log({ response }, 'getcustomer_locations');


          if (locations.length === 0) {
            // If no locations found, get the current location and add it to the backend
            getCurrentLocatin();  // Fetch and dispatch current location
            handleSubmit();  // Post current location to the backend
          } else {
            // If locations exist, dispatch the first location
            dispatch(setLocation({
              latitude: locations[0]?.latitude,
              longitude: locations[0]?.longitude,
              address: locations[0]?.address,
              id: locations[0]?.location_id,
            }));
            dispatch(setSetAllLocation(locations));
          }
        }
      })
      .catch(err => {
        console.log('Error in getCustomerLocations: ', err);
      })
      .finally(() => {
      });
  };



  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.secondary_color, },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 10,
      paddingBottom: 20,
      paddingHorizontal: 20
    },
    topChip: {
      backgroundColor: `${Colors.secondary_text}10`,
      borderRadius: 25,
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginRight: 7,
    },
    topChipText: {
      color: Colors.secondary_text,
      fontFamily: Fonts.PlusJakartaSans_Medium,
      fontSize: RFPercentage(1.7),
      marginTop: -2,
    },
    headerTextView: {
      height: hp(4),
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 0,
      marginTop: hp(2),
      paddingHorizontal: 20
    },
    headerText: {
      color: Colors.primary_text,
      fontFamily: Fonts.PlusJakartaSans_Bold,
      fontSize: RFPercentage(1.9),
      letterSpacing: 0.45,
    },
    viewAllText: {
      color: Colors.button.primary_button,
      fontSize: RFPercentage(1.8),
      fontFamily: Fonts.PlusJakartaSans_Medium,
      textDecorationLine: 'underline',
    },
    container2: { flex: 1, backgroundColor: 'red', alignItems: 'flex-end' },
    rbSheetHeading: {
      color: Colors.primary_text,
      fontFamily: Fonts.PlusJakartaSans_Bold,
      fontSize: RFPercentage(2),
    },
    rowViewSB1: {
      flexDirection: 'row',
      justifyContent: 'space-bssetween',
      marginBottom: 20,
    },
    rowView: {
      flexDirection: 'row',
      alignItems: 'center',
      width: wp(45),
      marginLeft: wp(3)
    },
    btmsheettext: {
      color: Colors.secondary_text,
      fontFamily: Fonts.PlusJakartaSans_Regular,
      marginLeft: wp(5),
      fontSize: RFPercentage(1.9),
    },
    headerLocation: {
      color: Colors.primary_text,
      width: wp(60),
      fontFamily: Fonts.PlusJakartaSans_Regular,
      textAlign: "center",
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: hp(2),
    },
    dot: {
      height: wp(2),
      borderRadius: wp(2.5),
      marginHorizontal: wp(1),
    },
    floatingButton: {
      position: 'absolute',
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      bottom: 40,
      right: 20,
      overflow: 'hidden',
      backgroundColor: Colors.button.primary_button,
      paddingVertical: wp(3),
      paddingHorizontal: wp(2.5),

    },
    variationTxt: {
      color: Colors.primary_text,
      fontFamily: Fonts.PlusJakartaSans_Bold,
      fontSize: RFPercentage(1.7),
      marginBottom: hp(1)
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
    rowViewSB: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,

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
      <Loader loading={loading || itemLoading || dealLoading || refresh} />
      <>
        {/* <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: wp(100),
          backgroundColor: '#FF5C01E0',
          padding: 20,
        }}>
        <Text
          style={{
            color: '#FFFFFF',
            fontFamily: Fonts.PlusJakartaSans_Medium,
            fontSize: RFPercentage(2),
          }}>
          Item Name
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              color: '#FFFFFF',
              fontFamily: Fonts.PlusJakartaSans_Regular,
              fontSize: RFPercentage(2),
            }}>
            Preparing
          </Text>
          <Text>3 items</Text>
          <Text>$ 234</Text>
        </View>
      </View> */}
      </>

      {showPopUp && <PopUp color={popUpColor} message={PopUpMesage} />}

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            colors={[Colors.primary_color]}
            refreshing={false}
            onRefresh={() => onRefresh()}
          />
        }>
        <StatusBar
          translucent={false}
          backgroundColor={'white'}
          barStyle={'dark-content'}
        />

        {
          !isSearch && <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation?.openDrawer()}>
              <Feather name="menu" size={RFPercentage(3.2)} color={Colors.primary_color} />

            </TouchableOpacity>
            <Text style={styles.headerLocation} ellipsizeMode='tail' numberOfLines={1} >{currentLocation.shortAddress}</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={{ marginRight: 20 }}
                onPress={() => handleOpenSearch()}>
                <Feather name="search" size={RFPercentage(2.8)} color={Colors.primary_color} />

              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (join_as_guest) {
                    ref_RBSheetGuestUser?.current?.open()
                  } else {
                    navigation?.navigate('Notification')
                  }

                }}>
                <Icons.NotificationWithDot />
              </TouchableOpacity>
            </View>
          </View>
        }
       

        <View style={{ marginVertical: 15 }}>
          {isSearch ? (
            <View style={{ paddingHorizontal: 20 }} >
              <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                <TouchableOpacity
                  style={{}}
                  onPress={() => handleCloseSearch()}>
                  <Ionicons
                    name={'chevron-back'}
                    size={hp(3.5)}
                    color={Colors.primary_color}
                  />
                </TouchableOpacity>

                <CInput
                  width={wp(80)}
                  height={42}
                  containerStyle={{ marginBottom: 0 }}
                  placeholder={'Search here'}
                  value={searchQuery}
                  onChangeText={text => setSearchQuery(text)}
                  leftContent={
                    <Feather
                      name="search"
                      size={17}
                      color="#9F9F9F"
                      style={{ marginRight: 6 }}
                    />
                  }
                  rightContent={
                    <TouchableOpacity
                      style={{ padding: 10, paddingRight: 0 }} onPress={handleSearch}  >
                      <Feather
                        name="search"
                        size={17}
                        color="#9F9F9F"
                        style={{ marginRight: 6 }}
                      />
                    </TouchableOpacity>
                  }
                />
              </View>


              <View style={{ flexDirection: 'row', marginVertical: hp(2) }} >
                <TouchableOpacity
                  onPress={() =>
                    handleSelect(false, false, true)
                  }
                  style={{
                    ...styles.topChip,
                    backgroundColor: searchBtns.all
                      ? Colors.button.primary_button
                      : `${Colors.secondary_text}10`,
                  }}>
                  <Text
                    style={{
                      ...styles.topChipText,
                      color: searchBtns.all ? Colors.button.primary_button_text : Colors.secondary_text,
                    }}>
                    All
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    handleSelect(false, false, true)
                  }
                  style={{
                    ...styles.topChip,
                    backgroundColor: searchBtns.category
                      ? Colors.button.primary_button
                      : `${Colors.secondary_text}10`,
                  }}>
                  <Text
                    style={{
                      ...styles.topChipText,
                      color: searchBtns.category ? Colors.button.primary_button_text : Colors.secondary_text,
                    }}>
                    Category
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    handlePriceToggle()
                  }
                  style={{
                    ...styles.topChip,
                    backgroundColor: searchBtns.price
                      ? Colors.button.primary_button
                      : `${Colors.secondary_text}10`,
                  }}>
                  <Text
                    style={{
                      ...styles.topChipText,
                      color: searchBtns.price ? Colors.button.primary_button_text : Colors.secondary_text,
                    }}>
                    {!searchBtns.price ? 'Price ↑↓' : searchBtns.priceUp ? 'Price ↑' : 'Price ↓'}
                  </Text>
                </TouchableOpacity>
              </View>
              {
                searchedItems.length > 0 &&
                <>
                  <View style={styles.headerTextView}>
                    <Text style={[styles.headerText]}>Items</Text>
                  </View>


                  <FlatList
                    scrollEnabled={false}
                    data={searchedItems}
                    numColumns={numColumns}
                    key={numColumns}
                    ListEmptyComponent={() => searchLoading ? <ItemLoading size={'large'} /> : <NoDataFound text={'No Items'} />}
                    renderItem={({ item, index }) => {
                      const fav = isItemFavorite(item?.item_id)
                      return (
                        <FoodCards
                          isFavorite={fav}
                          image={item?.images[0]}
                          description={shortenString(item?.description)}
                          price={item?.item_prices ? item?.item_prices[0]?.price : item?.item_variations[0]?.price}
                          heartPress={() => {
                            if (join_as_guest) {
                              ref_RBSheetGuestUser?.current?.open()
                            } else {
                              fav ? removeFavoriteitem(item?.item_id, customer_id, favoriteItems, dispatch) : addFavoriteitem(item?.item_id, customer_id, dispatch)
                            }
                          }}
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
                              {isItemLoading && item?.item_id == itemObj?.id ? (
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
                                      if (item?.quantity === 1) {
                                        handleDelete(item.item_id, item?.item_name)
                                      } else {
                                        if (item.item_prices.length > 1) {
                                          showBtmSheet(item)
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
                                        showBtmSheet(item)
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
                                    if (join_as_guest) {
                                      ref_RBSheetGuestUser?.current?.open()
                                    }
                                    else if (item.item_prices.length > 1) {
                                      showBtmSheet(item);
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
                      );
                    }}
                  />
                </>
              }
              {

                filteredDeals.length > 0 &&
                <>
                  <View style={styles.headerTextView}>
                    <Text style={[styles.headerText]}>Deals</Text>
                  </View>
                  <FlatList
                    horizontal={filteredDeals.length > 0 ? true : false}
                    data={filteredDeals}
                    showsHorizontalScrollIndicator={false}
                    style={{ paddingHorizontal: 20 }}
                    ListEmptyComponent={() => {
                      return searchQuery.length > 0 && searchLoading ? (
                        <ItemLoading size="large" />
                      ) : (
                        <NoDataFound text="No Deals" />
                      );
                    }
                    }
                    renderItem={({ item, index }) => {
                      const cuisineIds = item?.items?.map(item => item?.cuisine_id);
                      const cuisineNames = cuisineIds?.map(cuisineId =>
                        setCusineNameByItemCusineId(cuisineId)
                      );
                      const fav = isDealFavorite(item?.deal_id)

                      return (
                        <DealCard
                          image={item?.images?.length > 0 && item?.images[0]}
                          description={shortenString(item?.description)}
                          price={item?.price}
                          title={item?.name}
                          onPress={() =>
                            navigation?.navigate('NearByDealsDetails', {
                              id: item?.deal_id,
                            })
                          }
                          isFavorite={fav}
                          heartPress={() => {
                            if (join_as_guest) {
                              ref_RBSheetGuestUser?.current?.open()
                            }
                            else {
                              fav ? removeFavoriteDeal(item?.deal_id, customer_id, favoriteDeals, dispatch) : addFavoriteDeal(item?.deal_id, customer_id, dispatch)
                            }
                          }}
                          addToCartpress={() => handleDealAddToCart(item)}
                        />
                      );
                    }}
                  />
                </>
              }

            </View>
          ) : (
            <>
              <View style={{ alignItems: 'center', marginTop: wp(0) }} >
                <PagerView
                  style={[{ height: hp(25), backgroundColor: 'white', width: wp(100), }]}
                  initialPage={0}
                  onPageSelected={onPageSelected}
                  ref={pagerRef}
                >

                  {promos.length > 0 ? promos.map((promo, index) => {
                    return (
                      <TouchableOpacity key={index} style={{ backgroundColor: 'white' }} activeOpacity={0.7}>
                        <Image source={{ uri: promo.image }} style={{ width: wp(100), height: hp(25), resizeMode: 'cover' }} />
                      </TouchableOpacity>
                    )
                  }) : <NoDataFound text={'No Promo Codes'} />}
                </PagerView>

                {renderPaginationDots()}

                <FlatList
                  data={Cuisine}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginTop: hp(2), marginHorizontal: 20 }}
                  ListHeaderComponent={() => (
                    <View style={{ flexDirection: 'row', }} >
                      {/* <TouchableOpacity
                        onPress={() => handleOpenSearch()}
                        style={styles.topChip}>
                        <Feather name="search" size={17} color="#9F9F9F" />
                      </TouchableOpacity> */}
                      <TouchableOpacity
                        onPress={() =>
                          handleSelect(false, false, true)
                        }
                        style={{
                          ...styles.topChip,
                          backgroundColor: allSelected
                            ? Colors.button.primary_button
                            : `${Colors.secondary_text}10`,
                        }}>
                        <Text
                          style={{
                            ...styles.topChipText,
                            color: allSelected ? Colors.button.primary_button_text : Colors.secondary_text,
                          }}>
                          All
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          handleSelect(item?.cuisine_id, item?.selected)
                        }
                        style={{
                          ...styles.topChip,
                          backgroundColor: item?.selected
                            ? Colors.button.primary_button
                            : `${Colors.secondary_text}10`,
                        }}>
                        <Text
                          style={{
                            ...styles.topChipText,
                            color: item?.selected ? Colors.button.primary_button_text : Colors.secondary_text,
                          }}>
                          {item?.cuisine_name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
              <View style={[styles.headerTextView]}>
                <Text style={styles.headerText}>Explore Items</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('SeeAllitems');
                  }}>
                  <Text style={styles.viewAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                scrollEnabled={false}
                data={(item).slice(0, 4)}
                key={numColumns}
                numColumns={numColumns}
                keyExtractor={(item) => item.item_id.toString()}
                style={{ paddingHorizontal: 10 }}
                ListEmptyComponent={() => !loading || !itemLoading && <NoDataFound text={'No Items'} />}
                renderItem={({ item, index }) => {
                  const fav = isItemFavorite(item?.item_id)
                  return (
                    <FoodCards
                      isFavorite={fav}
                      image={item?.images?.length && item?.images[0]}
                      description={shortenString(item?.description)}
                      price={item?.item_prices ? item?.item_prices[0]?.price : item?.item_variations[0]?.price}
                      heartPress={() => {
                        if (join_as_guest) {
                          ref_RBSheetGuestUser?.current?.open()
                        }
                        else {
                          fav ? removeFavoriteitem(item?.item_id, customer_id, favoriteItems, dispatch) : addFavoriteitem(item?.item_id, customer_id, dispatch)
                        }
                      }

                      }
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
                          {isItemLoading && item?.item_id == itemObj?.id ? (
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
                                  if (item?.quantity === 1) {
                                    handleDelete(item.item_id, item?.item_name)
                                  } else {
                                    if (item.item_prices.length > 1) {
                                      showBtmSheet(item)
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
                                    showBtmSheet(item)
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
                                if (join_as_guest) {
                                  ref_RBSheetGuestUser?.current?.open()
                                }
                                else if (item.item_prices.length > 1) {
                                  showBtmSheet(item);
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
                  );
                }}
              />
              <View style={styles.headerTextView}>
                <Text style={styles.headerText}>Explore Deals</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NearByDeals');
                  }}>
                  <Text style={styles.viewAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                horizontal={deals.length > 0 ? true : false}
                data={deals}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                ListEmptyComponent={() => !loading && <NoDataFound text={'No Deals'} />}
                renderItem={({ item, index }) => {
                  const cuisineIds = item?.items?.map(item => item?.cuisine_id);
                  const cuisineNames = cuisineIds?.map(cuisineId =>
                    setCusineNameByItemCusineId(cuisineId)
                  );
                  const fav = isDealFavorite(item?.deal_id)

                  return (
                    <DealCard
                      image={item?.images?.length > 0 && item?.images[0]}
                      description={shortenString(item?.description)}
                      price={item?.price}
                      title={item?.name}
                      onPress={() =>
                        navigation?.navigate('NearByDealsDetails', {
                          id: item?.deal_id,
                        })
                      }
                      isFavorite={fav}
                      heartPress={() => {
                        if (join_as_guest) {
                          ref_RBSheetGuestUser?.current?.open()
                        }
                        else {
                          fav ? removeFavoriteDeal(item?.deal_id, customer_id, favoriteDeals, dispatch) : addFavoriteDeal(item?.deal_id, customer_id, dispatch)
                        }
                      }}
                      addToCartpress={() => {
                        if (join_as_guest) {
                          ref_RBSheetGuestUser?.current?.open()
                        } else {
                          handleDealAddToCart(item)
                        }
                      }}
                    />
                  );
                }}
              />
            </>
          )}
        </View>



        <View style={{ marginVertical: 0 }}>
       

          <CRBSheetComponent
            height={170}
            refRBSheet={locationBtmSheetRef}
            content={
              <View style={{ width: wp(90) }} >
                <View style={styles.rowViewSB}>
                  <Text style={styles.rbSheetHeading}>Select an option</Text>
                  <TouchableOpacity
                    onPress={() => closeLocationBtmSheet()}>
                    <Ionicons name={'close'} size={22} color={'#1E2022'} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.rowView} onPress={async () => { closeLocationBtmSheet() }} >
                  <Icons.MarkerOutlineActive />
                  <Text style={styles.btmsheettext} >Current Location</Text>
                </TouchableOpacity>
                <ItemSeparator />
                <TouchableOpacity style={styles.rowView} onPress={() => {
                  closeLocationBtmSheet()
                  navigation.navigate('Map')
                }} >
                  <Icons.AddSimple />
                  <Text style={styles.btmsheettext} >Add Location</Text>
                </TouchableOpacity>

              </View>
            }
          />
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.floatingButton} activeOpacity={0.9} onPress={() => {
        if (join_as_guest) {
          ref_RBSheetGuestUser?.current?.open()
        }
        else {
          navigation.navigate('MyCart')
        }
      }
      }
      >
        <View>
          {my_cart?.length > 0 && (
            <Badge
              style={{
                position: 'absolute',
                top: -10,
                right: 6,
                backgroundColor: `${Colors.secondary_color}40`,
                color: Colors.secondary_color,
                fontFamily: Fonts.PlusJakartaSans_Bold,
                fontSize: RFPercentage(1.2)
              }}
              size={15}
            >
              {my_cart?.length}
            </Badge>
          )}
          <WhiteCart />
        </View>
      </TouchableOpacity>

      <CRBSheetComponent
        height={hp(35)}
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
            {Variations?.map((variation, i) => (
              <View key={i} style={[styles.rowViewSB, { borderBottomColor: Colors.borderGray, borderBottomWidth: wp(0.3), paddingBottom: wp(1) }]}>
                <TouchableOpacity style={styles.rowView} >
                  <RadioButton
                    color={Colors.primary_color} // Custom color for selected button
                    uncheckedColor={Colors.primary_color} // Color for unselected buttons
                    status={selectedVariation?.variation_id === variation?.variation_id ? 'checked' : 'unchecked'}
                  // onPress={() => handleDecrement(variation?.variation_id, variation.item_id)}
                  />
                  <Text style={styles.variationText}>{variation.variation_name}</Text>
                </TouchableOpacity>

                {
                  variation?.cart_item_id ? <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: `${Colors.primary_color}`,
                      borderRadius: 15,
                      paddingVertical: 5,
                      // flex: 0.3,
                      alignSelf: 'flex-end',
                      justifyContent: 'space-around',
                      width: wp(20)
                    }}>
                    <TouchableOpacity
                      onPress={() => handleAddToCartDecrement(variation?.variation_id, variation.item_id)}
                      style={{
                        backgroundColor: `${Colors.secondary_color}40`,
                        borderRadius: wp(3),
                        // paddingHorizontal: wp(0),
                        // marginLeft: wp(2),
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
                      onPress={() => handleAddToCart(variation.variation_id, itemObj.id)}
                      style={{
                        backgroundColor: `${Colors.secondary_color}40`,
                        borderRadius: wp(3),
                        paddingHorizontal: wp(0),
                        // marginRight: wp(2),
                      }}>
                      <AntDesign name="plus" color={Colors.secondary_color} size={16} />
                    </TouchableOpacity>
                  </View> : <TouchableOpacity
                    onPress={() => handleAddToCart(variation.variation_id, itemObj.id)}
                    style={{
                      backgroundColor: `${Colors.primary_color}`,
                      borderRadius: wp(3),
                      padding: wp(0.5),
                      marginRight: wp(2)

                      // marginRight: wp(2),
                    }}>
                    <AntDesign name="plus" color={Colors.secondary_color} size={16} />
                  </TouchableOpacity>
                }



              </View>
            ))}
          </View>
        }
      />
      <RBSheetSuccess
        refRBSheet={ref_RBSheetSuccess}
        title={`${itemObj.name} added to cart.`}
        btnText={'OK'}
        onPress={() => {
          ref_RBSheetSuccess?.current?.close();
        }}
      />

      <RBSheetGuestUser
        refRBSheet={ref_RBSheetGuestUser}
        btnText={'OK'}
        onSignIn={() => {
          ref_RBSheetGuestUser?.current?.close();
          navigation?.popToTop();
          navigation?.replace('SignIn');
        }}
        onSignUp={() => {
          ref_RBSheetGuestUser?.current?.close();
          navigation?.popToTop();
          navigation?.replace('SignUp');
        }}
      />

    </View>
  );
};

export default Dashboard;

