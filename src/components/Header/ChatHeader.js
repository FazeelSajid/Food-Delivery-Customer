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

  function getInitials(input) {
    // Split the string into words
    const words = input.trim().split(' ');
  
    // Check the number of words
    if (words.length === 1) {
      // If only one word, return the first letter in uppercase
      return words[0][0].toUpperCase();
    } else {
      // If two or more words, return the first letters of the first two words in uppercase
      return words[0][0].toUpperCase() + words[1][0].toUpperCase();
    }
  }

  return (
    <View style={styles.header}>
      <StatusBar
        backgroundColor={Colors.secondary_color}
        barStyle={'dark-content'}
        translucent={false}
      />
      <View style={styles.headerView}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.iconContainer}>
          <Ionicons name={'chevron-back'} size={hp(3)} color={Colors.icon} />
        </TouchableOpacity>
        <View style={{backgroundColor: Colors.button.primary_button, paddingHorizontal: wp(4),paddingVertical: wp(2.2), borderRadius: wp(10),marginRight: wp(2) }} ><Text style={{color: Colors.button.primary_button_text, fontSize: RFPercentage(2.4), padding: 0, fontFamily: Fonts.PlusJakartaSans_Regular}} >{getInitials(title)}</Text></View>
        {/* <Avatar.Image
          // source={profile}
          source={{uri: profile}}
          size={40}
          style={{marginHorizontal: 12, backgroundColor: Colors.primary_color}}
        /> */}
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
    color: Colors.primary_text,
    fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(2.2),
  },
});
