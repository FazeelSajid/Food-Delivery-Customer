import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Share,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

import { Colors, Fonts, Icons } from '../../../constants';
import MenuHeader from '../../../components/Header/MenuHeader';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Entypo from 'react-native-vector-icons/Entypo';
import CSwitch from '../../../components/Switch/CSwitch';
import RBSheetConfirmation from '../../../components/BottomSheet/RBSheetConfirmation';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../components/Loader';
import api from '../../../constants/api';
import { getCustomerDetail, handlePopup, showAlert } from '../../../utils/helpers';
import RBSheetGuestUser from '../../../components/BottomSheet/RBSheetGuestUser';
import { useFocusEffect } from '@react-navigation/native';
import LogoutModalSvg from '../../../Assets/svg/logoutModalSvg.svg';
import DeleteModalSvg from '../../../Assets/svg/DeleteModalSvg.svg';
import { resetState } from '../../../redux/AuthSlice';
import PopUp from '../../../components/Popup/PopUp';

const Setting = ({ navigation, route }) => {
  const { join_as_guest, customer_id, showPopUp, popUpColor, PopUpMesage } = useSelector(store => store.store);
  const ref_RBSheetGuestUser = useRef(null);
  const dispatch = useDispatch();

  const { customer_detail } = useSelector(store => store.store);
  const ref_RBSheet = useRef();
  const ref_RBSheetDELETE = useRef();
  const [isNotificationEnable, setIsNotificationEnable] = useState(false);
  const [isEmailEnable, setIsEmailEnable] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    ref_RBSheet?.current?.close();
    dispatch(resetState())
    navigation?.replace('SignIn');
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Check out this awesome content!',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // You can do something here if specific activity is detected
          console.log('Shared with activity type: ', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing: ', error.message);
    }
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
    // let customer_id = await AsyncStorage.getItem('customer_id', customer_id);
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
          // handlePopup(dispatch,response?.message, 'red');
        } else {
          handlePopup(dispatch,response?.message, 'red');
        }
      })
      .catch(err => {
        console.log('Error in accept/reject order :  ', err);
        handlePopup(dispatch,'Something went wrong', 'red');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = () =>{
    fetch(api. delete_customer + 201730, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then (response => {
      console.log(response);
      if(response?.status == true){
        dispatch(resetState())
        navigation.replace('SignIn');
        // console.log(response.data);
        // showAlert(response?.message);
        ref_RBSheetDELETE?.current?.close();
        
      }else{
        handlePopup(dispatch,response?.message,'red');
      }
    } )
  }

  const handleOfferByEmailStatusChange = async status => {
    console.log({ status });

    setLoading(true);
    // let customer_id = await AsyncStorage.getItem('customer_id', customer_id);
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
          handlePopup(dispatch,response?.message,'red');
        }
      })
      .catch(err => {
        console.log('Error in handleOfferByEmailStatusChange :  ', err);
        handlePopup(dispatch,'Something went wrong', 'red');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getUserInfo = async () => {
    // let customer_id = await AsyncStorage.getItem('customer_id');
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
    <View style={{ flex: 1, backgroundColor: Colors.White }}>
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
          {showPopUp && <PopUp color={popUpColor} message={PopUpMesage} />}
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <MenuHeader
              title={'Settings'}
              rightIcon={
                <TouchableOpacity onPress={() => ref_RBSheet.current?.open()}>
                  <Icons.LogoutActive />
                </TouchableOpacity>
              }
            />
            <View style={{ alignItems: 'center' }}>
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
            <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 25 }}>
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
              <TouchableOpacity
                onPress={() => navigation.navigate('UpdatePassord')}
                style={styles.card}>
                <Text style={styles.cardTitle}>Update Password</Text>
                <Entypo
                  name="chevron-small-right"
                  size={styles.cardIconSize}
                  color={'#292323'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('ManageAddress')}
                style={styles.card}>
                <Text style={styles.cardTitle}>Manage Addresses</Text>
                <Entypo
                  name="chevron-small-right"
                  size={styles.cardIconSize}
                  color={'#292323'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('UpdateProfile')}
                style={styles.card}>
                <Text style={styles.cardTitle}>My Coins</Text>
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

              {/* Change Language */}
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('Languages')}>
                <Text style={styles.cardTitle}>Language Support</Text>
                <Entypo
                  name="chevron-small-right"
                  size={styles.cardIconSize}
                  color={'#292323'}
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
              {/*Share App */}
              <TouchableOpacity
                onPress={() => onShare()}
                style={styles.card}>
                <Text style={styles.cardTitle}>Share App</Text>
                <Entypo
                  name="chevron-small-right"
                  size={styles.cardIconSize}
                  color={'#292323'}
                />
              </TouchableOpacity>
              {/*Rate App */}
              <TouchableOpacity
                onPress={() => navigation.navigate('Invite')}
                style={styles.card}>
                <Text style={styles.cardTitle}>Rate App</Text>
                <Entypo
                  name="chevron-small-right"
                  size={styles.cardIconSize}
                  color={'#292323'}
                />
              </TouchableOpacity>
              {/*Invite Friend*/}
              <TouchableOpacity
                onPress={() => navigation.navigate('Invite')}
                style={styles.card}>
                <Text style={styles.cardTitle}>Invite Friend</Text>
                <Entypo
                  name="chevron-small-right"
                  size={styles.cardIconSize}
                  color={'#292323'}
                />
              </TouchableOpacity>
              {/*Delete Account*/}
              <TouchableOpacity
                onPress={() => ref_RBSheetDELETE.current?.open()}
                style={styles.card}>
                <Text style={styles.cardTitle}>Delete Account</Text>
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
               height={350}
              refRBSheet={ref_RBSheetDELETE}
              title={'Delete?'}
              description={`Your account will be permanently deleted.${'\n'} Do you want to delete your account?`}
              okText={'Delete'}
              onOk={() => handleDelete()}
              svg={<DeleteModalSvg/>}
              okBtnColor={'#F21515'}


            />
            <RBSheetConfirmation
               height={330}
              refRBSheet={ref_RBSheet}
              title={'Logout?'}
              description={'Do you want to logout?'}
              okText={'LOGOUT'}
              svg={<LogoutModalSvg/>}
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
