import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFPercentage} from 'react-native-responsive-fontsize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import StackHeader from '../../../components/Header/StackHeader';
import {Fonts, Icons, Images} from '../../../constants';
import FastImage from 'react-native-fast-image';
import RestaurantCard from '../../../components/Cards/RestaurantCard';
import Loader from '../../../components/Loader';
import api from '../../../constants/api';
import {getCurrentLocation} from '../../../utils/helpers/location';
import {BASE_URL_IMAGE} from '../../../utils/globalVariables';

import debounce from 'lodash.debounce';
import {checkRestaurantTimings} from '../../../utils/helpers';
import moment from 'moment';

const NearByRestaurants = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [allRestaurant, setAllRestaurant] = useState([]);

  //search
  const searchInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [data, setData] = useState([
    // {
    //   id: 0,
    //   title: 'Restaurant’s Name',
    //   image: Images.salad,
    //   rating: 4.5,
    //   tag: '08:00 am - 12:00 pm',
    //   reviews: '23.5k',
    // },
    // {
    //   id: 1,
    //   title: 'Restaurant’s Name',
    //   image: Images.salad,
    //   rating: 4.5,
    //   tag: '08:00 am - 12:00 pm',
    //   reviews: '23.5k',
    // },
    // {
    //   id: 2,
    //   title: 'Restaurant’s Name',
    //   image: Images.salad,
    //   rating: 4.5,
    //   tag: '08:00 am - 12:00 pm',
    //   reviews: '23.5k',
    // },
    // {
    //   id: 3,
    //   title: 'Restaurant’s Name',
    //   image: Images.salad,
    //   rating: 4.5,
    //   tag: '08:00 am - 12:00 pm',
    //   reviews: '23.5k',
    // },
    // {
    //   id: 4,
    //   title: 'Restaurant’s Name',
    //   image: Images.salad,
    //   rating: 4.5,
    //   tag: '08:00 am - 12:00 pm',
    //   reviews: '23.5k',
    // },
    // {
    //   id: 5,
    //   title: 'Restaurant’s Name',
    //   image: Images.salad,
    //   rating: 4.5,
    //   tag: '08:00 am - 12:00 pm',
    //   reviews: '23.5k',
    // },
    // {
    //   id: 6,
    //   title: 'Restaurant’s Name',
    //   image: Images.salad,
    //   rating: 4.5,
    //   tag: '08:00 am - 12:00 pm',
    //   reviews: '23.5k',
    // },
  ]);

  const getRestaurants = async () => {
    let {latitude, longitude} = await getCurrentLocation();
    console.log('latitude, longitude :  ', latitude, longitude);
    // fetch(api.get_all_restaurants + `?page=${page}&limit=25`)
    fetch(
      api.get_near_by_restaurant +
        `?longitude=${longitude}&latitude=${latitude}`,
    )
      .then(response => response.json())
      .then(async response => {
        let list = response?.result ? response?.result : [];
        // setData(list);
        let newList = [];
        for (const item of list) {
          console.log('item?.restaurant_id : ', item?.restaurant_id);
          // getting restaurant timings
          let time_obj = await checkRestaurantTimings(item?.restaurant_id);
          let obj = {
            ...item,
            restaurant_timings: time_obj,
          };
          newList.push(obj);
        }

        setData(newList);
      })
      .catch(err => console.log('error : ', err))
      .finally(() => setLoading(false), setLoadingMore(false));
  };

  useEffect(() => {
    setLoading(true);
    getRestaurants();
  }, []);

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <View style={{}}>
        <FlatList
          ListHeaderComponent={() => (
            <StackHeader
              title={'Nearby Restaurants'}
              rightIcon={
                <TouchableOpacity
                  onPress={() => navigation.navigate('SearchRestaurants')}>
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
          renderItem={({item}) => (
            // <TouchableOpacity
            //   activeOpacity={0.7}
            //   onPress={() => navigation?.navigate('RestaurantDetails')}
            //   style={styles.card}>
            //   <View style={styles.imageContainer}>
            //     <ImageBackground
            //       source={item.image}
            //       style={styles.image}
            //       resizeMode="cover"
            //       blurRadius={40}>
            //       <Image
            //         source={item.image}
            //         style={styles.image}
            //         resizeMode="contain"
            //         // resizeMode={FastImage.resizeMode.cover}
            //       />
            //     </ImageBackground>
            //   </View>
            //   <View style={styles.textContainer}>
            //     <Text style={styles.title}>{item.name}</Text>
            //     <View style={{alignItems: 'center', flexDirection: 'row'}}>
            //       <Icons.Rating />
            //       <Text style={styles.rating}>{item.rating}</Text>
            //     </View>
            //     <Text style={styles.review}>{item.reviews} reviews</Text>
            //   </View>
            // </TouchableOpacity>

            <RestaurantCard
              onPress={() =>
                navigation?.navigate('RestaurantAllDetails', {
                  id: item?.restaurant_id,
                })
              }
              title={item?.user_name}
              // image={item?.image}
              image={
                item?.images?.length > 0 ?  item?.images[0] : ''
              }
              // tag={item?.tag}
              // tag={item?.working_hours ? item?.working_hours : ''}

              tag={
                item?.restaurant_timings?.today_opening_time &&
                item?.restaurant_timings?.today_closing_time
                  ? `${moment(
                      item?.restaurant_timings?.today_opening_time,
                    ).format('h:mm A')} - ${moment(
                      item?.restaurant_timings?.today_closing_time,
                    ).format('h:mm A')}`
                  : ''
              }
              rating={item?.rating ? item?.rating : '0.0'}
              reviews={item?.reviews ? item?.reviews?.length : '0'}
              nextIconWidth={26}
              cardStyle={{marginHorizontal: 20, marginBottom: -5}}
              showNextButton={true}
              showRating={true}
              priceContainerStyle={{marginTop: 0}}
            />
          )}
          ListFooterComponent={() => <View style={{height: hp(3)}} />}
          onEndReached={() => {
            console.log('end reached......');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },

  card: {
    borderWidth: 1,
    borderColor: '#E6E7EB',
    // height: hp(23),
    paddingVertical: 7,
    flex: 0.47,
    borderRadius: hp(3),
    alignItems: 'center',
  },
  textContainer: {
    justifyContent: 'center',
    // marginTop: 6,
    flex: 1,
    marginLeft: 13,
    alignSelf: 'flex-start',
  },
  imageContainer: {
    width: hp(18),
    height: hp(10),
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#ddd',
  },
  image: {
    // width: hp(20),
    // height: hp(11),
    width: '100%',
    height: '100%',
    // resizeMode: 'cover',
  },
  title: {
    fontFamily: Fonts.PlusJakartaSans_Bold,
    color: '#0A212B',
    fontSize: RFPercentage(1.5),
    marginTop: 7,
  },
  rating: {
    fontFamily: Fonts.PlusJakartaSans_Medium,
    color: '#FF5C01',
    fontSize: RFPercentage(1.5),
    marginLeft: 3,
    marginVertical: 3,
  },
  review: {
    fontFamily: Fonts.PlusJakartaSans_Medium,
    color: '#0A212B',
    fontSize: RFPercentage(1.8),
  },
});

export default NearByRestaurants;

// import React from 'react';
// import {
//   View,
//   Text,
//   Image,
//   FlatList,
//   StyleSheet,
//   StatusBar,
//   ImageBackground,
//   TouchableOpacity,
// } from 'react-native';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import {RFPercentage} from 'react-native-responsive-fontsize';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import StackHeader from '../../../components/Header/StackHeader';
// import {Fonts, Icons, Images} from '../../../constants';
// import FastImage from 'react-native-fast-image';

// const NearByRestaurants = ({navigation, route}) => {
//   const DATA = [
//     {
//       id: 1,
//       name: 'Restaurant Name',
//       rating: 4.5,
//       reviews: 23.4,
//       image: Images.restaurant,
//     },
//     {
//       id: 2,
//       name: 'Restaurant Name',
//       rating: 4.5,
//       reviews: 23.4,
//       image: Images.restaurant1,
//     },
//     {
//       id: 3,
//       name: 'Restaurant Name',
//       rating: 4.5,
//       reviews: 23.4,
//       image: Images.restaurant2,
//     },
//     {
//       id: 4,
//       name: 'Restaurant Name',
//       rating: 4.5,
//       reviews: 23.4,
//       image: Images.restaurant3,
//     },
//     {
//       id: 5,
//       name: 'Restaurant Name',
//       rating: 4.5,
//       reviews: 23.4,
//       image: Images.restaurant4,
//     },
//     {
//       id: 6,
//       name: 'Restaurant Name',
//       rating: 4.5,
//       reviews: 23.4,
//       image: Images.restaurant1,
//     },
//     {
//       id: 7,
//       name: 'Restaurant Name',
//       rating: 4.5,
//       reviews: 23.4,
//       image: Images.restaurant1,
//     },
//     {
//       id: 8,
//       name: 'Restaurant Name',
//       rating: 4.5,
//       reviews: 23.4,
//       image: Images.restaurant1,
//     },
//     {
//       id: 9,
//       name: 'Restaurant Name',
//       rating: 4.5,
//       reviews: 23.4,
//       image: Images.restaurant1,
//     },
//   ];

//   return (
//     <View style={styles.container}>
//       <View style={{}}>
//         <FlatList
//           ListHeaderComponent={() => (
//             <StackHeader
//               title={'Nearby Restaurants'}
//               rightIcon={<Icons.SearchIcon />}
//             />
//           )}
//           showsVerticalScrollIndicator={false}
//           numColumns={2}
//           columnWrapperStyle={{
//             justifyContent: 'space-between',
//             paddingHorizontal: 20,
//           }}
//           data={DATA}
//           ItemSeparatorComponent={() => <View style={{height: hp(3)}} />}
//           renderItem={({item}) => (
//             <TouchableOpacity
//               activeOpacity={0.7}
//               onPress={() => navigation?.navigate('RestaurantDetails')}
//               style={styles.card}>
//               <View style={styles.imageContainer}>
//                 <ImageBackground
//                   source={item.image}
//                   style={styles.image}
//                   resizeMode="cover"
//                   blurRadius={40}>
//                   <Image
//                     source={item.image}
//                     style={styles.image}
//                     resizeMode="contain"
//                     // resizeMode={FastImage.resizeMode.cover}
//                   />
//                 </ImageBackground>
//               </View>
//               <View style={styles.textContainer}>
//                 <Text style={styles.title}>{item.name}</Text>
//                 <View style={{alignItems: 'center', flexDirection: 'row'}}>
//                   <Icons.Rating />
//                   <Text style={styles.rating}>{item.rating}</Text>
//                 </View>
//                 <Text style={styles.review}>{item.reviews} reviews</Text>
//               </View>
//             </TouchableOpacity>
//           )}
//           ListFooterComponent={() => <View style={{height: hp(3)}} />}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     alignItems: 'center',
//   },

//   card: {
//     borderWidth: 1,
//     borderColor: '#E6E7EB',
//     // height: hp(23),
//     paddingVertical: 7,
//     flex: 0.47,
//     borderRadius: hp(3),
//     alignItems: 'center',
//   },
//   textContainer: {
//     justifyContent: 'center',
//     // marginTop: 6,
//     flex: 1,
//     marginLeft: 13,
//     alignSelf: 'flex-start',
//   },
//   imageContainer: {
//     width: hp(18),
//     height: hp(10),
//     alignItems: 'center',
//     borderRadius: 10,
//     overflow: 'hidden',
//     backgroundColor: '#ddd',
//   },
//   image: {
//     // width: hp(20),
//     // height: hp(11),
//     width: '100%',
//     height: '100%',
//     // resizeMode: 'cover',
//   },
//   title: {
//     fontFamily: Fonts.PlusJakartaSans_Bold,
//     color: '#0A212B',
//     fontSize: RFPercentage(1.5),
//     marginTop: 7,
//   },
//   rating: {
//     fontFamily: Fonts.PlusJakartaSans_Medium,
//     color: '#FF5C01',
//     fontSize: RFPercentage(1.5),
//     marginLeft: 3,
//     marginVertical: 3,
//   },
//   review: {
//     fontFamily: Fonts.PlusJakartaSans_Medium,
//     color: '#0A212B',
//     fontSize: RFPercentage(1.8),
//   },
// });
// export default NearByRestaurants;
