import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Images, Fonts, Icons, Colors} from '../../constants';
import {Avatar, Badge} from 'react-native-paper';
import {RFPercentage} from 'react-native-responsive-fontsize';
import CBadge from '../CBadge';
import {useNavigation} from '@react-navigation/native';

const ChatCard = ({profile, user_name, message, created_at, unread_count}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Conversation')}
      style={styles.card}>
      <Avatar.Image source={profile} size={40} />
      <View style={{marginLeft: 10, flex: 1}}>
        <View style={styles.rowViewSB}>
          <Text style={styles.title}>{user_name}</Text>
          <Text
            style={{
              ...styles.timeText,
              fontFamily:
                unread_count > 0
                  ? Fonts.PlusJakartaSans_Bold
                  : Fonts.Inter_Medium,
              color: unread_count > 0 ? Colors.Text : '#595959',
            }}>
            {created_at}
          </Text>
        </View>
        <View style={styles.rowViewSB}>
          <Text
            style={{
              ...styles.description,

              fontFamily:
                unread_count > 0
                  ? Fonts.PlusJakartaSans_Bold
                  : Fonts.Inter_Regular,
              color: unread_count > 0 ? Colors.Text : '#595959',
            }}
            numberOfLines={1}>
            {message}
          </Text>
          {unread_count > 0 && <CBadge text={unread_count} />}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatCard;

const styles = StyleSheet.create({
  card: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20},
  iconContainer: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    backgroundColor: '#FF572233',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowViewSB: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: Fonts.Inter_SemiBold,
    color: Colors.Black,
    fontSize: RFPercentage(2),
    lineHeight: 30,
  },
  timeText: {
    fontFamily: Fonts.Inter_Medium,
    color: '#595959',
    fontSize: RFPercentage(1.5),
  },
  description: {
    fontFamily: Fonts.Inter_Regular,
    color: '#595959',
    fontSize: RFPercentage(1.5),
    flex: 0.9,
  },
});
