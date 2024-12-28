import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ImageBackground,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Fonts, Icons, Images } from '../../../constants';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import ConfirmationModal from '../../../components/Modal/ConfirmationModal';
import Lottie from 'lottie-react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CButton from '../../../components/Buttons/CButton';
import { useFocusEffect } from '@react-navigation/native';
import {
  handlePopup,
} from '../../../utils/helpers';
import api from '../../../constants/api';
import Loader from '../../../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import {
  addItemToCart,
  getCustomerCart,
  updateCartItemQuantity,
} from '../../../utils/helpers/cartapis';
import RBSheetGuestUser from '../../../components/BottomSheet/RBSheetGuestUser';
import {
  addItemToMYCart,
  updateMyCartList,
} from '../../../redux/CartSlice';
import { addFavoriteDeal, addFavoriteitem, removeFavoriteDeal, removeFavoriteitem } from '../../../utils/helpers/FavoriteApis';
import RBSheetSuccess from '../../../components/BottomSheet/RBSheetSuccess';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FoodCardWithRating from '../../../components/Cards/FoodCardWithRating';
import PopUp from '../../../components/Popup/PopUp';


const NearByDealsDetails = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { join_as_guest,  showPopUp, popUpColor, PopUpMesage, customer_id,Colors } = useSelector(store => store.store);
  const { cart, cart_restaurant_id, my_cart } = useSelector(store => store.cart);
  const { favoriteDeals, favoriteItems } = useSelector(store => store.favorite);

  const isDealFavorite = (id) => {
    return favoriteDeals.some(item => item?.deal?.deal_id === id);
  };

  const isItemFavorite = (id) => {
    return favoriteItems.some(item => item?.item?.item_id === id);
  };

  const isFavorite = isDealFavorite(route?.params?.id)
  const ref_RBSheet = useRef();
  const ref_cartAlert = useRef();
  const ref_RBSheetSuccess = useRef();
  const ref_RBSheetResClosed = useRef();
  const [count, setCount] = useState(1);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemDetail, setItemDetail] = useState('');
  const [restaurant_timings, setRestaurant_timings] = useState('');
  const [data, setData] = useState([
    // {
    //   id: 0,
    //   image: Images.burger,
    // },
    // {
    //   id: 1,
    //   image: Images.shake,
    // },
    // {
    //   id: 2,
    //   image: Images.pasta,
    // },
    // {
    //   id: 3,
    //   image: Images.chinese,
    // },
    // {
    //   id: 4,
    //   image: Images.biryani,
    // },
  ]);
 
  const onIncrement = () => {
    setCount(count + 1);
  };

  const onDecrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const add_item_to_cart = async () => {
    setLoading(true);
    let cart = await getCustomerCart(customer_id, dispatch);
    if (count == 0) {
      handlePopup(dispatch,'Please select quantity', 'red');
      setLoading(false);
    } else {
      let data = {
        item_id: route?.params?.id,
        cart_id: cart?.cart_id,
        item_type: 'deal',
        comments: '',
        quantity: count,
      };
      console.log('data   :  ', data);

      await addItemToCart(data, dispatch)
        .then(response => {
          if (response?.status == true) {
            dispatch(addItemToMYCart(response?.result));
            ref_RBSheetSuccess?.current?.open();
          } else {
            handlePopup(dispatch,response?.message, 'red');
          }
        })
        .catch(error => {
          console.log('error  :  ', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleAddToCart = async () => {
    setLoading(true);
  
    const filter = my_cart?.filter(
      item => item?.item_id == route?.params?.id,
    );
    if (filter?.length > 0) {
      let obj = {
        cart_item_id: filter[0]?.cart_item_id,
        quantity: filter[0]?.quantity + count,
      };
      await updateCartItemQuantity(obj, dispatch);
      const newData = my_cart?.map(item => {
        if (item?.item_id == route?.params?.id) {
          return {
            ...item,
            quantity: filter[0]?.quantity + count,
          };
        } else {
          return { ...item };
        }
      });
      
      dispatch(updateMyCartList(newData));
      ref_RBSheetSuccess?.current?.open();
        setLoading(false);
        setCount(0)

    } else {
      add_item_to_cart();
    }
  };

  const getItemDetails = async id => {
   

    fetch(api.get_deal_detail + id)
      .then(response => response.json())
      .then(async response => {
        let list = response?.result ? response?.result : {};
        setItemDetail(list);
       
        let imageList = [];
        for (const item of list?.images) {
          let obj = {
            image: item,
          };
          imageList.push(obj);
        }
        setData(imageList);
      })
      .catch(err => console.log('error : ', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
  }, []);

 
  useFocusEffect(
    React.useCallback(() => {
      let id = route?.params?.id;
      if (id) {
        getItemDetails(id);
      }
    }, []),
  );


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.secondary_color,
      alignItems: 'center',
    },
   
    itemName: {
      color: Colors.primary_color,
      fontFamily: Fonts.PlusJakartaSans_Bold,
      fontSize: RFPercentage(2),
      letterSpacing: 1,
      marginVertical: 5,
      marginBottom: 15,
    },
    favIconContainer:{
      backgroundColor: Colors.button.secondary_button, 
      borderRadius: wp(100), 
      paddingHorizontal: wp(3),
      position: 'absolute',
      right: 5,
      top: 5,
      padding: 10,
      zIndex: 999,
    },
  
   
    iconContainer: { backgroundColor: Colors.button.secondary_button, marginTop: hp(0.5), marginLeft: wp(2), borderRadius: wp(100), paddingHorizontal: 2 },
  
    rowView: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowViewSB: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    paginationStyle: {
    },
    paginationStyleItemActive: {
      width: wp(8),
      height: wp(2.5),
      borderRadius: wp(2.5) / 2,
      backgroundColor: Colors.primary_color,
      margin: 0,
      marginHorizontal: 2,
    },
    paginationStyleItemInactive: {
      width: wp(2.5),
      height: wp(2.5),
      borderRadius: wp(2.5) / 2,
      backgroundColor: Colors.secondary_color,
      borderWidth: 1,
      borderColor: Colors.primary_color,
      opacity: 0.7,
      marginHorizontal: 2,
    },
    imageCard: {
      width: wp(100),
      height: hp(30),
    },
    sliderContainer: {
      marginBottom: 1,
      paddingHorizontal: 0,
      height: hp(35),
    },
   
    paginationStyleItemActive: {
      width: wp(2.5),
      height: wp(2.5),
      borderRadius: wp(2.5) / 2,
      backgroundColor: Colors.primary_color,
      margin: 0,
      marginHorizontal: 2,
    },
    paginationStyleItemInactive: {
      width: wp(2.5),
      height: wp(2.5),
      borderRadius: wp(2.5) / 2,
      backgroundColor: Colors.secondary_color,
      borderWidth: 1,
      borderColor: Colors.primary_color,
      opacity: 0.7,
      marginHorizontal: 2,
    },
    description: {
      paddingVertical: hp(0.5),
      color: Colors.secondary_text,
      fontFamily: Fonts.PlusJakartaSans_Medium,
      fontSize: RFPercentage(1.6),
      lineHeight: 20,
  
    },
    descriptionContainer: {
      backgroundColor:  `${Colors.primary_color}10` ,
      paddingHorizontal: wp(6),
      paddingVertical: hp(1.5),
      borderRadius: 15,
      fontSize: RFPercentage(1.6),
      lineHeight: 20,
  
    },
  });
  


  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      {showPopUp && <PopUp color={popUpColor} message={PopUpMesage} />}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, }}>
        
            

        <StatusBar backgroundColor={`${Colors.primary_color}`} barStyle={'light-content'} />
        <View style={{ flex: 1 }}>
          <View style={styles.sliderContainer}>
            <SwiperFlatList
              autoplay
              autoplayDelay={7}
              autoplayLoop
              showPagination
              data={data}
              renderItem={({ item }) => (
                <View style={styles.imageCard}>
                  <ImageBackground
                    source={{ uri: item?.image }}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <View style={styles.rowViewSB} >
                      <TouchableOpacity
                        style={styles.iconContainer}
                        onPress={() => navigation.goBack()}>
                        <Ionicons
                          name={'chevron-back'}
                          size={hp(3.5)}
                          color={Colors.button.secondary_button_text}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        // disabled={isFavorite}
                        onPress={() => {
                          if (join_as_guest) {
                            ref_RBSheet?.current?.open();
                          } else {
                            isFavorite

                              ? removeFavoriteDeal(route?.params?.id, customer_id, favoriteDeals, dispatch, )
                              : addFavoriteDeal(route?.params?.id, customer_id, dispatch, )
                          }
                        }}
                        style={styles.favIconContainer}>
                        {isFavorite ? (
                          <AntDesign name="heart" size={24} color={Colors.button.primary_button} />
                        ) : (
                          <AntDesign name="hearto" size={24} color={Colors.button.primary_button} />
                        )}
                      </TouchableOpacity>
                    </View>

                  </ImageBackground>
                </View>
              )}
              paginationStyle={styles.paginationStyle}
              paginationStyleItemActive={styles.paginationStyleItemActive}
              paginationStyleItemInactive={styles.paginationStyleItemInactive}
            />

          </View>

          <View style={{ paddingHorizontal: 20 }}>

            <View style={styles.rowViewSB}>
              <Text style={{ ...styles.itemName, flex: 1 }}>
                {itemDetail?.name}
              </Text>

              <Text style={{ ...styles.itemName, flex: 1, textAlign: 'right' }}>
                £  {itemDetail?.price}
              </Text>

            </View>
            <View style={styles.descriptionContainer}>
              <Text
                style={[styles.description, { fontFamily: Fonts.PlusJakartaSans_SemiBold }]}>{moment(itemDetail?.expiry_date).format("D MMMM YYYY")}</Text>
              <Text style={[styles.description,]}>{itemDetail?.description}</Text>

            </View>

          </View>
          <View style={{ paddingHorizontal: wp(6), marginTop: hp(3) }} >


            {
              itemDetail?.items?.map((item) => {
                const isFavoriteItem = isItemFavorite(item?.item_id)
              
                return (
                  <View style={{ height: hp(15) }} >
                    <FoodCardWithRating
                    
                      title={item?.item_name}
                      image={
                        item?.images?.length > 0
                          ? item?.images[0]
                          : ''
                      }
                      quantity={`${item.variations[0].quantity}`}
                      variation_name = {item.variations[0].variation_name}
                      rating={item?.rating}
                      tag={item?.cuisineData?.cuisine_name}
                      isTagArray={false}
                      nextIconWidth={26}
                      cardStyle={{ marginHorizontal: 0, marginBottom: 15 }}
                      showNextButton={true}
                      showRating={false}
                      priceContainerStyle={{ marginTop: 0 }}
                      isFavorite={isFavoriteItem}
                      onRemove={() => 
                      {
                        if (join_as_guest) {
                          ref_RBSheet?.current?.open();
                        }
                        else{
                          removeFavoriteitem(item?.item_id, customer_id, favoriteItems, dispatch)
                        }
                      }
                       }
                      addFav={() => 
                        {
                          if (join_as_guest) {
                            ref_RBSheet?.current?.open();
                          }
                          else{
                            addFavoriteitem(item?.item_id, customer_id, dispatch)                          }
                        }
                       }
                    />


                  </View>

                )
              })
            }

          </View>


          <View
            style={{
              ...styles.rowViewSB,
              marginVertical: 10,
              paddingHorizontal: 20,
              flex: 0.95,
              alignItems: 'flex-end',
            }}>
            <View>
              <CButton
                title="Add to Cart"
                width={wp(60)}
                height={hp(6)}
                marginTop={-2}
                marginBottom={1}
                textStyle={{ textTransform: 'none' }}
                onPress={() => {
                  console.log('join_as_guest  : ____ ', join_as_guest);

                  if (join_as_guest) {
                    ref_RBSheet?.current?.open();
                  } else {
                    handleAddToCart();
                  }
                }}
              />
            </View>
           

            <View
              style={{
                ...styles.rowView,
                backgroundColor: `${Colors.primary_color}30`,
                borderRadius: 25,
                paddingVertical: 8,
                paddingHorizontal: 4,
              }}>
              <TouchableOpacity
                onPress={() =>
                {
                  if (join_as_guest) {
                    ref_RBSheet?.current?.open();
                  }
                  else{
                    onDecrement()
                  }
                }
                 
                 }
                style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                <AntDesign name="minus" color={Colors.button.secondary_button_text} size={16} />
              </TouchableOpacity>
              <Text
                style={{
                  color: Colors.button.secondary_button_text,
                  fontFamily: Fonts.PlusJakartaSans_Bold,
                  fontSize: RFPercentage(2),
                  marginTop: -2,
                }}>
                {count}
              </Text>
              <TouchableOpacity
                onPress={() => 
                  
                  {
                    if (join_as_guest) {
                      ref_RBSheet?.current?.open();
                    }
                    else{
                      onIncrement()
                    }
                  }}
                style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                <AntDesign name="plus" color={Colors.button.secondary_button_text} size={16} />
              </TouchableOpacity>
            </View>
          </View>
          {/* </View> */}
        </View>
      </ScrollView>

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
      <RBSheetSuccess
        refRBSheet={ref_RBSheetSuccess}
        title={`"${itemDetail?.name}" added to cart.`}
        btnText={'OK'}
        onPress={() => {
          ref_RBSheetSuccess?.current?.close();
        }}
      />


      <ConfirmationModal
        visible={visible}
        setVisible={setVisible}
        title={'Confirmation'}
        description={'Do you want to delete this Deal?'}
        cancelText={'Cancel'}
        okText={'Delete'}
        buttonContainerStyle={{ marginTop: -20 }}
        onOK={() => {
          setVisible(false);
          navigation.goBack();
        }}
        topContent={
          <View
            style={{
              height: 110,
              width: 110,
             
            }}>
            <Lottie
              source={Images.success_check}
              autoPlay
              loop={true}
              resizeMode="cover"
            />
          </View>
        }
      />
    </View>
  );
};

export default NearByDealsDetails;


