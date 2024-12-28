import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import StackHeader from '../../../components/Header/StackHeader';
import {Colors, Fonts, Icons, Images} from '../../../constants';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CInput from '../../../components/TextInput/CInput';
import {SelectCountry, Dropdown} from 'react-native-element-dropdown';

import {RFPercentage} from 'react-native-responsive-fontsize';
import CheckBox from '@react-native-community/checkbox';
import CButton from '../../../components/Buttons/CButton';
import CDropDown from '../../../components/DropDown/CDropDown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../constants/api';
import Loader from '../../../components/Loader';
import {getCustomerShippingAddress, showAlert} from '../../../utils/helpers';
import {getCurrentLocation} from '../../../utils/helpers/location';
import {useFocusEffect} from '@react-navigation/native';
import {
  addShippingAddress,
  getShippingAddress,
} from '../../../utils/helpers/localStorage';

const ShippingAddressList = ({navigation, route}) => {
  const scrollViewRef = useRef();
  const [loading, setLoading] = useState(false);
  const [addressList, setAddressList] = useState([]);

  const handleDelete = async location_id => {
    const filter = addressList?.filter(
      item => item?.location_id != location_id,
    );
    setAddressList(filter);
  };

  const handleSelectAddress = async location_id => {
    try {
      console.log('location_id', location_id);
      if (location_id) {
        const newData = addressList?.map((item, index) => {
          if (item?.location_id == location_id) {
            return {
              ...item,
              selected: true,
            };
          } else {
            return {
              ...item,
              selected: false,
            };
          }
        });
        let selectedAddress = newData.filter(item => item.selected == true);
        if (selectedAddress?.length > 0) {
          addShippingAddress(selectedAddress[0]); // save in local storage
          setAddressList(newData);
          navigation?.goBack();
        }
      }
    } catch (error) {
      console.log('Error  :   ', error);
    }
  };

  const getShippingAddressList = async () => {
    setLoading(true);
    let customer_Id = await AsyncStorage.getItem('customer_id');
    getCustomerShippingAddress(customer_Id)
      .then(async res => {
        if (res?.status == true) {
          let result = res?.result[0];
          let list = res?.result ? res?.result?.reverse() : [];
          let shipping_address = await getShippingAddress();

          let location_id = shipping_address?.location_id;
          if (location_id) {
            const newData = list?.map((item, index) => {
              if (item?.location_id == location_id) {
                return {
                  ...item,
                  selected: true,
                };
              } else {
                return {
                  ...item,
                  selected: false,
                };
              }
            });
            setAddressList(newData);
          } else {
            setAddressList(list);
          }
        } else {
          console.log('else  :  ', res);
        }
      })
      .catch(err => {
        console.log('err', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getSelectedAddress = async () => {
    let shipping_address = await getShippingAddress();
    console.log('shipping_address  :  ', shipping_address?.location_id);
  };

  //   useEffect(() => {
  //     getShippingAddressList();
  //   }, []);

  useFocusEffect(
    React.useCallback(() => {
      getShippingAddressList();
    }, []),
  );

  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <Loader loading={loading} />
      <ScrollView
        style={{flex: 1}}
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled">
        <StackHeader
          title={'Shipping Address'}
          rightIcon={
            <TouchableOpacity
              onPress={() => navigation.navigate('ShippingAddress')}>
              <Icons.AddActive />
            </TouchableOpacity>
          }
        />
        <FlatList
          data={addressList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => handleSelectAddress(item?.location_id)}
              activeOpacity={0.7}
              style={{...styles.card, borderWidth: item?.selected ? 1 : 0}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'flex-end',
                  position: 'absolute',
                  top: 13,
                  right: 10,
                  // width: 60,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('UpdateShippingAddress', {
                      id: item?.location_id,
                    })
                  }>
                  <Icons.EditActive />
                </TouchableOpacity>
                {/* <TouchableOpacity
                  onPress={() => handleDelete(item?.location_id)}>
                  <Icons.DeleteActive />
                </TouchableOpacity> */}
              </View>
              <View style={styles.label}>
                <Text style={styles.labelText}>{item?.label}</Text>
              </View>
              <View style={styles.rowViewSB}>
                <Text style={styles.heading}>House Number : </Text>
                <Text style={styles.description}>{item?.house_number} </Text>
              </View>
              <View style={styles.rowViewSB}>
                <Text style={styles.heading}>Street Number : </Text>
                <Text style={styles.description}>{item?.street_number} </Text>
              </View>

              {/* <View style={styles.rowViewSB}>
                <Text style={styles.heading}>Area Number : </Text>
                <Text style={styles.description}>{item?.area} </Text>
              </View> */}

              <View style={styles.rowViewSB}>
                <Text style={styles.heading}>Floor/Unit : </Text>
                <Text style={styles.description}>{item?.floor} </Text>
              </View>
              <View style={styles.rowViewSB}>
                <Text style={styles.heading}>Address : </Text>
                <Text style={styles.description}>{item?.address} </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </View>
  );
};

export default ShippingAddressList;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.White,
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,

    borderWidth: 0,
    borderColor: Colors.primary_color,
  },
  rowViewSB: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    borderWidth: 1,
    borderColor: Colors.primary_color,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    marginBottom: 12,
  },
  labelText: {
    fontFamily: Fonts.PoppinsRegular,
    fontSize: RFPercentage(2),
    color: Colors.primary_color,
    textTransform: 'capitalize',
  },

  heading: {
    fontFamily: Fonts.PoppinsRegular,
    fontSize: RFPercentage(2),
    color: Colors.Black,
  },
  description: {
    fontFamily: Fonts.PoppinsRegular,
    fontSize: RFPercentage(2),
    color: Colors.Black,
    flex: 1,
    textAlign: 'right',
  },
});
