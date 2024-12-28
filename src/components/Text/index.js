import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {RFPercentage} from 'react-native-responsive-fontsize';
import { Fonts} from '../../constants';
import { useSelector } from 'react-redux';

const PriceText = ({text, fontSize, color, currencyColor, textColor}) => {
            const  {Colors } = useSelector(store => store.store)
            const styles = StyleSheet.create({
              rowView: {
                flexDirection: 'row',
                alignItems: 'center',
              },
              title: {
                fontFamily: Fonts.PlusJakartaSans_Bold,
                color: Colors.primary_text,
                fontSize: RFPercentage(2),
                lineHeight: 25,
              },
            });
  return (
    <View style={styles.rowView}>
      <Text
        style={{
          ...styles.title,
          color: color ? color : currencyColor ? currencyColor : Colors.primary_color,
          fontSize: RFPercentage(1.8),
          position: 'absolute',
          // bottom: 4,
        }}>
        $
      </Text>
      <Text
        style={{
          ...styles.title,
          color: color ? color : textColor ? textColor : Colors.primary_color,
          marginLeft: 11,
          fontSize: fontSize ? fontSize : RFPercentage(2),
        }}>
        {text}
      </Text>
    </View>
  );
};

export default PriceText;


