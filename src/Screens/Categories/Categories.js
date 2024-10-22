import React from 'react';
import {View, Text, Image, FlatList, StyleSheet, StatusBar} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFPercentage} from 'react-native-responsive-fontsize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import StackHeader from '../../components/Header/StackHeader';
import {Images} from '../../constants';

const Categories = () => {
  const Categories = [
    {
      name: 'Continental',
      id: 1,
      image: Images.food5,
    },
    {
      name: 'Pakistani',
      id: 2,
      image: Images.food2,
    },
    {
      name: 'Thai',
      id: 3,
      image: Images.food3,
    },
    {
      name: 'Turkish',
      id: 4,
      image: Images.food4,
    },
    {
      name: 'Chinese',
      id: 5,
      image: Images.food5,
    },
    {
      name: 'Drinks',
      id: 6,
      image: Images.food6,
    },
    {
      name: 'Continental',
      id: 7,
      image: Images.food5,
    },
    {
      name: 'Pakistani',
      id: 8,
      image: Images.food2,
    },
    {
      name: 'Thai',
      id: 9,
      image: Images.food3,
    },
    {
      name: 'Turkish',
      id: 10,
      image: Images.food4,
    },
    {
      name: 'Chinese',
      id: 11,
      image: Images.food5,
    },
    {
      name: 'Drinks',
      id: 12,
      image: Images.food6,
    },
  ];
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={'#FFFFFF'}
        barStyle={'dark-content'}
        translucent={false}
      />
      <View style={{}}>
        <FlatList
          ListHeaderComponent={() => <StackHeader title={'All Categories'} />}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            paddingHorizontal: 20,
          }}
          data={Categories}
          ItemSeparatorComponent={() => <View style={{height: hp(3)}} />}
          renderItem={({item}) => (
            <View style={styles.card}>
              <View style={styles.textContainer}>
                <Text style={styles.text}>{item.name}</Text>
              </View>
              <View style={styles.imageContainer}>
                <Image
                  source={item.image}
                  resizeMode="stretch"
                  style={styles.image}
                />
              </View>
            </View>
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

  text: {
    color: '#000000',
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: RFPercentage(2.2),
    fontWeight: '500',
  },

  card: {
    borderWidth: 1,
    borderColor: '#E6E7EB',
    height: hp(21),
    flex: 0.46,
    borderRadius: hp(3),
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  textContainer: {
    height: hp(5),
    justifyContent: 'center',
    paddingLeft: hp(2),
  },
  imageContainer: {
    height: hp(18),
    width: hp(18),
    borderRadius: hp(20),
    marginLeft: hp(4.5),
    marginTop: hp(0.5),
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
export default Categories;
