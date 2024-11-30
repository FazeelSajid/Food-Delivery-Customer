import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors, Icons, Fonts, Images } from '../../../constants';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import StackHeader from '../../../components/Header/StackHeader';
import CInput from '../../../components/TextInput/CInput';
import FoodCardWithRating from '../../../components/Cards/FoodCardWithRating';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ItemSeparator from '../../../components/Separator/ItemSeparator';
import TopSearchesList from '../../../components/Lists/TopSearchesList';
import {
  addDealsTopSearch,
  getDealsTopSearch,
  removeDealsTopSearch,
} from '../../../utils/helpers/localStorage';
import { fetchApisGet, handlePopup, showAlert } from '../../../utils/helpers';
import NoDataFound from '../../../components/NotFound/NoDataFound';
import api from '../../../constants/api';
import { BASE_URL_IMAGE } from '../../../utils/globalVariables';
import Loader from '../../../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { removeDealResearch, setDealsResearch } from '../../../redux/AuthSlice';
import DealCard from '../../../components/Cards/DealCard';
import { addFavoriteDeal, removeFavoriteDeal } from '../../../utils/helpers/FavoriteApis';
import { addItemToCart, getCustomerCart, updateCartItemQuantity } from '../../../utils/helpers/cartapis';
import { addItemToMYCart, updateMyCartList } from '../../../redux/CartSlice';
import PopUp from '../../../components/Popup/PopUp';

const SearchNearByDeals = ({ navigation, route }) => {

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const { my_cart } = useSelector(store => store.cart);
  const [showTopSearches, setShowTopSearches] = useState(false);
  const [itemObj, setItemObj] = useState({})
  const [data, setData] = useState([]);
  const [numColumns, setNumColumns] = useState(2)
  const { favoriteDeals } = useSelector(store => store.favorite);
  const {  dealsRecentResearch, customer_id, cuisines,showPopUp, popUpColor, PopUpMesage } = useSelector(store => store.store);





  const setCusineNameByItemCusineId = (cusineId) => {
    const cuisineName = cuisines?.filter(item => item?.cuisine_id === cusineId)[0]?.cuisine_name;

    return cuisineName;
  }



  const handleRemoveTopSearches = async query => {
    dispatch(removeDealResearch(query))
    // const filter = topSearchesList.filter(e => e != item);
    // setTopSearchesList(filter);
    // removeDealsTopSearch(filter); //also remove item from local storage
  };

  // Simulated search API function
  const searchApi = async query => {
    // setShowTopSearches(false);
    if (!loading) {
      setLoading(true);
    }
    // const response = await fetchApisGet(api.search_deal_by_name + query, setLoading, dispatch);
    // let list = response?.result ? response?.result : [];
    // console.log(response);
    
    // setData(list)
    // if (response?.result?.length > 0) {
    //       let found = dealsRecentResearch?.some(item => item == query);
    //       if (!found) {
    //         // addDealsTopSearch([...topSearchesList, query]);
    //         dispatch(setDealsResearch(query))
    //         // getTopSearches();
    //       }
    //     }
    try {
      const response = await fetch(api.search_deal_by_name + query);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      console.log('search api called :  ', json);
      setData(json?.result);

      if (json?.result?.length > 0) {
        let found = dealsRecentResearch?.some(item => item == query);
        if (!found) {
          // addDealsTopSearch([...topSearchesList, query]);
          dispatch(setDealsResearch(query))
          // getTopSearches();
        }
      }
    } catch (error) {
      console.log('error in search api : ', error);
      showAlert('Something went wrong');
    } finally {
      setLoading(false);
      // setShowTopSearches(true);
    }
  };

  const add_item_to_cart = async (id, name) => {

    
    let cart = await getCustomerCart(customer_id, dispatch);
    console.log('______cart    :  ', cart?.cart_id);


    let data = {
      item_id: id,
      cart_id: cart?.cart_id?.toString(),
      item_type: 'deal',
      comments: '',
      quantity: 1,
    };


    await addItemToCart(data, dispatch)
      .then(response => {
        console.log('response ', response);
        if (response?.status == true) {
          // navigation?.navigate('MyCart');
          // cart_restaurant_id
          // dispatch(setCartRestaurantId(restaurantDetails?.restaurant_id));
          //my_cart
          dispatch(addItemToMYCart(response?.result));
          // setSelectedVariation(null)

          // ref_RBSheetSuccess?.current?.open();
          handlePopup(dispatch, `${name} is added to cart`, 'green')
        } else {
          handlePopup(dispatch,response?.message, 'red')
        }
      })
      .catch(error => {
        console.log('error  :  ', error);
      })
      .finally(() => {
        setLoading(false)
      });
  };


  const handleSearch = text => {
    console.log('text : ', text);
    setSearchQuery(text);
    // setShowTopSearches(true);
    // debouncedSearch(text?.trim());
  };

  const shortenString = (str) => {
    if (str.length > 35) {
      return str.substring(0, 20) + '...';
    }
    return str;
  }

  const handleDealAddToCart = async (deal) => {


    setItemObj({
      id: deal.deal_id,
      name: deal?.name,
    })
    console.log({
      id: deal.deal_id,
      name: deal?.name,
    });


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
            // showAlert(`${deal?.name}'s quantity updated`, 'green')
            handlePopup(dispatch, `${deal?.name}'s quantity updated`, 'green')
          }
        })
      // also update quantity in redux
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



    } else {
      add_item_to_cart(deal.deal_id, deal?.name)

    }
    // }
  };

  

  // const [isSearch, setIsSearch] = useState(false);
  // const [filteredData, setFilteredData] = useState([]);
  // const [topSearchesList, setTopSearchesList] = useState(dealsRecentResearch);

  // console.log(dealsRecentResearch, 'topSearches');

  // const getTopSearches = async () => {
  //   let list = await getDealsTopSearch();
  //   console.log('list  :  ', list);
  //   setTopSearchesList(list);
  // };
  // useEffect(() => {
  //   getTopSearches();
  // }, []);
  // const debouncedSearch = debounce(searchApi, 2000);

  // const handleSearch = query => {
  //   setSearchQuery(query);
  //   const filteredData = data.filter(item =>
  //     item?.title?.toLowerCase()?.includes(query?.toLowerCase()),
  //   );
  //   setFilteredData(filteredData);
  // };

  // const handleCloseSearch = async () => {
  //   setIsSearch(false);
  //   setFilteredData([]);
  //   setSearchQuery('');
  // };

  // const handleRemoveTopSearches = async item => {
  //   const filter = topSearchesList.filter(e => e != item);
  //   setTopSearchesList(filter);
  //   removeDealsTopSearch(filter); //also remove item from local storage
  // };


  const isDealFavorite = (id) => {

    return favoriteDeals.some(item => item?.deal?.deal_id === id);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery?.length == 0) {
        setLoading(false);
        setData([]);
        setShowTopSearches(true);
      } else {
        setLoading(true);
        searchApi(searchQuery);
        setShowTopSearches(false);

      }
      // Send Axios request here
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.White }}>
      <Loader loading={loading} />
      {showPopUp && <PopUp color={popUpColor} message={PopUpMesage} />}

      <ScrollView
        nestedScrollEnabled={true}
        contentContainerStyle={{ flexGrow: 1 }}>
        <StackHeader
          showTitle={false}
          iconContainerStyle={{
            marginTop: -12,
          }}
          headerStyle={{
            paddingVertical: 0,
          }}
          onBackPress={() => navigation?.goBack()}
          rightIcon={
            <>
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
                      style={{ marginLeft: -12, marginRight: -6 }}
                      width={32}
                    />
                  }
                />
              </TouchableOpacity>
            </>
          }
        />

        {showTopSearches && (
          <View
            style={{
              flex: 1,
              marginTop: -15,
              paddingBottom: 30,
            }}>
            <TopSearchesList
              data={dealsRecentResearch}
              onPress={item => {
                console.log('onPress :  ');
                searchApi(item);
                setSearchQuery(item);
              }}
              onRemove={item => handleRemoveTopSearches(item)}
            />
          </View>
        )}

        {showTopSearches ? null : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={data}
            key={numColumns}
            contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }}
            numColumns={numColumns}
            ListEmptyComponent={() => !loading && <NoDataFound svgHeight={hp(15)} text={'No Deals'} textStyle={{ fontSize: RFPercentage(2.5) }} />}
            ItemSeparatorComponent={() => <View style={{ height: hp(3) }} />}
            renderItem={({ item }) => {
              const cuisineIds = item?.items?.map(item => item?.cuisine_id);
              const cuisineNames = cuisineIds?.map(cuisineId =>
                setCusineNameByItemCusineId(cuisineId)
              );
              const fav = isDealFavorite(item?.deal_id)

              return (
                <DealCard
                image={
                  item?.images?.length > 0
                    ? BASE_URL_IMAGE + item?.images[0]
                    : ''
                }
                description={shortenString(item?.description)}
                price={item?.price}
                title={item?.name}
                onPress={() => {
                  navigation.navigate('NearByDealsDetails', {
                    id: item?.deal_id,
                    type: 'favorite',
                  });
                }}
                isFavorite={fav}
                heartPress={() => fav ? removeFavoriteDeal(item?.deal_id, customer_id, favoriteDeals, dispatch, showAlert) : addFavoriteDeal(item?.deal_id, customer_id, dispatch, showAlert)}
                addToCartpress={() => handleDealAddToCart(item)}
                imageStyle={{
                  width: wp(42),
                  height: hp('16.5%')
                }}
                nameStyle={{ fontSize: RFPercentage(1.8) }}
                descriptionStyle={{ fontSize: RFPercentage(1.5) }}
                priceStyle={{ fontSize: RFPercentage(2.2), color: Colors.Orange }}
                iconSize={19}
              />
                // <FoodCardWithRating
                //   onPress={() => navigation?.navigate('NearByDealsDetails')}
                //   title={item?.name}
                //   // image={item?.image}
                //   image={
                //     item?.images?.length > 0
                //       ? BASE_URL_IMAGE + item?.images[0]
                //       : ''
                //   }
                //   // description={item?.description}
                //   price={item?.price}
                //   rating={item?.rating}
                //   // tag={item?.tag}
                //   // tag={['Burger', 'Pizza', 'Drinks']}
                //   tag={cuisineNames ? cuisineNames : []}
                //   isTagArray={true}
                //   nextIconWidth={26}
                //   // cardStyle={{marginHorizontal: 20, marginBottom: 15}}
                //   showNextButton={true}
                //   showRating={false}
                //   priceContainerStyle={{ marginTop: 0 }}
                // />
              )
            }}
          />

        )}
      </ScrollView>
    </View>
  );
};

export default SearchNearByDeals;
