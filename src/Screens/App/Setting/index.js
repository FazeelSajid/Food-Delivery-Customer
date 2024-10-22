import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import {Colors, Fonts, Icons} from '../../../constants';
import MenuHeader from '../../../components/Header/MenuHeader';
import {RFPercentage} from 'react-native-responsive-fontsize';
import Entypo from 'react-native-vector-icons/Entypo';
import CSwitch from '../../../components/Switch/CSwitch';
import RBSheetConfirmation from '../../../components/BottomSheet/RBSheetConfirmation';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../components/Loader';
import api from '../../../constants/api';
import {getCustomerDetail, showAlert} from '../../../utils/helpers';
import RBSheetGuestUser from '../../../components/BottomSheet/RBSheetGuestUser';
import {useFocusEffect} from '@react-navigation/native';

const Setting = ({navigation, route}) => {
  const {join_as_guest} = useSelector(store => store.store);
  const ref_RBSheetGuestUser = useRef(null);

  const {customer_detail} = useSelector(store => store.store);
  const ref_RBSheet = useRef();
  const [isNotificationEnable, setIsNotificationEnable] = useState(false);
  const [isEmailEnable, setIsEmailEnable] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    ref_RBSheet?.current?.close();
    // navigation?.popToTop();
    // navigation?.navigate('SignIn');
    navigation?.replace('SignIn');
  };

  useEffect(() => {
    getFirstTwoLettersOfName();
  }, []);

  const getFirstTwoLettersOfName = name => {
    let data = name?.split(' ').map(name => name[0]);
    if (data) {
      return data?.toString().replace(/,/g, '');
    } else {
      return '';
    }
  };

  const handleNotificationStatusChange = async status => {
    setLoading(true);
    let customer_id = await AsyncStorage.getItem('customer_id', customer_id);
    let data = {
      customer_id: customer_id,
      recieve_notification: status,
    };
    console.log(data);
    fetch(api.update_receive_notification_status, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(async response => {
        console.log('response  :  ', response);
        if (response?.status == true) {
          setIsNotificationEnable(status);
        } else {
          showAlert(response?.message);
        }
      })
      .catch(err => {
        console.log('Error in accept/reject order :  ', err);
        showAlert('Something went wrong');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOfferByEmailStatusChange = async status => {
    console.log({status});

    setLoading(true);
    let customer_id = await AsyncStorage.getItem('customer_id', customer_id);
    let data = {
      customer_id: customer_id,
      recieve_email: status,
    };

    console.log(data);
    fetch(api.update_receive_emails_status, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(async response => {
        console.log('response  :  ', response);
        if (response?.status == true) {
          setIsEmailEnable(status);
        } else {
          showAlert(response?.message);
        }
      })
      .catch(err => {
        console.log('Error in handleOfferByEmailStatusChange :  ', err);
        showAlert('Something went wrong');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getUserInfo = async () => {
    let customer_id = await AsyncStorage.getItem('customer_id');
    // setLoading(true);
    let details = await getCustomerDetail(customer_id);
    if (details) {
      console.log('recieve_notification :  ', details?.recieve_notification);
      console.log('recieve_email :  ', details?.recieve_email);

      setIsEmailEnable(details?.recieve_email);
      setIsNotificationEnable(details?.recieve_notification);
    } else {
      setIsEmailEnable(false);
      setIsNotificationEnable(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    // getUserInfo();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (join_as_guest) {
        setLoading(false);
        ref_RBSheetGuestUser.current?.open();
      } else {
        getUserInfo();
      }
    }, []),
  );

  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      {join_as_guest ? (
        <RBSheetGuestUser
          showCloseButton={false}
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
      ) : (
        <>
          <Loader loading={loading} />
          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            <MenuHeader
              title={'Settings'}
              rightIcon={
                <TouchableOpacity onPress={() => ref_RBSheet.current?.open()}>
                  <Icons.LogoutActive />
                </TouchableOpacity>
              }
            />
            <View style={{alignItems: 'center'}}>
              <View
                style={{
                  backgroundColor: Colors.Orange,
                  borderRadius: 10,
                  height: 65,
                  width: 70,
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 5,
                }}>
                <Text
                  style={{
                    color: Colors.White,
                    fontFamily: Fonts.Inter_SemiBold,
                    fontSize: RFPercentage(2.8),
                    letterSpacing: 1.5,
                  }}>
                  {getFirstTwoLettersOfName(customer_detail?.user_name)}
                </Text>
              </View>
              <Text
                style={{
                  color: Colors.Orange,
                  fontFamily: Fonts.PlusJakartaSans_SemiBold,
                  fontSize: RFPercentage(2.2),
                  //   letterSpacing: 1.5,
                  lineHeight: 32,
                }}>
                {customer_detail?.user_name}
              </Text>
              <Text
                style={{
                  color: '#757575',
                  fontFamily: Fonts.PlusJakartaSans_Medium,
                  fontSize: RFPercentage(2),
                  //   letterSpacing: 1.5,
                }}>
                {customer_detail?.email}
              </Text>
              <Text
                style={{
                  color: '#757575',
                  fontFamily: Fonts.PlusJakartaSans_Medium,
                  fontSize: RFPercentage(2),
                  //   letterSpacing: 1.5,
                }}>
                {customer_detail?.phone_no}
              </Text>
            </View>
            <View style={{flex: 1, paddingHorizontal: 20, paddingVertical: 25}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('UpdateProfile')}
                style={styles.card}>
                <Text style={styles.cardTitle}>Update Profile</Text>
                <Entypo
                  name="chevron-small-right"
                  size={styles.cardIconSize}
                  color={'#292323'}
                />
              </TouchableOpacity>
              {/* Change Language */}
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('Languages')}>
                <Text style={styles.cardTitle}>Change Language</Text>
                <Entypo
                  name="chevron-small-right"
                  size={styles.cardIconSize}
                  color={'#292323'}
                />
              </TouchableOpacity>
              {/* Receive Notifications */}
              <TouchableOpacity disabled style={styles.card}>
                <Text style={styles.cardTitle}>Receive Notifications</Text>
                <CSwitch
                  value={isNotificationEnable}
                  onValueChange={value => handleNotificationStatusChange(value)}
                />
              </TouchableOpacity>

              {/* Offers by Email */}
              <TouchableOpacity disabled style={styles.card}>
                <Text style={styles.cardTitle}>Offers by Email</Text>
                <CSwitch
                  value={isEmailEnable}
                  onValueChange={value => handleOfferByEmailStatusChange(value)}
                />
              </TouchableOpacity>

              {/* Terms & Conditions */}
              <TouchableOpacity
                onPress={() => navigation.navigate('TermsAndCondition')}
                style={styles.card}>
                <Text style={styles.cardTitle}>Terms & Conditions</Text>
                <Entypo
                  name="chevron-small-right"
                  size={styles.cardIconSize}
                  color={'#292323'}
                />
              </TouchableOpacity>
              {/* Privacy Policy */}
              <TouchableOpacity
                onPress={() => navigation.navigate('PrivacyPolicy')}
                style={styles.card}>
                <Text style={styles.cardTitle}>Privacy Policy</Text>
                <Entypo
                  name="chevron-small-right"
                  size={styles.cardIconSize}
                  color={'#292323'}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
          <View>
            <RBSheetConfirmation
              refRBSheet={ref_RBSheet}
              title={'Logout?'}
              description={'Do you want to logout?'}
              okText={'LOGOUT'}
              onOk={() => handleLogout()}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F6F6F6',
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  cardTitle: {
    color: '#292323',
    fontFamily: Fonts.PlusJakartaSans_Medium,
  },
  cardIconSize: 25,
});
