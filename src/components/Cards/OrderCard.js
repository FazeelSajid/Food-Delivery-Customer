import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors, Fonts } from '../../constants'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ItemSeparator from '../Separator/ItemSeparator';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { BASE_URL } from '../../utils/globalVariables';
import moment from 'moment';
const OrderCard = ({item, onPress , type}) => {
    console.log(type);
    
    return (
        <TouchableOpacity onPress={onPress} style={styles.container} >
         <Text 
            style={[
                styles.statusTxt,
                type === 'pending' ? 
                { color: Colors.pending } : 
                type === 'cancelled' ? 
                    { color: Colors.cancelled } : 
                    { color: Colors.completed } 
            ]}
            >
  {item?.order_status}
</Text>
            <ItemSeparator width={'100%'} style={styles.ItemSeparator} />
            <View style={styles.contentContainer} >
                <Image source={{ uri: BASE_URL + 'images/1729754235671--Greek-Salad.webp' }} style={{
                    height: 50,
                    width: 50,
                    borderRadius: wp(3),
                   
                }} />
                <View style={styles.orderInfoContainer} >
                    <Text style={styles.orderId} >#{item?.order_id}</Text>
                    <View style={styles.orderPriceContainer} >
                        <Text style={styles.priceText} >$ {item?.total_amount}</Text>
                        <Text  style={[styles.dataTxt]} >{moment(item?.created_at).format("MMM D, YYYY, hh:mm A")}</Text>
                        <Text  style={[styles.dataTxt]}>• {item?.cart_items_Data.length} Items</Text>

                    </View>
                </View>
               

            </View>

        </TouchableOpacity>
    )
}

export default OrderCard

const styles = StyleSheet.create({
    container: {
        borderColor: Colors.borderGray,
        borderWidth: wp(0.4),
        borderRadius: wp(2.5),
        paddingHorizontal: wp(4),
        paddingVertical: wp(2),

    },
    statusTxt: {
        color: Colors.pending,
        fontFamily: Fonts.PlusJakartaSans_SemiBold,
        fontSize: RFPercentage(1.7),
        marginBottom: wp(1),
    },
    ItemSeparator: {
        marginVertical: 5
    },
    image: {
        height: 60,
        marginVertical: 1.5,
        flex: 0.34,
        width: 30
    },
    contentContainer:{
        marginTop: wp(1),
        flexDirection: 'row'
    },
    orderInfoContainer:{
        marginLeft: wp(3),
    },

    orderId:{
        color: Colors.Black,
        fontFamily: Fonts.PlusJakartaSans_SemiBold
    },
    orderPriceContainer:{
        flexDirection: 'row',
        marginTop: wp(2),
        alignItems: 'center'
    },
    priceText:{
        color: Colors.Orange,
        fontFamily: Fonts.PlusJakartaSans_SemiBold,
        fontSize: RFPercentage(1.7),
    },
    dataTxt:{
        color: Colors.grayText,
        fontFamily: Fonts.PlusJakartaSans_SemiBold,
        fontSize: RFPercentage(1.5),
        marginLeft: wp(3),
        
        
    }
})