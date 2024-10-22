import {StyleSheet, View, FlatList} from 'react-native';
import React, {memo, useState, useEffect} from 'react';
import {Images} from '../../../constants';
import FavoriteItemCard from '../../../components/Cards/FavoriteItemCard';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../constants/api';
import {BASE_URL_IMAGE} from '../../../utils/globalVariables';
import Loader from '../../../components/Loader';
import NoDataFound from '../../../components/NotFound/NoDataFound';
import {showAlert} from '../../../utils/helpers';
import { getFavoriteDeals, removeFavoriteDeal } from '../../../utils/helpers/FavoriteApis';
import { useDispatch, useSelector } from 'react-redux';

const FavoriteDeals = ({}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  // const [data, setData] = useState([]);
  const customer_id = useSelector(store => store.store.customer_id)
  const { favoriteDeals} = useSelector(store => store.favorite);
  const dispatch = useDispatch()


  // const removeFavorite = async id => {
  //   setLoading(true);
  //   // favourite_item_id

  //   fetch(api.delete_deal_from_favorites + id, {
  //     method: 'DELETE',
  //     // body: JSON.stringify(data),
  //     headers: {
  //       'Content-type': 'application/json; charset=UTF-8',
  //     },
  //   })
  //     .then(response => response.json())
  //     .then(async response => {
  //       console.log('response : ', response);
  //       if (response?.status == true) {
  //         const filter = data.filter(item => item?.favourite_deal_id != id);
  //         setData(filter);
  //       } else {
  //         showAlert(response?.message);
  //       }
  //     })
  //     .catch(err => {
  //       console.log('Error   ', err);
  //       showAlert('Something Went Wrong');
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

  // const data = [
  //   {
  //     id: 0,
  //     image: Images.salad,
  //     title: 'Green Salad',
  //     rating: 4.5,
  //     price: 13.2,
  //     status: 'Order Placed',
  //   },
  //   {
  //     id: 1,
  //     image: Images.salad,
  //     title: 'Green Salad',
  //     rating: 4.5,
  //     price: 13.2,
  //     status: 'Preparing',
  //   },
  //   {
  //     id: 2,
  //     image: Images.salad,
  //     title: 'Green Salad',
  //     rating: 4.5,
  //     price: 13.2,
  //     status: 'Ready to Deliver',
  //   },
  //   {
  //     id: 3,
  //     image: Images.salad,
  //     title: 'Green Salad',
  //     rating: 4.5,
  //     price: 13.2,
  //     status: 'Out for Delivery',
  //   },
  //   {
  //     id: 4,
  //     image: Images.salad,
  //     title: 'Green Salad',
  //     rating: 4.5,
  //     price: 13.2,
  //     status: 'Order Placed',
  //   },
  //   {
  //     id: 5,
  //     image: Images.salad,
  //     title: 'Green Salad',
  //     rating: 4.5,
  //     price: 13.2,
  //     status: 'Order Placed',
  //   },
  //   {
  //     id: 6,
  //     image: Images.salad,
  //     title: 'Green Salad',
  //     rating: 4.5,
  //     price: 13.2,
  //     status: 'Order Placed',
  //   },
  //   {
  //     id: 7,
  //     image: Images.salad,
  //     title: 'Green Salad',
  //     rating: 4.5,
  //     price: 13.2,
  //     status: 'Order Placed',
  //   },
  // ];
  // const getData = async () => {
  //   setLoading(true);
  //   let customer_id = await AsyncStorage.getItem('customer_id');
  //   console.log({customer_id});
  //   fetch(api.get_all_favorite_deals + `?customer_id=${customer_id}`)
  //     .then(response => response.json())
  //     .then(response => {
  //       let list = response?.result ? response?.result : [];
  //       setData(list);
  //     })
  //     .catch(err => console.log('error : ', err))
  //     .finally(() => setLoading(false));
  // };

  // useEffect(() => {
  //   getData();
  // }, []);

  
  useFocusEffect(
    React.useCallback(() => {
      if(favoriteDeals.length === 0){
        getFavoriteDeals(customer_id, dispatch);
      }
      
    }, []),
  );

  

  return (
    <View style={{flex: 1}}>
      <Loader loading={loading} />
      <FlatList
        data={favoriteDeals}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <View style={{height: 10}} />}
        ListFooterComponent={() => <View style={{height: 20}} />}
        ListEmptyComponent={() => <NoDataFound />}
        renderItem={({item}) => (
          <FavoriteItemCard
            disabled={false}
            onPress={() => {
              navigation.navigate('NearByDealsDetails', {
                id: item?.deal?.deal_id,
                type: 'favorite',
              });
            }}
            onHeartPress={() => removeFavoriteDeal( item?.deal?.deal_id,customer_id, favoriteDeals, dispatch, showAlert)}
            title={item?.deal?.name}
            // image={item?.image}
            image={
              item?.deal?.images?.length > 0
                ? BASE_URL_IMAGE + item?.deal?.images[0]
                : ''
            }
            price={item?.deal?.price}
            // rating={item?.rating}
            showRating={false}
            imageContainerStyle={{
              flex: 0.4,
            }}
          />
        )}
      />
    </View>
  );
};

export default memo(FavoriteDeals);
