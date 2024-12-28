import {StyleSheet, View, FlatList} from 'react-native';
import React, {memo, useState, useEffect} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Loader from '../../../components/Loader';
import NoDataFound from '../../../components/NotFound/NoDataFound';
import {handlePopup} from '../../../utils/helpers';
import { getFavoriteDeals, removeFavoriteDeal } from '../../../utils/helpers/FavoriteApis';
import { useDispatch, useSelector } from 'react-redux';
import DealCard from '../../../components/Cards/DealCard';
import { addItemToMYCart, updateMyCartList } from '../../../redux/CartSlice';
import { addItemToCart, getCustomerCart, updateCartItemQuantity } from '../../../utils/helpers/cartapis';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';

const FavoriteDeals = ({}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const {customer_id, showPopUp, popUpColor, PopUpMesage, Colors} = useSelector(store => store.store)
  const { favoriteDeals} = useSelector(store => store.favorite);
  const dispatch = useDispatch()
  const [itemObj, setItemObj] = useState({})
  const [numColumns, setNumColumns] = useState(2)
  const {  my_cart } = useSelector(store => store.cart);





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
  //         handlePopup(response?.message);
  //       }
  //     })
  //     .catch(err => {
  //       console.log('Error   ', err);
  //       handlePopup('Something Went Wrong');
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
 
  const add_item_to_cart = async (id, type) => {
    let cart = await getCustomerCart(customer_id, dispatch);
    let data =  {
      item_id: id,
      cart_id: cart?.cart_id?.toString(),
      item_type: 'deal',
      comments: '',
      quantity: 1,
    };


    await addItemToCart(data, dispatch)
      .then(response => {
        if (response?.status == true) {
          
          dispatch(addItemToMYCart(response?.result));
          handlePopup(dispatch,`${itemObj.name} is added to cart`, 'green');
        } else {
          handlePopup(dispatch,response?.message);
        }
      })
      .catch(error => {
        console.log('error  :  ', error);
      })
      .finally(() => {
        setLoading(false)
      });
  };

  
  useFocusEffect(
    React.useCallback(() => {
      if(favoriteDeals.length === 0){
        getFavoriteDeals(customer_id, dispatch, setLoading);
      }
      
    }, []),
  );

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
         handlePopup(dispatch, 'Item quantity updated', 'green')
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
        }
       })
    } else {
      add_item_to_cart(deal.deal_id, 'deal');

    }
  };
  

  return (
    <View style={{flex: 1,}}>
      <Loader loading={loading} />
      <FlatList
        data={favoriteDeals}
        key={numColumns}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <View style={{height: 10}} />}
        ListFooterComponent={() => <View style={{height: 20}} />}
        contentContainerStyle={{flexGrow:1}}
        ListEmptyComponent={() => <NoDataFound loading={loading} text={'No Deals'} textStyle={{fontSize: RFPercentage(2.4)}} svgHeight={hp(12)} />}
        renderItem={({item}) => {
          console.log(item.deal);
          
          return(

            <DealCard

            image={
                  item?.deal?.images?.length > 0
                    ? item?.deal?.images[0]
                    : ''
                }
            description={shortenString(item?.deal?.description)}
            price={item?.deal?.price}
            title={item?.deal?.name}
            onPress={() => {
                  navigation.navigate('NearByDealsDetails', {
                    id: item?.deal?.deal_id,
                    type: 'favorite',
                  });
                }}
            isFavorite={true}
            heartPress={() => removeFavoriteDeal( item?.deal?.deal_id,customer_id, favoriteDeals, dispatch)}
            addToCartpress={() => handleDealAddToCart(item?.deal)} 
            imageStyle={{ width: wp(42),
              height: hp('16.5%')}}
            nameStyle={{fontSize: RFPercentage(1.8)}}
            descriptionStyle={{fontSize: RFPercentage(1.5)}}
            priceStyle={{fontSize: RFPercentage(2.2), color: Colors.primary_color}}
            iconSize={19}
          />

         
        )}}
      />
    </View>
  );
};

export default memo(FavoriteDeals);
