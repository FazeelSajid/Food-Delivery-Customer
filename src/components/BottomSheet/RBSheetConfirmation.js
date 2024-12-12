import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import React from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {useNavigation} from '@react-navigation/native';
import {Fonts, Images, Colors} from '../../constants';
import Lottie from 'lottie-react-native';
import CButton from '../Buttons/CButton';
const RBSheetConfirmation = ({
  refRBSheet,
  content,
  height,
  title,
  btnText,
  onPress,
  textColor,
  cancelText,
  okText,
  onCancel,
  onOk,
  description,
  svg,
  okBtnColor
}) => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1}}>
      <RBSheet
        ref={refRBSheet}
        height={height ? height : 340}
        openDuration={300}
        // closeOnDragDown
        customStyles={{
          container: {
            // justifyContent: 'center',
            paddingVertical: 20,
            alignItems: 'center',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{width: wp(87), alignItems: 'center'}}>
            {/* <View
              style={{
                height: 150,
                width: 150,
                marginBottom: 10,
                //   aspectRatio: 1,
              }}> */}

                {
                  svg ? <View style={{
                    height: 120,
                    // width: 150,
                    marginBottom: 10,
                    //   aspectRatio: 1,
                  }} >
                    {svg}
                  </View> :   
                  <View style={{
                    height: 150,
                    width: 150,
                    marginBottom: 10,
                    //   aspectRatio: 1,
                  }}>
                     <Lottie
                  source={Images.success_check}
                  autoPlay
                  loop={true}
                  resizeMode="cover"
                />
                  </View>
                 
                }

            
            {/* </View> */}
            <Text
              style={{
                color: textColor ? textColor : '#1D1D20',
                fontSize: RFPercentage(2.5),
                fontFamily: Fonts.PlusJakartaSans_SemiBold,
                textAlign: 'center',
              }}>
              {title}
            </Text>
            {description && (
              <Text
                style={{
                  color: Colors.secondary_text,
                  fontSize: RFPercentage(2),
                  fontFamily: Fonts.PlusJakartaSans_Regular,
                  textAlign: 'center',
                  marginTop: 8,
                }}>
                {description}
              </Text>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: wp(78),
              }}>
              <CButton
                title={cancelText ? cancelText : 'CANCEL'}
                width={wp(36)}
                height={hp(5.5)}
                marginTop={hp(5)}
                onPress={
                  onCancel ? onCancel : () => refRBSheet?.current?.close()
                }
                transparent={true}
              />
              <CButton
                title={okText ? okText : 'DELETE'}
                width={wp(36)}
                height={hp(5.5)}
                marginTop={hp(5)}
                onPress={onOk}
                bgColor={okBtnColor}
              />
            </View>
          </View>
        </ScrollView>
      </RBSheet>
    </View>
  );
};

export default RBSheetConfirmation;

const styles = StyleSheet.create({});
