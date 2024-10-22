import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import CRBSheetComponent from './CRBSheetComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RadioButton} from 'react-native-paper';
import {Colors, Fonts} from '../../constants';
import CInput from '../TextInput/CInput';
import {Rating, AirbnbRating} from 'react-native-ratings';
import CButton from '../Buttons/CButton';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFPercentage} from 'react-native-responsive-fontsize';
import RBSheet from 'react-native-raw-bottom-sheet';

const RBSheetRating = ({
  refRBSheet,
  height,
  title,
  rating,
  setRating,
  onSubmit,
  comment,
  setComment,
}) => {
  return (
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
      <View style={{width: wp(90)}}>
        <Text
          style={{
            color: Colors.Text,
            fontFamily: Fonts.PlusJakartaSans_Bold,
            fontSize: RFPercentage(2.4),
            marginBottom: 20,
          }}>
          {title ? title : 'Rate Rider'}
        </Text>
        <View
          style={{
            flex: 1,
          }}>
          <View
            style={{
              width: wp(90),
              position: 'absolute',
              right: -wp(48),
              top: -10,
            }}>
            <AirbnbRating
              count={5}
              showRating={false}
              defaultRating={1}
              size={30}
              // starImage={<Images.food1 />}
              ratingContainerStyle={{marginBottom: 20, width: 50}}
              onFinishRating={value => {
                setRating(value);
              }}
            />
          </View>
          <View style={{height: 150, marginTop: 40}}>
            <CInput
              placeholder="Enter comments"
              placeholderTextColor="#1E2022"
              multiline={true}
              numberOfLines={6}
              textAlignVertical="top"
              value={comment}
              onChangeText={text => setComment(text)}
            />
          </View>

          <CButton
            title="Submit"
            onPress={() => {
              refRBSheet?.current?.close();
              onSubmit();
            }}
            marginTop={1}
          />
        </View>
      </View>
    </RBSheet>
  );
};

export default RBSheetRating;

const styles = StyleSheet.create({});
