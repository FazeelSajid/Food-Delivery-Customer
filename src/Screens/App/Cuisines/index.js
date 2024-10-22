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
import {Fonts, Images} from '../../../constants';
import FoodCard from '../../../components/Cards/FoodCard';

const Cuisines = ({navigation, route}) => {
  const DATA = [
    {
      id: 1,
      title: 'Burgers',
      image: Images.burger,
    },
    {
      id: 2,
      title: 'Biryani',
      image: Images.food7,
    },
    {
      id: 3,
      title: 'Pasta',
      image: Images.pasta,
    },
    {
      id: 4,
      title: 'Desserts',
      image: Images.food2,
    },
    {
      id: 5,
      title: 'Chinese',
      image: Images.chinese,
    },
    {
      id: 6,
      title: 'Desserts',
      image: Images.food2,
    },
    {
      id: 7,
      title: 'Chinese',
      image: Images.chinese,
    },
    {
      id: 8,
      title: 'Burgers',
      image: Images.burger,
    },
    {
      id: 9,
      title: 'Biryani',
      image: Images.food7,
    },
  ];
  return (
    <View style={styles.container}>
      <View style={{}}>
        <FlatList
          ListHeaderComponent={() => <StackHeader title={'Cuisines'} />}
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
              onPress={() => navigation.navigate('SpecificCuisines')}
              image={item?.image}
              title={item?.title}
              imageContainerStyle={{height: hp(15)}}
              // description={item?.description}
              // price={item?.price}
            />
          )}
          // renderItem={({item}) => (
          //   <TouchableOpacity
          //     activeOpacity={0.7}
          //     onPress={() => navigation?.navigate('SpecificCuisines')}
          //     style={styles.card}>
          //     <Image source={item.image} style={styles.image} />
          //     <View style={styles.textContainer}>
          //       <Text style={styles.title}>{item.title}</Text>
          //     </View>
          //   </TouchableOpacity>
          // )}
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

  card: {
    borderWidth: 1,
    borderColor: '#E6E7EB',
    // height: hp(23),
    paddingVertical: 7,
    flex: 0.47,
    borderRadius: hp(3),
    alignItems: 'center',
  },
  textContainer: {
    justifyContent: 'center',
    marginTop: 6,
    alignItems: 'center',
  },

  image: {
    width: hp(20),
    height: hp(11),
    resizeMode: 'contain',
  },
  title: {
    fontFamily: Fonts.PlusJakartaSans_Bold,
    color: '#0A212B',
    fontSize: RFPercentage(1.8),
    lineHeight: 30,
  },
});
export default Cuisines;
