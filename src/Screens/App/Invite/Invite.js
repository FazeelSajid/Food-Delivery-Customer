import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Fonts, Icons } from '../../../constants'
import StackHeader from '../../../components/Header/StackHeader'
import { RFPercentage } from 'react-native-responsive-fontsize'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Clipboard from '@react-native-community/clipboard'
import { useSelector } from 'react-redux'

const Invite = () => {
    const { Colors } = useSelector(store => store.store);
    const PROMO_CODE = 'EatlyPartnerMR';

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors.secondary_color
        },
        heading: {
            fontFamily: Fonts.PlusJakartaSans_SemiBold,
            fontSize: RFPercentage(2.8),
            color: Colors.primary_text,
            marginTop: hp(7)
        },
        text: {
            fontFamily: Fonts.PlusJakartaSans_Regular,
            fontSize: RFPercentage(2),
            color: Colors.secondary_text,
            textAlign: 'center',
            marginTop: hp(1.5)
        },
        codeContainer: {
            backgroundColor: Colors.borderGray,
            width: wp(80),
            marginTop: hp(5),
            paddingHorizontal: wp(5),
            paddingVertical: hp(1),
            borderRadius: wp(6),
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        code: {
            fontFamily: Fonts.PlusJakartaSans_Regular,
            color: Colors.primary_text,
            fontSize: RFPercentage(2),
        }
    })
    return (
        <View style={styles.container} >
            <StackHeader
                title={'Invite Friend'}
                headerStyle={{ paddingBottom: 10 }}
            />
            <View style={{ flex: 1, alignItems: 'center', marginTop: hp(10) }} >
                <Icons.Invite />

                <Text style={styles.heading} accessibilityRole="header">Refer A Friend</Text>

                <Text style={styles.text} >Share Your Promo Code & Get {`\n`} 1000 Coins For Each Friend</Text>

                <View style={styles.codeContainer} >
                    <Text style={styles.code} >
                        {PROMO_CODE}
                    </Text>
                    <TouchableOpacity
                        accessible={true}
                        accessibilityLabel="Copy promo code"
                        accessibilityHint="Copies the promo code to your clipboard"
                        onPress={() => {
                            Clipboard.setString('EatlyPartnerMR');
                        }} >
                        <Icons.CopySvg />
                    </TouchableOpacity>

                </View>
            </View>

        </View>
    )
}

export default Invite

