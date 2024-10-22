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
} from 'react-native';
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FoodCardWithRating from '../../components/Cards/FoodCardWithRating';
import { Colors, Images, Fonts, Icons } from '../../constants';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CInput from '../../components/TextInput/CInput';
import RestaurantCard from '../../components/Cards/RestaurantCard';
import api from '../../constants/api';
import Loader from '../../components/Loader';
import { BASE_URL, BASE_URL_IMAGE } from '../../utils/globalVariables';
import {
  getCurrentLocation,
  getEstimatedDeliveryTime,
} from '../../utils/helpers/location';
import NoDataFound from '../../components/NotFound/NoDataFound';
import { fetchApis, getCustomerDetail, showAlert } from '../../utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { resetState, setLocation, setPromos } from '../../redux/AuthSlice';
import { Badge } from 'react-native-paper';
import CRBSheetComponent from '../../components/BottomSheet/CRBSheetComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PagerView from 'react-native-pager-view';
// import Images from '../../Assets/png/Dashboard/Images';
import { setcuisines, setitems, setdeals } from '../../redux/AuthSlice';
import WhiteCart from '../../Assets/svg/WhiteCart.svg';
import { addFavoriteDeal, addFavoriteitem, getFavoriteDeals, getFavoriteItem, removeFavoriteitem } from '../../utils/helpers/FavoriteApis';
import { removeFavoriteDeal } from '../../utils/helpers/FavoriteApis';


const Dashboard = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { location, customer_detail, customer_id, cuisines, items, deals, promos } = useSelector(store => store.store);
  const { cart, my_cart } = useSelector(store => store.cart);
  const { favoriteItems, favoriteDeals} = useSelector(store => store.favorite);

  

  



  // console.log(customer_id, 'stte');

  const isFocused = useIsFocused();
  const [isSearch, setIsSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [showFilteredData, setShowFilteredData] = useState(false);
  const [searchedItems, setSearchedItems] = useState([]);
  // search
  const [showSearchedData, setShowSearchedData] = useState(false);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [filteredRestaurant, setFilteredRestaurant] = useState([]);
  const [item, setItems] = useState([])
  const [allSelected, setAllSelected] = useState(true)
  const btmSheetRef = useRef()
  const [Cuisine, setCuisine] = useState([]);
  const [promoCodes, setPromoCodes] = useState([])
  const [Deals, setDeals] = useState([]);
  const pagerRef = useRef(null); // Ref to control pager
  const [currentPage, setCurrentPage] = useState(0); // Track the current page index
  const onPageSelected = (e) => {
    // Update the page when the user swipes
    setCurrentPage(e.nativeEvent.position);

  };
  const [searchBtns, setSearchBtns] = useState({
    all: true,
    category : false,
    price: false,
    priceUp: false,
    priceDown: false,
  })

  const handlePriceSort = () => {
    let sortedItems = [...searchedItems]; // Copy the array

    if (searchBtns.priceUp) {
      sortedItems.sort((a, b) => a.price - b.price); // Ascending order
    } else if (searchBtns.priceDown) {
      sortedItems.sort((a, b) => b.price - a.price); // Descending order
    }
    setSearchedItems(sortedItems); // Update the state with sorted data
  };



  const handlePriceToggle = () => {
    if (!searchBtns.price) {
      setSearchBtns({ price: true, priceUp: true, priceDown: false });
    } else if (searchBtns.priceUp) {
      setSearchBtns({ price: true, priceUp: false, priceDown: true });
    } else if (searchBtns.priceDown) {
      setSearchBtns({ price: false, priceUp: false, priceDown: false });
    }

    handlePriceSort(); // Sort the list whenever the state changes
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
                backgroundColor: currentPage === index ? Colors.Orange : Colors.grayText,
                width: currentPage === index ? wp(6.5) : wp(2),
              },
            ]}
          />
        ))}
      </View>
    );
  };


  const showBtmSheet = () => {
    btmSheetRef?.current?.open()
  }
  const closeBtmSheet = () => {
    btmSheetRef?.current?.close()
  }

  const ItemSeparator = () => (
    <View
      style={{
        height: hp(0.1),
        marginVertical: 10,
        backgroundColor: '#00000026',
      }}
    />
  );


  const getPromo = async () => {
    const response = await fetchApis(api.get_all_promocodes, 'GET', setLoading);
    let list = response?.result ? response?.result : [];
    // console.log(list, 'badges');
    dispatch(setPromos(list))
    setPromoCodes(list);
    // fetch(api.get_all_promocodes)
    //   .then(response => response.json())
    //   .then(response => {
    //     let list = response?.result ? response?.result : [];
    //     // console.log(list, 'badges');
    //     setPromoCodes(list);
    //   })
    //   .catch(err => console.log('error getAllCuisines : ', err));
  };




  // console.log(Deals);

  // ______________________ handle search  items,deals and restaurant  by name ____________________
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
      }
    });
  };

  const searchDealsByName = text => {
    return new Promise((resolve, reject) => {
      try {
        fetch(api.search_deal_by_name + text)
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
      }
    });
  };

  const searchRestaurantByName = text => {
    return new Promise((resolve, reject) => {
      try {
        fetch(api.search_restaurant_by_name + text)
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
      }
    });
  };

  // Simulated search API function
  const searchApi = async query => {
    setShowSearchedData(true);
    if (query) {
      // setLoading(true);
      let items = await searchItemsByName(query);
      // let deals = await searchDealsByName(query);
      // let restaurants = await searchRestaurantByName(query);
      // console.log(items, 'item');
      
      setSearchedItems(items);
      // setFilteredDeals(deals);
      // setFilteredRestaurant(restaurants);
      setShowSearchedData(true);

      setLoading(false);
    }
  };

  // const debouncedSearch = debounce(searchApi, 2000);

  const handleSearch = text => {
    console.log('text : ', text);
    setSearchQuery(text);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery?.length == 0) {
        setLoading(false);
        // handleSelect(false, false, true)
        setSearchedItems([]);
        setFilteredDeals([]);
        setFilteredRestaurant([]);
      } else {
        // setLoading(true);
        searchApi(searchQuery);
      }
      // Send Axios request here
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);


  const getAllItemByCuisine = async cuisine_id => {
    const response = await fetchApis(api.get_all_item_by_cuisine + cuisine_id, 'GET', setLoading);
    let list = response?.result ? response?.result : [];
    setItems(list);
    // console.log(list, 'list');

    // fetch(api.get_all_item_by_cuisine + cuisine_id)
    //   .then(response => response.json())
    //   .then(response => {
    //     let list = response?.result ? response?.result : [];
    //     setFilteredItems(list);
    //   })
    // .catch(err => console.log('error : ', err))
    // .finally(() => setLoading(false));
  };

  const handleSelect = (id, selected, all) => {
    setShowSearchedData(false);

    if (all) {
      // console.log('all selected');

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
        // console.log(id, 'cusine selected');

        // setShowFilteredData(true); 
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

  const getAllCuisines = async () => {
    const response = await fetchApis(api.get_all_cuisines, 'GET', setLoading);
    let list = response?.result ? response?.result : [];
    dispatch(setcuisines(list))
    setCuisine(list);
    
  };

  const getDeals = async () => {
    // fetch(api.get_all_deals + `?page=1&limit=2`)

    const response = await fetchApis(api.get_all_deals, 'GET', setLoading);
    let list = response?.result ? response?.result : [];
    dispatch(setdeals(list))


        if (list?.length > 2) {
          const slicedArray = list.slice(0, 2);
          setDeals(slicedArray);
        } else {
          setDeals(list);
        }
    // let { latitude, longitude } = await getCurrentLocation();
    // fetch(
    //   api.get_all_deals,
    // )
    //   .then(response => response.json())
    //   .then(response => {
    //     let list = response?.result ? response?.result : [];
    //     // console.log(list , 'get deals');


    //     if (list?.length > 2) {
    //       const slicedArray = list.slice(0, 2);
    //       setDeals(slicedArray);
    //     } else {
    //       setDeals(list);
    //     }
    //   })
    //   .catch(err => console.log('error  getDeals : ', err))
    //   .finally(
    //     () => setIsFetching(false),
    //     setLoading(false),
    //     setRefresh(false),
    //   );
  };

  const getCurrentLocatin = async () => {
    const { latitude, longitude, address, shortAdress } = await getCurrentLocation()
    dispatch(setLocation({
      latitude: latitude,
      longitude: longitude,
      address: address,
      shortAddress: shortAdress
    }))
  }
  const getAllItems = async () => {


    const response = await fetchApis(api.get_all_items, 'GET', setLoading);

    let list = response?.result ? response?.result : [];
    dispatch(setitems(list))
    // console.log(list, 'restaurants');

    if (list?.length > 3) {
      const slicedArray = list.slice(0, 3);
      setItems(slicedArray);
      setLoading(false)
    } else {
      setItems(list);
    }
    // fetch(api.get_all_items )
    //   .then(response => response.json())
    //   .then(response => {
    //     let list = response?.result ? response?.result : [];
    //     // console.log(list, 'restaurants');

    //     if (list?.length > 3) {
    //       const slicedArray = list.slice(0, 3);
    //       setNearByRestaurants(slicedArray);
    //     } else {
    //       setNearByRestaurants(list);
    //     }
    //   })
    //   .catch(err => console.log('error getRestaurants : ', err))
    //   .finally(
    //     () => setIsFetching(false),
    //     setLoading(false),
    //     setRefresh(false),
    //   );
  };
  const setCusineNameByItemCusineId = (cusineId) => {
    const cuisineName = Cuisine?.filter(item => item?.cuisine_id === cusineId)[0]?.cuisine_name;
    // console.log(cuisineName);

    return cuisineName;
  }
  const onRefresh = () => {
    setRefresh(true);
    // getRestaurants();
    // getCurrentLocatin()
    getAllItems()

    getFavoriteItem(customer_id, dispatch);
    getFavoriteDeals(customer_id, dispatch);


    getDeals();
    if (deals.length > 0 && promos.length > 0 && items.length > 0 && cuisines.length > 0) {
      setRefresh (false)
    }
  };

  useEffect(() => {
    if (deals.length > 0) {
      setDeals(deals.slice(0,2)); 
    } else {
      getDeals();
    }
    if (items.length > 0) {
      setItems(items.slice(0,2))
    } else {
      handleSelect(false, false, true)
    }
    if (promos.length > 0) {
      setPromoCodes(promos)
    } else {
      getPromo()
    }
    if (cuisines.length > 0) {
      setCuisine(cuisines)
    }else{
      getAllCuisines();
    }
  
   
    getCurrentLocatin()
    // getRestaurants();
    
  }, []);




  useEffect(() => {
    getFavoriteItem(customer_id, dispatch);
    getFavoriteDeals(customer_id, dispatch);
  }, [customer_id]);

  const isItemFavorite = (id) => {    
    return favoriteItems.some(item => item?.item?.item_id === id);
  };
  const isDealFavorite = (id) => {
    
    return favoriteDeals.some(item => item?.deal?.deal_id === id);
  };


  
  
  // console.log(Cuisine,'promos');
  

  // const getCustomerData = async () => {
  //   let customer_id = await AsyncStorage.getItem('customer_id');

  //   let details = await getCustomerDetail(customer_id);
  //   if (details) {
  //     // setUserLocation(details?.location);
  //     dispatch(
  //       setLocation({
  //         latitude: details?.latitude,
  //         longitude: details?.longitude,
  //         address: details?.location,
  //       }),
  //     );
  //   }
  // };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     getCustomerData();
  //   }, []),
  // );
  // console.log(setcuisines, "isFetching");

  return (
    <View style={styles.container}>
      <Loader loading={loading || isFetching} />
      

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            colors={[Colors.Orange, Colors.OrangeLight]}
            refreshing={refresh}
            onRefresh={() => onRefresh()}
          />
        }>
        <StatusBar
          translucent={false}
          backgroundColor={'white'}
          barStyle={'dark-content'}
        />
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation?.openDrawer()}>
            <Icons.MenuActive width={23} />
          </TouchableOpacity>
          <Text style={styles.headerLocation} >{location.shortAddress}</Text>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={{ marginRight: 20 }}
              onPress={() => {

                // console.log(customer_id, 'stte');
                showBtmSheet()
              }}>
              <Icons.MarkerOutlineActive />
              
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation?.navigate('Notification')}>
              <Icons.NotificationWithDot />
            </TouchableOpacity>
          </View>
        </View>
        {/* <Text
          style={{
            color: '#02010E',
            fontFamily: Fonts.PlusJakartaSans_Bold,
            fontSize: RFPercentage(2.5),
            width: wp(60),
            lineHeight: 30,
          }}>
          Let’s find your favorite food!
        </Text> */}
     






        {/* {location?.address && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SelectLocation', {
                type: 'update_user_location',
              })
            }>
            <Text
              style={{
                color: '#02010E',
                fontFamily: Fonts.PlusJakartaSans_Medium,
                fontSize: RFPercentage(1.7),
                width: wp(90),
                // lineHeight: 30,
              }}>
              {location?.address}
            </Text>
          </TouchableOpacity>
        )} */}

        <View style={{ marginVertical: 15 }}>
       
          {isSearch ? (
            <View style={{paddingHorizontal: 20}} >
             <CInput
                width={wp(88)}
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
                    style={{ padding: 10, paddingRight: 0 }}
                    onPress={() => handleCloseSearch()}>
                    <AntDesign name="close" size={18} color={'#838383'} />
                  </TouchableOpacity>
                }
              />

              <View style={{flexDirection: 'row', marginVertical: hp(2)}} >

              <TouchableOpacity
                onPress={() =>
                  handleSelect(false, false, true)
                }
                style={{
                  ...styles.topChip,
                  backgroundColor: searchBtns.all
                    ? Colors.Orange
                    : '#F5F6FA',
                }}>
                <Text
                  style={{
                    ...styles.topChipText,
                    color: searchBtns.all ? Colors.White : '#9F9F9F',
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
                    ? Colors.Orange
                    : '#F5F6FA',
                }}>
                <Text
                  style={{
                    ...styles.topChipText,
                    color: searchBtns.category ? Colors.White : '#9F9F9F',
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
                    ? Colors.Orange
                    : '#F5F6FA',
                }}>
                <Text
                  style={{
                    ...styles.topChipText,
                    color: searchBtns.price ? Colors.White : '#9F9F9F',
                  }}>
                 {!searchBtns.price? 'Price ↑↓' : searchBtns.priceUp ? 'Price ↑' : 'Price ↓' }
                </Text>
              </TouchableOpacity>

              </View>

              <FlatList
                scrollEnabled={false}
                data={searchedItems}
                ListEmptyComponent={() => searchQuery?.length == 0? <Text style={{fontFamily: Fonts.PlusJakartaSans_Bold,
                  color: '#0A212B',
                  textAlign: 'center',
                  fontSize: RFPercentage(1.8),
                  lineHeight: 30,}}>Search Your Favorite Food</Text> :<NoDataFound />}
                renderItem={({ item, index }) => {

                  const fav = isItemFavorite(item?.item_id)



                  return (
                    <FoodCardWithRating
                      onPress={() =>
                        navigation?.navigate('ItemDetails', {
                          id: item?.item_id,
                        })
                      }
                      title={item?.item_name}
                      image={
                        // item.image
                        item?.images?.length > 0
                          ? BASE_URL_IMAGE + item?.images[0]
                          : ''
                      }
                      price={item?.price}
                      rating={item?.rating}
                      tag={setCusineNameByItemCusineId(item?.cuisine_id)}
                      isTagArray={false}
                      nextIconWidth={26}
                      cardStyle={{ marginHorizontal: 0, marginBottom: 15 }}
                      showNextButton={true}
                      showRating={false}
                      priceContainerStyle={{ marginTop: 0 }}
                      onRemove = {()=> removeFavoriteitem( item?.item_id,customer_id, favoriteItems, dispatch, showAlert)}
                      addFav={()=> addFavoriteitem( item?.item_id,customer_id, dispatch, showAlert)}
                      isFavorite={fav}
                    />
                  );
                }}
              />

                  
              

            

            </View>


          ) : (
            <>
              <View style={{ alignItems: 'center', marginTop: wp(0) }} >
                <PagerView
                  style={[{ height: hp(16), backgroundColor: 'white', width: wp(100), }]}
                  initialPage={0}
                  onPageSelected={onPageSelected}
                  ref={pagerRef} // Reference to control PagerView programmatically
                >
                  {promoCodes.map((promo, index) => {
                    // console.log(promo);
                    
                  return(
                    <TouchableOpacity key={index} style={{ backgroundColor: 'white' }} activeOpacity={0.7}>
                      <Image source={{ uri: BASE_URL + promo.image }} style={{ width: wp(100), height: hp(15), resizeMode: 'cover' }} />
                    </TouchableOpacity>
                  )
})}
                </PagerView>

                {renderPaginationDots()}

                <FlatList
                  data={Cuisine}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginVertical: hp(2), marginHorizontal: 20 }}
                  ListHeaderComponent={() => (
                    <View style={{ flexDirection: 'row', }} >
                      <TouchableOpacity
                        onPress={() => handleOpenSearch()}
                        style={styles.topChip}>
                        <Feather name="search" size={17} color="#9F9F9F" />
                      </TouchableOpacity>
                      <View>
                        
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          handleSelect(false, false, true)
                        }
                        style={{
                          ...styles.topChip,
                          backgroundColor: allSelected
                            ? Colors.Orange
                            : '#F5F6FA',
                        }}>
                        <Text
                          style={{
                            ...styles.topChipText,
                            color: allSelected ? Colors.White : '#9F9F9F',
                          }}>
                          All
                        </Text>
                      </TouchableOpacity>
                    </View>

                  )}
                  renderItem={({ item, index }) => {
                    // console.log(item, 'item');

                    return (
                      <TouchableOpacity
                        onPress={() =>
                          handleSelect(item?.cuisine_id, item?.selected)
                        }
                        style={{
                          ...styles.topChip,
                          backgroundColor: item?.selected
                            ? Colors.Orange
                            : '#F5F6FA',
                        }}>
                        <Text
                          style={{
                            ...styles.topChipText,
                            color: item?.selected ? Colors.White : '#9F9F9F',
                          }}>
                          {item?.cuisine_name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
              <FlatList
                scrollEnabled={false}
                data={item}
                style={{paddingHorizontal: 20}}
                ListEmptyComponent={() => <NoDataFound />}
                renderItem={({ item, index }) => {
                  // console.log(item);

                  const fav = isItemFavorite(item?.item_id)
                  

                  



                  return (
                    <FoodCardWithRating
                    onPress={() =>
                      navigation?.navigate('ItemDetails', {
                        id: item?.item_id,
                      })
                    }
                      title={item?.item_name}
                      image={
                        // item.image
                        item?.images?.length > 0
                          ? BASE_URL_IMAGE + item?.images[0]
                          : ''
                      }
                      price={item?.item_prices[0]?.price}
                      rating={item?.rating}
                      tag={setCusineNameByItemCusineId(item?.cuisine_id)}
                      isTagArray={false}
                      nextIconWidth={26}
                      cardStyle={{ marginHorizontal: 0, marginBottom: 15 }}
                      showNextButton={true}
                      showRating={false}
                      priceContainerStyle={{ marginTop: 0 }}
                      isFavorite={fav}
                      onRemove = {()=> removeFavoriteitem( item?.item_id,customer_id, favoriteItems, dispatch, showAlert)}
                      addFav={()=> addFavoriteitem( item?.item_id,customer_id, dispatch, showAlert)}
                    />
                  );
                }}
              />
            </>

          )}
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
                scrollEnabled={false}
                data={Deals}
                style={{paddingHorizontal: 20}}
                ListEmptyComponent={() => <NoDataFound />}
                renderItem={({ item, index }) => {
                  // console.log(item, 'deal');
                  const cuisineIds = item?.items?.map(item => item?.cuisine_id);
                  const cuisineNames = cuisineIds?.map(cuisineId =>
                    setCusineNameByItemCusineId(cuisineId)
                  );
                  const fav = isDealFavorite(item?.deal_id)
                  // console.log(cuisineIds);
                  // console.log(fav ,'fav Deal')
                  // console.log(favoriteDeals[0], 'deal as favorite');
                  
                  
                 
                  

                  
                  return (
                    <FoodCardWithRating
                      onPress={() =>
                        navigation?.navigate('NearByDealsDetails', {
                          id: item?.deal_id,
                        })
                      }
                      title={item?.name}
                      image={
                        // item.image
                        item?.images?.length > 0
                          ? BASE_URL_IMAGE + item?.images[0]
                          : ''
                      }
                      price={item?.price}
                      rating={item?.rating}
                      tag={cuisineNames
                        // item.tag
                        // item?.items ? item?.items : []

                      }
                      isFavorite={fav}
                      isTagArray={true}
                      nextIconWidth={26}
                      cardStyle={{ marginHorizontal: 0, marginBottom: 15 }}
                      showNextButton={true}
                      showRating={false}
                      priceContainerStyle={{ marginTop: 0 }}
                      onRemove = {()=> removeFavoriteDeal( item?.deal_id,customer_id, favoriteDeals, dispatch, showAlert)}
                      addFav={()=> addFavoriteDeal( item?.deal_id, customer_id, dispatch, showAlert)}

                    />
                  );
                }}
              />
        </View>
        {/* <View>
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Text style={styles.nameText}>John Doe</Text>
        </View> */}
        {(showFilteredData || showSearchedData) && (
          // <View style={{ marginVertical: 20 }}>
          <>
            {/* <View style={styles.headerTextView}>
                <Text style={styles.headerText}>Item</Text>

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Deals');
                  }}>
                  <Text style={styles.viewAllText}>See All</Text>
                </TouchableOpacity>
                
              </View>
              <FlatList
                scrollEnabled={false}
                data={filteredItems}
                ListEmptyComponent={() => <NoDataFound />}
                renderItem={({ item }) => (
                  <FoodCardWithRating
                    onPress={() =>
                      navigation.navigate('ItemDetails', {
                        id: item?.item_id, //item id
                        // nav_screen: 'home',
                      })
                    }
                    image={
                      item?.images?.length > 0
                        ? BASE_URL_IMAGE + item?.images[0]
                        : ''
                    }
                    title={item?.item_name}
                    price={item?.price}
                    showRating={false}
                    cardStyle={{ marginHorizontal: 0, marginBottom: 15 }}
                  />
                )}
              /> 
              */}
          </>
          // </View>
        )}

        {showSearchedData && (
          <></>
          // <View style={{ marginVertical: 20 }}>
          //   <>
          //     <View style={styles.headerTextView}>
          //       <Text style={styles.headerText}> Deals</Text>

          //     </View>
          //     <FlatList
          //       scrollEnabled={false}
          //       data={filteredDeals}
          //       ListEmptyComponent={() => <NoDataFound />}
          //       renderItem={({ item, index }) => {
          //         return (
          //           <FoodCardWithRating
          //             onPress={() =>
          //               navigation?.navigate('DealsDetails', {
          //                 id: item?.deal_id,
          //               })
          //             }
          //             title={item?.name}
          //             image={
          //               item?.images?.length > 0
          //                 ? BASE_URL_IMAGE + item?.images[0]
          //                 : ''
          //             }
          //             price={item?.price}
          //             rating={item?.rating}
          //             tag={item?.items ? item?.items : []}
          //             isTagArray={true}
          //             nextIconWidth={26}
          //             cardStyle={{ marginHorizontal: 0, marginBottom: 15 }}
          //             showNextButton={true}
          //             showRating={false}
          //             priceContainerStyle={{ marginTop: 0 }}
          //           />
          //         );
          //       }}
          //     />
          //   </>
          //   <>
          //     <View style={styles.headerTextView}>
          //       <Text style={styles.headerText}> Restaurants</Text>

          //     </View>
          //     <FlatList
          //       scrollEnabled={false}
          //       data={filteredRestaurant}
          //       ListEmptyComponent={() => <NoDataFound />}
          //       renderItem={({ item, index }) => {
          //         return (
          //           <RestaurantCard
          //             onPress={() => {
          //               // navigation?.navigate('RestaurantDetails', {
          //               navigation?.navigate('RestaurantAllDetails', {
          //                 id: item?.restaurant_id,
          //               });
          //             }}
          //             title={item?.user_name}
          //             image={
          //               item?.images?.length > 0
          //                 ? BASE_URL_IMAGE + item?.images[0]
          //                 : ''
          //             }
          //             tag={item?.working_hours ? item?.working_hours : ''}
          //             rating={item?.rating ? item?.rating : '0.0'}
          //             reviews={item?.reviews ? item?.reviews?.length : '0'}
          //             nextIconWidth={26}
          //             cardStyle={{ marginHorizontal: 0, marginBottom: 15 }}
          //             showNextButton={true}
          //             showRating={true}
          //             priceContainerStyle={{ marginTop: 0 }}
          //           />
          //         );
          //       }}
          //     />
          //   </>
          // </View>
        )}

        {/* {!showFilteredData && !showSearchedData && ( */}
          <View style={{ marginVertical: 0 }}>
            <>
            
              
            </>
            {/* <>
              <View style={styles.headerTextView}>
                <Text style={styles.headerText}>Our Cuisines</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('NearByRestaurants')}>
                  <Text style={styles.viewAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                scrollEnabled={false}
                data={[]}
                ListEmptyComponent={() => <NoDataFound />}
                renderItem={({ item, index }) => {
                  return (
                    <RestaurantCard
                      // onPress={() => {
                      //   navigation?.navigate('RestaurantAllDetails', {
                      //     id: item?.restaurant_id,
                      //   });
                      // }}
                      title={
                        // item.title
                        item?.user_name
                      }
                      image={
                        // item.image
                        item?.images?.length > 0
                          ? BASE_URL_IMAGE + item?.images[0]
                          : ''
                      }
                      tag={
                        // item.tag
                        item?.working_hours ? item?.working_hours : ''
                      }
                      rating={item?.rating ? item?.rating : '0.0'}
                      // reviews={item?.describe ? item?.describe?.length : '0'}
                      description={item.describe}
                      nextIconWidth={26}
                      cardStyle={{ marginHorizontal: 0, marginBottom: 15 }}
                      showNextButton={true}
                      showRating={true}
                      priceContainerStyle={{ marginTop: 0 }}
                    />
                  );
                }}
              />
            </> */}
            <CRBSheetComponent
              height={170}
              refRBSheet={btmSheetRef}
              content={
                <View style={{ width: wp(90) }} >
                  <View style={styles.rowViewSB1}>
                    <Text style={styles.rbSheetHeading}>Select an option</Text>
                    <TouchableOpacity
                      onPress={() => closeBtmSheet()}>
                      <Ionicons name={'close'} size={22} color={'#1E2022'} />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.rowView} onPress={async () => {

                    // getRestaurants();
                    // getDeals();
                    // console.log(address);
                    closeBtmSheet()
                    // navigation.navigate('AddAddress', { address })


                  }} >
                    <Icons.MarkerOutlineActive />
                    <Text style={styles.btmsheettext} >Current Location</Text>
                  </TouchableOpacity>
                  <ItemSeparator />
                  <TouchableOpacity style={styles.rowView} onPress={() => {
                    closeBtmSheet()
                    navigation.navigate('Map')
                  }} >
                    <Icons.AddSimple />
                    <Text style={styles.btmsheettext} >Add Location</Text>
                  </TouchableOpacity>

                </View>
              }
            />
          </View>
         {/* )} */}
      </ScrollView>
      <TouchableOpacity style={styles.floatingButton} activeOpacity={0.9} onPress={() => navigation.navigate('MyCart')}>
        <View>
        {my_cart?.length > 0 && (
                <Badge
                  style={{
                    position: 'absolute',
                    top: -8,
                    right: -4,
                    backgroundColor: Colors.White,
                    color: Colors.Orange,
                    fontFamily: Fonts.PlusJakartaSans_Bold,
                    fontSize: RFPercentage(1.2),
                    

                  }}
                 
                
                  size={15}
              
                  >
                  {my_cart?.length}
                </Badge>
              )}
               <WhiteCart />
        </View>
      
       
        
      </TouchableOpacity>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.White,  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20
  },
  topChip: {
    backgroundColor: '#F5F6FA',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 15,
  },
  topChipText: {
    color: '#9F9F9F',
    fontFamily: Fonts.PlusJakartaSans_Medium,
    fontSize: RFPercentage(1.7),
    marginTop: -2,
  },
  welcomeText: {
    fontFamily: Fonts.PlusJakartaSans_Medium,
    color: '#02010E',
    fontSize: RFPercentage(2),
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  nameText: {
    fontFamily: Fonts.PlusJakartaSans_Bold,
    color: '#02010E',
    fontSize: RFPercentage(2.1),
    letterSpacing: 1,
  },
  headerTextView: {
    height: hp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 20
  },
  headerText: {
    color: '#02010E',
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(1.9),
    letterSpacing: 0.45,
  },
  viewAllText: {
    color: '#FF5722',
    fontSize: RFPercentage(1.8),
    fontFamily: Fonts.PlusJakartaSans_Medium,
    textDecorationLine: 'underline',
  },
  container2: { flex: 1, backgroundColor: 'red', alignItems: 'flex-end' },
  rbSheetHeading: {
    color: Colors.Text,
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(2),
  },
  rowViewSB1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent:'space-between',
    width: wp(45),
    marginLeft: wp(3)
  },
  btmsheettext: {
    color: '#56585B',
    fontFamily: Fonts.PlusJakartaSans_Regular,
    marginLeft: wp(5),
    fontSize: RFPercentage(1.9),
  },
  headerLocation: {
    color: Colors.Black,
    width: wp(60),
    fontFamily: Fonts.PlusJakartaSans_Regular,
    textAlign: "center",
    paddingTop: hp(1)
  }, paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp(1),
  },
  dot: {
    height: wp(2),
    borderRadius: wp(2.5),
    marginHorizontal: wp(1),
  },
  floatingButton: {
    position: 'absolute',
    // width: 60,
    // height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 40, // Adjust the distance from the bottom
    right: 20, // Adjust the distance from the right
    overflow: 'hidden',
    backgroundColor: Colors.Orange,
    paddingVertical: wp(3),
    paddingHorizontal: wp(2.5),
    
  },
});

// import React, {useState, useEffect, useRef} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   FlatList,
//   Image,
//   ScrollView,
//   StatusBar,
// } from 'react-native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import {RFPercentage} from 'react-native-responsive-fontsize';
// import Feather from 'react-native-vector-icons/Feather';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Entypo from 'react-native-vector-icons/Entypo';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import Notification from '../../Assets/svg/notification.svg';
// import Search from '../../Assets/svg/searchDashboard';
// import Star from '../../Assets/svg/starDashboard';
// import LinearGradient from 'react-native-linear-gradient';
// import {useNavigation} from '@react-navigation/native';
// import RBSheetAddLocation from '../../components/BottomSheet/RBSheetAddLocation';
// import {Fonts, Images} from '../../constants';
// import {Avatar} from 'react-native-paper';

// const Dashboard = ({navigation}) => {
//   const ref_RBSheet = useRef();
//   const [selectedCategory, setSelectedCategory] = useState('');

//   const Categories = [
//     {
//       name: 'Continental',
//       id: 1,
//       image: require('../../Assets/png/Dashboard/food5.png'),
//     },
//     {
//       name: 'Pakistani',
//       id: 2,
//       image: require('../../Assets/png/Dashboard/food2.png'),
//     },
//     {
//       name: 'Thai',
//       id: 3,
//       image: require('../../Assets/png/Dashboard/food3.png'),
//     },
//     {
//       name: 'Turkish',
//       id: 4,
//       image: require('../../Assets/png/Dashboard/food4.png'),
//     },
//     {
//       name: 'Chinese',
//       id: 5,
//       image: require('../../Assets/png/Dashboard/food5.png'),
//     },
//     {
//       name: 'Drinks',
//       id: 6,
//       image: require('../../Assets/png/Dashboard/food6.png'),
//     },
//   ];

//   const Deals = [
//     {
//       id: 1,
//       name: 'Chicken Noodle Special',
//       restaurent: 'Grim Cafe & Eatery',
//       price: '$2.5',
//       image: require('../../Assets/png/Dashboard/img1.png'),
//     },
//     {
//       id: 2,
//       name: 'Chicken Noodle Special',
//       restaurent: 'Grim Cafe & Eatery',
//       price: '$2.0',
//       image: Images.food8,
//     },
//     {
//       id: 3,
//       name: 'Chicken Noodle Special',
//       restaurent: 'Grim Cafe & Eatery',
//       price: '$1.0',
//       image: require('../../Assets/png/Dashboard/img1.png'),
//     },
//     {
//       id: 4,
//       name: 'Chicken Noodle Special',
//       restaurent: 'Grim Cafe & Eatery',
//       price: '$3.5',
//       image: Images.food8,
//     },
//   ];

//   const Restaurents = [
//     {
//       id: 1,
//       name: "Casetta Dell'Orso",
//       rating: '4.5',
//       image: require('../../Assets/png/Dashboard/res1.png'),
//     },
//     {
//       id: 2,
//       name: 'Grim Cafe & Eatery',
//       rating: '4.0',
//       image: require('../../Assets/png/Dashboard/res1.png'),
//     },
//     {
//       id: 3,
//       name: 'Grim Cafe & Eatery',
//       rating: '5.0',
//       image: require('../../Assets/png/Dashboard/res1.png'),
//     },
//     {
//       id: 4,
//       name: 'Grim Cafe & Eatery',
//       rating: '3.5',
//       image: require('../../Assets/png/Dashboard/res1.png'),
//     },
//   ];

//   const Cuisine = [
//     {
//       name: 'Burgers',
//       id: 1,
//       image: Images.burger,
//     },
//     {
//       name: 'Pizza',
//       id: 2,
//       image: Images.pasta,
//     },
//     {
//       name: 'Fries',
//       id: 3,
//       image: Images.food3,
//     },
//     {
//       name: 'Burgers',
//       id: 4,
//       image: require('../../Assets/png/Dashboard/food4.png'),
//     },
//     {
//       name: 'Pizza',
//       id: 5,
//       image: require('../../Assets/png/Dashboard/food5.png'),
//     },
//     {
//       name: 'Fries',
//       id: 6,
//       image: require('../../Assets/png/Dashboard/food6.png'),
//     },
//   ];

//   return (
//     <KeyboardAvoidingView style={styles.container}>
//       <ScrollView
//         contentContainerStyle={{flexGrow: 1}}
//         keyboardShouldPersistTaps="handled">
//         <LinearGradient
//           colors={['#FF5722', '#F99145']}
//           //style={{ flex: 1 }}
//         >
//           <StatusBar
//             backgroundColor={'transparent'}
//             barStyle={'light-content'}
//             translucent={true}
//           />
//           <View style={styles.header}>
//             <View style={styles.headerView}>
//               <TouchableOpacity
//                 onPress={() => navigation?.toggleDrawer()}
//                 style={styles.headerIconContainer}>
//                 <Feather name="menu" size={hp(3.5)} color="#FFFFFF" />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => {
//                   // navigation?.navigate('AddLocation');
//                   ref_RBSheet?.current?.open();
//                 }}
//                 style={styles.locationPickerContainer}>
//                 <View>
//                   <Ionicons
//                     name="location-sharp"
//                     size={hp(2)}
//                     color="#FFFFFF"
//                   />
//                 </View>
//                 <View>
//                   <Text numberOfLines={1} style={styles.text}>
//                     Location name
//                   </Text>
//                 </View>
//                 <View>
//                   <Entypo
//                     name={'chevron-thin-down'}
//                     size={hp(2)}
//                     color="#FFFFFF"
//                   />
//                 </View>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={() => navigation.navigate('Notification')}
//                 style={styles.headerIconContainer}>
//                 <Notification />
//               </TouchableOpacity>
//             </View>
//             <View style={{...styles.searchContainer}}>
//               <View style={styles.searchIcon}>
//                 <Search />
//               </View>
//               <View style={styles.inputContainer}>
//                 <TextInput
//                   style={styles.input}
//                   color="#212121"
//                   placeholder="What would you like to eat?"
//                   placeholderTextColor={'#808D9E'}
//                   // onChangeText={text => setFullName(text)}
//                   // value={fullName}
//                 />
//               </View>
//             </View>
//           </View>
//         </LinearGradient>
//         <View style={styles.mainBody}>
//           <View style={{...styles.viewCategoriesContainer, height: hp(14)}}>
//             <View style={styles.headerTextView}>
//               <Text style={styles.headerText}>Choose Category</Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   navigation.navigate('Categories');
//                 }}>
//                 <Text
//                   style={{
//                     ...styles.headerText,
//                     color: '#FF5722',
//                     fontSize: RFPercentage(1.8),
//                   }}>
//                   See All
//                 </Text>
//               </TouchableOpacity>
//             </View>
//             <View style={styles.categoryContainer}>
//               <TouchableOpacity
//                 onPress={() => setSelectedCategory('all')}
//                 style={styles.categoryView}>
//                 <View
//                   style={{
//                     ...styles.categoryImage,
//                     backgroundColor:
//                       selectedCategory == 'all' ? '#FF572245' : 'transparent',
//                   }}>
//                   {/* <View
//                     style={{
//                       ...styles.categoryImage,
//                       width: '85%',
//                       height: '85%',
//                       overflow: 'hidden',
//                     }}>
//                     <Image
//                       source={require('../../Assets/png/Dashboard/food1.png')}
//                       resizeMode="contain"
//                       style={styles.image}
//                     />
//                   </View> */}
//                   <Avatar.Image source={Images.food1} size={wp(10)} />
//                 </View>
//                 <Text
//                   style={{
//                     ...styles.categoryText,
//                     color: selectedCategory == 'all' ? '#FD451C' : '#000000',
//                   }}>
//                   All
//                 </Text>
//               </TouchableOpacity>
//               <FlatList
//                 horizontal={true}
//                 showsHorizontalScrollIndicator={false}
//                 data={Categories}
//                 renderItem={({item}) => (
//                   <TouchableOpacity
//                     style={styles.categoryView}
//                     onPress={() => setSelectedCategory(item.id)}>
//                     <View
//                       style={{
//                         ...styles.categoryImage,
//                         backgroundColor:
//                           selectedCategory == item?.id
//                             ? '#FF572245'
//                             : 'transparent',
//                       }}>
//                       {/* <View
//                         style={{
//                           ...styles.categoryImage,
//                           width: '85%',
//                           height: '85%',
//                           overflow: 'hidden',
//                         }}> */}
//                       {/* <Image
//                           source={item.image}
//                           resizeMode="contain"
//                           style={styles.image}
//                         /> */}

//                       <Avatar.Image source={item.image} size={wp(10)} />
//                       {/* </View> */}
//                     </View>
//                     <Text
//                       style={{
//                         ...styles.categoryText,

//                         color:
//                           selectedCategory == item?.id ? '#FD451C' : '#000000',
//                       }}>
//                       {item.name}
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//               />
//             </View>
//           </View>
//           <View style={styles.viewDealsContainer}>
//             <View style={styles.headerTextView}>
//               <Text style={styles.headerText}>Nearby Deals</Text>
//               <Text
//                 onPress={() => navigation?.navigate('Deals')}
//                 style={{
//                   ...styles.headerText,
//                   color: '#FF5722',
//                   fontSize: RFPercentage(1.8),
//                 }}>
//                 See All
//               </Text>
//             </View>
//             <View style={styles.nearByContainer}>
//               <FlatList
//                 horizontal={true}
//                 showsHorizontalScrollIndicator={false}
//                 data={Deals}
//                 renderItem={({item}) => (
//                   <TouchableOpacity
//                     onPress={() => navigation.navigate('DealsDetails')}
//                     style={styles.nearByView}>
//                     <View style={styles.nearByImage}>
//                       <Image
//                         source={item.image}
//                         resizeMode="contain"
//                         style={styles.image}
//                       />
//                     </View>
//                     <Text
//                       style={{
//                         ...styles.categoryText,
//                         fontSize: RFPercentage(1.5),
//                         fontWeight: '600',
//                       }}
//                       numberOfLines={1}>
//                       {item.name}
//                     </Text>
//                     <Text
//                       style={{
//                         ...styles.categoryText,
//                         fontSize: RFPercentage(1.3),
//                         color: '#FF5C01',
//                       }}>
//                       {item.restaurent}
//                     </Text>
//                     <Text
//                       style={{
//                         ...styles.categoryText,
//                         fontSize: RFPercentage(2),
//                         fontWeight: 'bold',
//                       }}>
//                       {item.price}
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//               />
//             </View>
//           </View>
//           <View style={styles.viewRestaurentContainer}>
//             <View style={styles.headerTextView}>
//               <Text style={styles.headerText}>Nearby Restaurents</Text>
//               <Text
//                 style={{
//                   ...styles.headerText,
//                   color: '#FF5722',
//                   fontSize: RFPercentage(1.8),
//                 }}
//                 onPress={() => navigation.navigate('NearByRestaurants')}>
//                 See All
//               </Text>
//             </View>
//             <View style={styles.restaurentContainer}>
//               <FlatList
//                 horizontal={true}
//                 showsHorizontalScrollIndicator={false}
//                 data={Restaurents}
//                 renderItem={({item}) => (
//                   <TouchableOpacity
//                     style={styles.restaurentView}
//                     onPress={() => navigation?.navigate('RestaurantDetails')}>
//                     <View style={styles.restaurentImage}>
//                       <Image
//                         source={item.image}
//                         resizeMode="stretch"
//                         style={styles.image}
//                       />
//                     </View>
//                     <View style={styles.textView}>
//                       <Text
//                         style={{
//                           ...styles.categoryText,
//                           fontSize: RFPercentage(1.9),
//                           fontWeight: '600',
//                           marginBottom: hp(0.5),
//                         }}
//                         numberOfLines={1}>
//                         {item.name}
//                       </Text>
//                       <Text
//                         style={{
//                           ...styles.categoryText,
//                           fontSize: RFPercentage(1.6),
//                           color: '#FF5C01',
//                           marginBottom: hp(0.5),
//                         }}>
//                         Open until 10.30 PM
//                       </Text>
//                       <View style={styles.review}>
//                         <Star />
//                         <Text
//                           style={{
//                             ...styles.categoryText,
//                             fontSize: RFPercentage(1.3),
//                             fontWeight: '600',
//                             paddingLeft: wp(1.2),
//                           }}>
//                           {item.rating}{' '}
//                         </Text>
//                         <Text
//                           style={{
//                             ...styles.categoryText,
//                             fontSize: RFPercentage(1.3),
//                             fontWeight: '600',
//                             color: '#97999A',
//                           }}>
//                           (2,12k Review)
//                         </Text>
//                       </View>
//                     </View>
//                   </TouchableOpacity>
//                 )}
//               />
//             </View>
//           </View>
//           <View style={styles.viewCusineContainer}>
//             <View style={styles.headerTextView}>
//               <Text style={styles.headerText}>Cuisines</Text>
//               <Text
//                 onPress={() => navigation?.navigate('Cuisines')}
//                 style={{
//                   ...styles.headerText,
//                   color: '#FF5722',
//                   fontSize: RFPercentage(1.8),
//                 }}>
//                 See All
//               </Text>
//             </View>
//             <View style={styles.cuisineContainer}>
//               <FlatList
//                 horizontal={true}
//                 showsHorizontalScrollIndicator={false}
//                 data={Cuisine}
//                 renderItem={({item}) => (
//                   <TouchableOpacity
//                     onPress={() => navigation.navigate('SpecificCuisines')}
//                     style={styles.cuisineView}>
//                     <View style={styles.cuisineImage}>
//                       <Image
//                         source={item.image}
//                         resizeMode="stretch"
//                         style={styles.image}
//                       />
//                     </View>
//                     <Text
//                       style={{
//                         ...styles.categoryText,
//                         fontSize: RFPercentage(1.9),
//                         fontWeight: '600',
//                         marginTop: hp(0.5),
//                       }}
//                       numberOfLines={1}>
//                       {item.name}
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//               />
//             </View>
//           </View>
//           <View style={{...styles.viewCusineContainer, marginTop: -30}}>
//             {/* <View style={styles.headerTextView}>
//               <Text style={styles.headerText}>Items</Text>
//               <Text
//                 style={{
//                   ...styles.headerText,
//                   color: '#FF5722',
//                   fontSize: RFPercentage(1.8),
//                 }}>
//                 See All
//               </Text>
//             </View> */}
//             <View style={styles.cuisineContainer}>
//               <FlatList
//                 horizontal={true}
//                 showsHorizontalScrollIndicator={false}
//                 data={Cuisine}
//                 renderItem={({item}) => (
//                   <TouchableOpacity
//                     onPress={() => navigation.navigate('SpecificCuisines')}
//                     style={styles.cuisineView}>
//                     <View style={styles.cuisineImage}>
//                       <Image
//                         source={item.image}
//                         resizeMode="stretch"
//                         style={styles.image}
//                       />
//                     </View>
//                     <Text
//                       style={{
//                         ...styles.categoryText,
//                         fontSize: RFPercentage(1.9),
//                         fontWeight: '600',
//                         marginTop: hp(0.5),
//                       }}
//                       numberOfLines={1}>
//                       {item.name}
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//               />
//             </View>
//           </View>
//         </View>
//         <RBSheetAddLocation refRBSheet={ref_RBSheet} />
//       </ScrollView>
//       <View style={styles.footer}></View>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     //  backgroundColor:"rgba(0, 0, 0, 0.3)",
//   },
//   header: {
//     // alignSelf:"flex-start",
//     height: hp(20),
//     //  borderWidth:1,
//     justifyContent: 'space-evenly',
//     marginTop: StatusBar.currentHeight - 20,
//   },
//   headerView: {
//     width: wp(100),
//     height: '30%',
//     //  borderWidth:1,
//     flexDirection: 'row',
//   },
//   headerIconContainer: {
//     width: wp(20),
//     //borderWidth:1,
//     // height:"60%",
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   locationPickerContainer: {
//     width: wp(60),
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     //borderWidth:1,
//   },
//   text: {
//     textAlign: 'center',
//     //borderWidth:1,
//     width: wp(40),
//     color: '#FFFFFF',
//   },
//   searchContainer: {
//     width: wp(80),
//     height: wp(11),
//     borderRadius: hp(50),
//     backgroundColor: '#FFFFFF',
//     flexDirection: 'row',
//     paddingHorizontal: wp(5),
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignSelf: 'center',
//   },
//   inputContainer: {
//     //flexDirection:"row",
//     flex: 1,
//     height: wp(11),
//     //borderRadius:hp(50),

//     // justifyContent:"center",
//     backgroundColor: '#FFFFFF',
//     //alignItems:"center",
//     //  borderWidth:1
//   },
//   input: {
//     marginLeft: hp(1),
//     height: hp(6),
//   },
//   searchIcon: {
//     //borderWidth:1
//   },
//   mainBody: {
//     flex: 1,
//     justifyContent: 'space-between',
//     height: hp(120),
//     padding: wp(3),
//     marginBottom: hp(1),
//     // borderWidth:1
//   },
//   viewCategoriesContainer: {
//     height: hp(17),
//     // borderWidth:1
//   },
//   viewDealsContainer: {
//     height: hp(25),
//     // borderWidth:1
//   },
//   viewRestaurentContainer: {
//     height: hp(21),
//     // borderWidth:1
//   },
//   viewCusineContainer: {
//     height: hp(20),
//   },
//   headerTextView: {
//     // borderWidth:1,
//     height: hp(4),
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 10,
//   },
//   headerText: {
//     color: '#000000',
//     fontFamily: Fonts.PlusJakartaSans_Bold,
//     fontSize: RFPercentage(2),
//     //lineHeight: 84,
//     // fontWeight: 'bold',
//     // textAlign: 'center',
//     // marginBottom:hp("2"),
//   },
//   categoryContainer: {
//     flex: 1,
//     flexDirection: 'row',
//   },
//   categoryView: {
//     //borderWidth:1,
//     //  height:hp(5),
//     //flex:1,
//     width: wp(23),
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   categoryImage: {
//     borderWidth: 1,
//     borderColor: '#E6E7EB',
//     width: wp(15),
//     height: wp(15),
//     borderRadius: wp(15) / 2,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   categoryText: {
//     color: '#000000',
//     fontFamily: 'PlusJakartaSans-Regular',
//     fontSize: RFPercentage(1.6),
//     //lineHeight: 84,
//     //fontWeight:"bold",
//     // textAlign: 'center',
//     // marginBottom:hp("2"),
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//   },
//   nearByContainer: {
//     flex: 1,
//     flexDirection: 'row',
//   },
//   nearByView: {
//     borderWidth: 1,
//     //flex:1,
//     borderColor: '#E6E7EB',
//     width: wp(35),
//     // height:"100%",
//     borderRadius: hp(2),
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     marginRight: wp(2),
//   },
//   nearByImage: {
//     //borderWidth:1,
//     height: hp(9),
//     width: wp(31),
//     borderRadius: hp(2),
//   },

//   restaurentContainer: {
//     flex: 1,
//     flexDirection: 'row',
//   },
//   restaurentView: {
//     borderWidth: 1,
//     flexDirection: 'row',
//     //flex:1,
//     borderColor: '#E6E7EB',
//     width: wp(75),
//     // height:"100%",
//     borderRadius: hp(2),
//     // justifyContent:"space-evenly",
//     alignItems: 'center',
//     // paddingLeft:wp(0.5)
//     marginRight: wp(2),
//   },
//   restaurentImage: {
//     overflow: 'hidden',
//     marginHorizontal: hp(1.5),
//     // borderWidth:1,
//     height: hp(13),
//     width: wp(33),
//     borderRadius: hp(2),
//   },

//   textView: {
//     //  borderWidth:1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     // paddingVertical:hp(1),

//     // justifyContent:"space-around"
//   },
//   review: {
//     //borderWidth:1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   cuisineContainer: {
//     flex: 1,
//     flexDirection: 'row',
//   },
//   cuisineView: {
//     borderWidth: 1,
//     borderColor: '#E6E7EB',
//     width: wp(30),
//     height: hp(13.5),
//     borderRadius: hp(2),
//     paddingTop: hp(1),
//     alignItems: 'center',
//     marginRight: wp(2),
//   },
//   cuisineImage: {
//     //borderWidth:1,
//     height: hp(8),
//     width: wp(22),
//     borderRadius: hp(2),
//     overflow: 'hidden',
//   },

//   footer: {
//     height: hp(7),
//     // alignSelf:"flex-end",
//     // backgroundColor:"blue",
//     // borderWidth:1,
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     top: hp(93),
//     //padding:10,
//   },
// });
// export default Dashboard;
