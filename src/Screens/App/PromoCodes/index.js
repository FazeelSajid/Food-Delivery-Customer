import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import {  Images, Fonts, Icons } from '../../../constants';
import StackHeader from '../../../components/Header/StackHeader';
import { RFPercentage } from 'react-native-responsive-fontsize';
import api from '../../../constants/api';
import Loader from '../../../components/Loader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
const PromoCodes = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { Colors } = useSelector(store => store.store);

  const getData = () => {
    setLoading(true);
    fetch(api.get_all_promocodes)
      .then(response => response.json())
      .then(response => {
        let list = response?.result ? response?.result : [];
        setData(list);
      })
      .catch(err => console.log('error : ', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getData();
  }, []);


  return (
    <View style={{ flex: 1, backgroundColor: Colors.secondary_color }}>
      <Loader loading={loading} />
      <FlatList
        ListHeaderComponent={() => <StackHeader title={'Promocodes'} />}
        data={data}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={{  paddingHorizontal: 25, marginVertical: 5, overflow: 'hidden' }}>
            <Image
              source={{ uri: item.image }}
              style={{ width: '100%', height: 190, borderRadius: wp(2.5)  }}  // Try setting a fixed height to test
              onError={(error) => console.log('Image Load Error:', error.nativeEvent.error)}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default PromoCodes;


