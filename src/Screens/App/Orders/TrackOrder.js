import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { BASE_URL, googleMapKey } from '../../../utils/globalVariables';
import { Fonts, Icons } from '../../../constants';
import { io } from 'socket.io-client';


const TrackOrder = ({ route }) => {
  const [riderLocation, setRiderLocation] = useState({ latitude: null, longitude: null }); // State for rider's location
  const rider_id = route.params.item.riderData?.rider_id;
  const item = route.params.item
  const { Colors } = useSelector(store => store.store);



  useEffect(() => {
    const socket = io(BASE_URL);

    // Handle socket connection
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    // Emit the initial tracking request
    socket.emit("trackRiderLocation", { rider_id });

    // Listen for rider's real-time location updates
    socket.on("riderLocationUpdate", (data) => {
      setRiderLocation({ latitude: data.latitude, longitude: data.longitude });
      console.log("Real-time location:", { latitude: data.latitude, longitude: data.longitude });
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error("Socket error:", error.message);
    });

    // Emit `trackRiderLocation` periodically
    const interval = setInterval(() => {
      socket.emit("trackRiderLocation", { rider_id });
    }, 5000); // Emit every 5 seconds

    // Clean up on unmount
    return () => {
      clearInterval(interval);
      console.log("Cleaning up socket listeners...");
      socket.off("connect");
      socket.off("riderLocationUpdate");
      socket.off("error");
      socket.disconnect();
    };
  }, [rider_id]);

  const startLocation = { latitude: riderLocation.latitude || 33.651753086372594, longitude: riderLocation.longitude || 73.08297514915466 }; // Clifton Suspension Bridge
  const endLocation = { latitude: item?.locationData?.latitude, longitude: item?.locationData?.longitude }; // Temple Meads Station
  const [timeLeft, setTimeLeft] = useState(40 * 60); // 40 minutes in seconds

  useEffect(() => {
    // Start the timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer); // Clear the timer when it reaches 0
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  // Function to format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    map: {
      width: wp('100%'),
      // height: hp('50%'),
      flex: 1
  
    },
    detailsContainer: {
      padding: wp('5%'),
      backgroundColor: Colors.secondary_color,
      // flex: 1,
      borderTopLeftRadius: wp('5%'),
      borderTopRightRadius: wp('5%'),
      // marginTop: -hp('5%'),
    },
    routeInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: hp('2%'),
    },
    locationText: {
      fontSize: RFPercentage(2.2),
      fontWeight: 'bold',
    },
    deliveryInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: hp('2%'),
    },
    deliveryTime: {
      fontSize: RFPercentage(2.2),
      fontFamily: Fonts.PlusJakartaSans_SemiBold,
      color: Colors.primary_text
    },
    timer: {
      fontSize: RFPercentage(2.2),
      fontFamily: Fonts.PlusJakartaSans_Medium,
      color: Colors.primary_color,
      marginLeft: wp('2%'),
      textAlign: 'center'
  
    },
    progressBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: hp('1%'),
    },
    progressStep: {
      width: wp('14%'),
      height: wp('14%'),
      borderRadius: wp('10'),
      backgroundColor: Colors.button.primary_button,
      alignItems: 'center',
      justifyContent: 'center'
    },
    activeStep: {
      backgroundColor: Colors.primary_color,
    },
    progressLine: {
      width: wp('10%'),
      height: wp('1%'),
      backgroundColor: Colors.secondary_text,
    },
    activeLine: {
      backgroundColor: Colors.primary_color,
    },
    statusLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statusText: {
      fontSize: RFPercentage(1.8),
      color: Colors.secondary_text,
      fontFamily: Fonts.PlusJakartaSans_Medium,
      textAlign: 'center'
    },
    activeText: {
      color: Colors.primary_color,
    },
    overlayContainer: {
      position: 'absolute',
      top: hp('5%'),
      left: wp('5%'),
      width: wp('90%'),
      backgroundColor: 'white',
      borderRadius: wp('4%'),
      padding: wp('4%'),
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      zIndex: 2,
      flexDirection: 'row',
    },
    overlayCard: {
      alignItems: 'center',
      overflow: 'hidden',
      flex: 1
    },
    overlayText: {
      fontSize: RFPercentage(1.8),
      fontWeight: 'bold',
      color: Colors.primary_text,
      textAlign: 'center'
    },
    arrowText: {
      fontSize: RFPercentage(3),
      fontWeight: 'bold',
      color: Colors.primary_color,
    },
    arrowContainer: {
      position: 'absolute',
      bottom: -hp('5%'),
      left: wp('40%'),
      alignItems: 'center',
    },
    arrowImage: {
      width: wp('10%'),
      height: hp('5%'),
      resizeMode: 'contain',
    },
  });
  

  return (
    <View style={styles.container}>
      {/* Map Section */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: (startLocation.latitude + endLocation.latitude) / 2,
          longitude: (startLocation.longitude + endLocation.longitude) / 2,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}

      >
        {/* Route Directions */}
        <MapViewDirections
          origin={startLocation}
          destination={endLocation}
          apikey={googleMapKey}
          strokeWidth={4}
          strokeColor={Colors.primary_color}
        />
        {/* Start Location Marker */}
        <Marker coordinate={startLocation} title="Start Location" >
          <Icons.RiderMapMarker />

        </Marker>
        {/* End Location Marker */}
        <Marker coordinate={endLocation} title="Destination" >
          <Icons.MapMarker />

        </Marker>
      </MapView>
      <View style={styles.overlayContainer}>
        <View style={{ marginRight: wp(2), }} >
          <View style={{ height: hp(1.9), width: wp(4), borderColor: Colors.grayText, borderWidth: wp(0.4), borderRadius: wp(10) }} />
          <View style={{ height: hp(3), width: wp(0), borderRightColor: Colors.grayText, borderRightWidth: wp(0.4), alignSelf: 'center', borderStyle: 'dotted' }} />

          <Icons.MapPinActive />
        </View>
        <View style={styles.overlayCard}>
          <Text style={styles.overlayText} ellipsizeMode='middle' numberOfLines={1} >{item?.restaurantData?.location}</Text>
          <View style={{ backgroundColor: Colors.grayText, height: hp(0.1), width: '60%', marginVertical: hp(1) }} />
          <Text style={styles.overlayText}>{item?.locationData?.label}</Text>
        </View>
        {/* <View style={styles.arrowContainer}>
          <Image source={require('./path_to_arrow_image.png')} style={styles.arrowImage} />
        </View> */}
      </View>

      {/* Delivery Details */}
      <View style={styles.detailsContainer}>
        {/* Route Info */}

        {/* Delivery Timer and Status */}
        <View style={styles.deliveryInfo}>
          <Text style={styles.deliveryTime}>Deliver in</Text>
          <View style={{ flexDirection: 'row' }} >
            <Icons.ClockOrange />
            <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
          </View>

        </View>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          {/* <View style={[styles.progressStep, styles.activeStep]} /> */}
          {/* <View style={[styles.progressLine, styles.activeLine]} /> */}
          <View style={[styles.progressStep, styles.activeStep]} >
            <Icons.WhitebikeSvg />
          </View>

          <View style={styles.progressLine} />
          <View style={[styles.progressStep, { backgroundColor: Colors.secondary_text }]}>
            <Icons.Delivered />
          </View>
        </View>

        <View style={[styles.progressBar, { justifyContent: 'space-evenly' }]}>

          <Text style={[styles.statusText, styles.activeText]}>Out for Delivery</Text>
          <Text style={styles.statusText}>Delivered</Text>
        </View>
      </View>
    </View>
  );
};


export default TrackOrder;
