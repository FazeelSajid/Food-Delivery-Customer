import React from 'react';
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
import { googleMapKey } from '../../../utils/globalVariables';
import { Colors } from '../../../constants';
import MapPinActive from '../../../Assets/svg/MapPinActive.svg';
import MapMarker from '../../../Assets/svg/mapMarker.svg';
import RiderMapMarker from '../../../Assets/svg/RiderMapMarker.svg';


const TrackOrder = () => {
  // Dummy coordinates for locations
  const startLocation = { latitude: 51.454513, longitude: -2.627609 }; // Clifton Suspension Bridge
  const endLocation = { latitude: 51.44982, longitude: -2.58194 }; // Temple Meads Station

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
          strokeColor={Colors.Orange}
        />
        {/* Start Location Marker */}
        <Marker coordinate={startLocation} title="Start Location" >
            <MapMarker  />
        </Marker>
        {/* End Location Marker */}
        <Marker coordinate={endLocation} title="Destination" >
            <RiderMapMarker/>
        </Marker>
      </MapView>
      <View style={styles.overlayContainer}>
        <View style={{marginRight: wp(2),}} >
            <View  style={{height: hp(1.9), width: wp(4), borderColor: Colors.grayText, borderWidth: wp(0.4),borderRadius: wp(10)}} />
            <View  style={{height: hp(3), width: wp(0), borderRightColor: Colors.grayText, borderRightWidth: wp(0.4), alignSelf: 'center', borderStyle:'dotted'}} />

            <MapPinActive/>
        </View>
        <View style={styles.overlayCard}>
          <Text style={styles.overlayText}>Clifton Suspension Bridge</Text>
          <View style={{backgroundColor: Colors.grayText, height: hp(0.1), width: '60%', marginVertical: hp(1)}} />
          <Text style={styles.overlayText}>Temple Meads Train Station</Text>
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
          <Text style={styles.timer}>29:45</Text>
        </View>

        {/* Progress Bar */}
        {/* <View style={styles.progressBar}>
          <View style={[styles.progressStep, styles.activeStep]} />
          <View style={[styles.progressLine, styles.activeLine]} />
          <View style={[styles.progressStep, styles.activeStep]} />
          <View style={styles.progressLine} />
          <View style={styles.progressStep} />
        </View>

        <View style={styles.statusLabels}>
          
          <Text style={[styles.statusText, styles.activeText]}>Out for Delivery</Text>
          <Text style={styles.statusText}>Delivered</Text>
        </View> */}
      </View>
    </View>
  );
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
    backgroundColor: Colors.White,
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
    fontWeight: '600',
  },
  timer: {
    fontSize: RFPercentage(2.5),
    fontWeight: 'bold',
    color: Colors.Orange,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp('2%'),
  },
  progressStep: {
    width: wp('5%'),
    height: wp('5%'),
    borderRadius: wp('2.5%'),
    backgroundColor: '#ccc',
  },
  activeStep: {
    backgroundColor: Colors.Orange,
  },
  progressLine: {
    width: wp('10%'),
    height: wp('1%'),
    backgroundColor: '#ccc',
  },
  activeLine: {
    backgroundColor: Colors.Orange,
  },
  statusLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: RFPercentage(1.8),
    color: '#aaa',
  },
  activeText: {
    color: Colors.Orange,
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
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    // backgroundColor: Colors.Black,
    flex: 1
  },
  overlayText: {
    fontSize: RFPercentage(2),
    fontWeight: 'bold',
    color: Colors.darkTextColor,
  },
  arrowText: {
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
    color: Colors.Orange,
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

export default TrackOrder;
