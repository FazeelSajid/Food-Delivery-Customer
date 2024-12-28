import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {useNavigation} from '@react-navigation/native';
import { Fonts, Icons} from '../../constants';
import { useSelector } from 'react-redux';

const MenuHeader = ({title, rightIcon}) => {
  const navigation = useNavigation();
        const  {Colors } = useSelector(store => store.store);
  
        const styles = StyleSheet.create({
          header: {
            justifyContent: 'center',
            paddingVertical: 15,
            paddingBottom: hp(4),
          },
          headerView: {
            width: wp(100),
            flexDirection: 'row',
            alignItems: 'center',
          },
          iconContainer: {
            width: wp(20),
            justifyContent: 'center',
            alignItems: 'center',
          },
          headerTextContainer: {
            flex: 1,
          },
          mainText: {
            color: Colors.primary_color,
            // fontFamily: Fonts.PlusJakartaSans_Medium,
            fontFamily: Fonts.PlusJakartaSans_SemiBold,
            letterSpacing: 1,
            fontSize: RFPercentage(2.5),
            textAlign: 'center',
          },
        });

  return (
    <View style={styles.header}>
      <StatusBar
        backgroundColor={'#FFFFFF'}
        barStyle={'dark-content'}
        translucent={false}
      />
      <View style={styles.headerView}>
        <TouchableOpacity
          onPress={() => navigation?.toggleDrawer()}
          style={styles.iconContainer}>
          <Icons.MenuActive width={24} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.mainText}>{title}</Text>
        </View>
        <TouchableOpacity style={styles.iconContainer}>
          {rightIcon}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MenuHeader;


