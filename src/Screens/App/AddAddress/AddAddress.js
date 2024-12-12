import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import StackHeader from '../../../components/Header/StackHeader'
import CInput from '../../../components/TextInput/CInput'
import { Colors, Fonts } from '../../../constants'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CustomButton from '../../../components/Buttons/customButton'
import { showAlert } from '../../../utils/helpers'
import api from '../../../constants/api'
import { useSelector } from 'react-redux'
import CButton from '../../../components/Buttons/CButton'

const AddAddress = ({route, navigation}) => {
//     const {address} = route.params
//     console.log(address);
//     let addressArray = address.split(',');

// // Store each part in separate variables
// let part1 = addressArray[0].trim(); // "Shamas Abad"
// let part2 = addressArray[1].trim(); // "Muree Road"
// let part3 = addressArray[2].trim(); // "M32J+GCP"
// let part4 = addressArray[3].trim(); // "Farooq-e-Azam Rd"
// let part5 = addressArray[4].trim(); // "Shamsabad"
// let part6 = addressArray[5].trim(); // "Rawalpindi"
// let part7 = addressArray[6].trim(); // "Punjab"
// let part8 = addressArray[7].trim(); //
// console.log(part1);  // Shamas Abad
// console.log(part2);  // Muree Road
// console.log(part3);  // M32J+GCP
// console.log(part4);  // Farooq-e-Azam Rd
// console.log(part5);  // Shamsabad
// console.log(part6);  // Rawalpindi
// console.log(part7);  // Punjab
// console.log(part8);  // Pakistan
    
    const [label, setLabel] = useState()
    const [streetNumber, setStreetNumber] = useState()
    const [houseNumber, setHouseNumber] = useState()
    const [floor, setFloor] = useState()
    const [area, setArea] = useState()
    const [addresss, setAddress] = useState()
    const [Instructions, setInstructions] = useState()
    const customer_id = useSelector(store => store.store.customer_id)
    const [isLoading, setIsLoading] = useState(false)
    const [formErrors, setFormErrors] = useState({});




    const validate = () => {
        let errors = {};

        if (!label || label.trim().length === 0) {
            errors.label = 'Label is required';
        }

        if (!streetNumber || streetNumber.trim().length === 0) {
            errors.streetNumber = 'Street Number is required';
        }

        if (!houseNumber || houseNumber.trim().length === 0) {
            errors.houseNumber = 'House Number is required';
        }

        if (!floor || floor.trim().length === 0) {
            errors.floor = 'Floor is required';
        }

        if (!area || area.trim().length === 0) {
            errors.area = 'Region is required';
        }

        // Set form errors if any exist
        setFormErrors(errors);

        // Return true if no errors, otherwise false
        return Object.keys(errors).length === 0;
    };


const clearFields = () => {
    setAddress('')
    setArea('')
    setFloor('')
    setInstructions('')
    setHouseNumber('')
    setLabel('')
    setStreetNumber('')
    setFormErrors({})
}
    const handleSubmit = () => {
        if (validate()) {
            setIsLoading(true)
            const data = {
                house_number: houseNumber,
                street_number: streetNumber,
                area: area,
                floor: floor,
                instructions: Instructions,
                customer_id: customer_id,
                label: label,
                address: addresss
            }
            fetch(api.add_location, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(async response => {
                    console.log(response);

                    if (response.status === false) {
                        showAlert(response.message)
                        return;

                    }else {
                    showAlert('Address added successfully', 'green');
                    clearFields()
                    

                    }
                })
                .catch(err => {
                    console.log('Error in Login :  ', err);
                    showAlert('Something went wrong!');
                  })
                  .finally(() => {
                    setIsLoading(false);
                  });
        }
    }

    return (
        <ScrollView style={styles.container} >
            <StackHeader title={'Add Address'} headerStyle={{ marginBottom: hp(2) }} />

            <View style={{ flex: 1 }} >
                <CInput
                    placeholder="Label (Home, Office, Apartment etc)"
                    value={label}
                    onChangeText={text => setLabel(text)}
                    containerStyle={formErrors.label && { marginBottom: hp(0.5) }}
                />
                {
                    formErrors.label && (
                        <Text style={styles.errorText}>{formErrors.label}</Text>
                    )
                }

                <CInput
                    placeholder="Street Number"
                    value={streetNumber}
                    onChangeText={text => setStreetNumber(text)}
                    containerStyle={formErrors.streetNumber && { marginBottom: hp(0.5) }}
                />
                {
                    formErrors.streetNumber && (
                        <Text style={styles.errorText}>{formErrors.streetNumber}</Text>
                    )
                }
                <CInput
                    placeholder="Building, House Number"
                    value={houseNumber}
                    onChangeText={text => setHouseNumber(text)}
                    containerStyle={formErrors.houseNumber && { marginBottom: hp(0.5) }}
                />
                {
                    formErrors.houseNumber && (
                        <Text style={styles.errorText}>{formErrors.houseNumber}</Text>
                    )
                }
                <CInput
                    placeholder="Flat, Floor,Apt, Unit Number etc"
                    value={floor}
                    onChangeText={text => setFloor(text)}
                    containerStyle={formErrors.floor && { marginBottom: hp(0.5) }}
                />
                {
                    formErrors.floor && (
                        <Text style={styles.errorText}>{formErrors.floor}</Text>
                    )
                }
                <CInput
                    placeholder="Area"
                    value={area}
                    onChangeText={text => setArea(text)}
                    containerStyle={formErrors.area && { marginBottom: hp(0.5) }}
                />
                {
                    formErrors.area && (
                        <Text style={styles.errorText}>{formErrors.area}</Text>
                    )
                }
                <CInput
                    placeholder="Address (Optional)"
                    value={addresss}
                    onChangeText={text => setAddress(text)}
                    containerStyle={{ marginTop: hp(1) }}
                />
                <CInput
                    placeholder="Instructions (Optional)"
                    value={Instructions}
                    onChangeText={text => setInstructions(text)}
                    containerStyle={{ marginTop: hp(1) }}
                />
            </View>

            <View style={{ flex: 0.15 }} >
            <CButton
            title="Add Address"
            height={hp(6.2)}
            marginTop={hp(5)}
            width={wp(88)}
            onPress={() => handleSubmit()
            }
            loading={isLoading}
          />
                {/* <CustomButton
                    text={'Add Address'}
                    textStyle={styles.continueButtonText}
                    containerStyle={styles.continueButtonContainer}
                    onPress={handleSubmit}
                    pressedRadius={wp(6)}
                /> */}
            </View>

        </ScrollView>
    )
}

export default AddAddress

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White
    },
    continueButtonText: {
        alignSelf: 'center',
        color: Colors.White,
        fontFamily: Fonts.medium,
        fontSize: wp(4),
    },
    continueButtonContainer: {
        backgroundColor: Colors.primary_color,
        paddingVertical: wp(3),
        borderRadius: wp(6),
        marginHorizontal: wp(10),
        // bottom: 0

    },
    errorText: {
        color: 'red',
        fontSize: wp(3.5),
        marginBottom: hp(1),
        marginLeft: wp(8)
    },
})