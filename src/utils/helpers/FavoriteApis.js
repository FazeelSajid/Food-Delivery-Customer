import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../constants/api';
import { useSelector } from 'react-redux';
import { setFavoriteItems, setFavoriteDeals, removeFavoriteItem, addFavoriteItem } from '../../redux/FavoriteSlice';


export const getFavoriteItem = async (customer_id, dispatch) => {
  console.log(customer_id);

  try {
    const response = await fetch(api.get_all_favorite_items + `?customer_id=${customer_id}`);
    const data = await response.json();
    if (data?.status) {
      dispatch(setFavoriteItems(data.result))
    } else {
      dispatch(setFavoriteItems([]))
    }
  } catch (error) {
    console.error('Error fetching favorite items:', error);
  }
};

export const getFavoriteDeals = async (customer_id, dispatch) => {
  try {
    let url = api.get_all_favorite_deals + `?customer_id=${customer_id}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data?.status === false) {
      return dispatch(setFavoriteDeals([]))
    } else {
      dispatch(setFavoriteDeals(data.result))
    }
  } catch (error) {
    console.log('error:', error);
    return [];
  }
};

export const removeFavoriteitem = async (id, customer_id, favoriteItems, dispatch, showAlert, setLoading,) => {

  const favItem = favoriteItems.find(item => item?.item?.item_id === id);

  const favId = favItem ? favItem.favourite_item_id : undefined;

  if (favId) {
    setLoading && setLoading(true);
    // favourite_item_id
    console.log(favId, ';favId');

    fetch(api.delete_item_from_favorites + favId, {
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
          getFavoriteItem(customer_id, dispatch)
          showAlert(response?.message);
        } else {
          showAlert(response?.message);
        }
      })
      .catch(err => {
        console.log('Error   ', err);
        showAlert('Something Went Wrong');
      })
      .finally(() => {
        setLoading && setLoading(false);
      });
  }
  else {
    console.log("remove Favorite Item, is not supported");

  }


};
export const removeFavoriteDeal = async (id, customer_id, favoriteDeals, dispatch, showAlert, setLoading,) => {

  const favItem = favoriteDeals.find(item => item?.deal?.deal_id === id);

  const favId = favItem ? favItem.favourite_deal_id : undefined;

  if (favId) {
    setLoading && setLoading(true);
    // favourite_item_id
    console.log(favId, ';favId');

    fetch(api.delete_deal_from_favorites + favId, {
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
          getFavoriteDeals(customer_id, dispatch)
          showAlert(response?.message);
        } else {
          showAlert(response?.message);
        }
      })
      .catch(err => {
        console.log('Error   ', err);
        showAlert('Something Went Wrong');
      })
      .finally(() => {
        setLoading && setLoading(false);
      });
  }
  else {
    console.log("remove Favorite deal, is not supported");

  }


};

export const addFavoriteitem = async (id, customer_id, dispatch, showAlert, setLoading) => {

  setLoading && setLoading(true);
  // favourite_item_id

  const data = {
    customer_id: customer_id,
    item_id: id
  }

  fetch(api.add_item_to_favorites, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then(response => response.json())
    .then(async response => {
      console.log('response : ', response);
      if (response?.status == true) {
        // dispatch(addFavoriteItem(item))
        getFavoriteItem(customer_id, dispatch)
        showAlert(response?.message, 'green');
      } else {
        showAlert(response?.message);
      }
    })
    .catch(err => {
      console.log('Error   ', err);
      showAlert('Something Went Wrong', 'green');
    })
    .finally(() => {
      setLoading && setLoading(false);
    });
};
export const addFavoriteDeal = async (id, customer_id, dispatch, showAlert, setLoading) => {

  setLoading && setLoading(true);
  // favourite_item_id

  const data = {
    customer_id: customer_id,
    deal_id: id
  }

  fetch(api.add_deal_to_favorites, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then(response => response.json())
    .then(async response => {
      console.log('response : ', response);
      if (response?.status == true) {
        // dispatch(addFavoriteItem(item))
        getFavoriteDeals(customer_id, dispatch)
        showAlert(response?.message, 'green');
      } else {
        showAlert(response?.message);
      }
    })
    .catch(err => {
      console.log('Error   ', err);
      showAlert('Something Went Wrong', 'green');
    })
    .finally(() => {
      setLoading && setLoading(false);
    });
};


export const getRestaurantFavoriteStatus = async id => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('restaurant id passed to check favorite :  ', id);
      let customer_id = await AsyncStorage.getItem('customer_id');
      console.log({ customer_id });
      // fetch(
      //   api.get_all_favorite_restaurant +
      //     `?customer_id=${customer_id}&restaurant_id=${id}`,
      // )
      //   .then(response => response.json())
      //   .then(response => {
      //     if (response?.status == false) {
      //       resolve(false);
      //     } else {
      //       let list = response?.result ? response?.result : [];
      //       resolve(list);
      //     }
      //   })
      //   .catch(err => {
      //     console.log('error : ', err);
      //     resolve(false);
      //   });

      fetch(api.get_all_favorite_restaurant + `?customer_id=${customer_id}`)
        .then(response => response.json())
        .then(response => {
          if (response?.status == false) {
            resolve(false);
          } else {
            let list = response?.result ? response?.result : [];
            const filter = list.filter(
              item =>
                item?.restaurant?.length > 0 &&
                item?.restaurant[0]?.restaurant_id == id,
            );

            if (filter.length == 0) {
              resolve(false);
            } else {
              resolve(filter[0]);
            }
          }
        })
        .catch(err => {
          console.log('error : ', err);
          resolve(false);
        });
    } catch (error) {
      resolve(false);
    }
  });
};
