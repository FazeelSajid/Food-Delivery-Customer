import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import StackHeader from '../../../components/Header/StackHeader';
import {  Fonts, Icons, Images } from '../../../constants';
import api from '../../../constants/api';
import { useFocusEffect } from '@react-navigation/native';
import NoDataFound from '../../../components/NotFound/NoDataFound';
import { useDispatch, useSelector } from 'react-redux';
import { setdeals } from '../../../redux/AuthSlice';
import { addFavoriteDeal, removeFavoriteDeal } from '../../../utils/helpers/FavoriteApis';
import { fetchApisGet, handlePopup } from '../../../utils/helpers';
import DealCard from '../../../components/Cards/DealCard';
import { addItemToCart, getCustomerCart, updateCartItemQuantity } from '../../../utils/helpers/cartapis';
import { addItemToMYCart, updateMyCartList } from '../../../redux/CartSlice';
import PopUp from '../../../components/Popup/PopUp';
import { RefreshControl } from 'react-native-gesture-handler';
import RBSheetGuestUser from '../../../components/BottomSheet/RBSheetGuestUser';

const NearByDeals = ({ navigation, route }) => {
  const { customer_id, cuisines, deals, showPopUp, popUpColor, PopUpMesage, Colors, join_as_guest } = useSelector(store => store.store);
  const [numColumns, setNumColumns] = useState(2)
  const { my_cart } = useSelector(store => store.cart);
  const dispatch = useDispatch()
  const { favoriteDeals } = useSelector(store => store.favorite);
    const ref_RBSheet = useRef();

  const isDealFavorite = (id) => {
    return favoriteDeals.some(item => item?.deal?.deal_id === id);
  };

  const setCusineNameByItemCusineId = (cusineId) => {
    const cuisineName = cuisines?.filter(item => item?.cuisine_id === cusineId)[0]?.cuisine_name;
    return cuisineName;
  }

  const [loading, setLoading] = useState(false);

  const getDeals = async () => {
    const response = await fetchApisGet(api.get_all_deals, setLoading, dispatch);
    let list = response?.result ? response?.result : [];
    dispatch(setdeals(list))

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
          handlePopup(dispatch,`${name} is added to cart`, 'green');
        } else {
          handlePopup(dispatch,response?.message,'red');
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
      if (deals.length === 0) {
        getDeals();
      } 
    }, []),
  );
  const handleDealAddToCart = async (deal) => {
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
         else {
            handlePopup(dispatch, response.message, 'red')
            return
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
      add_item_to_cart(deal.deal_id, deal?.name);

    }
  };

  const shortenString = (str) => {
    if (str.length > 35) {
      return str.substring(0, 20) + '...';
    }
    return str;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.secondary_color ,
      alignItems: 'center',
    },
    heading: {
      color: Colors.primary_text,
      fontFamily: Fonts.PlusJakartaSans_Bold,
      fontSize: RFPercentage(2.5),
      marginBottom: 10,
    },
    itemView: {
      marginVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      width: wp(88),
    },
    imageContainer: {
      width: wp(30),
      height: hp(10),
      borderRadius: 10,
      overflow: 'hidden',
    },
    image: {
      height: '100%',
      width: '100%',
      resizeMode: 'contain',
    },
    textContainer: {
      marginLeft: 10,
      flex: 1,
    },
    title: {
      fontFamily: Fonts.PlusJakartaSans_Bold,
      color: Colors.primary_text,
      fontSize: RFPercentage(1.7),
      lineHeight: 25,
    },
  
    ratingText: {
      fontFamily: Fonts.PlusJakartaSans_Bold,
      color: Colors.primary_text,
      fontSize: RFPercentage(2),
      lineHeight: 25,
      marginLeft: 5,
    },
    rowViewSB: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'space-between',
    },
    rowView: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    
  });
  
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={'#FFFFFF'}
        barStyle={'dark-content'}
        translucent={false}
      />
      {showPopUp && <PopUp color={popUpColor} message={PopUpMesage} />}
        <View style={{}}>
          <FlatList
            contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }}
            key={numColumns}
            numColumns={numColumns}
            ListHeaderComponent={() => (
              <StackHeader
                title={'Explore Deals'}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => navigation?.navigate('SearchNearByDeals')}>
                    <Icons.SearchIcon />
                  </TouchableOpacity>
                }
              />
            )}
            showsVerticalScrollIndicator={false}
            data={deals}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={() => getDeals()} colors={[Colors.primary_color]} />}
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
                  heartPress={() => 
                  {
                    if (join_as_guest) {
                      ref_RBSheet.current.open()
                    } else {
                    fav ? removeFavoriteDeal(item?.deal_id, customer_id, favoriteDeals, dispatch) : addFavoriteDeal(item?.deal_id, customer_id, dispatch)
                    }
                  }
                  }
                  addToCartpress={() => 
                  {
                    if (join_as_guest) {
                      ref_RBSheet.current.open()
                    } else {
                      handleDealAddToCart(item);
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
            ListFooterComponent={() => <View style={{ height: hp(3) }} />}
          />
        </View>

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



export default NearByDeals;

