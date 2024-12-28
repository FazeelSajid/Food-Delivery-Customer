import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import { Fonts} from '../../../constants';
import StackHeader from '../../../components/Header/StackHeader';
import {RFPercentage} from 'react-native-responsive-fontsize';
import Loader from '../../../components/Loader';
import {BASE_URL} from '../../../utils/globalVariables';
import PaymentCard from '../../../components/Cards/PaymentCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SelectPaymentMethod = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [cardList, setCardList] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const handleSelectCard = async item => {
    setSelectedPaymentMethod(item);
    await AsyncStorage.setItem('selected_card', JSON.stringify(item));
    navigation.goBack();
  };

  const getCustomerCards = () => {
    setLoading(true);
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
          console.log(response, 'paymentMethods');
          
        }
      })
      .catch(err => console.log('error in getting customer card: ', err))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getCustomerCards();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1, backgroundColor: Colors.White}}>
      <Loader loading={loading} />
      <StackHeader title={'Payment Method'} headerStyle={{paddingBottom: 10}} />
      <View>
        <FlatList
          data={cardList}
          renderItem={({item, index}) => {
            return (
              <PaymentCard
                onPress={() => handleSelectCard(item)}
                selected={selectedPaymentMethod?.id == item?.id ? true : false}
                marginBottom={3}
                title={item?.card?.brand}
              />
            );
          }}
          ListFooterComponent={() => (
            <PaymentCard
              marginBottom={3}
              title={'Add New Card'}
              onPress={() => {
                navigation.navigate('SetupCard');
              }}
            />
          )}
        />
      </View>
    </ScrollView>
  );
};

export default SelectPaymentMethod;

