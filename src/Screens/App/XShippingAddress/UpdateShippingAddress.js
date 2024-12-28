import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
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
import {
  getCustomerShippingAddress,
  getLocationById,
  showAlert,
} from '../../../utils/helpers';
import {getCurrentLocation} from '../../../utils/helpers/location';
import {useDispatch, useSelector} from 'react-redux';
import {setLocation} from '../../../redux/AuthSlice';

const UpdateShippingAddress = ({navigation, route}) => {
  const dispatch = useDispatch();

  const {location} = useSelector(store => store.store);

  const scrollViewRef = useRef();
  const textInput_HEIGHT = 42;

  const [loading, setLoading] = useState(false);
  const [isAddressAlreadyAdded, setIsAddressAlreadyAdded] = useState(false);
  const [location_id, setLocation_id] = useState('');

  const [houseNo, setHouseNo] = useState('');
  const [streetNo, setStreetNo] = useState('');
  const [areaNo, setAreaNo] = useState('');
  const [instructions, setInstructions] = useState();
  const [floor, setFloor] = useState('');
  const [checked, setChecked] = useState(false);
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);

  const [address, setAddress] = useState('');

  const [addressList, setAddressList] = useState([]);

  const data = [
    {label: 'Home', value: 'home'},
    {label: 'Office', value: 'office'},
    // {label: 'Other', value: 'other'},
  ];
  const [value, setValue] = useState('home');
  const [isFocus, setIsFocus] = useState(false);

  const validate = () => {
    if (houseNo?.length == 0) {
      showAlert('Please Enter House Number');
      return false;
    } else if (streetNo?.length == 0) {
      showAlert('Please Enter Street Number');
      return false;
    }
    //  else if (areaNo?.length == 0) {
    //   showAlert('Please Enter Area ');
    //   return false;
    // }
    else if (floor?.length == 0) {
      showAlert('Please Enter Floor/Unit');
      return false;
    } else if (location?.address?.length == 0) {
      showAlert('Please Enter Address');
      return false;
    } else if (value?.length == 0) {
      showAlert('Please Select Label');
      return false;
    } else {
      return true;
    }
  };

  const addShippingAddress = async () => {
    if (validate()) {
      setLoading(true);
      let customer_Id = await AsyncStorage.getItem('customer_id');
      let data = {
        house_number: houseNo,
        street_number: streetNo,
        // area: areaNo,
        area: location?.city,
        floor: floor,
        instructions: instructions?.trim(),
        customer_id: customer_Id,
        label: value,
        // address: address,
        address: location?.address,
      };

      console.log('data  :  ', data);

      // navigation?.goBack();
      fetch(api.add_location, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(async response => {
          console.log('response', response);
          if (response?.status == true) {
            navigation?.goBack();
          } else {
            showAlert(response?.message);
          }
        })
        .catch(err => {
          console.log('Error in addShippingAddress :  ', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const updateShippingAddress = async () => {
    if (validate()) {
      setLoading(true);
      let customer_Id = await AsyncStorage.getItem('customer_id');
      let data = {
        location_id: location_id,
        street_number: streetNo,
        house_number: houseNo,
        // area: areaNo,
        area: location?.city,
        floor: floor,
        instructions: instructions,
        label: value,
        // address: address,
        address: location?.address,
      };

      console.log('data  :  ', data);
      // navigation?.goBack();
      fetch(api.update_location, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(async response => {
          console.log('response', response);
          if (response?.status == true) {
            navigation?.goBack();
          } else {
            showAlert(response?.message);
          }
        })
        .catch(err => {
          console.log('Error in addShippingAddress :  ', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleAddress = () => {
    if (location_id) {
      console.log('updateShippingAddress');
      updateShippingAddress();
    } else {
      console.log('addShippingAddress');
      addShippingAddress();
    }
  };

  const getShippingAddress = async location_id => {
    setLoading(true);

    getLocationById(location_id)
      .then(res => {
        console.log('res :  ', res);
        if (res?.status == true) {
          let result = res?.result;
          setLocation_id(result?.location_id);
          setHouseNo(result?.house_number);
          setStreetNo(result?.street_number);
          setAreaNo(result?.area);
          setFloor(result?.floor);
          setInstructions(result?.instructions);
          setIsAddressAlreadyAdded(true);
          setValue(result?.label);
          setAddress(result?.address);
          setAddressList(res?.result);
          dispatch(
            setLocation({
              address: result?.address,
              city: result?.city,
            }),
          );
        } else {
          console.log('else 212 :  ', res);
          //   setIsAddressAlreadyAdded(false);
        }
      })
      .catch(err => {
        console.log('err', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getShippingAddress(route?.params?.id);
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <Loader loading={loading} />
      <ScrollView
        style={{flex: 1}}
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled">
        <StackHeader
          title={'Shipping Address'}
          // rightIcon={
          //   <Text
          //     onPress={() => navigation.replace('SelectPaymentMethod')}
          //     style={{
          //       color: Colors.primary_color,
          //       textDecorationLine: 'underline',
          //       fontFamily: Fonts.PlusJakartaSans_Bold,
          //     }}>
          //     Skip
          //   </Text>
          // }
        />
        <CInput
          heading="House Number"
          value={houseNo}
          onChangeText={text => setHouseNo(text)}
          headingStyle={styles.headingStyle}
          height={textInput_HEIGHT}
        />

        <CInput
          heading="Street Number"
          value={streetNo}
          onChangeText={text => setStreetNo(text)}
          headingStyle={styles.headingStyle}
          height={textInput_HEIGHT}
        />
        {/* <CInput
            heading="Area"
            value={location?.city}
            // value={areaNo}
            // onChangeText={text => setAreaNo(text)}
            headingStyle={styles.headingStyle}
            height={textInput_HEIGHT}
          /> */}
        <CInput
          heading="Floor/Unit"
          value={floor}
          onChangeText={text => setFloor(text)}
          headingStyle={styles.headingStyle}
          height={textInput_HEIGHT}
        />
        <CInput
          heading="Instructions for Rider"
          multiline={true}
          numberOfLines={8}
          textAlignVertical="top"
          value={instructions}
          onChangeText={text => setInstructions(text)}
          headingStyle={styles.headingStyle}
          // height={textInput_HEIGHT}
        />
        {/* <CInput
            heading={'Address'}
            // value={location?.address}
            value={address}
            onChangeText={text => setAddress(text)}
            headingStyle={styles.headingStyle}
            // height={textInput_HEIGHT}
            // leftContent={<Icons.Location width={16} />}
            // editable={false}
            // disabled={false}
            // multiline
            // onPress={() => navigation.navigate('SelectLocation')}
          /> */}

        <CInput
          heading={'Address '}
          placeholder=""
          headingStyle={styles.headingStyle}
          // value={location}
          // onChangeText={text => setLocation(text)}
          // onFocus={() => {
          //   scrollViewRef.current?.scrollTo({y: 450});
          // }}
          value={location?.address}
          editable={false}
          disabled={false}
          multiline
          onPress={() =>
            navigation.navigate('SelectLocation', {
              // screen: 'update',
            })
          }
        />

        <CDropDown
          heading={'Label'}
          placeholder={'Burger'}
          value={value}
          setValue={setValue}
          data={data}
          onFocus={() => {
            setIsDropDownVisible(true);
            // setTimeout(() => {
            //   scrollViewRef.current?.scrollToEnd();
            // }, 200);
          }}
          onBlur={() => setIsDropDownVisible(false)}
        />
        {/* {isDropDownVisible && <View style={{height: 180}} />} */}
        {/* <View style={{height: 280}} /> */}
        {/* <TouchableOpacity
            onPress={() => setChecked(!checked)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 20,
              width: wp(50),
            }}>
            <CheckBox
              value={checked}
              label={'redsfdfs'}
              tintColors={{true: Colors.primary_color, false: Colors.primary_color}}
              onValueChange={() => {
                setChecked(!checked);
              }}
            />
            <Text>Save for future use</Text>
          </TouchableOpacity> */}
        <CButton
          title="Update"
          style={{marginBottom: 100}}
          // onPress={() => navigation.replace('SelectPaymentMethod')}
          onPress={() => {
            // handleAddress();
            updateShippingAddress();
          }}
        />
      </ScrollView>
    </View>
  );
};

export default UpdateShippingAddress;

const styles = StyleSheet.create({
  headingStyle: {
    color: '#292323',
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(1.5),
    marginTop: -5,
  },
});
