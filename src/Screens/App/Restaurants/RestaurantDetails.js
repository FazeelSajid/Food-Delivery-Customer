import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
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
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FoodCard from '../../../components/Cards/FoodCard';
import CButton from '../../../components/Buttons/CButton';
import RBSheetRating from '../../../components/BottomSheet/RBSheetRating';
import RBSheetSuccess from '../../../components/BottomSheet/RBSheetSuccess';
import {
  getRestaurantDetail,
  getUserFcmToken,
  showAlert,
  showAlertLongLength,
} from '../../../utils/helpers';
import {
  BASE_URL_IMAGE,
  firebase_server_key,
} from '../../../utils/globalVariables';
import {useFocusEffect} from '@react-navigation/native';
import Loader from '../../../components/Loader';
import api from '../../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getRestaurantFavoriteStatus} from '../../../utils/helpers/FavoriteApis';
import {useSelector} from 'react-redux';
import RBSheetGuestUser from '../../../components/BottomSheet/RBSheetGuestUser';
import {
  getCurrentLocation,
  getDeliveryCharges,
  getEstimatedDeliveryTime,
} from '../../../utils/helpers/location';
import {getDistance} from 'geolib';
import HeaderImageSlider from '../../../components/Slider/HeaderImageSlider';

const RestaurantDetails = ({navigation, route}) => {
  const {join_as_guest} = useSelector(store => store.store);
  const ref_RBSheetGuestUser = useRef(null);

  const refRBSheetRating = useRef();
  const [rating, setRating] = useState(1);
  const [ratingComment, setRatingComment] = useState('');
  let description =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ullamcorper, lorem non sagittis hendrerit, metus turpis consectetur turpis, eget fermentum nisl velit a  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ullamcorper, lorem non sagittis hendrerit, metus turpis consectetur turpis, eget fermentum nisl velit a';
  const [readMore, setReadMore] = useState(false);

  const [details, setDetails] = useState('');
  const [topSellingList, setTopSellingList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteDetails, setFavoriteDetails] = useState(null);

  const [estimated_delivery_time, setEstimated_delivery_time] = useState(0);
  const [distance, setDistance] = useState(0);
  const [delivery_charges, setDelivery_charges] = useState(0);

  const DATA = [
    {
      id: 1,
      title: 'Chicken Noodle Special',
      description: 'Grim Cafe & Eatery',
      price: '$ 1,55',
      image: Images.food2,
    },
    {
      id: 2,
      title: 'Chicken Noodle Special',
      description: 'Grim Cafe & Eatery',
      price: '$ 1,55',
      image: Images.food3,
    },
    {
      id: 3,
      title: 'Chicken Noodle Special',
      description: 'Grim Cafe & Eatery',
      price: '$ 1,55',
      image: Images.food7,
    },
    {
      id: 4,
      title: 'Chicken Noodle Special',
      description: 'Grim Cafe & Eatery',
      price: '$ 1,55',
      image: Images.food4,
    },
    {
      id: 5,
      title: 'Chicken Noodle Special',
      description: 'Grim Cafe & Eatery',
      price: '$ 1,55',
      image: Images.chinese,
    },
    {
      id: 6,
      title: 'Chicken Noodle Special',
      description: 'Grim Cafe & Eatery',
      price: '$ 1,55',
      image: Images.food5,
    },
  ];

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
          setFavoriteDetails(response?.result);
          setIsFavorite(false);
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
  const handleFavorite = async () => {
    console.log('handleFavorite called...');
    setLoading(true);

    let customer_id = await AsyncStorage.getItem('customer_id');
    let data = {
      customer_id: customer_id,
      restaurant_id: route?.params?.id,
    };
    console.log('data : ', data);

    fetch(api.add_restaurant_to_favorites, {
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
          setFavoriteDetails(response?.result);
          setIsFavorite(true);
        } else {
          showAlert(response?.message);
        }
      })
      .catch(err => {
        console.log('Error in add deal to favorite :  ', err);
        showAlert('Something Went Wrong');
      })
      .finally(() => setLoading(false));
  };

  const handleSubmitRating = async () => {
    console.log('handleSubmitRating  :  called.....', rating);

    if (rating > 0) {
      setLoading(true);
      let customer_id = await AsyncStorage.getItem('customer_id');
      //send notification to restaurant
      // handleSendPushNotification(`Customer gives you ${rating} star rating`);
      let data = {
        restaurant_id: route?.params?.id,
        rating: rating,
        customer_id: customer_id,
        comment: ratingComment,
      };
      console.log('data  : ', data);

      fetch(api.rate_restaurant, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(async response => {
          console.log('response  :   ', response);
          if (response?.status == false) {
            // showAlert(response?.message);
            showAlert('Invalid Credentials');
            setLoading(false);
          } else {
            getRestaurantDetails(route?.params?.id);
            setTimeout(() => {
              showAlertLongLength('Rating Submitted successfully', 'green');
              setLoading(false);
            }, 3000);
          }
        })
        .catch(err => {
          console.log('Error in Login :  ', err);
          showAlert('Something went wrong!');
          setLoading(false);
        });
    }
  };

  const handleSendPushNotification = async text => {
    const receiver_fcm = await getUserFcmToken();

    if (receiver_fcm) {
      let body = {
        to: receiver_fcm,
        notification: {
          title: 'Rating',
          body: text ? text : '',
          // mutable_content: true,
          sound: 'default',
        },
        data: {
          // user_id: user,
          type: 'chat',
        },
        priority: 'high',
      };

      var requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `key=${firebase_server_key}`,
        },
        body: JSON.stringify(body),
      };

      fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
        .then(response => response.text())
        .then(response => {
          let res = JSON.parse(response);
          console.log('push notification response :  ', res);
        })
        .catch(err => {
          console.log('error :  ', err);
        });
    } else {
      console.log('receiver_fcm not found');
    }
  };

  const getTopSellingItems = id => {
    return new Promise((resolve, reject) => {
      try {
        fetch(api.get_restaurant_top_selling_items + id)
          .then(response => response.json())
          .then(response => {
            resolve(response?.result);
          })
          .catch(err => {
            console.log('error : ', err);
            resolve('');
          });
      } catch (error) {
        resolve('');
      }
    });
  };

  const getRestaurantDetails = async restaurant_id => {
    let res_details = await getRestaurantDetail(restaurant_id);
    let top_selling_items = await getTopSellingItems(restaurant_id);
    setTopSellingList(top_selling_items);
    setDetails(res_details);
    restaurantDistanceAndTimeCalculation(res_details);
    let isFav = await getRestaurantFavoriteStatus(restaurant_id);
    console.log({isFav});
    if (isFav) {
      setIsFavorite(true);
      setFavoriteDetails(isFav);
    }
    setLoading(false);
  };

  function calculateDistance(lat1, lon1, lat2, lon2) {
    console.log('calculateDistance  : ', lat1, lon1, lat2, lon2);
    const radius = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = radius * c; // Distance in kilometers
    return distance;
  }

  const restaurantDistanceAndTimeCalculation = async res_details => {
    let {latitude, longitude, address} = await getCurrentLocation();
    console.log('res_details  : ', res_details?.location);
    let pickup_location = res_details?.location;
    let dropOff_Location = address;

    let delivery_time = await getEstimatedDeliveryTime(
      pickup_location,
      dropOff_Location,
    );
    setEstimated_delivery_time(delivery_time);

    ///
    var add = address;
    var value = add?.split(',');
    count = value.length;
    city = value[count - 3];
    console.log('city______ : ', city);

    let delivery_charges1 = await getDeliveryCharges(city);

    setDelivery_charges(delivery_charges1);
    if (
      latitude &&
      longitude &&
      res_details?.latitude &&
      res_details?.longitude
    ) {
      let distance_in_meters = getDistance(
        {latitude: latitude, longitude: longitude},
        {latitude: res_details?.latitude, longitude: res_details?.longitude},
      );
      // let meter =  distance_in_meters;
      let km = distance_in_meters / 1000;
      setDistance(km);
    }
  };

  useEffect(() => {
    if (route?.params?.type == 'favorite') setIsFavorite(true);
  }, [route?.params]);

  useEffect(() => {
    setLoading(true);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getRestaurantDetails(route?.params?.id);
    }, []),
  );

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <StatusBar
        backgroundColor={'transparent'}
        barStyle={'light-content'}
        translucent={true}
      />
      {!loading && (
        <ScrollView style={{flex: 1}}>
          <HeaderImageSlider data={details?.images ? details?.images : []} />
          <View style={{flex: 1, paddingVertical: 10}}>
            <View style={{flex: 1, paddingHorizontal: 20}}>
              <View style={styles.rowViewSB}>
                <Text style={styles.heading}> {details?.user_name}</Text>
                <View style={styles.rowViewSB}>
                  <Icons.Rating />
                  <Text style={styles.text}>
                    {details?.rating ? details?.rating?.toFixed(1) : '0.0'}
                  </Text>

                  <TouchableOpacity
                    // disabled={isFavorite}
                    onPress={() => {
                      if (join_as_guest) {
                        ref_RBSheetGuestUser?.current?.open();
                      } else {
                        isFavorite
                          ? removeFavorite(
                              favoriteDetails?.favourite_restaurant_id,
                            )
                          : handleFavorite();
                      }
                    }}
                    style={{
                      // position: 'absolute',
                      // right: 5,
                      // top: 5,
                      padding: 10,
                      paddingRight: 0,
                      zIndex: 999,
                    }}>
                    {isFavorite ? (
                      <AntDesign name="heart" size={24} color={Colors.Orange} />
                    ) : (
                      <AntDesign
                        name="hearto"
                        size={24}
                        color={Colors.Orange}
                      />
                    )}
                  </TouchableOpacity>

                  {/* <TouchableOpacity
                    style={{paddingLeft: 10}}
                    onPress={() => {
                      navigation.navigate('Conversation', {
                        userId: 'restaurant',
                        name: 'Eatery Hotspot',
                        image: Images.restaurant1,
                      });
                    }}>
                    <Icons.ChatActive />
                  </TouchableOpacity> */}
                </View>
              </View>
              <View
                style={{
                  ...styles.rowView,
                  alignItems: 'center',
                  marginTop: -4,
                  marginBottom: 6,
                }}>
                <Icons.MarkerOutlineActive />
                <Text
                  style={{
                    fontFamily: Fonts.Inter_Regular,
                    color: '#292323',
                    fontSize: RFPercentage(1.5),
                    opacity: 0.55,
                    marginLeft: 7,
                  }}>
                  {details?.location}
                </Text>
              </View>
              {/* <>
                {readMore ? (
                  <Text style={styles.text}>
                    {description}{' '}
                    <Text
                      onPress={() => setReadMore(false)}
                      style={{
                        color: Colors.Orange,
                        fontFamily: Fonts.PlusJakartaSans_Bold,
                      }}>
                      Show Less
                    </Text>
                  </Text>
                ) : (
                  <Text style={styles.text}>
                    {`${description.slice(0, 170)}`}{' '}
                    <Text
                      onPress={() => setReadMore(true)}
                      style={{
                        color: Colors.Orange,
                        fontFamily: Fonts.PlusJakartaSans_Bold,
                      }}>
                      Read More
                    </Text>
                  </Text>
                )}
              </> */}
              <View style={styles.rowView}>
                <View style={styles.card}>
                  <Text style={styles.cardText}>{details?.buisness_type}</Text>
                </View>
                <View style={styles.card}>
                  <Text style={styles.cardText}>{details?.phone_no}</Text>
                </View>
              </View>
            </View>
            <View style={{marginLeft: 20}}>
              <View style={styles.rowView1}>
                <Text style={styles.heading}>Delivery : </Text>
                <Text style={styles.description}>
                  {estimated_delivery_time} mins
                </Text>
              </View>

              <View style={styles.rowView1}>
                <Text style={styles.heading}>Minimum Order : </Text>
                <Text style={styles.description}>
                  {' '}
                  {details?.minimum_order}{' '}
                </Text>
              </View>
              <View style={styles.rowView1}>
                <Text style={styles.heading}>Delivery Charges : </Text>
                <Text style={styles.description}> ${delivery_charges} </Text>
              </View>
              <View style={styles.rowView1}>
                <Text style={styles.heading}>Distance : </Text>
                <Text style={styles.description}>
                  {' '}
                  {distance?.toFixed(1)} km{' '}
                </Text>
              </View>
            </View>

            {/* <FlatList
              data={details?.images ? details?.images : []}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => (
                <View
                  style={{
                    height: hp(13),
                    width: wp(45),
                    borderRadius: 10,
                    overflow: 'hidden',
                    marginRight: 15,
                  }}>
                  <Image
                    // source={Images.restaurant1}
                    source={{uri: BASE_URL_IMAGE + item}}
                    style={{
                      height: '100%',
                      width: '100%',
                    }}
                  />
                </View>
              )}
              ListHeaderComponent={() => <View style={{width: 20}} />}
              ListFooterComponent={() => <View style={{width: 20}} />}
            /> */}
            <ScrollView
              horizontal
              contentContainerStyle={{flex: 1, padding: 20}}>
              <FlatList
                ListHeaderComponent={() => (
                  <Text
                    style={{
                      ...styles.heading,
                      color: Colors.Text,
                      marginBottom: 20,
                    }}>
                    Top Selling Items
                  </Text>
                )}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                columnWrapperStyle={{
                  justifyContent: 'space-between',
                }}
                // data={DATA}
                data={topSellingList}
                ItemSeparatorComponent={() => <View style={{height: hp(3)}} />}
                renderItem={({item}) => (
                  <FoodCard
                    // image={item?.image}
                    disabled={false}
                    onPress={() => {
                      navigation.navigate('ItemDetails', {
                        id: item?.item_id, //item id
                        nav_screen: 'home',
                      });
                    }}
                    image={
                      item?.images?.length > 0
                        ? BASE_URL_IMAGE + item?.images[0]
                        : ''
                    }
                    title={item?.item_name}
                    // description={item?.description}
                    price={item?.price}
                  />
                )}
                ListFooterComponent={() => <View style={{height: 50}} />}
              />
              <View>
                <RBSheetRating
                  refRBSheet={refRBSheetRating}
                  title="Rate Restaurant"
                  rating={rating}
                  setRating={setRating}
                  onSubmit={() => {
                    refRBSheetRating?.current?.close();
                    handleSubmitRating();
                  }}
                  comment={ratingComment}
                  setComment={setRatingComment}
                />
                {/* <RBSheetSuccess
                  refRBSheet={refRBSheetRating}
                  title={'sdsdsds'}
                  btnText={'OK'}
                  onPress={() => {
                    refRBSheetRating?.current?.close();
                    // navigation?.popToTop();
                    // navigation?.replace('Drawer');
                  }}
                /> */}
              </View>
            </ScrollView>
          </View>

          <RBSheetGuestUser
            refRBSheet={ref_RBSheetGuestUser}
            btnText={'OK'}
            onSignIn={() => {
              ref_RBSheetGuestUser?.current?.close();
              navigation?.popToTop();
              navigation?.replace('SignIn');
            }}
            onSignUp={() => {
              ref_RBSheetGuestUser?.current?.close();
              navigation?.popToTop();
              navigation?.replace('SignUp');
            }}
          />
        </ScrollView>
      )}

      <View
        style={{
          position: 'absolute',
          bottom: hp(4),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: wp(85),
        }}>
        <CButton
          title="CHAT"
          width={wp(40)}
          leftIcon={<Icons.ChatWhite />}
          onPress={() => {
            if (join_as_guest) {
              ref_RBSheetGuestUser?.current?.open();
            } else {
              navigation.navigate('Conversation', {
                // userId: 'restaurant',
                // name: 'Eatery Hotspot',
                // image: Images.restaurant1,
                type: 'restaurant',
                userId: details?.restaurant_id,
                name: details?.user_name,
                image:
                  details?.images?.length == 0
                    ? null
                    : BASE_URL_IMAGE + details?.images[0],
                fcm_token: details?.fcm_token,
              });
            }
          }}
        />
        <CButton
          title="RATE"
          width={wp(40)}
          leftIcon={<Icons.RatingWhite width={18} />}
          onPress={() => {
            if (join_as_guest) {
              ref_RBSheetGuestUser?.current?.open();
            } else {
              refRBSheetRating.current.open();
            }
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

  iconContainer: {
    width: wp(20),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: hp(6),
  },
  heading: {
    fontFamily: Fonts.PlusJakartaSans_Bold,
    color: Colors.Orange,
    fontSize: RFPercentage(2.5),
    marginBottom: 10,
  },
  rowViewSB: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: Colors.Text,
    fontFamily: Fonts.PlusJakartaSans_Regular,
    marginLeft: 4,
    fontSize: RFPercentage(1.8),
    lineHeight: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: Colors.Orange,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    paddingVertical: 5,
    marginRight: 15,
    paddingHorizontal: 10,
  },
  rowView: {
    flexDirection: 'row',
    marginVertical: 20,
  },

  cardText: {color: Colors.Orange},
  rowView1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  heading: {
    color: '#000',
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(2),
  },
  description: {
    color: '#000',
    fontFamily: Fonts.PlusJakartaSans_Medium,
    fontSize: RFPercentage(1.5),
  },
});

export default RestaurantDetails;
