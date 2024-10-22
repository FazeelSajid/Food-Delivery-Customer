import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Colors, Icons, Fonts, Images} from '../../../constants';
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
import TopSearchesList from '../../../components/Lists/TopSearchesList';
import {
  addDealsTopSearch,
  addOrderTopSearch,
  getDealsTopSearch,
  getOrderTopSearch,
  removeDealsTopSearch,
  removeOrderTopSearch,
} from '../../../utils/helpers/localStorage';
import {showAlert} from '../../../utils/helpers';
import NoDataFound from '../../../components/NotFound/NoDataFound';
import api from '../../../constants/api';
import {BASE_URL_IMAGE} from '../../../utils/globalVariables';
import Loader from '../../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';

const SearchOrder = ({navigation, route}) => {
  const order_history = useSelector(store => store.order.order_history);

  const [isSearch, setIsSearch] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTopSearches, setShowTopSearches] = useState(true);
  const [isFirst, setIsFirst] = useState(true);

  const [data, setData] = useState([
    // {
    //   id: 0,
    //   title: 'Green Salad',
    //   image: Images.salad,
    //   price: '14:20',
    //   rating: 4.5,
    // },
    // {
    //   id: 2,
    //   title: 'Green Salad',
    //   image: Images.salad,
    //   price: '14:20',
    //   rating: 4.5,
    // },
    // {
    //   id: 3,
    //   title: 'Green Salad',
    //   image: Images.salad,
    //   price: '14:20',
    //   rating: 4.5,
    // },
    // {
    //   id: 4,
    //   title: 'Green Salad',
    //   image: Images.salad,
    //   price: '14:20',
    //   rating: 4.5,
    // },
    // {
    //   id: 5,
    //   title: 'Green Salad',
    //   image: Images.salad,
    //   price: '14:20',
    //   rating: 4.5,
    // },
    // {
    //   id: 6,
    //   title: 'Green Salad',
    //   image: Images.salad,
    //   price: '14:20',
    //   rating: 4.5,
    // },
    // {
    //   id: 7,
    //   title: 'Green Salad',
    //   image: Images.salad,
    //   price: '14:20',
    //   rating: 4.5,
    // },
    // {
    //   id: 8,
    //   title: 'Green Salad',
    //   image: Images.salad,
    //   price: '14:20',
    //   rating: 4.5,
    // },
    // {
    //   id: 9,
    //   title: 'Green Salad',
    //   image: Images.salad,
    //   price: '14:20',
    //   rating: 4.5,
    // },
    // {
    //   id: 10,
    //   title: 'Green Salad',
    //   image: Images.salad,
    //   price: '14:20',
    //   rating: 4.5,
    // },
    // {
    //   id: 11,
    //   title: 'Green Salad',
    //   image: Images.salad,
    //   price: '14:20',
    //   rating: 4.5,
    // },
  ]);

  const [topSearchesList, setTopSearchesList] = useState([]);

  // const handleSearch = query => {
  //   setSearchQuery(query);

  const handleRemoveTopSearches = async item => {
    const filter = topSearchesList.filter(e => e != item);
    setTopSearchesList(filter);
    removeOrderTopSearch(filter); //also remove item from local storage
  };

  // Simulated search API function
  const searchApi = async query => {
    setShowTopSearches(false);
    if (!loading) {
      setLoading(true);
    }
    try {
      console.log('query :  ', query);
      //   const filteredData = order_history?.filter(
      //     item =>
      //       item?.cart_items_Data?.length > 0 &&
      //       (item?.cart_items_Data[0]?.itemData?.name === query ||
      //         item?.cart_items_Data[0]?.itemData?.item_name === query),
      //   );
      const filteredData = order_history?.filter(item => {
        const firstCartItem = item?.cart_items_Data?.[0]?.itemData;
        return (
          item?.cart_items_Data?.length > 0 &&
          (firstCartItem?.name?.includes(query) ||
            firstCartItem?.item_name?.includes(query))
        );
      });

      console.log('filteredData :  ', filteredData);
      setData(filteredData);
      if (filteredData?.length > 0) {
        let found = topSearchesList?.some(item => item == query);
        if (!found) {
          addOrderTopSearch([...topSearchesList, query]);
          getTopSearches();
        }
      }

      /////////////////////////
      //   let customer_id = await AsyncStorage.getItem('customer_id');
      //   let url =
      //     api.search_order_by_user +
      //     `?text=${query?.trim()}&customer_id=${customer_id}`;
      //   console.log('url :  ', url);
      //   const response = await fetch(url); // Replace with your API endpoint
      //   if (!response.ok) {
      //     throw new Error('Network response was not ok');
      //   }
      //   const json = await response.json();
      //   console.log('search api called :  ');
      //   //   setData(json?.result);
      //   let list = json?.result ? json?.result : [];
      //   const filter = list?.filter(item => item?.cart_items_Data?.length > 0);
      //   setData(filter?.reverse());
      //   if (filter?.length > 0) {
      //     let found = topSearchesList?.some(item => item == query);
      //     if (!found) {
      //       addOrderTopSearch([...topSearchesList, query]);
      //       getTopSearches();
      //     }
      //   }
    } catch (error) {
      console.log('error in search api : ', error);
      showAlert('Something went wrong');
    } finally {
      setLoading(false);
      // setShowTopSearches(true);
    }
  };

  const handleSearch = text => {
    console.log('text : ', text);
    setSearchQuery(text);
    setShowTopSearches(true);
  };

  const getTopSearches = async () => {
    let list = await getOrderTopSearch();
    console.log('list  :  ', list);
    setTopSearchesList(list);
  };
  useEffect(() => {
    getTopSearches();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (isFirst) {
        setIsFirst(false);
      } else if (searchQuery?.length == 0) {
        setLoading(false);
        setData([]);
        setShowTopSearches(false);
      } else {
        setLoading(true);
        searchApi(searchQuery?.trim());
      }
      // Send Axios request here
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <Loader loading={loading} />
      <ScrollView
        nestedScrollEnabled={true}
        contentContainerStyle={{flexGrow: 1}}>
        <StackHeader
          title={'Order History'}
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
                      style={{marginLeft: -12, marginRight: -6}}
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
              data={topSearchesList}
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
            ItemSeparatorComponent={() => <View style={{height: hp(3)}} />}
            renderItem={({item, index}) => {
              let cart_item =
                item?.cart_items_Data?.length > 0
                  ? item?.cart_items_Data[0]
                  : null;
              return (
                <FoodCardWithRating
                  onPress={() =>
                    navigation.navigate('OrderDetails', {
                      type: 'history',
                      id: item?.order_id,
                    })
                  }
                  image={
                    cart_item && cart_item?.itemData?.images?.length > 0
                      ? BASE_URL_IMAGE + cart_item?.itemData?.images[0]
                      : ''
                  }
                  title={
                    cart_item
                      ? cart_item?.item_type == 'deal'
                        ? cart_item?.itemData?.name
                        : cart_item?.itemData?.item_name
                      : ''
                  }
                  price={cart_item ? cart_item?.itemData?.price : ''}
                  showRating={false}
                  label={item?.status}
                  type={'history'}
                  //   cardStyle={{marginTop: 5}}
                  imageContainerStyle={{
                    // width: 30,
                    height: 60,
                    marginVertical: 1.5,
                    flex: 0.34,
                  }}
                />
              );
            }}
            ListEmptyComponent={() => (loading ? null : <NoDataFound />)}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default SearchOrder;
