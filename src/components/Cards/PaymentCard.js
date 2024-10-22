import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {Colors, Fonts, Icons, Images} from '../../constants';
import {RFPercentage} from 'react-native-responsive-fontsize';

const PaymentCard = ({
  style,
  title,
  type,
  marginBottom,
  selected,
  onPress,
  onEditPress,
  showEditButton,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: selected ? Colors.Orange : '#E6E7EB',
        paddingVertical: 5,
        // flex: 1,
        minHeight: 40,
        marginHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        paddingHorizontal: 10,
        overflow: 'hidden',
        flexDirection: 'row',
        marginVertical: 10,
        marginBottom: marginBottom ? marginBottom : 10,
        minHeight: 55,
        ...style,
      }}>
      {type == 'cash' ? (
        <Text style={styles.title}>{title ? title : 'Master Card'}</Text>
      ) : (
        <>
          <Image
            source={Images.master_card}
            style={{height: 50, width: 50, resizeMode: 'contain'}}
          />
          <Text style={styles.title}>{title ? title : 'Master Card'}</Text>
        </>
      )}
      {showEditButton && (
        <TouchableOpacity
          onPress={onEditPress}
          style={{position: 'absolute', right: 10, top: 8}}>
          <Icons.EditActive />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default PaymentCard;

const styles = StyleSheet.create({
  title: {
    color: '#02010E',
    fontFamily: Fonts.PlusJakartaSans_Medium,
    fontSize: RFPercentage(2),
    marginLeft: 15,
    textTransform: 'capitalize',
  },
});
