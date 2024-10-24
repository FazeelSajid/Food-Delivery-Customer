import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import StackHeader from '../../../components/Header/StackHeader'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import MapMarker from '../../../Assets/svg/mapMarker.svg';
import { Colors, Fonts } from '../../../constants';
import { RadioButton } from 'react-native-paper';
import api from '../../../constants/api';
import { useDispatch, useSelector } from 'react-redux';
import { showAlert } from '../../../utils/helpers';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Ionicons from 'react-native-vector-icons/Ionicons';  // For delete icon (optional)
import { setLocation } from '../../../redux/AuthSlice';



const ManageAddress = () => {

    const { customer_id, location } = useSelector(store => store.store)
    const [isLoading, setIsLoading] = useState()

    const [locations, setLocations] = useState([])

    const dispatch = useDispatch()

    useEffect(() => {
        getLocation()
    }, [customer_id])





    const deleteItem = (id) => {

        fetch(api.delete_location + id, {
            method: 'DELETE',
            headers: {
                // 'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                if (response.status === false) {
                    showAlert(response.message)
                    return;
                }
                else {
                    showAlert('Location deleted successfully!', 'green')
                    setLocations((prevLocations) => prevLocations.filter((item) => item.location_id !== id));
                    console.log(response.message, id);

                }
            })






    };

    // console.log(location );

    const getLocation = () => {
        fetch(api.get_customer_location + customer_id, {
            method: 'GET',
            headers: {
                // 'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => {

                if (response.status === false) {
                    showAlert(response.message)
                    setIsLoading(false)
                }
                else {
                    setLocations(response.customerData.locations)
                    console.log(api.get_customer_location + customer_id);

                    setIsLoading(false)
                    console.log(response.customerData.locations[0]);
                    dispatch(setLocation({
                        latitude: response.customerData.locations[0].latitude,
                        longitude: response.customerData.locations[0].longitude,
                        address: response.customerData.locations[0].address,
                        id: response.customerData.locations[0].location_id
                    }))

                }

                // update state with fetched data
            })
            .catch(err => {
                console.log('Error in Login :  ', err);
                showAlert('Something went wrong!');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }
    const truncateString = (text, maxLength = 30) => {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        }
        return text;
    };

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

    return (
        <View style={styles.container}>
            <StackHeader title={'Manage Addresses'} headerStyle={{ marginBottom: hp(2) }} iconContainerStyle={{ marginTop: hp(1) }} />

            {/* <View style={{alignItems: 'center'}}  > */}

            <FlatList
                data={locations}
                contentContainerStyle={{ alignItems: 'center' }}
                keyExtractor={(item) => item.location_id.toString()} // Ensure each item has a unique id
                renderItem={({ item }) => {
                    return (
                        <Swipeable
                            renderRightActions={() => renderRightActions(item.location_id)} // Pass the item's id to delete

                        >
                            <TouchableOpacity onPress={() => {
                                console.log({
                                    latitude: item.latitude,
                                    longitude: item.longitude,
                                    address: item.address,
                                    id: item.location_id
                                });
                                
                                dispatch(setLocation({
                                latitude: item.latitude,
                                longitude: item.longitude,
                                address: item.address,
                                id: item.location_id
                            }))}} style={styles.listContainer}>
                                <View>
                                    <MapMarker />
                                </View>
                                <View style={{ flex: 1, marginLeft: wp(3) }}>
                                    <Text style={styles.label}>{item.label}</Text>
                                    <Text style={styles.address}>{truncateString(item.address)}</Text>
                                </View>
                                <View style={{ flex: 0.2, alignItems: 'flex-end', justifyContent: 'center' }}>
                                    <RadioButton
                                        color={Colors.Orange}
                                        uncheckedColor={Colors.Orange}
                                        status={location.id === item.location_id ? 'checked' : 'unchecked'}
                                        onPress={() => dispatch(setLocation({
                                            latitude: item.latitude,
                                            longitude: item.longitude,
                                            address: item.address,
                                            id: item.location_id
                                        }))} 
                                    />
                                </View>
                            </TouchableOpacity>
                        </Swipeable>
                    );
                }}
            />

            {/* <View style={styles.listContainer} >
                    <View style={{}}>
                        <MapMarker/>
                    </View>
                    <View style={{flex: 1, marginLeft: wp(3), width: '100'}}>
                        <Text style={styles.label}>Home</Text>
                        <Text style={styles.address}>{'45 Maple Road, Bristol, Avon, B...'.length}</Text>
                    </View>
                    <View style={{flex: 0.2, alignItems: 'flex-end', justifyContent: 'center'}}>
                    <RadioButton color={Colors.Orange} uncheckedColor={Colors.Orange} status={ 'checked'}  />
                    </View>
                </View> */}
            {/* <View style={styles.listContainer} >
                    <View style={{}}>
                        <MapMarker/>
                    </View>
                    <View style={{flex: 1, marginLeft: wp(3), width: '100'}}>
                        <Text style={styles.label}>Home</Text>
                        <Text style={styles.address}>45 Maple Road, Bristol, Avon, B...</Text>
                    </View>
                    <View style={{flex: 0.2, alignItems: 'flex-end', justifyContent: 'center'}}>
                    <RadioButton color={Colors.Orange} uncheckedColor={Colors.Orange} status={ 'checked'}  />
                    </View>
                </View> */}


            {/* </View> */}


        </View>
    )
}

export default ManageAddress

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
        // paddingHorizontal: wp(2),
    },
    listContainer: {
        backgroundColor: '#F5F6FA',
        flexDirection: 'row',
        width: wp(90),
        overflow: 'hidden',
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    label: {
        color: Colors.Black,
        fontFamily: Fonts.PlusJakartaSans_Bold,
        fontSize: RFPercentage(2),
    },
    address: {
        color: '#535151',
        fontFamily: Fonts.PlusJakartaSans_Regular,
        fontSize: RFPercentage(1.5),
    },
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: wp(20),
        height: hp(8),
        borderRadius: 5,
    },
})