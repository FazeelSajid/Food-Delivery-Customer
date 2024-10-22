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

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    paddingHorizontal: 25,
    marginTop: -10,
    paddingBottom: 20,
  },
  text: {
    color: '#595959',
    fontFamily: Fonts.PlusJakartaSans_Regular,
    fontSize: RFPercentage(2),
    lineHeight: 25,
  },
});

// import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
// import React from 'react';
// import {Colors, Fonts, Icons, Images} from '../../../constants';
// import StackHeader from '../../../components/Header/StackHeader';
// import {RFPercentage} from 'react-native-responsive-fontsize';
// import {RadioButton} from 'react-native-paper';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import CButton from '../../../components/Buttons/CButton';
// import AntDesign from 'react-native-vector-icons/AntDesign';

// const SelectPaymentMethod = ({navigation, route}) => {
//   const [checked, setChecked] = React.useState('first');
//   const ItemSeparator = () => (
//     <View
//       style={{
//         height: hp(0.1),
//         marginVertical: 10,
//         backgroundColor: '#00000026',
//       }}
//     />
//   );
//   return (
//     <View style={{flex: 1, backgroundColor: Colors.White}}>
//       <StackHeader title={'Payment Method'} />
//       <View style={{paddingHorizontal: 20, flex: 1}}>
//         <View style={styles.cardView}>
//           <Text style={styles.heading}>Select a Payment method</Text>

//           <View style={styles.rowViewSB}>
//             <Text style={styles.text}>Cash</Text>
//             <RadioButton
//               value="cash"
//               status={checked === 'cash' ? 'checked' : 'unchecked'}
//               uncheckedColor={'#757575'}
//               color={Colors.Orange}
//               onPress={() => setChecked('cash')}
//             />
//           </View>
//           <ItemSeparator />
//           <View style={styles.rowViewSB}>
//             <Text style={styles.text}>Credit Card</Text>
//             <RadioButton
//               value="credit"
//               status={checked === 'credit' ? 'checked' : 'unchecked'}
//               uncheckedColor={'#757575'}
//               color={Colors.Orange}
//               onPress={() => setChecked('credit')}
//             />
//           </View>
//         </View>
//         {/* <View
//           style={{...styles.cardView, borderRadius: 30, paddingHorizontal: 20}}>
//           <Text style={styles.text}>Promocode</Text>
//         </View> */}
//         <TouchableOpacity
//           onPress={() => navigation.navigate('PromoCodes')}
//           style={{
//             ...styles.cardView,
//             borderRadius: 30,
//             paddingHorizontal: 20,
//             alignItems: 'center',
//             flexDirection: 'row',
//             justifyContent: 'center',
//           }}>
//           <AntDesign name="plus" size={13} style={{marginRight: 10}} />
//           <Text style={styles.text}>Add Promocode</Text>
//         </TouchableOpacity>
//         <View
//           style={{
//             flex: 1,
//             justifyContent: 'flex-end',
//             paddingBottom: 20,
//           }}>
//           <CButton
//             title="Continue"
//             onPress={() => navigation.replace('CardInfo')}
//           />
//         </View>
//       </View>
//     </View>
//   );
// };

// export default SelectPaymentMethod;

// const styles = StyleSheet.create({
//   cardView: {
//     borderWidth: 1,
//     borderColor: '#DADADA',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 25,
//   },
//   heading: {
//     fontFamily: Fonts.Inter_SemiBold,
//     color: Colors.Black,
//     fontSize: RFPercentage(2),
//     marginBottom: 10,
//   },
//   rowViewSB: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//   },
//   text: {
//     fontFamily: Fonts.Inter_Regular,
//     fontSize: RFPercentage(2),
//   },
// });
