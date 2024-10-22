import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
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
import {Fonts, Images} from '../../constants';
import Lottie from 'lottie-react-native';
import CButton from '../Buttons/CButton';

const RBSheetRestaurantClosed = ({
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
}) => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1}}>
      <RBSheet
        ref={refRBSheet}
        height={height ? height : hp(60)}
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
            <View
              style={{
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
            <Text
              style={{
                color: textColor ? textColor : '#1D1D20',
                fontSize: RFPercentage(2.5),
                fontFamily: Fonts.PlusJakartaSans_SemiBold,
                textAlign: 'center',
              }}>
              {title}
            </Text>
            {/* {description && ( */}
            <Text
              style={{
                color: '#595959',
                fontSize: RFPercentage(2),
                fontFamily: Fonts.PlusJakartaSans_Regular,
                textAlign: 'center',
                marginTop: 8,
              }}>
              {description
                ? description
                : 'This restaurant is closed right now. Check out others that are open or take a look at the menu to plan for your next meal'}
            </Text>
            {/* )} */}
            <View
              style={{
                // flexDirection: 'row',
                alignItems: 'center',
                // justifyContent: 'space-between',
                width: wp(78),
              }}>
              <CButton
                title={'See other restaurants'}
                width={wp(82)}
                height={hp(5.5)}
                marginTop={hp(3.5)}
                // onPress={onOk}
                onPress={() => {
                  refRBSheet?.current?.close();
                  navigation?.navigate('NearByRestaurants');
                }}
              />
              <CButton
                title={'Go to menu'}
                // width={wp(36)}
                width={wp(82)}
                marginTop={hp(2)}
                // onPress={
                //   onCancel ? onCancel : () => refRBSheet?.current?.close()
                // }
                onPress={() => {
                  refRBSheet?.current?.close();
                  navigation?.navigate('Drawer');
                }}
                transparent={true}
              />
            </View>
          </View>
        </ScrollView>
      </RBSheet>
    </View>
  );
};

export default RBSheetRestaurantClosed;

const styles = StyleSheet.create({});
