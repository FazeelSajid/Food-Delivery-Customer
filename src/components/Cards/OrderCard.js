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
const OrderCard = ({item, onPress }) => {
    
    return (
        <TouchableOpacity onPress={onPress} style={styles.container} >
         <Text 
            style={[
                styles.statusTxt,
            item?.order_status === 'out_for_delivery'? {color: '#09275E', backgroundColor: '#B9D7FF'} : item?.order_status === 'delivered'? {color: '#384308', backgroundColor: '#F2FFB9'} :item?.order_status === 'cancelled'? {color: '#88260D', backgroundColor: '#FEB6B6' } : {color: '#5E3A09', backgroundColor: '#FFD7B0'}
            ]}
            >
                         {item?.order_status === 'out_for_delivery'? 'Out For Delivery' : item?.order_status === 'placed' ? 'Preparing': item?.order_status === 'delivered'? "Delivered" : item?.order_status === 'cancelled'? 'Cancelled' : item?.order_status === 'pending'? 'Pending': ''}
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
        width: wp(20),
        textAlign: 'center',
        borderRadius: wp(6)
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