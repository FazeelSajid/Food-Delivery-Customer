import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFPercentage} from 'react-native-responsive-fontsize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors, Fonts, Icons} from '../../constants';
import CButton from '../../components/Buttons/CButton';
const UpdateLocation = ({navigation}) => {
  const [searchHide, setSearchHide] = useState(true);
  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <StatusBar
          backgroundColor={'transparent'}
          translucent
          barStyle={'dark-content'}
        />
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => (searchHide ? '' : setSearchHide('true'))}>
            <TouchableOpacity
              onPress={() => navigation?.goBack()}
              style={styles.iconContainer}>
              {/* {searchHide ? (
                <AntDesign
                  name={searchHide ? 'close' : 'left'}
                  size={hp(2.5)}
                  color="#FF5722"
                />
              ) : ( */}
              <Ionicons
                name={'chevron-back'}
                size={hp(3)}
                color={Colors.Orange}
              />
              {/* )} */}
            </TouchableOpacity>
          </TouchableOpacity>

          {/* {searchHide ? (
            <TouchableOpacity onPress={() => setSearchHide(false)}>
              <View style={styles.iconContainer}>
                <AntDesign name="search1" size={hp(2.5)} color="#FF5722" />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={{...styles.inputIcon}}>
              <View style={{...styles.iconContainer, marginHorizontal: wp(0)}}>
                <AntDesign name="search1" size={hp(2.5)} color="#898A8D" />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  color="#212121"
                  placeholder="Search"
                  placeholderTextColor={'#898A8D'}
                  // onChangeText={text => setFullName(text)}
                  // value={fullName}
                />
              </View>
            </View>
          )} */}
        </View>
        <MapView
          // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          <Marker
            draggable
            coordinate={{
              latitude: 37.78825,
              longitude: -122.4324,
            }}
            // description={'This is a marker in React Natve'}
          >
            <Icons.MapMarker />
          </Marker>
        </MapView>
        {/* <View
          style={{
            left: '50%',
            marginLeft: -7,
            marginTop: -7,
            position: 'absolute',
            top: '50%',
          }}>
          <Icons.MapMarker />
        </View> */}
        {/* <View style={styles.selectLocationContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 15,
            }}>
            <Icons.Location />
            <View style={styles.textsContainer}>
              <Text style={styles.mainText}>Morem ipsum dolor sit amet, </Text>
              <Text style={styles.descriptionText}>
                Morem ipsum dolor sit amet, consectetur elit
              </Text>
            </View>
          </View>
          <View style={{flex: 1}}>
            <TouchableOpacity
              onPress={() => {
                // navigation.replace('Drawer');
                navigation?.goBack();
              }}>
              <View
                style={{...styles.buttonContainer, backgroundColor: '#FF5722'}}>
                <Text style={styles.buttonText}>Update Location</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View> */}

        <View style={{position: 'absolute', bottom: 40, left: 0, right: 0}}>
          <CButton
            title="Add"
            width={wp(84)}
            onPress={() => {
              navigation?.goBack();
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  bodyContainer: {
    flex: 1,
  },
  selectLocationContainer: {
    height: hp(29),
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: wp(8),
    borderTopLeftRadius: wp(8),
    position: 'absolute',
    // top: hp(73),
    bottom: 0,
  },

  mapContainer: {
    height: '70%',
    width: '90%',
    margin: wp(5),
    borderRadius: wp(5),
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  textsContainer: {
    height: hp(20),
    width: wp(85),
    marginLeft: wp(5),
    justifyContent: 'center',
  },
  mainText: {
    color: '#000000',
    fontFamily: Fonts.Inter_SemiBold,
    fontSize: RFPercentage(2.5),
    lineHeight: 40,
  },
  descriptionText: {
    color: '#000000',
    fontSize: RFPercentage(1.6),
    fontFamily: 'PlusJakartaSans-Regular',
    //textAlign: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: RFPercentage(2),
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  buttonContainer: {
    height: hp(6.5),
    justifyContent: 'center',
    alignSelf: 'center',
    width: wp(90),
    borderRadius: hp(10),
    //  borderWidth:1
  },
  headerContainer: {
    height: hp(15),
    //  borderWidth:1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 1,
  },
  iconContainer: {
    width: wp(11),
    height: wp(11),
    borderRadius: hp(50),
    // backgroundColor: '#FFFFFF',
    marginHorizontal: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',

    height: wp(11),
    //borderRadius:hp(50),

    // justifyContent:"center",
    backgroundColor: '#FFFFFF',
    //alignItems:"center",
    //borderWidth:1
  },
  input: {
    height: hp(6),
  },
  inputIcon: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    width: wp(75),
    height: wp(11),
    marginRight: wp(5),
    // justifyContent:"center",
    // alignSelf:"center",
    // width:wp(83),
    borderRadius: hp(10),
  },
});

export default UpdateLocation;
