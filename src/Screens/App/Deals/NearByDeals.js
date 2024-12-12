import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import StackHeader from '../../../components/Header/StackHeader';
import { Colors, Fonts, Icons, Images } from '../../../constants';
import FoodCard from '../../../components/Cards/FoodCard';
import Chip from '../../../components/Chip.js';
import FoodCardWithRating from '../../../components/Cards/FoodCardWithRating';
import api from '../../../constants/api';
import { BASE_URL, BASE_URL_IMAGE } from '../../../utils/globalVariables';
import { useFocusEffect } from '@react-navigation/native';
import Loader from '../../../components/Loader';
import { getCurrentLocation } from '../../../utils/helpers/location';
import NoDataFound from '../../../components/NotFound/NoDataFound';
import { useDispatch, useSelector } from 'react-redux';
import { setdeals } from '../../../redux/AuthSlice';
import { addFavoriteDeal, removeFavoriteDeal } from '../../../utils/helpers/FavoriteApis';
import { fetchApisGet, showAlert } from '../../../utils/helpers';
import DealCard from '../../../components/Cards/DealCard';
import { addItemToCart, getCustomerCart, updateCartItemQuantity } from '../../../utils/helpers/cartapis';
import { addItemToMYCart, updateMyCartList } from '../../../redux/CartSlice';
import PopUp from '../../../components/Popup/PopUp';
import { RefreshControl } from 'react-native-gesture-handler';

const NearByDeals = ({ navigation, route }) => {
  const [isSearch, setIsSearch] = useState(false);
  const [selected, setSelected] = useState('All');
  const { customer_id, cuisines, deals, showPopUp, popUpColor, PopUpMesage } = useSelector(store => store.store);

  const [itemObj, setItemObj] = useState({})
  const [numColumns, setNumColumns] = useState(2)
  const { my_cart } = useSelector(store => store.cart);
  const dispatch = useDispatch()

  const { favoriteDeals } = useSelector(store => store.favorite);


  const isDealFavorite = (id) => {

    return favoriteDeals.some(item => item?.deal?.deal_id === id);
  };

  const setCusineNameByItemCusineId = (cusineId) => {
    const cuisineName = cuisines?.filter(item => item?.cuisine_id === cusineId)[0]?.cuisine_name;

    return cuisineName;
  }

  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);

  const searchFilters = [
    'Nearby',
    'All',
    'Chinese',
    'Pakistani',
    'Italian',
    'Dessert',
    'Drinks',
  ];

  const [data, setData] = useState([]);
  const searchList = [
    {
      id: 0,
      image: Images.food1,
      name: 'Pasta spaghetti with shrimps',
      price: '9.1',
      owner: 'Dapur Umami',
      rating: 4.5,
    },
    {
      id: 1,
      image: Images.burger,
      name: 'Pasta spaghetti with shrimps',
      price: '9.1',
      owner: 'Dapur Umami',
      rating: 4.5,
    },
    {
      id: 2,
      image: Images.food2,
      name: 'Pasta spaghetti with shrimps',
      price: '9.1',
      owner: 'Dapur Umami',
      rating: 4.5,
    },
    {
      id: 3,
      image: Images.food3,
      name: 'Pasta spaghetti with shrimps',
      price: '9.1',
      owner: 'Dapur Umami',
      rating: 4.5,
    },
    {
      id: 4,
      image: Images.food4,
      name: 'Pasta spaghetti with shrimps',
      price: '3.1',
      owner: 'Dapur Umami',
      rating: 4.5,
    },
    {
      id: 5,
      image: Images.food5,
      name: 'Pasta spaghetti with shrimps',
      price: '9.1',
      owner: 'Dapur Umami',
      rating: 3.5,
    },
    {
      id: 6,
      image: Images.food6,
      name: 'Pasta spaghetti with shrimps',
      price: '9.1',
      owner: 'Dapur Umami',
      rating: 2.5,
    },
    {
      id: 7,
      image: Images.food7,
      name: 'Pasta spaghetti with shrimps',
      price: '9.1',
      owner: 'Dapur Umami',
      rating: 4.2,
    },
  ];

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
          // navigation?.navigate('MyCart');
          // cart_restaurant_id
          // dispatch(setCartRestaurantId(restaurantDetails?.restaurant_id));
          //my_cart
          dispatch(addItemToMYCart(response?.result));
          // setSelectedVariation(null)

          // ref_RBSheetSuccess?.current?.open();
          showAlert(`${name} is added to cart`, 'green');
        } else {
          showAlert(response?.message);
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


    setItemObj({
      id: deal.deal_id,
      name: deal?.name,
    })
    console.log({
      id: deal.deal_id,
      name: deal?.name,
    });


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
      // also update quantity in redux
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
    // }
  };

  const shortenString = (str) => {
    // Check if the string length exceeds 50
    if (str.length > 35) {
      // Cut the string to 50 characters and append "..."
      return str.substring(0, 20) + '...';
    }
    // If the string length is less than or equal to 50, return it as is
    return str;
  }

  // console.log({searchFilters});
  
  return (
    <View style={styles.container}>
      {/* <Loader loading={loading} /> */}
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
                    //  onPress={() => setIsSearch(!isSearch)}
                    onPress={() => navigation?.navigate('SearchNearByDeals')}>
                    <Icons.SearchIcon />
                  </TouchableOpacity>
                }
              />
            )}
            showsVerticalScrollIndicator={false}
            // numColumns={2}
            // columnWrapperStyle={{
            //   justifyContent: 'space-between',
            //   paddingHorizontal: 20,
            // }}
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
                // <FoodCard
                //   image={item?.image}
                //   title={item?.title}
                //   description={item?.description}
                //   price={item?.price}
                // />
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
                  heartPress={() => fav ? removeFavoriteDeal(item?.deal_id, customer_id, favoriteDeals, dispatch, showAlert) : addFavoriteDeal(item?.deal_id, customer_id, dispatch, showAlert)}
                  addToCartpress={() => handleDealAddToCart(item)}
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

    </View>
  );
};

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
  // card: {
  //   borderWidth: 1,
  //   borderColor: '#E6E7EB',
  //   // height: hp(23),
  //   paddingVertical: 7,
  //   flex: 0.47,
  //   borderRadius: hp(3),
  //   alignItems: 'center',
  // },
  // textContainer: {
  //   justifyContent: 'center',
  //   marginTop: 6,
  //   alignItems: 'center',
  // },

  // image: {
  //   width: hp(20),
  //   height: hp(11),
  //   resizeMode: 'contain',
  // },
  // title: {
  //   fontFamily: Fonts.PlusJakartaSans_Bold,
  //   color: '#0A212B',
  //   fontSize: RFPercentage(1.5),
  //   lineHeight: 30,
  // },
  // description: {
  //   fontFamily: Fonts.PlusJakartaSans_Medium,
  //   color: '#FF5C01',
  //   fontSize: RFPercentage(1.5),
  // },
  // price: {
  //   fontFamily: Fonts.PlusJakartaSans_Bold,
  //   color: '#0A212B',
  //   fontSize: RFPercentage(2.5),
  // },
});

export default NearByDeals;

// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   Image,
//   FlatList,
//   StyleSheet,
//   StatusBar,
//   TouchableOpacity,
//   TextInput,
//   ImageBackground,
//   ScrollView,
// } from 'react-native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import {RFPercentage} from 'react-native-responsive-fontsize';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import StackHeader from '../../../components/Header/StackHeader';
// import {Colors, Fonts, Icons, Images} from '../../../constants';
// import FoodCard from '../../../components/Cards/FoodCard';
// import Chip from '../../../components/Chip.js';

// const NearByDeals = ({navigation, route}) => {
//   const [isSearch, setIsSearch] = useState(false);
//   const [selected, setSelected] = useState('All');
//   const searchFilters = [
//     'Nearby',
//     'All',
//     'Chinese',
//     'Pakistani',
//     'Italian',
//     'Dessert',
//     'Drinks',
//   ];

//   const Categories = [
//     {
//       id: 1,
//       title: 'Chicken Noodle Special',
//       description: 'Grim Cafe & Eatery',
//       price: '$ 1,55',
//       image: Images.food1,
//     },
//     {
//       id: 2,
//       title: 'Chicken Noodle Special',
//       description: 'Grim Cafe & Eatery',
//       price: '$ 1,55',
//       image: Images.food2,
//     },
//     {
//       id: 3,
//       title: 'Chicken Noodle Special',
//       description: 'Grim Cafe & Eatery',
//       price: '$ 1,55',
//       image: Images.food3,
//     },
//     {
//       id: 4,
//       title: 'Chicken Noodle Special',
//       description: 'Grim Cafe & Eatery',
//       price: '$ 1,55',
//       image: Images.food4,
//     },
//     {
//       id: 5,
//       title: 'Chicken Noodle Special',
//       description: 'Grim Cafe & Eatery',
//       price: '$ 1,55',
//       image: Images.food5,
//     },
//     {
//       id: 6,
//       title: 'Chicken Noodle Special',
//       description: 'Grim Cafe & Eatery',
//       price: '$ 1,55',
//       image: Images.food6,
//     },
//     {
//       id: 7,
//       title: 'Chicken Noodle Special',
//       description: 'Grim Cafe & Eatery',
//       price: '$ 1,55',
//       image: Images.food7,
//     },
//     {
//       id: 8,
//       title: 'Chicken Noodle Special',
//       description: 'Grim Cafe & Eatery',
//       price: '$ 1,55',
//       image: Images.food8,
//     },
//     {
//       id: 9,
//       title: 'Chicken Noodle Special',
//       description: 'Grim Cafe & Eatery',
//       price: '$ 1,55',
//       image: Images.shake,
//     },
//     {
//       id: 10,
//       title: 'Chicken Noodle Special',
//       description: 'Grim Cafe & Eatery',
//       price: '$ 1,55',
//       image: Images.pasta,
//     },
//   ];
//   const searchList = [
//     {
//       id: 0,
//       image: Images.food1,
//       name: 'Pasta spaghetti with shrimps',
//       price: '9.1',
//       owner: 'Dapur Umami',
//       rating: 4.5,
//     },
//     {
//       id: 1,
//       image: Images.burger,
//       name: 'Pasta spaghetti with shrimps',
//       price: '9.1',
//       owner: 'Dapur Umami',
//       rating: 4.5,
//     },
//     {
//       id: 2,
//       image: Images.food2,
//       name: 'Pasta spaghetti with shrimps',
//       price: '9.1',
//       owner: 'Dapur Umami',
//       rating: 4.5,
//     },
//     {
//       id: 3,
//       image: Images.food3,
//       name: 'Pasta spaghetti with shrimps',
//       price: '9.1',
//       owner: 'Dapur Umami',
//       rating: 4.5,
//     },
//     {
//       id: 4,
//       image: Images.food4,
//       name: 'Pasta spaghetti with shrimps',
//       price: '3.1',
//       owner: 'Dapur Umami',
//       rating: 4.5,
//     },
//     {
//       id: 5,
//       image: Images.food5,
//       name: 'Pasta spaghetti with shrimps',
//       price: '9.1',
//       owner: 'Dapur Umami',
//       rating: 3.5,
//     },
//     {
//       id: 6,
//       image: Images.food6,
//       name: 'Pasta spaghetti with shrimps',
//       price: '9.1',
//       owner: 'Dapur Umami',
//       rating: 2.5,
//     },
//     {
//       id: 7,
//       image: Images.food7,
//       name: 'Pasta spaghetti with shrimps',
//       price: '9.1',
//       owner: 'Dapur Umami',
//       rating: 4.2,
//     },
//   ];

//   return (
//     <View style={styles.container}>
//       <StatusBar
//         backgroundColor={'#FFFFFF'}
//         barStyle={'dark-content'}
//         translucent={false}
//       />
//       {isSearch ? (
//         <ScrollView style={{flex: 1}}>
//           <View
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               width: wp(100),
//               paddingHorizontal: 20,
//             }}>
//             <Icons.SearchIconInActive />
//             <TextInput
//               placeholder="What would you like to eat?"
//               placeholderTextColor={'#757575'}
//               style={{flex: 1, fontSize: RFPercentage(2)}}
//             />
//             <TouchableOpacity onPress={() => setIsSearch(!isSearch)}>
//               <Text
//                 style={{
//                   color: Colors.primary_color,
//                   textDecorationLine: 'underline',
//                   fontFamily: Fonts.PlusJakartaSans_Bold,
//                   fontSize: RFPercentage(1.8),
//                 }}>
//                 Cancel
//               </Text>
//             </TouchableOpacity>
//           </View>
//           <View
//             style={{
//               width: wp(100),
//               marginTop: 10,
//             }}>
//             <FlatList
//               ListHeaderComponent={() => <View style={{width: 20}} />}
//               ListFooterComponent={() => <View style={{width: 20}} />}
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               data={searchFilters}
//               renderItem={({item}) => (
//                 <Chip
//                   title={item}
//                   selected={item == selected ? true : false}
//                   onPress={() => setSelected(item)}
//                   icon={item == 'Nearby' ? <Icons.MapPin /> : null}
//                 />
//               )}
//             />
//           </View>
//           <ScrollView
//             horizontal
//             style={{
//               paddingHorizontal: 20,
//               paddingVertical: 20,
//               flex: 1,
//             }}>
//             <FlatList
//               scrollEnabled={false}
//               data={searchList}
//               showsVerticalScrollIndicator={false}
//               ListHeaderComponent={() => (
//                 <Text
//                   style={{
//                     ...styles.heading,
//                     color: '#191A26',
//                     fontSize: RFPercentage(2.2),
//                   }}>
//                   Top Searches
//                 </Text>
//               )}
//               ItemSeparatorComponent={() => (
//                 <View
//                   style={{
//                     height: hp(0.1),
//                     marginVertical: 10,
//                     backgroundColor: '#E6E9ED',
//                   }}
//                 />
//               )}
//               renderItem={({item}) => (
//                 <View style={styles.itemView}>
//                   <ImageBackground
//                     source={item.image}
//                     blurRadius={40}
//                     style={styles.imageContainer}>
//                     <Image source={item.image} style={styles.image} />
//                   </ImageBackground>
//                   <View style={styles.textContainer}>
//                     <Text style={styles.title}>{item?.name}</Text>
//                     <Text style={{...styles.title, color: Colors.primary_color}}>
//                       $ {item?.price}
//                     </Text>
//                     <View style={styles.rowViewSB}>
//                       <Text style={styles.nameText}>by {item?.owner}</Text>
//                       <View style={styles.rowView}>
//                         <Icons.Rating />
//                         <Text style={styles.ratingText}>{item?.rating}</Text>
//                       </View>
//                     </View>
//                   </View>
//                 </View>
//               )}
//             />
//           </ScrollView>
//         </ScrollView>
//       ) : (
//         <View style={{}}>
//           <FlatList
//             ListHeaderComponent={() => (
//               <StackHeader
//                 title={'Nearby Deals'}
//                 rightIcon={
//                   <TouchableOpacity onPress={() => setIsSearch(!isSearch)}>
//                     <Icons.SearchIcon />
//                   </TouchableOpacity>
//                 }
//               />
//             )}
//             showsVerticalScrollIndicator={false}
//             numColumns={2}
//             columnWrapperStyle={{
//               justifyContent: 'space-between',
//               paddingHorizontal: 20,
//             }}
//             data={Categories}
//             ItemSeparatorComponent={() => <View style={{height: hp(3)}} />}
//             renderItem={({item}) => (
//               <FoodCard
//                 image={item?.image}
//                 title={item?.title}
//                 description={item?.description}
//                 price={item?.price}
//               />
//             )}
//             ListFooterComponent={() => <View style={{height: hp(3)}} />}
//           />
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     alignItems: 'center',
//   },
//   heading: {
//     color: Colors.Text,
//     fontFamily: Fonts.PlusJakartaSans_Bold,
//     fontSize: RFPercentage(2.5),
//     marginBottom: 10,
//   },
//   itemView: {
//     marginVertical: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: wp(88),
//   },
//   imageContainer: {
//     width: wp(30),
//     height: hp(10),
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   image: {
//     height: '100%',
//     width: '100%',
//     resizeMode: 'contain',
//   },
//   textContainer: {
//     marginLeft: 10,
//     flex: 1,
//   },
//   title: {
//     fontFamily: Fonts.PlusJakartaSans_Bold,
//     color: Colors.Text,
//     fontSize: RFPercentage(1.7),
//     lineHeight: 25,
//   },
//   nameText: {
//     fontFamily: Fonts.PlusJakartaSans_Medium,
//     color: '#7E8CA0',
//     fontSize: RFPercentage(2),
//     lineHeight: 25,
//   },
//   ratingText: {
//     fontFamily: Fonts.PlusJakartaSans_Bold,
//     color: Colors.Text,
//     fontSize: RFPercentage(2),
//     lineHeight: 25,
//     marginLeft: 5,
//   },
//   rowViewSB: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//     justifyContent: 'space-between',
//   },
//   rowView: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   // card: {
//   //   borderWidth: 1,
//   //   borderColor: '#E6E7EB',
//   //   // height: hp(23),
//   //   paddingVertical: 7,
//   //   flex: 0.47,
//   //   borderRadius: hp(3),
//   //   alignItems: 'center',
//   // },
//   // textContainer: {
//   //   justifyContent: 'center',
//   //   marginTop: 6,
//   //   alignItems: 'center',
//   // },

//   // image: {
//   //   width: hp(20),
//   //   height: hp(11),
//   //   resizeMode: 'contain',
//   // },
//   // title: {
//   //   fontFamily: Fonts.PlusJakartaSans_Bold,
//   //   color: '#0A212B',
//   //   fontSize: RFPercentage(1.5),
//   //   lineHeight: 30,
//   // },
//   // description: {
//   //   fontFamily: Fonts.PlusJakartaSans_Medium,
//   //   color: '#FF5C01',
//   //   fontSize: RFPercentage(1.5),
//   // },
//   // price: {
//   //   fontFamily: Fonts.PlusJakartaSans_Bold,
//   //   color: '#0A212B',
//   //   fontSize: RFPercentage(2.5),
//   // },
// });

// export default NearByDeals;
