import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors, Images, Fonts, Icons } from '../../../constants';
import StackHeader from '../../../components/Header/StackHeader';
import { RFPercentage } from 'react-native-responsive-fontsize';
import api from '../../../constants/api';
import Loader from '../../../components/Loader';
import { BASE_URL_IMAGE } from '../../../utils/globalVariables';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const PromoCodes = ({ navigation, route }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([
    // {
    //   id: 0,
    //   percentage: 30,
    //   expiry_date: '09/23/2023',
    //   code: 'BUY3R',
    // },
    // {
    //   id: 1,
    //   percentage: 10,
    //   expiry_date: '09/23/2023',
    //   code: 'XYH22',
    // },
    // {
    //   id: 2,
    //   percentage: 50,
    //   expiry_date: '09/23/2023',
    //   code: '987UI',
    // },
    // {
    //   id: 3,
    //   percentage: 25,
    //   expiry_date: '09/23/2023',
    //   code: 'FS345',
    // },
    // {
    //   id: 4,
    //   percentage: 70,
    //   expiry_date: '09/23/2023',
    //   code: 'ERT45',
    // },
    // {
    //   id: 5,
    //   percentage: 30,
    //   expiry_date: '09/23/2023',
    //   code: 'TRY22',
    // },
    // {
    //   id: 6,
    //   percentage: 10,
    //   expiry_date: '09/23/2023',
    //   code: '87IKJ',
    // },
    // {
    //   id: 7,
    //   percentage: 30,
    //   expiry_date: '09/23/2023',
    //   code: 'BUY3R',
    // },
    // {
    //   id: 8,
    //   percentage: 10,
    //   expiry_date: '09/23/2023',
    //   code: 'XYH22',
    // },
  ]);

  const handleSelect = async item => {
    setSelectedId(item?.id);
  };

  const getData = () => {
    setLoading(true);
    fetch(api.get_all_promocodes)
      .then(response => response.json())
      .then(response => {
        let list = response?.result ? response?.result : [];
        // setData([...data, ...list]);
        setData(list);
      })
      .catch(err => console.log('error : ', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.White }}>
      <Loader loading={loading} />
      <FlatList
        ListHeaderComponent={() => <StackHeader title={'Promocodes'} />}
        data={data}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={{  paddingHorizontal: 25, marginVertical: 5, overflow: 'hidden' }}>
            <Image
              source={{ uri: BASE_URL_IMAGE + item.image }}
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

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 10,
    padding: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    marginHorizontal: 20,
  },
  boldText: {
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(2.2),
    color: Colors.Text,
  },
  codeText: {
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(2.5),
    color: Colors.Orange,
  },
  description: {
    color: '#8D93A1',
    fontFamily: Fonts.PlusJakartaSans_Medium,
    fontSize: RFPercentage(1.5),
  },
});
