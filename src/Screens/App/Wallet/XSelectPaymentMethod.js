import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts} from '../../../constants';
import StackHeader from '../../../components/Header/StackHeader';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {WebView} from 'react-native-webview';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CButton from '../../../components/Buttons/CButton';
import Loader from '../../../components/Loader';
import {BASE_URL} from '../../../utils/globalVariables';
import {PaymentType} from '@stripe/stripe-react-native/lib/typescript/src/types/PlatformPay';

const SelectPaymentMethod = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [cardList, setCardList] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const getCustomerCards = () => {
    let url = BASE_URL + 'payment/pay2';
    console.log('url  :   ', url);
    fetch(url, {
      method: 'POST',
      // body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(response => response.json())
      .then(response => {
        if (response?.status == true) {
          let list = response?.paymentMethods?.data;
          setCardList(list);
        }
      })
      .catch(err => console.log('error in getting customer card: ', err));
  };

  useEffect(() => {
    getCustomerCards();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1, backgroundColor: Colors.White}}>
      <Loader loading={loading} />
      <StackHeader title={'Payment Method'} headerStyle={{paddingBottom: 10}} />
    </ScrollView>
  );
};

export default SelectPaymentMethod;

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    paddingHorizontal: 25,
    marginTop: -10,
    paddingBottom: 20,
  },
  text: {
    color: Colors.secondary_text,
    fontFamily: Fonts.PlusJakartaSans_Regular,
    fontSize: RFPercentage(2),
    lineHeight: 25,
  },
});
