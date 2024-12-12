import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SelectCountry, Dropdown} from 'react-native-element-dropdown';
import {Colors, Fonts, Images, Icons} from '../../constants';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const CDropDown = ({
  heading,
  data,
  value,
  setValue,
  placeholder,
  onFocus,
  onBlur,
}) => {
  return (
    <View>
      {heading && (
        <Text
          style={{
            color: Colors.primary_text,
            fontFamily: Fonts.PlusJakartaSans_Bold,
            fontSize: RFPercentage(1.5),
            marginHorizontal: 25,
            marginBottom: 14,
          }}>
          {heading}
        </Text>
      )}

      <Dropdown
        style={[
          {
            backgroundColor: Colors.secondary_color,
            borderRadius: 25,
            width: wp(90),
            alignSelf: 'center',
            paddingHorizontal: 20,
            paddingVertical: 6.8,
            marginBottom: 20,
          },
        ]}
        // activeColor={Colors.AvatarBG}
        itemContainerStyle={
          {
            // backgroundColor: 'red',
          }
        }
        itemTextStyle={{
          fontSize: RFPercentage(2),
          fontFamily: Fonts.PlusJakartaSans_Regular,
          color: 'black',
        }}
        selectedTextStyle={{
          fontSize: 16,
        }}
        containerStyle={{
          width: wp(90),
          marginTop: 2,
          borderRadius: 25,
          backgroundColor: Colors.secondary_color,
          alignSelf: 'center',
          overFlow: 'hidden',
          padding: 10,
        }}
        // dropdownPosition="top"
        // mode="modal"
        placeholderStyle={{
          color: Colors.secondary_text,
          //   fontWeight: '400',
          fontSize: RFPercentage(2.1),
        }}
        // inputSearchStyle={styles.inputSearchStyle}
        // iconStyle={styles.iconStyle}
        data={data}
        search={false}
        maxHeight={200}
        labelField="label"
        valueField="value"
        placeholder={placeholder ? placeholder : 'Burger'}
        searchPlaceholder="Search..."
        value={value}
        // onFocus={() => setIsFocus(true)}
        // onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          //   setIsFocus(false);
        }}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </View>
  );
};

export default CDropDown;

const styles = StyleSheet.create({});
