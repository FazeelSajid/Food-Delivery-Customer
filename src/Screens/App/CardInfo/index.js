import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import {Colors, Fonts, Images} from '../../../constants';
import StackHeader from '../../../components/Header/StackHeader';
import CInput from '../../../components/TextInput/CInput';
import CButton from '../../../components/Buttons/CButton';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import SuccessModal from '../../../components/Modal/SuccessModal';
import {useKeyboard} from '../../../utils/UseKeyboardHook';
import RBSheetSuccess from '../../../components/BottomSheet/RBSheetSuccess';

const CardInfo = ({navigation, route}) => {
  const ref_RBSheet = useRef();
  const keyboardHeight = useKeyboard();
  const scrollViewRef = useRef();

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd();
  }, [keyboardHeight]);

  const [holderName, setHolderName] = useState('');
  const [cardNo, setCardNo] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvcNo, setCvcNo] = useState('');

  const [visible, setVisible] = React.useState(false);

  return (
    <View style={{flex: 1, backgroundColor: Colors.White}}>
      <StackHeader title={'Card Information'} />
      <ScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={{
          paddingHorizontal: 20,
          flexGrow: 1,
          // height: hp(80),
        }}>
        <CInput
          placeholder="Card holder’s name"
          value={holderName}
          onChangeText={text => setHolderName(text)}
        />
        <CInput
          placeholder="Card Number"
          keyboardType="numeric"
          value={cardNo}
          onChangeText={text => setCardNo(text)}
        />
        <CInput
          placeholder="Expiry Date"
          value={expiryDate}
          onChangeText={text => setExpiryDate(text)}
        />
        <CInput
          placeholder="CVV/CVC"
          keyboardType="numeric"
          value={cvcNo}
          onChangeText={text => setCvcNo(text)}
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          {/* <CButton title="Continue" onPress={() => setVisible(true)} /> */}
          {route?.params?.type == 'top_up' ? (
            <CButton
              title="Add TOP-UP"
              onPress={() => {
                ref_RBSheet?.current?.open();
              }}
            />
          ) : (
            <CButton
              title="Add"
              onPress={() => {
                navigation?.replace('Checkout', {
                  selectPaymentMethod: route.params?.selectPaymentMethod,
                  checked: route.params?.checked,
                });
              }}
            />
          )}
        </View>

        <View style={{height: 50}} />
        <View>
          <RBSheetSuccess
            refRBSheet={ref_RBSheet}
            title={'Top-up Added Successfully'}
            btnText={'OK'}
            onPress={() => {
              ref_RBSheet?.current?.close();
              navigation.goBack();
            }}
          />
        </View>
      </ScrollView>
      <SuccessModal
        visible={visible}
        setVisible={setVisible}
        onOK={() => navigation?.goBack()}
      />
    </View>
  );
};

export default CardInfo;

const styles = StyleSheet.create({});
