import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import StackHeader from '../../../components/Header/StackHeader';
import { Images, Fonts, Icons} from '../../../constants';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {RadioButton} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedLanguage} from '../../../redux/AuthSlice';

const Languages = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {selectedLanguage, Colors} = useSelector(store => store.store);

  const [checked, setChecked] = React.useState(selectedLanguage);
  const [isSearch, setIsSearch] = useState(false);
  const [data, setData] = useState([
    {
      id: 1,
      name: 'English',
      selected: true,
    },
    {
      id: 2,
      name: '中国人',
      selected: false,
    },
    {
      id: 3,
      name: 'عربي',
      selected: false,
    },
    {
      id: 4,
      name: 'Español',
      selected: false,
    },
    {
      id: 5,
      name: 'हिंदी',
      selected: false,
    },
    {
      id: 6,
      name: 'Русский',
      selected: false,
    },
    {
      id: 7,
      name: 'اردو',
      selected: false,
    },
    {
      id: 8,
      name: '日本語',
      selected: false,
    },
    {
      id: 9,
      name: 'Punjabi',
      selected: false,
    },
    {
      id: 10,
      name: 'French',
      selected: false,
    },
  ]);
  const styles = StyleSheet.create({
    rowViewSB: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    text: {
      fontFamily: Fonts.Inter_Medium,
      fontSize: RFPercentage(2.1),
      color: Colors.primary_text,
      paddingHorizontal: 5,
    },
    input: {
      flex: 0.9,
      fontFamily: Fonts.PlusJakartaSans_Regular,
      color: Colors.primary_text,
    },
    searchContainer: {
      flexDirection: 'row',
      backgroundColor:Colors.secondary_color,
      width: wp(75),
      // flex: 1,
      height: wp(12),
      // marginRight: wp(5),
      borderRadius: hp(10),
      // marginLeft: 20,
      alignItems: 'center',
    },
    iconContainer: {
      width: wp(11),
      height: wp(11),
      borderRadius: hp(50),
      marginHorizontal: wp(5),
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      // height: wp(11),
      paddingVertical: 0,
      // backgroundColor: 'red',
    },
  });

  const [filteredData, setFilteredData] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  // Function to handle the search query and update the filteredData state
  const handleSearch = text => {
    setSearchQuery(text);
    const filteredItems = data.filter(item =>
      item?.name?.toLowerCase()?.includes(text?.trim().toLowerCase()),
    );
    setFilteredData(filteredItems);
  };

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: Colors.secondary_color}}
      keyboardShouldPersistTaps="handled">
      <StackHeader
        onBackPress={() =>
          isSearch ? setIsSearch(false) : navigation.goBack()
        }
        title={'Change Language'}
        showTitle={!isSearch}
        rightIcon={
          <>
            {isSearch ? (
              <View style={{...styles.searchContainer}}>
                <View
                  style={{...styles.iconContainer, marginHorizontal: wp(0)}}>
                  <Icons.SearchIcon />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Search here"
                    placeholderTextColor={Colors.primary_text}
                    value={searchQuery}
                    onChangeText={handleSearch}
                  />
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={{right: -10}}
                onPress={() => setIsSearch(true)}>
                <Icons.SearchIcon />
              </TouchableOpacity>
            )}
          </>
        }
      />

      <FlatList
        scrollEnabled={false}
        data={filteredData}
        ItemSeparatorComponent={() => (
          <ItemSeparator style={{marginVertical: 10, width: '90%'}} />
        )}
        contentContainerStyle={{paddingBottom: 30, marginHorizontal: 10}}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              setChecked(item.name);
              dispatch(setSelectedLanguage(item?.name));
            }}
            activeOpacity={0.7}
            style={styles.rowViewSB}>
            <Text style={styles.text}>{item.name}</Text>
            <RadioButton
              value={item.name}
              status={checked === item.name ? 'checked' : 'unchecked'}
              uncheckedColor={'#757575'}
              color={Colors.primary_color}
              onPress={() => setChecked(item.name)}
            />
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
};

export default Languages;


