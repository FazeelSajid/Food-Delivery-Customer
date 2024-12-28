import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoding';  // Import Geocoder for reverse geocoding
import { googleMapKey } from '../../../utils/globalVariables';
import { Fonts } from '../../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import CRBSheetComponent from '../../../components/BottomSheet/CRBSheetComponent';
import { getCurrentLocation } from '../../../utils/helpers/location';
import CInput from '../../../components/TextInput/CInput';
import CButton from '../../../components/Buttons/CButton';
import { useSelector } from 'react-redux';
import api from '../../../constants/api';
import { handlePopup, showAlert } from '../../../utils/helpers';
import { setLocation } from '../../../redux/AuthSlice';
import { useDispatch } from 'react-redux';
import PopUp from '../../../components/Popup/PopUp';
navigator.geolocation = require('@react-native-community/geolocation');
const Map = ({navigation}) => {
    const dispatch = useDispatch();

    const [region, setRegion] = useState({
        latitude: 33.6520751,
        longitude: 73.0816881,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
    });


  

    const [selectedLocation, setSelectedLocation] = useState(null); // For holding marker position
    const mapRef = useRef(null); // Reference to the map
    const [label, setLabel] = useState()
    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false)
    const {customer_id, showPopUp, popUpColor, PopUpMesage, restautantDetails, Colors} = useSelector(store => store.store)

    
 

    // Function to get distance in meters and duration in seconds between two points
    const getDistanceAndDuration = async (originLat, originLng, destinationLat, destinationLng) => {
        try {
          const origin = `${originLat},${originLng}`;
          const destination = `${destinationLat},${destinationLng}`;
          const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${googleMapKey}`;
          
          const response = await fetch(url);
          const data = await response.json();
      
          // Check if the response contains valid data
          if (data.rows && data.rows[0].elements[0].status === 'OK') {
            const distance = data.rows[0].elements[0].distance.text;
            const duration = data.rows[0].elements[0].duration.text;
            return { distance, duration };
          } else {
            throw new Error('Invalid response from API');
          }
        } catch (error) {
          console.error('Error fetching distance data:', error);
          return null; // or handle error based on your app logic
        }
      };
useEffect(()=>{
    getCurrentLocatin()
},[])
    const btmSheetRef = useRef()
    const showBtmSheet = () => {
        btmSheetRef?.current?.open()
    }
    const closeBtmSheet = () => {
        btmSheetRef?.current?.close()
        clearFields()
    }
    const getCurrentLocatin = async () => {
        const { latitude, longitude, address, shortAddress : shortAdress } = await getCurrentLocation()

        setRegion({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
        });

        mapRef.current.animateToRegion({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
        });

        dispatch(setLocation({
            latitude: latitude,
            longitude: longitude,
            address: address,
            shortAddress : shortAdress
        }))

        setSelectedLocation({
            latitude: latitude,
            longitude: longitude,
            address: address,
            shortAddress : shortAdress
        });
    }


    // Initialize the Geocoder with your Google Maps API Key
    Geocoder.init(googleMapKey); // Replace with your API key

    // Function to reverse geocode coordinates to get full address
    const getAddressFromCoordinates = async (lat, lng) => {
        try {
            const json = await Geocoder.from(lat, lng);

            const addressComponent = json.results[0].formatted_address;
            return addressComponent;
        } catch (error) {
            console.error('Error fetching address:', error);
            return 'Address not found';
        }
    };

    const extractEnglishWords = (text) => {
        let words = text.match(/[A-Za-z]+/g) || [];
        return words.join(' ')
      };

    // Function to handle taps on the map and get lat/lng
    const handleMapPress = async (event) => {
        // console.log('mappressed');

        const { latitude, longitude } = event.nativeEvent.coordinate;
        const { name} = event.nativeEvent;

        const namee = extractEnglishWords(name)

        // Get the address using reverse geocoding
        const address = await getAddressFromCoordinates(latitude, longitude);

        setSelectedLocation({
            latitude: latitude,
            longitude: longitude,
            address: address,
            name: namee
        });
        setLabel(namee);

        showBtmSheet()
    };

    // Function to handle place search and get lat/lng
    const handlePlaceSelect = async (data, details = null) => {
        const { lat, lng } = details.geometry.location;
        // console.log(details.formatted_address);
        console.log(data);
        

        

        // Get the address using reverse geocoding
        const address = details.formatted_address
        const name= details.name
        console.log(name, 'name');
        

        setRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
        });

        // Move the map to the selected location
        mapRef.current.animateToRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
        });

        // Set the selected location for the marker
        setSelectedLocation({
            latitude: lat,
            longitude: lng,
            address: address,
            name: name
        });

      
        showBtmSheet()
    };

    const clearFields = () => {
        setLabel('')
    }


    const validate = () => {
        let errors = {};

        if (!selectedLocation?.name || selectedLocation?.name.trim().length === 0) {
            errors.label = 'Label is required';
        }

        // Set form errors if any exist
        setFormErrors(errors);

        // Return true if no errors, otherwise false
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async() => {
       const distance = await getDistanceAndDuration(selectedLocation?.latitude ,selectedLocation?.longitude, restautantDetails?.latitude, restautantDetails?.longitude,)
        .then(result => {
          if (result) {
            console.log(result.distance, 'location result');
            
            return result
        } else { 
            console.log('Failed to retrieve distance and duration');
          }
        });
        if (validate()) {
            setIsLoading(true)
            const data = {
                house_number: '',
                street_number: '',
                area: '',
                floor: '',
                instructions: '',
                customer_id: customer_id,
                label: selectedLocation?.name,
                address: selectedLocation?.address,
                longitude: selectedLocation?.longitude,
                latitude: selectedLocation?.latitude,
                distance: distance.distance
            }
            console.log(data, 'data');

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
                        handlePopup(dispatch, response.message, 'red')
                        return;

                    } else {
                        handlePopup(dispatch, 'Address added successfully', 'green');
                        clearFields()
                        navigation.navigate('ManageAddress')
                        closeBtmSheet()
                        dispatch(setLocation({
                            latitude:selectedLocation?.latitude,
                            longitude:selectedLocation?.longitude,
                            address:  selectedLocation?.address,
                            shortAddress : selectedLocation?.shortAddress,
                            id : response?.result?.location_id
                        }))

                       
                        


                    }
                })
                .catch(err => {
                    console.log('Error in Login :  ', err);
                    handlePopup(dispatch, 'Something went wrong!', 'red');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }

    const styles = StyleSheet.create({
        map: {
            ...StyleSheet.absoluteFillObject,
        },
        title: {
            fontSize: 18,
            textAlign: 'center',
            marginVertical: 10,
        },
        rbSheetHeading: {
            color: Colors.primary_text,
            fontFamily: Fonts.PlusJakartaSans_Bold,
            fontSize: RFPercentage(2),
        },
        rowViewSB1: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            paddingHorizontal: 10,
        },
        rowView: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        currentLocationButton: {
            position: 'absolute',
            bottom: 80,
            right: 20,
            backgroundColor: Colors.primary_color,
            borderRadius: 50,
            padding: 8,
        },
        errorText: {
            color: 'red',
            fontSize: wp(3.5),
            marginBottom: hp(1),
            marginLeft: wp(3)
        },
    });
    
    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.title}>Map with Address Selection</Text>
            {showPopUp && <PopUp color={popUpColor} message={PopUpMesage} />}

            {/* Google Places Search Input */}
            <GooglePlacesAutocomplete
                placeholder="Search for a place"
                minLength={2}
                fetchDetails={true}
                onPress={handlePlaceSelect}
                query={{
                    key: googleMapKey, // Replace with your API key
                    language: 'en',
                }}
                styles={{
                    container: {
                        position: 'absolute',
                        width: '100%',
                        zIndex: 1,
                        alignItems: 'center'
                    },
                    listView: {
                        // backgroundColor: 'black',
                        width: wp(90),
                        // borderRadius: 10

                    },
                    textInput: {
                        color: 'black',
                        borderRadius: wp(10),
                        backgroundColor: Colors.secondary_color,
                        paddingLeft: wp(5),
                        fontFamily: Fonts.PlusJakartaSans_Regular
                    },
                    textInputContainer: {
                        marginTop: hp(3),
                        width: wp(90),
                        alignSelf: 'center'
                    },
                    row:{
                        width: wp(90),
                    },
                    description:{
                        color: 'black',
                        fontFamily: Fonts.PlusJakartaSans_Regular
                    },
                    poweredContainer: {
                        // borderRadius: 5
                    }

                }}
                multiline={true}
                numberOfLines={2}
                placeholderTextColor={'black'}
                debounce={200}
                textInputProps={{
                    placeholderTextColor: Colors.secondary_text
                }}
               
            />

            {/* Google Map */}
            
            <MapView
                ref={mapRef}
                style={styles.map}
                region={region? region : {}}
                onPress={handleMapPress}  // Handle map taps to get lat/lng and address
                onPoiClick={handleMapPress}
            >
                {/* Marker for the selected location */}
                {selectedLocation && (
                    <Marker
                        coordinate={{
                            latitude: selectedLocation.latitude,
                            longitude: selectedLocation.longitude,
                        }}
                        title={selectedLocation.address || "Selected Location"}
                        description={`Latitude: ${selectedLocation.latitude}\nLongitude: ${selectedLocation.longitude}`}
                    />
                )}
            </MapView>

            <TouchableOpacity style={styles.currentLocationButton} onPress={getCurrentLocatin}>
                <MaterialIcons name="my-location" size={20} color="white" />
            </TouchableOpacity>

            <CRBSheetComponent
                height={300}
                refRBSheet={btmSheetRef}
                content={
                    <View style={{ width: wp(90) }} >
                        <View style={styles.rowViewSB1}>
                            <Text style={styles.rbSheetHeading}>Add Location</Text>
                            <TouchableOpacity
                                onPress={() => closeBtmSheet()}>
                                <Ionicons name={'close'} size={22} color={Colors.icon} />
                            </TouchableOpacity>
                        </View>
                        <CInput
                            placeholder="Label"
                            value={selectedLocation?.name}
                            onChangeText={text => setSelectedLocation({...selectedLocation, name: text})}
                            containerStyle={formErrors.label && { marginBottom: hp(0.5) }}
                        />
                        {
                            formErrors.label && (
                                <Text style={styles.errorText}>{formErrors.label}</Text>
                            )
                        }

                        <CInput
                            placeholder="Address"
                            value={selectedLocation?.address}
                            onChangeText={text => setSelectedLocation({...selectedLocation, address: text})}
                            containerStyle={{ marginTop: hp(1) }}
                        />

                        <CButton
                            title="Add Address"
                            height={hp(6.2)}
                            marginTop={hp(2)}
                            width={wp(88)}
                            onPress={() => handleSubmit()
                            }
                            loading={isLoading}
                        />



                    </View>
                }

            />
        </View>
    );
};

export default Map;
