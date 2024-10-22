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
  getDealsTopSearch,
  removeDealsTopSearch,
} from '../../../utils/helpers/localStorage';
import {showAlert} from '../../../utils/helpers';
import NoDataFound from '../../../components/NotFound/NoDataFound';
import api from '../../../constants/api';
import {BASE_URL_IMAGE} from '../../../utils/globalVariables';
import Loader from '../../../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { removeDealResearch, setDealsResearch } from '../../../redux/AuthSlice';

const SearchNearByDeals = ({navigation, route}) => {
  // const [isSearch, setIsSearch] = useState(false);
  // const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const {dealsRecentResearch, cuisines} = useSelector(store => store.store)
  const [showTopSearches, setShowTopSearches] = useState(false);

  const [data, setData] = useState([]);

  // const [topSearchesList, setTopSearchesList] = useState(dealsRecentResearch);

  // console.log(dealsRecentResearch, 'topSearches');

  const setCusineNameByItemCusineId = (cusineId) => {
    const cuisineName = cuisines?.filter(item => item?.cuisine_id === cusineId)[0]?.cuisine_name;
    // console.log(cuisineName);

    return cuisineName;
  }
  

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
    try {
      const response = await fetch(api.search_deal_by_name + query); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      console.log('search api called :  ',json);
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

  // const debouncedSearch = debounce(searchApi, 2000);

  const handleSearch = text => {
    console.log('text : ', text);
    setSearchQuery(text);
    // setShowTopSearches(true);
    // debouncedSearch(text?.trim());
  };

  // const getTopSearches = async () => {
  //   let list = await getDealsTopSearch();
  //   console.log('list  :  ', list);
  //   setTopSearchesList(list);
  // };
  // useEffect(() => {
  //   getTopSearches();
  // }, []);

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
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <Loader loading={loading} />
      <ScrollView
        nestedScrollEnabled={true}
        contentContainerStyle={{flexGrow: 1}}>
        <StackHeader
          // title={'Order History'}
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
          ItemSeparatorComponent={() => <View style={{height: hp(3)}} />}
          renderItem={({item}) => {
            const cuisineIds = item?.items?.map(item => item?.cuisine_id);
            const cuisineNames = cuisineIds?.map(cuisineId =>
              setCusineNameByItemCusineId(cuisineId)
            );
            return(
            <FoodCardWithRating
              onPress={() => navigation?.navigate('NearByDealsDetails')}
              title={item?.name}
              // image={item?.image}
              image={
                item?.images?.length > 0
                  ? BASE_URL_IMAGE + item?.images[0]
                  : ''
              }
              // description={item?.description}
              price={item?.price}
              rating={item?.rating}
              // tag={item?.tag}
              // tag={['Burger', 'Pizza', 'Drinks']}
              tag={cuisineNames ? cuisineNames : []}
              isTagArray={true}
              nextIconWidth={26}
              // cardStyle={{marginHorizontal: 20, marginBottom: 15}}
              showNextButton={true}
              showRating={false}
              priceContainerStyle={{marginTop: 0}}
            />
          )}}
          ListEmptyComponent={() => (loading ? null : <NoDataFound />)}
        />

        )}
      </ScrollView>
    </View>
  );
};

export default SearchNearByDeals;
