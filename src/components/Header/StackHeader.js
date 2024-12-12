import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {RFPercentage} from 'react-native-responsive-fontsize';
import {useNavigation} from '@react-navigation/native';
import {Colors, Fonts, Icons} from '../../constants';

const StackHeader = ({
  title,
  rightIcon,
  onBackPress,
  showTitle,
  backIconColor,
  enableStatusBar,
  translucent,
  headerView,
  titleColor,
  backgroundColor,
  statusBarBG,
  statusBarStyle,
  headerStyle,
  iconContainerStyle,
  barStyle,
  headerTxtStyle,
  titleSize
}) => {
  const navigation = useNavigation();
  return (
    <View style={{...styles.header, ...headerStyle}}>
      {enableStatusBar == false ? null : (
        <StatusBar
          backgroundColor={
            translucent == true
              ? 'transparent'
              : statusBarBG
              ? statusBarBG
              : '#FFFFFF'
          }
          barStyle={
            barStyle
              ? barStyle
              : statusBarStyle
              ? statusBarStyle
              : translucent
              ? 'light-content'
              : 'dark-content'
          }
          translucent={translucent ? translucent : false}
        />
      )}
      <View style={{...styles.headerView, ...headerView}}>
        <TouchableOpacity
          onPress={onBackPress ? onBackPress : () => navigation?.goBack()}
          style={{...styles.iconContainer, ...iconContainerStyle}}>
          <Ionicons
            name={'chevron-back'}
            size={hp(3.5)}
            color={backIconColor ? backIconColor : Colors.primary_color}
          />
        </TouchableOpacity>
        {showTitle == false ? null : (
          <View style={styles.headerTextContainer}>
            <Text
              style={[headerTxtStyle,{
                ...styles.mainText,
                color: titleColor ? titleColor : Colors.primary_color,
                letterSpacing: 0,
                fontSize: titleSize? titleSize : RFPercentage(2.8),
                
                
              }]}>
              {title}
            </Text>
          </View>
        )}
        <TouchableOpacity style={{...styles.iconContainer1}}>
          {rightIcon}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StackHeader;

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    paddingVertical: 15,
    paddingBottom: hp(4),
  },
  headerView: {
    width: wp(100),
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: wp(20),
    justifyContent: 'center',
    alignItems: 'center',
    // flex: 0.2,
    // marginRight: 30,
  },
  iconContainer1: {
    // width: wp(20),
    justifyContent: 'center',
    alignItems: 'center',
    // flex: 0.2,
    marginRight: 30,
    minWidth: 35,
  },
  headerTextContainer: {
    flex: 1,
  },
  mainText: {
    color: Colors.primary_color,
    fontFamily: Fonts.PlusJakartaSans_SemiBold,
    // fontFamily: Fonts.PlusJakartaSans_Bold,
    fontSize: RFPercentage(3),
    textAlign: 'center',
  },
});

// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   StatusBar,
// } from 'react-native';
// import React from 'react';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// import {RFPercentage} from 'react-native-responsive-fontsize';
// import {useNavigation} from '@react-navigation/native';
// import {Colors, Fonts, Icons} from '../../constants';

// const StackHeader = ({
//   title,
//   rightIcon,
//   onBackPress,
//   showTitle,
//   backIconColor,
//   enableStatusBar,
//   translucent,
//   headerView,
//   titleColor,
//   backgroundColor,
//   barStyle,
// }) => {
//   const navigation = useNavigation();
//   return (
//     <View style={styles.header}>
//       {enableStatusBar == false ? null : (
//         <StatusBar
//           backgroundColor={
//             backgroundColor
//               ? backgroundColor
//               : translucent == true
//               ? 'transparent'
//               : '#FFFFFF'
//           }
//           barStyle={
//             barStyle ? barStyle : translucent ? 'light-content' : 'dark-content'
//           }
//           translucent={translucent ? translucent : false}
//         />
//       )}
//       <View style={{...styles.headerView, ...headerView}}>
//         <TouchableOpacity
//           onPress={onBackPress ? onBackPress : () => navigation?.goBack()}
//           style={styles.iconContainer}>
//           <Ionicons
//             name={'chevron-back'}
//             size={hp(3)}
//             color={backIconColor ? backIconColor : Colors.primary_color}
//           />
//         </TouchableOpacity>
//         {showTitle == false ? null : (
//           <View style={styles.headerTextContainer}>
//             <Text
//               style={{
//                 ...styles.mainText,
//                 color: titleColor ? titleColor : Colors.primary_color,
//                 letterSpacing: 1.5,
//               }}>
//               {title}
//             </Text>
//           </View>
//         )}
//         <TouchableOpacity style={{...styles.iconContainer1}}>
//           {rightIcon}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default StackHeader;

// const styles = StyleSheet.create({
//   header: {
//     justifyContent: 'center',
//     paddingVertical: 15,
//     paddingBottom: hp(4),
//   },
//   headerView: {
//     width: wp(100),
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   iconContainer: {
//     width: wp(20),
//     justifyContent: 'center',
//     alignItems: 'center',
//     // flex: 0.2,
//     // marginRight: 30,
//   },
//   iconContainer1: {
//     // width: wp(20),
//     justifyContent: 'center',
//     alignItems: 'center',
//     // flex: 0.2,
//     marginRight: 30,
//     minWidth: 35,
//   },
//   headerTextContainer: {
//     flex: 1,
//   },
//   mainText: {
//     color: Colors.primary_color,
//     fontFamily: Fonts.PlusJakartaSans_SemiBold,
//     fontSize: RFPercentage(2.2),
//     textAlign: 'center',
//   },
// });
