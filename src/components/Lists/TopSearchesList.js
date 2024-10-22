import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import React from 'react';
import ItemSeparator from '../Separator/ItemSeparator';
import {Fonts, Icons, Colors, Images} from '../../constants';
import {RFPercentage} from 'react-native-responsive-fontsize';

const TopSearchesList = ({data, onRemove, onPress, text}) => {
  return (
    <View style={{paddingHorizontal: 30, marginTop: -15}}>
      <Text
        style={{
          color: Colors.Orange,
          fontFamily: Fonts.PlusJakartaSans_Bold,
          marginBottom: 10,
        }}>
        Top Searches
      </Text>
      <FlatList
        data={data}
        ItemSeparatorComponent={() => (
          <ItemSeparator style={{marginVertical: 0}} />
        )}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              onPress={() => onPress(item)}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icons.TopSearch width={16} />
              <Text
                style={{
                  marginLeft: 10,
                  flex: 1,
                  color: '#0A212B',
                  fontFamily: Fonts.PlusJakartaSans_Regular,
                  fontSize: RFPercentage(1.59),
                }}>
                {item ? item : ' Lorem ipsum dolor sit amet, consectetur a'}
              </Text>
              <TouchableOpacity onPress={() => onRemove(item)}>
                {/* <AntDesign name="close" color={'#0A212B'} size={15} /> */}
                <Icons.Close />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default TopSearchesList;

const styles = StyleSheet.create({});
