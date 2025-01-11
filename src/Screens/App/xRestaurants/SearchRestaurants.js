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
import TopSearchesList from '../../../components/Lists/TopSearchesList';

import debounce from 'lodash.debounce';
import {showAlert} from '../../../utils/helpers';
import api from '../../../constants/api';
import RestaurantCard from '../../../components/Cards/RestaurantCard';
import Loader from '../../../components/Loader';
import NoDataFound from '../../../components/NotFound/NoDataFound';
import {
  addRestaurantTopSearch,
  getRestaurantTopSearch,
  removeRestaurantTopSearch,
} from '../../../utils/helpers/localStorage';

const SearchRestaurants = ({navigation, route}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTopSearches, setShowTopSearches] = useState(false);

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

  const handleRemoveTopSearches = async item => {
    const filter = topSearchesList.filter(e => e != item);
    setTopSearchesList(filter);
    removeRestaurantTopSearch(filter); //also remove item from local storage
  };

  // Simulated search API function
  const searchApi = async query => {
    setShowTopSearches(false);
    if (!loading) {
      setLoading(true);
    }
    try {
      const response = await fetch(api.search_restaurant_by_name + query); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      console.log('search api called :  ');
      setData(json?.result);
      if (json?.result?.length > 0) {
        let found = topSearchesList?.some(item => item == query);
        if (!found) {
          addRestaurantTopSearch([...topSearchesList, query]);
          getTopSearches();
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

  const debouncedSearch = debounce(searchApi, 2000);

  const handleSearch = text => {
    console.log('text : ', text);
    setSearchQuery(text);
    setShowTopSearches(true);
    // debouncedSearch(text?.trim());
  };

  const getTopSearches = async () => {
    let list = await getRestaurantTopSearch();
    console.log('list  :  ', list);
    setTopSearchesList(list);
  };

  useEffect(() => {
    getTopSearches();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery?.length == 0) {
        setLoading(false);
        setData([]);
        setShowTopSearches(false);
      } else {
        setLoading(true);
        searchApi(searchQuery);
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
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
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
                  onFocus={() => setShowTopSearches(true)}
                  // onBlur={() => setShowTopSearches(false)}
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
            ListFooterComponent={() => <View style={{height: 15}} />}
            renderItem={({item}) => (
              <RestaurantCard
                onPress={() =>
                  navigation?.navigate('RestaurantAllDetails', {
                    id: item?.restaurant_id,
                  })
                }
                title={item?.user_name}
                // image={item?.image}
                image={
                  item?.images?.length > 0
                    ?  item?.images[0]
                    : ''
                }
                // tag={item?.tag}
                tag={item?.working_hours ? item?.working_hours : ''}
                rating={item?.rating ? item?.rating : '0.0'}
                reviews={item?.reviews ? item?.reviews?.length : '0'}
                nextIconWidth={26}
                cardStyle={{marginHorizontal: 20, marginBottom: -5}}
                showNextButton={true}
                showRating={true}
                priceContainerStyle={{marginTop: 0}}
              />
            )}
            ListEmptyComponent={() => (loading ? null : <NoDataFound />)}
          />
        )}
      </ScrollView>
    </View>
  );
};
export default SearchRestaurants;
