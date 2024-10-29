import {StyleSheet, View, FlatList, Text, TouchableOpacity} from 'react-native';
import React, {useState, memo, useEffect, useRef} from 'react';
import {Colors, Fonts, Images} from '../../../constants';
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
import FoodCards from '../../../components/Cards/FoodCards';
import CRBSheetComponent from '../../../components/BottomSheet/CRBSheetComponent';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { RadioButton } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { addItemToMYCart, updateMyCartList } from '../../../redux/CartSlice';
import { addItemToCart, getCustomerCart, updateCartItemQuantity } from '../../../utils/helpers/cartapis';


const FavoriteItems = ({}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const customer_id = useSelector(store => store.store.customer_id)
  const { favoriteItems} = useSelector(store => store.favorite);
  const dispatch = useDispatch()
  const btmSheetRef = useRef()
  const [itemObj, setItemObj] = useState({})
  const {  my_cart } = useSelector(store => store.cart);
  const [selectedVariation, setSelectedVariation] = useState(null);




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

  const [numColumns, setNumColumns] = useState(2)


  const showBtmSheet = (item) => {
    setSelectedVariation(null)

    setItemObj({
      id: item.item_id,
      variations: item.item_prices,
      name: item?.item_name,
    })
    btmSheetRef?.current?.open()
  }
  const closeBtmSheet = () => {
    btmSheetRef?.current?.close()
    setItemObj({})
  }

  const handleAddToCart = async (variation_id, item_id) => {
    // console.log(id, 'id');
    setSelectedVariation(variation_id)

    if (variation_id === null) {
      showBtmSheet()
    } else {
      const filter = my_cart?.filter(
        item => item?.item_id == item_id
      );
      // console.log(filter, 'filter');
      // const OtherFilter = filter.filter(
      //   item => item.variation_id === id
      // )

      if (filter?.length > 0) {
        const checkVariation = filter?.filter(
          item =>
            item?.variation_id == variation_id,
        )

        // console.log( 'checkVariation', checkVariation.length > 0);


        if (checkVariation.length === 0) {
          add_item_to_cart(variation_id, 'item');
          closeBtmSheet()
        } else {
          // console.log('check variation icon' , checkVariation);
          closeBtmSheet()
          let obj = {
            cart_item_id: checkVariation[0]?.cart_item_id,
            quantity: checkVariation[0]?.quantity + 1,
          };

          await updateCartItemQuantity(obj)
          .then(response => {
           if (response.status === true) {
           
            showAlert(`${itemObj.name} quantity updated`, 'green')
              // also update quantity in redux
              const newData = my_cart?.map(item => {
                if (item?.item_id == item_id) {
                  return {
                    ...item,
                    quantity: checkVariation[0]?.quantity + 1,
                  };
                } else {
                  return { ...item };
                }
              });
              dispatch(updateMyCartList(newData));
          
          }})

      
          // dispatch(setCartRestaurantId(restaurantDetails?.restaurant_id));
        }

      } else {
        add_item_to_cart(variation_id, 'item');
        closeBtmSheet()
      }

    }
  };

  const add_item_to_cart = async (id, type) => {

    // let customer_id = await AsyncStorage.getItem('customer_id');
    // console.log('customer_Id :  ', customer_id);
    let cart = await getCustomerCart(customer_id);
    console.log('______cart    :  ', cart?.cart_id);


    let data = type === 'item' ? {
      item_id: itemObj.id?.toString(),
      cart_id: cart?.cart_id?.toString(),
      item_type: type,
      comments: 'Adding item in cart',
      quantity: 1,
      variation_id: id
    } : {
      item_id: id,
      cart_id: cart?.cart_id?.toString(),
      item_type: 'deal',
      comments: '',
      quantity: 1,
    };

    console.log('data   :  ', data);

    await addItemToCart(data)
      .then(response => {
        console.log('response ', response);
        if (response?.status == true) {
          // navigation?.navigate('MyCart');
          // cart_restaurant_id
          // dispatch(setCartRestaurantId(restaurantDetails?.restaurant_id));
          //my_cart
          dispatch(addItemToMYCart(response?.result));
          setSelectedVariation(null)

          // ref_RBSheetSuccess?.current?.open();
          showAlert(`${itemObj.name} is added to cart`, 'green');
        } else {
          showAlert(response?.message);
        }
      })
      .catch(error => {
        console.log('error  :  ', error);
      })
      .finally(() => {
        // setLoading(false)
      });
  };
  return (
    <View style={{flex: 1}}>
      <Loader loading={loading} />
      <FlatList
        data={favoriteItems}
        key={numColumns}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => <View style={{height: 10}} />}
        ListFooterComponent={() => <View style={{height: 20}} />}
        ListEmptyComponent={() => <NoDataFound />}
        renderItem={({item}) => {
          
          // console.log(item)
          
          
          
          return(

            <FoodCards
            isFavorite={true}
            image={ BASE_URL_IMAGE + item?.item?.images[0]}
            description={item?.item?.description}
            price={item?.item?.item_prices ? item?.item?.item_prices[0]?.price : item?.item?.item_variations[0]?.price}
            heartPress={() => removeFavoriteitem( item?.item?.item_id,customer_id, favoriteItems, dispatch, showAlert)}
            title={item?.item?.item_name}
            item={item?.item}
            id={item?.item_id}
            onPress={() => {
                  navigation.navigate('ItemDetails', {
                    id: item?.item?.item_id, //item id
                    type: 'favorite',
                  });
                }}
            addToCart={() => showBtmSheet(item?.item)}

          />
          // <FavoriteItemCard
          //   disabled={false}
          //   onPress={() => {
          //     navigation.navigate('ItemDetails', {
          //       id: item?.item?.item_id, //item id
          //       type: 'favorite',
          //     });
          //   }}
          //   tag={item?.item?.cuisine?.cuisine_name}
          //   onHeartPress={() => removeFavoriteitem( item?.item?.item_id,customer_id, favoriteItems, dispatch, showAlert)}
          //   title={item?.item?.item_name}
          //   // image={item?.image}
          //   image={
          //     item?.item?.images?.length > 0
          //       ? BASE_URL_IMAGE + item?.item?.images[0]
          //       : ''
          //   }
          //   rating={item?.rating}
          //   price={item?.item?.price}
          //   imageContainerStyle={{
          //     flex: 0.4,
          //   }}
          //   showRating={false}
          // />
        )}}
      />

<CRBSheetComponent
        height={230}
        refRBSheet={btmSheetRef}
        content={
          <View style={{ width: wp(90) }} >
            <View style={styles.rowViewSB} >
              <Text style={[styles.variationTxt, { fontSize: RFPercentage(2) }]} >Select your variation</Text>
              <TouchableOpacity
                onPress={() => closeBtmSheet()}>
                <Ionicons name={'close'} size={22} color={'#1E2022'} />
              </TouchableOpacity>
            </View>
            {itemObj.variations?.map((variation, i) => (
              <View key={i} style={[styles.rowViewSB, { borderBottomColor: Colors.borderGray, borderBottomWidth: wp(0.3), paddingBottom: wp(1) }]}>
                <View style={styles.rowView} >
                  <RadioButton
                    color={Colors.Orange} // Custom color for selected button
                    uncheckedColor={Colors.Orange} // Color for unselected buttons
                    status={selectedVariation === variation.variation_id ? 'checked' : 'unchecked'}
                    onPress={() => handleAddToCart(variation.variation_id, itemObj.id)}
                  />
                  <Text style={styles.variationText}>{variation.variation_name}</Text>
                </View>
                <Text style={styles.variationText}>£ {variation?.price}</Text>
              </View>
            ))}

          </View>
        }

      />
    </View>
  );
};


const styles = StyleSheet.create({
  variationText: {
    fontSize: RFPercentage(1.6),
    color: '#02010E',
    fontFamily: Fonts.PlusJakartaSans_Medium,
  },
  rowViewSB: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,

  },
  variationTxt: {
    color: '#02010E',
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(1.7),
    marginBottom: hp(1)
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent:'space-between',
    width: wp(45),
    marginLeft: wp(3)
  },
})

export default memo(FavoriteItems);
