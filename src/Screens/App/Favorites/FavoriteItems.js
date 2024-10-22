import {StyleSheet, View, FlatList} from 'react-native';
import React, {useState, memo, useEffect} from 'react';
import {Images} from '../../../constants';
import FavoriteItemCard from '../../../components/Cards/FavoriteItemCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import api from '../../../constants/api';
import {BASE_URL_IMAGE} from '../../../utils/globalVariables';
import Loader from '../../../components/Loader';
import {showAlert} from '../../../utils/helpers';
import NoDataFound from '../../../components/NotFound/NoDataFound';
import { useDispatch, useSelector } from 'react-redux';
import { getFavoriteItem, removeFavoriteitem } from '../../../utils/helpers/FavoriteApis';


const FavoriteItems = ({}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const customer_id = useSelector(store => store.store.customer_id)
  const { favoriteItems} = useSelector(store => store.favorite);
  const dispatch = useDispatch()



  // console.log(customer_id);

  // const [data, setData] = useState(favoriteItems);

  // const removeFavorite = async id => {
  //   setLoading(true);
  //   // favourite_item_id

  //   fetch(api.delete_item_from_favorites + id, {
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
  //         const filter = data.filter(item => item?.favourite_item_id != id);
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

  // const getData = async () => {
  //   setLoading(true);
  //   // let customer_id = await AsyncStorage.getItem('customer_id');
  //   console.log(customer_id);
  //   fetch(api.get_all_favorite_items + `?customer_id=${customer_id}`)
  //     .then(response => response.json())
  //     .then(response => {
  //       let list = response?.result ? response?.result : [];
  //       setData(list);
  //     })
  //     .catch(err => console.log('error : ', err))
  //     .finally(() => setLoading(false));
  // };


  useFocusEffect(
    React.useCallback(() => {
      if (favoriteItems.length === 0) {
        getFavoriteItem(customer_id, dispatch);
      }
     
    }, []),
  );


  return (
    <View style={{flex: 1}}>
      <Loader loading={loading} />
      <FlatList
        data={favoriteItems}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <View style={{height: 10}} />}
        ListFooterComponent={() => <View style={{height: 20}} />}
        ListEmptyComponent={() => <NoDataFound />}
        renderItem={({item}) => (
          <FavoriteItemCard
            disabled={false}
            onPress={() => {
              navigation.navigate('ItemDetails', {
                id: item?.item?.item_id, //item id
                type: 'favorite',
              });
            }}
            tag={item?.item?.cuisine?.cuisine_name}
            onHeartPress={() => removeFavoriteitem( item?.item?.item_id,customer_id, favoriteItems, dispatch, showAlert)}
            title={item?.item?.item_name}
            // image={item?.image}
            image={
              item?.item?.images?.length > 0
                ? BASE_URL_IMAGE + item?.item?.images[0]
                : ''
            }
            rating={item?.rating}
            price={item?.item?.price}
            imageContainerStyle={{
              flex: 0.4,
            }}
            showRating={false}
          />
        )}
      />
    </View>
  );
};

export default memo(FavoriteItems);
