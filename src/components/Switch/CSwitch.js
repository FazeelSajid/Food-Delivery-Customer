import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Switch} from 'react-native-switch';
import { useSelector } from 'react-redux';
const CSwitch = ({value, onValueChange}) => {
          const  {Colors } = useSelector(store => store.store)
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={false}
      activeText={'On'}
      inActiveText={'Off'}
      circleBorderActiveColor={Colors.primary_color}
      circleBorderInactiveColor={'#BEBEBE'}
      backgroundActive={Colors.primary_color}
      backgroundInactive={'#E2E2E2'}
      circleActiveColor={Colors.secondary_color}
      circleInActiveColor={'#BEBEBE'}
      //   renderInsideCircle={() => <CustomComponent />} // custom component to render inside the Switch circle (Text, Image, etc.)
      changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
      innerCircleStyle={{
        alignItems: 'center',
        justifyContent: 'center',
      }} // style for inner animated circle for what you (may) be rendering inside the circle
      outerCircleStyle={{}} // style for outer animated circle
      renderActiveText={false}
      renderInActiveText={false}
      switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
      switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
      switchWidthMultiplier={2} // multiplied by the `circleSize` prop to calculate total width of the Switch
      switchBorderRadius={20} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
      circleSize={20}
      barHeight={20}
      circleBorderWidth={1}
    />
  );
};

export default CSwitch;

const styles = StyleSheet.create({});
