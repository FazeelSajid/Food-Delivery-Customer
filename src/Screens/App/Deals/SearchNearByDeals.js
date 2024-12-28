import {
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Icons, Fonts, Images } from '../../../constants';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import StackHeader from '../../../components/Header/StackHeader';
import CInput from '../../../components/TextInput/CInput';
import TopSearchesList from '../../../components/Lists/TopSearchesList';
import { handlePopup } from '../../../utils/helpers';
import NoDataFound from '../../../components/NotFound/NoDataFound';
import api from '../../../constants/api';
import Loader from '../../../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { removeDealResearch, setDealsResearch } from '../../../redux/AuthSlice';
import DealCard from '../../../components/Cards/DealCard';
import { addFavoriteDeal, removeFavoriteDeal } from '../../../utils/helpers/FavoriteApis';
import { addItemToCart, getCustomerCart, updateCartItemQuantity } from '../../../utils/helpers/cartapis';
import { addItemToMYCart, updateMyCartList } from '../../../redux/CartSlice';
import PopUp from '../../../components/Popup/PopUp';
import RBSheetGuestUser from '../../../components/BottomSheet/RBSheetGuestUser';

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
  const ref_RBSheet = useRef()
  const {  dealsRecentResearch, customer_id, cuisines,showPopUp, popUpColor, PopUpMesage,Colors, join_as_guest } = useSelector(store => store.store);
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
  const searchApi = async query => {
    if (!loading) {
      setLoading(true);
    }
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
          dispatch(setDealsResearch(query))
        }
      }
    } catch (error) {
      console.log('error in search api : ', error);
      handlePopup(dispatch,'Something went wrong','red');
    } finally {
      setLoading(false);
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
          dispatch(addItemToMYCart(response?.result));
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
            handlePopup(dispatch, `${deal?.name}'s quantity updated`, 'green')
          }
        })
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
  };

  


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
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.secondary_color }}>
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
                    ? item?.images[0]
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
                heartPress={() => {
                  if (join_as_guest) {
                    ref_RBSheet.current.open()
                  } else {
                    fav ? removeFavoriteDeal(item?.deal_id, customer_id, favoriteDeals, dispatch) : addFavoriteDeal(item?.deal_id, customer_id, dispatch)
                  }
                }
                }
                addToCartpress={() => {
                  if (join_as_guest) {
                    ref_RBSheet.current.open()
                  } else {
                    handleDealAddToCart(item)   
                  }
                } 
                 }
                imageStyle={{
                  width: wp(42),
                  height: hp('16.5%')
                }}
                nameStyle={{ fontSize: RFPercentage(1.8) }}
                descriptionStyle={{ fontSize: RFPercentage(1.5) }}
                priceStyle={{ fontSize: RFPercentage(2.2), color: Colors.primary_color }}
                iconSize={19}
              />
               
              )
            }}
          />

        )}
      </ScrollView>

      <RBSheetGuestUser
        refRBSheet={ref_RBSheet}

        btnText={'OK'}
        onSignIn={() => {
          ref_RBSheet?.current?.close();
          navigation?.popToTop();
          navigation?.replace('SignIn');
        }}
        onSignUp={() => {
          ref_RBSheet?.current?.close();
          navigation?.popToTop();
          navigation?.replace('SignUp');
        }}
      />
    </View>
  );
};

export default SearchNearByDeals;
