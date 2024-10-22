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

      <WebView
        source={{uri: 'https://mtechub.org/terms/'}}
        style={{flex: 1, height: hp(90), width: wp(100)}}
      />
      {/* <View style={styles.textContainer}>
        <Text style={styles.text}>
          Morem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
          turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec
          fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
          elit sed risus. Maecenas eget condimentum velit, sit amet feugiat
          lectus. Class aptent taciti sociosqu ad litora torquent per conubia
          nostra, per inceptos himenaeos. Praesent auctor purus luctus enim
          egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex.
          Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum
          lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in
          elementum tellus. Curabitur tempor quis eros tempus lacinia. Nam
          bibendum pellentesque quam a convallis. Sed ut vulputate nisi. Integer
          in felis sed leo vestibulum venenatis. Suspendisse quis arcu sem.
          Aenean feugiat ex eu vestibulum vestibulum. Morbi a eleifend magna.
          Nam metus lacus, porttitor eu mauris a, blandit ultrices nibh. Mauris
          sit amet magna non ligula vestibulum eleifend. Nulla varius volutpat
          turpis sed lacinia. Nam eget mi in purus lobortis eleifend. Sed nec
          ante dictum sem condimentum ullamcorper quis venenatis nisi. Proin
          vitae facilisis nisi, ac posuere leo. . Suspendisse quis arcu sem.
          Aenean feugiat ex eu vestibulum vestibulum. Morbi a eleifend magna.
          Nam metus lacus, porttitor eu mauris a, blandit ultrices nibh. Mauris
          sit amet magna non ligula vestibulum eleifend. Nulla varius volutpat
          turpis sed lacinia. Nam eget mi in purus lobortis eleifend. Sed nec
          ante dictum sem condimentum ullamcorper quis venenatis nisi. Proin
          vitae facilisis nisi, ac posuere leo.Morem ipsum dolor sit amet,
          consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a,
          mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem
          sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget
          condimentum velit, sit amet feugiat lectus. Class aptent taciti
          sociosqu ad litora torquent per conubia nostra, per inceptos
          himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque
          ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu
          tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis
          diam sit amet lacinia. Aliquam in elementum tellus. Curabitur tempor
          quis eros tempus lacinia. Nam bibendum pellentesque quam a convallis.
          Sed ut vulputate nisi. Integer in felis sed leo vestibulum venenatis.
          Suspendisse quis arcu sem. Aenean feugiat ex eu vestibulum vestibulum.
          Morbi a eleifend magna. Nam metus lacus, porttitor eu mauris a,
          blandit ultrices nibh. Mauris sit amet magna non ligula vestibulum
          eleifend. Nulla varius volutpat turpis sed lacinia. Nam eget mi in
          purus lobortis eleifend. Sed nec ante dictum sem condimentum
          ullamcorper quis venenatis nisi. Proin vitae facilisis nisi, ac
          posuere leo. . Suspendisse quis arcu sem. Aenean feugiat ex eu
          vestibulum vestibulum. Morbi a eleifend magna. Nam metus lacus,
          porttitor eu mauris a, blandit ultrices nibh. Mauris sit amet magna
          non ligula vestibulum eleifend. Nulla varius volutpat turpis sed
          lacinia. Nam eget mi in purus lobortis eleifend. Sed nec ante dictum
          sem condimentum ullamcorper quis venenatis nisi. Proin vitae facilisis
          nisi, ac posuere leo.
        </Text>
      </View> */}
    </ScrollView>
  );
};

export default TermsAndCondition;

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    paddingHorizontal: 25,
    marginTop: -10,
    paddingBottom: 20,
  },
  text: {
    color: '#595959',
    fontFamily: Fonts.PlusJakartaSans_Regular,
    fontSize: RFPercentage(2),
    lineHeight: 25,
  },
});
