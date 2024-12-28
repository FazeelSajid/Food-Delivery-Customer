import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {useNavigation} from '@react-navigation/native';
import { useSelector } from 'react-redux';

const RBSheetAddLocation = ({refRBSheet}) => {
  const navigation = useNavigation();
    const  {Colors } = useSelector(store => store.store);
  
  return (
    <View style={{flex: 1}}>
      <RBSheet
        ref={refRBSheet}
        height={250}
        openDuration={250}
        customStyles={{
          container: {
            justifyContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
        }}>
        <View>
          <View
            style={{
              height: 170,
              width: wp(90),
              borderRadius: 20,
              overflow: 'hidden',
            }}>
            <MapView
              // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={{height: '100%', width: '100%'}}
              region={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}></MapView>
          </View>
          <TouchableOpacity
            onPress={() => {
              refRBSheet?.current?.close();
              navigation.navigate('SelectLocation');
            }}>
            <Text
              style={{
                color: Colors.primary_color,
                fontSize: RFPercentage(1.8),
                fontFamily: 'PlusJakartaSans-Regular',
                fontWeight: 'bold',
                marginTop: 15,
              }}>
              +Add Your Location
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </View>
  );
};

export default RBSheetAddLocation;

