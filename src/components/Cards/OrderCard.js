import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import {  Fonts } from '../../constants'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ItemSeparator from '../Separator/ItemSeparator';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { BASE_URL } from '../../utils/globalVariables';
import moment from 'moment';
import { useSelector } from 'react-redux';
const OrderCard = ({item, onPress }) => {
    const  {Colors } = useSelector(store => store.store);
    const statusStyles = {
        out_for_delivery: { color: '#09275E', backgroundColor: '#B9D7FF', label: 'Out For Delivery',  width: wp(30), },
        preparing_food:{color: '#5E3A09', backgroundColor: '#FFD7B0', label: 'Preparing',  width: wp(20)},
        delivered: { color: '#384308', backgroundColor: '#F2FFB9', label: 'Delivered' ,  width: wp(22),},
        cancelled: { color: '#88260D', backgroundColor: '#FEB6B6', label: 'Cancelled',  width: wp(22), },
        placed: { color: '#5E3A09', backgroundColor: '#FFD7B0', label: 'Preparing',  width: wp(20), },
        pending: { color: '#5E3A09', backgroundColor: '#FFA270FF', label: 'Pending', width: wp(18), },
        ready_to_deliver: { color: '#09275E', backgroundColor: '#B9D7FF', label: 'Ready To Deliver',  width: wp(30), }
    };


    const currentStatus = statusStyles[item?.order_status] || { color: '#5E3A09', backgroundColor: '#FFD7B0', label: '',  width: wp(20), };
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
            color: Colors.primary_text,
            fontFamily: Fonts.PlusJakartaSans_SemiBold
        },
        orderPriceContainer:{
            flexDirection: 'row',
            marginTop: wp(2),
            alignItems: 'center'
        },
        priceText:{
            color: Colors.primary_color,
            fontFamily: Fonts.PlusJakartaSans_SemiBold,
            fontSize: RFPercentage(1.7),
        },
        dataTxt:{
            color: Colors.secondary_text,
            fontFamily: Fonts.PlusJakartaSans_SemiBold,
            fontSize: RFPercentage(1.5),
            marginLeft: wp(3),
            
            
        }
    })
    return (
        <TouchableOpacity onPress={onPress} style={styles.container} >
       <Text 
    style={[styles.statusTxt, { color: currentStatus.color, backgroundColor: currentStatus.backgroundColor, width: currentStatus.width  }]}
>
    {currentStatus.label}
</Text>
            <ItemSeparator width={'100%'} style={styles.ItemSeparator} />
            <View style={styles.contentContainer} >
                <Image source={{ uri: BASE_URL + item.cart_items_Data[0]?.itemData?.images[0] }} style={{
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

