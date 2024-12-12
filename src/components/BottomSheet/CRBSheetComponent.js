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

const CRBSheetComponent = ({refRBSheet, content, height}) => {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1}}>
      <RBSheet
        ref={refRBSheet}
        height={height ? height : 320}
        openDuration={300}
        customStyles={{
          container: {
            // justifyContent: 'center',
            paddingVertical: 20,
            alignItems: 'center',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {content}
        </ScrollView>
      </RBSheet>
    </View>
  );
};

export default CRBSheetComponent;

const styles = StyleSheet.create({});
