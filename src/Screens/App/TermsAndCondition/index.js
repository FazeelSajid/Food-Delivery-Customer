import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React from 'react';
import {Colors, Fonts} from '../../../constants';
import StackHeader from '../../../components/Header/StackHeader';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {WebView} from 'react-native-webview';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CButton from '../../../components/Buttons/CButton';

const TermsAndCondition = () => {
  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1, backgroundColor: Colors.White}}>
      <StackHeader
        title={'Terms & Condition'}
        headerStyle={{paddingBottom: 10}}
      />

      {/* <WebView
        source={{uri: 'https://mtechub.org/terms/'}}
        style={{flex: 1, height: hp(90), width: wp(100),}}
      /> */}
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Welcome to Food Delivery Customer. These Terms and Conditions govern your use of our app and services. By accessing or using our app, you agree to comply with these terms. If you do not agree, please do not use our services. To use our app, you must create an account by providing accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. When you place an order through our app, you agree to pay the total amount specified, including any applicable taxes and delivery fees. Orders are subject to availability, and we reserve the right to refuse or cancel an order for any reason. We will make reasonable efforts to deliver your order within the estimated time frame; however, we are not responsible for delays due to unforeseen circumstances, including traffic, weather, or issues with the restaurant. All payments must be made through the app using our accepted payment methods. By providing your payment information, you authorize us to charge the specified amount to your selected payment method. You may cancel your order before it has been prepared. Refunds may be issued at our discretion based on the circumstances surrounding your order. You agree to use our app for lawful purposes only and to refrain from any activity that could damage or interfere with the app’s operation or violate the rights of others. All content, trademarks, and other intellectual property displayed in the app are owned by Food Delivery Customer or its licensors. You may not use any of this content without our prior written consent. To the fullest extent permitted by law, Food Delivery Customer is not liable for any indirect, incidental, or consequential damages arising from your use of the app or services. We reserve the right to modify these Terms and Conditions at any time, with changes effective immediately upon posting in the app. Your continued use of the app after any changes indicates your acceptance of the revised terms. These Terms and Conditions shall be governed by and construed in accordance with the laws of Pakistan. If you have any questions or concerns regarding these Terms and Conditions, please contact our customer support team. Thank you for using Food Delivery Customer!
        </Text>
      </View>
    </ScrollView>
  );
};

export default TermsAndCondition;

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    paddingHorizontal: 25,
    marginTop: hp(1.5),
    paddingBottom: 20,
  },
  text: {
    color: '#595959',
    fontFamily: Fonts.PlusJakartaSans_Regular,
    fontSize: RFPercentage(1.5),
    lineHeight: 25,
  },
});
