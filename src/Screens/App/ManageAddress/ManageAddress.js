import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import StackHeader from '../../../components/Header/StackHeader'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import MapMarker from '../../../Assets/svg/mapMarker.svg';
import {  Fonts } from '../../../constants';
import { RadioButton } from 'react-native-paper';
import api from '../../../constants/api';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApisGet, handlePopup, showAlert } from '../../../utils/helpers';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Ionicons from 'react-native-vector-icons/Ionicons';  // For delete icon (optional)
import { setLocation, setSetAllLocation, setUpdateLocation } from '../../../redux/AuthSlice';
import { setSelectedPaymentString, setSelectedPaymentType } from '../../../redux/CartSlice';
import { ScrollView } from 'react-native-gesture-handler';
import CButton from '../../../components/Buttons/CButton';
import Loader from '../../../components/Loader';
import NoDataFound from '../../../components/NotFound/NoDataFound';
import PopUp from '../../../components/Popup/PopUp';



const ManageAddress = ({navigation}) => {

    const { customer_id, location,  showPopUp, popUpColor, PopUpMesage, Colors } = useSelector(store => store.store)
    const [isLoading, setIsLoading] = useState()

    const [locations, setLocations] = useState([])

    const dispatch = useDispatch()

    useEffect(() => {
        getLocation()
    }, [customer_id])

    const deleteItem = (id) => {
        fetch(api.delete_location + id, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                if (response.status === false) {
                    handlePopup(dispatch,response.message, 'red')
                    return;
                }
                else {
                    handlePopup(dispatch,'Location deleted successfully!', 'green')
                    setLocations((prevLocations) => prevLocations.filter((item) => item.location_id !== id));
                }
            })
    };
    const getLocation = async () => {
        setIsLoading(true)
        const response = await fetchApisGet(api.get_customer_location + customer_id, setIsLoading, dispatch)
        if (response.status === false) {
            handlePopup(dispatch,response?.message, 'red')
            setIsLoading(false)
        }
        else {
            setLocations(response?.customerData?.locations)
            setIsLoading(false)
            dispatch(setLocation({
                latitude: response?.customerData?.locations[0]?.latitude,
                longitude: response?.customerData?.locations[0]?.longitude,
                address: response?.customerData?.locations[0]?.address,
                id: response?.customerData?.locations[0]?.location_id
            }))
            dispatch(setSetAllLocation(response?.customerData?.locations))
            dispatch(setSelectedPaymentType(''));
        }
    }
  

    const renderRightActions = (itemId) => {
        return (
                <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteItem(itemId)}
            >
                <Ionicons name="trash-outline" size={24} color="white" />
            </TouchableOpacity>

            
        );
    };


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.secondary_color,
        // paddingHorizontal: wp(2),
    },
    listContainer: {
        backgroundColor: `${Colors.secondary_text}12`,
        flexDirection: 'row',
        width: wp(90),
        overflow: 'hidden',
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
        // opacity: 2
        
    },
    label: {
        color: Colors.primary_text,
        fontFamily: Fonts.PlusJakartaSans_Bold,
        fontSize: RFPercentage(2),
    },
    address: {
        color: Colors.secondary_text,
        fontFamily: Fonts.PlusJakartaSans_Regular,
        fontSize: RFPercentage(1.5),
    },
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: wp(16),
        height: hp(7),
        // alignSelf: 'center',
        // flex: 1,
        borderRadius: wp(2),
        marginTop: wp(3)
    },
    rowBack: {
        alignItems: 'flex-end',
        // flex: 1,
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // marginHorizontal: wp(1),
      },
})

    return (
        <View style={styles.container}>

            <StackHeader title={'Manage Addresses'} headerStyle={{ marginBottom: hp(2) }} iconContainerStyle={{ marginTop: hp(1) }} />
            {showPopUp && <PopUp color={popUpColor} message={PopUpMesage} />}
            <Loader loading={isLoading} />
            {/* <View style={{alignItems: 'center'}}  > */}

            <FlatList
                data={locations}
                style={{flex:1}}
                contentContainerStyle={{ alignItems: 'center',flexGrow: 1 }}
                refreshControl={<RefreshControl onRefresh={getLocation} colors={[Colors.primary_color]} refreshing={false} />}
                ListEmptyComponent={() => !isLoading && <NoDataFound text={'No Addresses were added'} />}
                keyExtractor={(item) => item.location_id.toString()} // Ensure each item has a unique id
                renderItem={({ item }) => {
                    return (
                        <Swipeable
                            renderRightActions={() => renderRightActions(item.location_id)} // Pass the item's id to delete
                            
                        >
                            <TouchableOpacity onPress={() => {
                                dispatch(setLocation({
                                    latitude: item.latitude,
                                    longitude: item.longitude,
                                    address: item.address,
                                    id: item.location_id,
                                    distance: item.distance
                                }))
                                dispatch(setUpdateLocation({
                                    latitude: item?.latitude,
                                    longitude: item?.longitude,
                                    address: item?.address,
                                    id: item.location_id,
                                    distance: item.distance
                                }))
                                dispatch(setSelectedPaymentType(''));
                                dispatch(setSelectedPaymentString(''));

                            }}

                                style={styles.listContainer}>
                                <View>
                                    <MapMarker />
                                </View>
                                <View style={{ flex: 1, marginLeft: wp(3) }}>
                                    <Text style={styles.label} ellipsizeMode='tail' numberOfLines={1}>{item.label}</Text>
                                    <Text style={styles.address} ellipsizeMode='tail' numberOfLines={1}  >{item.address}</Text>
                                    <View style={{flexDirection: 'row'}} >
                                    <Text style={styles.address}>Distance: </Text>
                                    <Text style={styles.address}>{item.distance}</Text>
                                    </View>
                                    
                                </View>
                                <View style={{ flex: 0.2, alignItems: 'flex-end', justifyContent: 'center' }}>
                                    <RadioButton
                                        color={Colors.button.primary_button}
                                        uncheckedColor={Colors.button.primary_button}
                                        status={location.id === item.location_id ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            dispatch(setLocation({
                                                latitude: item.latitude,
                                                longitude: item.longitude,
                                                address: item.address,
                                                id: item.location_id,
                                                distance: item.distance
                                            }))

                                            dispatch(setUpdateLocation({
                                                latitude: item?.latitude,
                                                longitude: item?.longitude,
                                                address: item?.address,
                                                id: item.location_id,
                                                distance: item.distance

                                            }))
                                        }
                                        }

                                    />
                                </View>
                            </TouchableOpacity>
                        </Swipeable>
                    );
                }}
            />
            <View
                style={{
                    // flex: 0.8,
                    paddingBottom: 30,
                    justifyContent: 'flex-end',
                    
                }}>
                <CButton
                    title="Add Address"
                    width={wp(85)}
                    loading={isLoading}
                    onPress={() => {
                      
                        // ref_RBSheet?.current?.open();
                        navigation.navigate('Map')

                    }}
                />
            </View>


        </View>
    )
}

export default ManageAddress
