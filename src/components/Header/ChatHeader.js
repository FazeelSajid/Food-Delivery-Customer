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
import Ionicons from 'react-native-vector-icons/Ionicons';

import {RFPercentage} from 'react-native-responsive-fontsize';
import {useNavigation} from '@react-navigation/native';
import {Colors, Fonts, Icons} from '../../constants';
import {Avatar} from 'react-native-paper';

const ChatHeader = ({title, profile, rightIcon}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <StatusBar
        backgroundColor={'#FFFFFF'}
        barStyle={'dark-content'}
        translucent={false}
      />
      <View style={styles.headerView}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.iconContainer}>
          <Ionicons name={'chevron-back'} size={hp(3)} color={Colors.Orange} />
        </TouchableOpacity>
        <Avatar.Image
          // source={profile}
          source={{uri: profile}}
          size={40}
          style={{marginHorizontal: 12, backgroundColor: Colors.Orange}}
        />
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

export default ChatHeader;

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    paddingVertical: 15,
    // paddingBottom: hp(4),
  },
  headerView: {
    width: wp(100),
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    // marginLeft: wp(6),
    paddingLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  mainText: {
    color: Colors.Text,
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(2.2),
  },
});
