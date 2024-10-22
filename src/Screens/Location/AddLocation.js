import React from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFPercentage} from 'react-native-responsive-fontsize';

const AddLocation = props => {
  return (
    <View style={styles.container}>
      <View style={styles.addLocationContainer}>
        <View style={styles.mapContainer}>
          {/* <MapView
                   // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    region={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                    >
                </MapView> */}
        </View>
        <View style={styles.textContainer}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('SelectLocation');
            }}>
            <Text style={styles.addLocationText}>+Add Your Location</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  addLocationContainer: {
    height: hp(35),
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: wp(8),
    borderTopLeftRadius: wp(8),
    // justifyContent:"space-evenly",
    // alignItems:"center",
    //  borderWidth:1
  },
  addLocationText: {
    color: '#FF5722',
    fontSize: RFPercentage(1.8),
    fontFamily: 'PlusJakartaSans-Regular',
    fontWeight: 'bold',
    //textAlign: 'center',
  },
  mapContainer: {
    height: '70%',
    width: '90%',
    margin: wp(5),
    borderRadius: wp(5),
    borderWidth: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  textContainer: {
    //height:"60%",
    width: '90%',
    marginHorizontal: wp(5),
  },
});

export default AddLocation;
