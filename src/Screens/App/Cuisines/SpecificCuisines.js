import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFPercentage} from 'react-native-responsive-fontsize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import StackHeader from '../../../components/Header/StackHeader';
import {Fonts, Icons, Images} from '../../../constants';
import FoodCard from '../../../components/Cards/FoodCard';

const SpecificCuisines = ({navigation, route}) => {
  const DATA = [
    {
      id: 1,
      title: 'Chicken Noodle Special',
      description: 'Grim Cafe & Eatery',
      price: '$ 1,55',
      image: Images.burger,
    },
    {
      id: 2,
      title: 'Chicken Noodle Special',
      description: 'Grim Cafe & Eatery',
      price: '$ 1,55',
      image: Images.burger,
    },
    {
      id: 3,
      title: 'Chicken Noodle Special',
      description: 'Grim Cafe & Eatery',
      price: '$ 1,55',
      image: Images.burger,
    },
    {
      id: 4,
      title: 'Chicken Noodle Special',
      description: 'Grim Cafe & Eatery',
      price: '$ 1,55',
      image: Images.burger,
    },
    {
      id: 5,
      title: 'Chicken Noodle Special',
      description: 'Grim Cafe & Eatery',
      price: '$ 1,55',
      image: Images.burger,
    },
    {
      id: 6,
      title: 'Chicken Noodle Special',
      description: 'Grim Cafe & Eatery',
      price: '$ 1,55',
      image: Images.burger,
    },
    {
      id: 7,
      title: 'Chicken Noodle Special',
      description: 'Grim Cafe & Eatery',
      price: '$ 1,55',
      image: Images.burger,
    },
    {
      id: 8,
      title: 'Chicken Noodle Special',
      description: 'Grim Cafe & Eatery',
      price: '$ 1,55',
      image: Images.burger,
    },
    {
      id: 9,
      title: 'Chicken Noodle Special',
      description: 'Grim Cafe & Eatery',
      price: '$ 1,55',
      image: Images.burger,
    },
    {
      id: 10,
      title: 'Chicken Noodle Special',
      description: 'Grim Cafe & Eatery',
      price: '$ 1,55',
      image: Images.burger,
    },
  ];
  return (
    <View style={styles.container}>
      <View style={{}}>
        <FlatList
          ListHeaderComponent={() => <StackHeader title={'Burgers'} />}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            paddingHorizontal: 20,
          }}
          data={DATA}
          ItemSeparatorComponent={() => <View style={{height: hp(3)}} />}
          renderItem={({item}) => (
            <FoodCard
              image={item?.image}
              title={item?.title}
              description={item?.description}
              price={item?.price}
            />
          )}
          ListFooterComponent={() => <View style={{height: hp(3)}} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
});
export default SpecificCuisines;
