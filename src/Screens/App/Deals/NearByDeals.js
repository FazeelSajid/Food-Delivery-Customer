import React, {useState, useEffect} from 'react';
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
import {RFPercentage} from 'react-native-responsive-fontsize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import StackHeader from '../../../components/Header/StackHeader';
import {Colors, Fonts, Icons, Images} from '../../../constants';
import FoodCard from '../../../components/Cards/FoodCard';
import Chip from '../../../components/Chip.js';
import FoodCardWithRating from '../../../components/Cards/FoodCardWithRating';
import api from '../../../constants/api';
import {BASE_URL, BASE_URL_IMAGE} from '../../../utils/globalVariables';
import {useFocusEffect} from '@react-navigation/native';
import Loader from '../../../components/Loader';
import {getCurrentLocation} from '../../../utils/helpers/location';
import NoDataFound from '../../../components/NotFound/NoDataFound';
import { useDispatch, useSelector } from 'react-redux';
import { setdeals } from '../../../redux/AuthSlice';
import { addFavoriteDeal, removeFavoriteDeal } from '../../../utils/helpers/FavoriteApis';
import { showAlert } from '../../../utils/helpers';

const NearByDeals = ({navigation, route}) => {
  const [isSearch, setIsSearch] = useState(false);
  const [selected, setSelected] = useState('All');
  const { customer_id, cuisines, deals } = useSelector(store => store.store);
  // console.log(cuisines);
  const dispatch = useDispatch()

  const {favoriteDeals} = useSelector(store => store.favorite);

  
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
    // fetch(api.get_all_deals + `?page=1&limit=2`)

    const response = await fetchApis(api.get_all_deals, 'GET', setLoading);
    let list = response?.result ? response?.result : [];
    dispatch(setdeals(list))


        if (list?.length > 2) {
          const slicedArray = list.slice(0, 2);
          setData(slicedArray);
        } else {
          setData(list);
        }
    // let { latitude, longitude } = await getCurrentLocation();
    // fetch(
    //   api.get_all_deals,
    // )
    //   .then(response => response.json())
    //   .then(response => {
    //     let list = response?.result ? response?.result : [];
    //     // console.log(list , 'get deals');


    //     if (list?.length > 2) {
    //       const slicedArray = list.slice(0, 2);
    //       setDeals(slicedArray);
    //     } else {
    //       setDeals(list);
    //     }
    //   })
    //   .catch(err => console.log('error  getDeals : ', err))
    //   .finally(
    //     () => setIsFetching(false),
    //     setLoading(false),
    //     setRefresh(false),
    //   );
  };

  useFocusEffect(
    React.useCallback(() => {
      if (deals.length > 0) {
        setData(deals)
      } else {
        getDeals();
      }
     
    }, []),
  );

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <StatusBar
        backgroundColor={'#FFFFFF'}
        barStyle={'dark-content'}
        translucent={false}
      />
      {isSearch ? (
        <ScrollView style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: wp(100),
              paddingHorizontal: 20,
              backgroundColor: 'red'
            }}>
            <Icons.SearchIconInActive />
            <TextInput
              placeholder="What would you like to eat?"
              placeholderTextColor={'#757575'}
              style={{flex: 1, fontSize: RFPercentage(2)}}
            />
            <TouchableOpacity onPress={() => setIsSearch(!isSearch)}>
              <Text
                style={{
                  color: Colors.Orange,
                  textDecorationLine: 'underline',
                  fontFamily: Fonts.PlusJakartaSans_Bold,
                  fontSize: RFPercentage(1.8),
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: wp(100),
              marginTop: 10,
            }}>
            <FlatList
              ListHeaderComponent={() => <View style={{width: 20}} />}
              ListFooterComponent={() => <View style={{width: 20}} />}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={searchFilters}
              renderItem={({item}) => (
                <Chip
                  title={item}
                  selected={item == selected ? true : false}
                  onPress={() => setSelected(item)}
                  icon={item == 'Nearby' ? <Icons.MapPin /> : null}
                />
              )}
            />
          </View>
          <ScrollView
            horizontal
            style={{
              paddingHorizontal: 20,
              paddingVertical: 20,
              flex: 1,
            }}>
            <FlatList
              scrollEnabled={false}
              data={searchList}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={() => (
                <Text
                  style={{
                    ...styles.heading,
                    color: '#191A26',
                    fontSize: RFPercentage(2.2),
                  }}>
                  Top Searches
                </Text>
              )}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    height: hp(0.1),
                    marginVertical: 10,
                    backgroundColor: '#E6E9ED',
                  }}
                />
              )}
              renderItem={({item}) => (
                <View style={styles.itemView}>
                  <ImageBackground
                    source={item.image}
                    blurRadius={40}
                    style={styles.imageContainer}>
                    <Image source={item.image} style={styles.image} />
                  </ImageBackground>
                  <View style={styles.textContainer}>
                    <Text style={styles.title}>{item?.name}</Text>
                    <Text style={{...styles.title, color: Colors.Orange}}>
                      $ {item?.price}
                    </Text>
                    <View style={styles.rowViewSB}>
                      <Text style={styles.nameText}>by {item?.owner}</Text>
                      <View style={styles.rowView}>
                        <Icons.Rating />
                        <Text style={styles.ratingText}>{item?.rating}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            />
          </ScrollView>
        </ScrollView>
      ) : (
        <View style={{}}>
          <FlatList
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
            data={data}
            ItemSeparatorComponent={() => <View style={{height: hp(3)}} />}
            renderItem={({item}) => {
              const cuisineIds = item?.items?.map(item => item?.cuisine_id);
                  const cuisineNames = cuisineIds?.map(cuisineId =>
                    setCusineNameByItemCusineId(cuisineId)
                  );

                  const fav = isDealFavorite(item?.deal_id)

              return(
              // <FoodCard
              //   image={item?.image}
              //   title={item?.title}
              //   description={item?.description}
              //   price={item?.price}
              // />

              <FoodCardWithRating
                onPress={() => {
                  navigation?.navigate('NearByDealsDetails', {
                    id: item?.deal_id,
                  });
                }}
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
                tag={cuisineNames}
                isTagArray={true}
                nextIconWidth={26}
                cardStyle={{
                  marginHorizontal: 0,
                  marginBottom: -9,
                  width: wp(90),
                  alignSelf: 'center',
                }}
                showNextButton={true}
                showRating={false}
                priceContainerStyle={{marginTop: 0}}
                isFavorite={fav}
                onRemove = {()=> removeFavoriteDeal( item?.deal_id,customer_id, favoriteDeals, dispatch, showAlert)}
                addFav={()=> addFavoriteDeal( item?.deal_id, customer_id, dispatch, showAlert)}
              />
            )}}
            ListFooterComponent={() => <View style={{height: hp(3)}} />}
            ListEmptyComponent={() => <NoDataFound />}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  heading: {
    color: Colors.Text,
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
    color: Colors.Text,
    fontSize: RFPercentage(1.7),
    lineHeight: 25,
  },
  nameText: {
    fontFamily: Fonts.PlusJakartaSans_Medium,
    color: '#7E8CA0',
    fontSize: RFPercentage(2),
    lineHeight: 25,
  },
  ratingText: {
    fontFamily: Fonts.PlusJakartaSans_Bold,
    color: Colors.Text,
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
//                   color: Colors.Orange,
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
//                     <Text style={{...styles.title, color: Colors.Orange}}>
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