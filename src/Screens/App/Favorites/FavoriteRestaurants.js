import {StyleSheet, View, FlatList} from 'react-native';
import React, {memo, useState, useEffect} from 'react';
import {Images} from '../../../constants';
import FavoriteItemCard from '../../../components/Cards/FavoriteItemCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../constants/api';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {BASE_URL_IMAGE} from '../../../utils/globalVariables';
import Loader from '../../../components/Loader';
import NoDataFound from '../../../components/NotFound/NoDataFound';
import {showAlert} from '../../../utils/helpers';

const FavoriteRestaurants = ({}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  // const data = [
  //   {
  //     id: 0,
  //     image: Images.salad,
  //     title: 'Restaurant’s Name',
  //     rating: 4.5,
  //     reviews: '23.5k',
  //     tag: '08:00 am - 12:00 pm',
  //   },
  //   {
  //     id: 1,
  //     image: Images.salad,
  //     title: 'Restaurant’s Name',
  //     rating: 4.5,
  //     reviews: '23.5k',
  //     tag: '08:00 am - 12:00 pm',
  //   },
  //   {
  //     id: 2,
  //     image: Images.salad,
  //     title: 'Restaurant’s Name',
  //     rating: 4.5,
  //     reviews: '23.5k',
  //     tag: '08:00 am - 12:00 pm',
  //   },
  //   {
  //     id: 3,
  //     image: Images.salad,
  //     title: 'Restaurant’s Name',
  //     rating: 4.5,
  //     reviews: '23.5k',
  //     tag: '08:00 am - 12:00 pm',
  //   },
  //   {
  //     id: 4,
  //     image: Images.salad,
  //     title: 'Restaurant’s Name',
  //     rating: 4.5,
  //     reviews: '23.5k',
  //     tag: '08:00 am - 12:00 pm',
  //   },
  //   {
  //     id: 5,
  //     image: Images.salad,
  //     title: 'Restaurant’s Name',
  //     rating: 4.5,
  //     reviews: '23.5k',
  //     tag: '08:00 am - 12:00 pm',
  //   },
  //   {
  //     id: 6,
  //     image: Images.salad,
  //     title: 'Restaurant’s Name',
  //     rating: 4.5,
  //     reviews: '23.5k',
  //     tag: '08:00 am - 12:00 pm',
  //   },
  //   {
  //     id: 7,
  //     image: Images.salad,
  //     title: 'Restaurant’s Name',
  //     rating: 4.5,
  //     reviews: '23.5k',
  //     tag: '08:00 am - 12:00 pm',
  //   },
  // ];

  const removeFavorite = async id => {
    setLoading(true);
    // favourite_item_id

    fetch(api.delete_restaurant_from_favorites + id, {
      method: 'DELETE',
      // body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(async response => {
        console.log('response : ', response);
        if (response?.status == true) {
          const filter = data.filter(
            item => item?.favourite_restaurant_id != id,
          );
          setData(filter);
        } else {
          showAlert(response?.message);
        }
      })
      .catch(err => {
        console.log('Error   ', err);
        showAlert('Something Went Wrong');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getData = async () => {
    setLoading(true);
    let customer_id = await AsyncStorage.getItem('customer_id');
    console.log({customer_id});
    fetch(api.get_all_favorite_restaurant + `?customer_id=${customer_id}`)
      .then(response => response.json())
      .then(response => {
        let list = response?.result ? response?.result : [];
        setData(list);
      })
      .catch(err => console.log('error : ', err))
      .finally(() => setLoading(false));
  };

  // useEffect(() => {
  //   getData();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, []),
  );

  return (
    <View style={{flex: 1}}>
      <Loader loading={loading} />
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <View style={{height: 10}} />}
        ListFooterComponent={() => <View style={{height: 20}} />}
        ListEmptyComponent={() => <NoDataFound />}
        renderItem={({item}) => {
          let restaurant =
            item?.restaurant?.length > 0 ? item?.restaurant[0] : null;
          return (
            <FavoriteItemCard
              disabled={false}
              onPress={() => {
                navigation.navigate('RestaurantDetails', {
                  id: restaurant?.restaurant_id,
                  type: 'favorite',
                });
              }}
              onHeartPress={() => removeFavorite(item?.favourite_restaurant_id)}
              // onHeartPress={() => alert(item.id)}
              title={restaurant ? restaurant?.user_name : ''}
              // image={item?.image}
              image={
                restaurant && restaurant?.images?.length > 0
                  ? BASE_URL_IMAGE + restaurant.images[0]
                  : ''
              }
              description={'item?.description'}
              reviews={2}
              // tag={item?.tag}
              tag={restaurant ? restaurant?.working_hours : ''}
              rating={0.3}
            />
          );
        }}
      />
    </View>
  );
};

export default memo(FavoriteRestaurants);

const styles = StyleSheet.create({});
