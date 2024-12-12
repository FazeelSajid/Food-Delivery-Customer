import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useRef, useDebugValue} from 'react';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import CountryPicker from 'react-native-country-picker-modal';
import {Colors, Fonts} from '../../constants';

const CInputWithCountryCode = ({
  phoneNo,
  setPhoneNo,
  setCountryCode,
  countryCode,
  placeholder
}) => {
  const [CountryPickerView, setCountryPickerView] = useState(false);
  //   const [countryCode, setCountryCode] = useState('92');
  const [countryNameCode, setCountryNameCode] = useState('PK');
  //   const [phone_no, setPhone_no] = useState('');

  return (
    <>
      {/* {CountryPickerView == true ? ( */}
        
      {/* ) : (
        <View></View>
      )} */}

      <View style={styles.TextFieldView}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setCountryPickerView(true)}
          style={[{width: wp(18), flexDirection: 'row', alignItems: 'center',}]}>
            <CountryPicker
        countryCode={countryNameCode}
          withFilter={true}
          withCallingCode={true}
          withModal={true}
          withFlag={true}
          withFlagButton={true}
          onSelect={e => {
            setCountryPickerView(false);
            //setCountryFlag(JSON.parse(e.flag))
            e.name === 'Antarctica'
              ? setCountryCode('+672')
              : setCountryCode('+' + e.callingCode[0]);
            setCountryNameCode(e.cca2);
            console.log(' e.callingCode[0]  : ', e.callingCode[0]);
          }}
          onClose={e => {
            setCountryPickerView(false);
          }}
          visible={CountryPickerView}
        />
          {/* <TextInput style={[styles.TextField, { width: wp(15) }]} value={"+" + countryCode} editable={false} disabled={false}></TextInput> */}
          <Text style={{color: Colors.primary_text}}>{countryCode}</Text>
        </TouchableOpacity>

        <TextInput
          style={[styles.TextField,countryCode.length > 4 ? {marginLeft: wp(2)} :'' ]}
          placeholder={placeholder}
          value={phoneNo}
          onChangeText={text => setPhoneNo(text)}
          keyboardType={'numeric'}
          placeholderTextColor={Colors.secondary_text}
          // onSubmitEditing={handleTextSubmit}
        ></TextInput>
      </View>
    </>
  );
};

export default CInputWithCountryCode;

const styles = StyleSheet.create({
  TextFieldView: {
    borderRadius: 25,
    width: wp(90),
    alignSelf: 'center',
    paddingRight: 15,
    paddingLeft: 10,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.secondary_text}15`
  },
  TextField: {
    // fontSize: hp(1.6),
    marginHorizontal: wp(0),
    color: Colors.primary_text,
    flex: 1,
    fontFamily: Fonts.PlusJakartaSans_Regular,
    // width: wp(20),
    width: wp(60),
    paddingLeft: 10
    //backgroundColor: 'red',
  },
});
