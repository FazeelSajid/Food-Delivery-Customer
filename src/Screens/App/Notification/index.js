import {StyleSheet, Text, View, FlatList, RefreshControl} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Colors, Fonts, Icons, Images} from '../../../constants';
import StackHeader from '../../../components/Header/StackHeader';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Avatar} from 'react-native-paper';
import {GetAllNotifications} from '../../../utils/helpers/notificationApis';
import Loader from '../../../components/Loader';
import moment from 'moment';
import NoDataFound from '../../../components/NotFound/NoDataFound';
import { useSelector } from 'react-redux';

const Notification = ({navigation, route}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { customer_id } = useSelector(store => store.store);
  const [data, setData] = useState([
    // {
    //   id: 0,
    //   title: 'Your order is in process',
    //   description: 'Morem ipsum dolor sit amet, consectetur elit',
    //   time: '03:00 pm',
    //   type: 'in_process',
    // },
    // {
    //   id: 1,
    //   title: 'Order placed successfully',
    //   description: 'Morem ipsum dolor sit amet, consectetur elit',
    //   time: '03:00 pm',
    //   type: 'placed',
    // },
    // {
    //   id: 2,
    //   title: 'Your order is out for delivery',
    //   description: 'Morem ipsum dolor sit amet, consectetur elit',
    //   time: '03:00 pm',
    //   type: 'out_for_delivery',
    // },
    // {
    //   id: 3,
    //   title: 'Morem ipsum dolor sit amet, ',
    //   description: 'Morem ipsum dolor sit amet, consectetur elit',
    //   time: '03:00 pm',
    //   type: 'other',
    //   profile: Images.user1,
    // },
    // {
    //   id: 4,
    //   title: 'Morem ipsum dolor sit amet, ',
    //   description: 'Morem ipsum dolor sit amet, consectetur elit',
    //   time: '03:00 pm',
    //   type: 'other',
    //   profile: Images.user2,
    // },
    // {
    //   id: 5,
    //   title: 'Morem ipsum dolor sit amet, ',
    //   description: 'Morem ipsum dolor sit amet, consectetur elit',
    //   time: '03:00 pm',
    //   type: 'other',
    //   profile: Images.user3,
    // },
    // {
    //   id: 6,
    //   title: 'Morem ipsum dolor sit amet, ',
    //   description: 'Morem ipsum dolor sit amet, consectetur elit',
    //   time: '03:00 pm',
    //   type: 'other',
    //   profile: Images.user4,
    // },
    // {
    //   id: 7,
    //   title: 'Morem ipsum dolor sit amet, ',
    //   description: 'Morem ipsum dolor sit amet, consectetur elit',
    //   time: '03:00 pm',
    //   type: 'other',
    //   profile: Images.user5,
    // },
    // {
    //   id: 8,
    //   title: 'Morem ipsum dolor sit amet, ',
    //   description: 'Morem ipsum dolor sit amet, consectetur elit',
    //   time: '03:00 pm',
    //   type: 'other',
    //   profile: Images.user2,
    // },
    // {
    //   id: 9,
    //   title: 'Morem ipsum dolor sit amet, ',
    //   description: 'Morem ipsum dolor sit amet, consectetur elit',
    //   time: '03:00 pm',
    //   type: 'other',
    //   profile: Images.user3,
    // },
  ]);

  const getData = async () => {
    let list = await GetAllNotifications(customer_id);
    setData(list);
    setRefreshing(false);
  };

  useEffect(() => {
    setRefreshing(true);
    getData();
  }, []);

  const ItemSeparator = () => (
    <View
      style={{
        height: hp(0.15),
        marginVertical: 15,
        backgroundColor: Colors.borderGray,
        width: wp(90),
        alignSelf: 'center',
      }}
    />
  );
  const onRefresh = () => {
    setRefreshing(true);
    getData();
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.secondary_color}}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            colors={[Colors.primary_color]}
            onRefresh={() => onRefresh()}
          />
        }
        data={data}
        ListHeaderComponent={() => <StackHeader title={'Notifications'} />}
        ListEmptyComponent={() =><NoDataFound loading={loading} text={'No Notifications'} textStyle={{fontSize: RFPercentage(2.4)}} svgHeight={hp(12)} />}
        ItemSeparatorComponent={() => <ItemSeparator />}
        contentContainerStyle={{flexGrow:1}}
        renderItem={({item, index}) => {
          return(
          <View style={styles.card}>
            {item?.orderData?.order_status == 'in_process' ||
            item?.orderData?.order_status == 'preparing_food' ? (
              <View style={styles.iconContainer}>
                <Icons.OrderInProcess />
              </View>
            ) : item?.orderData?.order_status == 'out_for_delivery' ||
              item?.orderData?.order_status == 'ready_to_deliver' ? (
              <View style={styles.iconContainer}>
                <Icons.OrderOutForDelivery />
              </View>
            ) : item?.orderData?.order_status == 'placed' ||
              item?.orderData?.order_status == 'pending' ||
              item?.orderData?.order_status == 'order_placed' ? (
              <View style={styles.iconContainer}>
                <Icons.OrderPlaced />
              </View>
            ) : item?.orderData?.order_status == 'delievered' ||
              item?.orderData?.order_status == 'delivered' ? (
              <View style={styles.iconContainer}>
                <Icons.Check />
              </View>
            ) : item?.notification_type == 'updates' ? (
              <View style={styles.iconContainer}>
                <Icons.Refresh />
              </View>
            ) : (
              // <Avatar.Image
              //   source={item?.profile}
              //   size={50}
              //   style={{backgroundColor: Colors.primary_color}}
              // />
              <View style={styles.iconContainer}>
                <Icons.OrderInProcess />
              </View>
            )}
            <View style={{marginLeft: 10, flex: 1}}>
              <View style={styles.rowViewSB}>
                <Text style={styles.title}>{item?.title}</Text>
                <Text style={styles.timeText}>
                  {item?.created_at ? moment(item?.created_at).fromNow() : ''}
                </Text>
              </View>
              <Text style={styles.description}>{item?.description}</Text>
            </View>
          </View>
        )}}
      />
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  card: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20},
  iconContainer: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    backgroundColor: `${Colors.primary_color}30`,
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
    color: Colors.primary_text,
    fontSize: RFPercentage(1.7),
    lineHeight: 30,
  },
  timeText: {
    fontFamily: Fonts.Inter_Medium,
    color: Colors.secondary_text,
    fontSize: RFPercentage(1.5),
  },
  description: {
    fontFamily: Fonts.Inter_Regular,
    color: Colors.secondary_text,
    fontSize: RFPercentage(1.5),
  },
});
