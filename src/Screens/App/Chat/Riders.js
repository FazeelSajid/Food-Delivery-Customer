import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Images, Colors, Fonts, Icons} from '../../../constants';
import {Avatar, Badge} from 'react-native-paper';
import {RFPercentage} from 'react-native-responsive-fontsize';
import StackHeader from '../../../components/Header/StackHeader';
import ItemSeparator from '../../../components/Separator/ItemSeparator';
import CBadge from '../../../components/CBadge';
import ChatCard from '../../../components/Cards/ChatCard';

const Riders = () => {
  const [data, setData] = useState([
    {
      id: 0,
      user_name: 'Anabel Ramon',
      message: 'Hahahah😂😂',
      profile: Images.user1,
      created_at: '08:43',
      unread_count: 3,
    },
    {
      id: 1,
      user_name: 'Anabel Ramon',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      profile: Images.user2,
      created_at: '08:43',
      unread_count: 9,
    },
    {
      id: 2,
      user_name: 'Laura Wills',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      profile: Images.user3,
      created_at: 'Tue',
      unread_count: 0,
    },
    {
      id: 3,
      user_name: 'Jenny Wilson',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      profile: Images.user4,
      created_at: 'Sun',
      unread_count: 0,
    },
    {
      id: 4,
      user_name: 'Laura Wills',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      profile: Images.user5,
      created_at: 'Sun',
      unread_count: 0,
    },
    {
      id: 5,
      user_name: 'Jenny Wilson',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      profile: Images.user1,
      created_at: 'Sun',
      unread_count: 0,
    },
    {
      id: 6,
      user_name: 'Marting Harris',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      profile: Images.user3,
      created_at: 'Fri',
      unread_count: 0,
    },
    {
      id: 7,
      user_name: 'Monolo Garcia',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      profile: Images.user3,
      created_at: 'Tue',
      unread_count: 0,
    },
    {
      id: 8,
      user_name: 'John Doe',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      profile: Images.user3,
      created_at: 'Wed',
      unread_count: 0,
    },
  ]);
  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <FlatList
        data={data}
        ListHeaderComponent={() => <View style={{height: 20}} />}
        ItemSeparatorComponent={() => <ItemSeparator />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 30}}
        renderItem={({item, index}) => (
          <ChatCard
            profile={item?.profile}
            user_name={item?.user_name}
            created_at={item?.created_at}
            message={item?.message}
            unread_count={item?.unread_count}
          />
        )}
      />
    </View>
  );
};

export default Riders;

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
