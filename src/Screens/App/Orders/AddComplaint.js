import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {Colors, Fonts, Icons, Images} from '../../../constants';
import StackHeader from '../../../components/Header/StackHeader';
import CInput from '../../../components/TextInput/CInput';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {
  chooseImageFromCamera,
  chooseVideoFromCamera,
  handlePopup,
  showAlert,
  uploadImage,
} from '../../../utils/helpers';
import Feather from 'react-native-vector-icons/Feather';
import CButton from '../../../components/Buttons/CButton';
import VideoPlayer from 'react-native-video-player';
import RBSheetSuccess from '../../../components/BottomSheet/RBSheetSuccess';
import Loader from '../../../components/Loader';
import api from '../../../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import PopUp from '../../../components/Popup/PopUp';

const AddComplaint = ({navigation, route}) => {
  const ref_RBSheet = useRef();
  const [complaint, setComplaint] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoName, setVideoName] = useState(null);
  const [videoType, setVideoType] = useState(null);
  const {customer_id,  showPopUp, popUpColor, PopUpMesage,} = useSelector(store => store.store)
  const dispatch = useDispatch()

  const [complaintFor, setComplaintFor] = useState('rider');
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([
    {
      id: 1,
      image: null,
    },
    {
      id: 2,
      image: null,
    },
    {
      id: 3,
      image: null,
    },
    {
      id: 4,
      image: null,
    },
    {
      id: 5,
      image: null,
    },
    {
      id: 5,
      image: null,
    },
  ]);

  const handleUploadImage = async item => {
    chooseImageFromCamera()
      .then(res => {
        if (res) {
          const newData = data.map(element => {
            if (element?.id == item?.id) {
              return {
                ...element,
                image: res,
              };
            } else {
              return {
                ...element,
              };
            }
          });
          setData(newData);
        }
      })
      .catch(err => {
        console.log('error :::: ', err);
      });
  };

  const handleUploadVideo = async item => {
    chooseVideoFromCamera()
      .then(res => {
        if (res) {
          console.log('res  : :', res);
          setVideoFile(res?.path);
          setVideoName(res?.name);
          setVideoType(res?.mime);
          // const newData = data.map(element => {
          //   if (element?.id == item?.id) {
          //     return {
          //       ...element,
          //       image: res,
          //     };
          //   } else {
          //     return {
          //       ...element,
          //     };
          //   }
          // });
          // setData(newData);
        }
      })
      .catch(err => {
        console.log('error :::: ', err);
      });
  };

  //upload video to server
  const handleUploadVideoToServer = () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (videoFile) {
          let image = {
            uri: videoFile,
            name: videoName,
            type: videoType,
          };
          console.log('video  :  ', image);
          let filePath = await uploadImage(image);
          resolve([filePath]);
        } else {
          resolve([]);
        }
      } catch (error) {
        console.log('error handleUploadImages :  ', error);
        resolve([]);
      }
    });
  };

  //upload images to server
  const handleUploadImagesToServer = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const imagesList = data?.filter(item => item.image != null);
        if (imagesList?.length > 0) {
          let pathList = [];
          for (const item of imagesList) {
            let image = {
              uri: item?.image?.path,
              name: item?.image?.name,
              type: item?.image?.mime,
            };
            // console.log('image  :  ', image);
            let filePath = await uploadImage(image);
            if (filePath) {
              pathList.push(filePath);
            }
          }
          resolve(pathList);
        } else {
          resolve([]);
        }
      } catch (error) {
        console.log('error handleUploadImages :  ', error);
        resolve([]);
      }
    });
  };

  const validate = () => {
    if (complaint?.length == 0) {
      handlePopup(dispatch,'Please enter complaint','red');
      return false;
    } else {
      return true;
    }
  };
  const handleAddComplaint = async () => {
    // ref_RBSheet?.current?.open();
    if (validate()) {
      setLoading(true);
      let images = await handleUploadImagesToServer();
      let videoPath = await handleUploadVideoToServer();
      // let customer_id = await AsyncStorage.getItem('customer_id');
      let data = {
        customer_id: customer_id,
        order_id: route?.params?.id,
        complaint_text: complaint,
        complaint_for: complaintFor,
      };
      if (images?.length > 0) {
        data.images = images;
      }
      if (videoPath?.length > 0) {
        data.video = videoPath;
      }

      console.log('data  : ', data);

      fetch(api.add_complaint, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
        .then(response => response.json())
        .then(async response => {
          console.log('response  :  ', response);
          if (response?.error == false) {
            ref_RBSheet?.current?.open();
          } else {
            handlePopup(dispatch, response?.message, 'red');
          }
        })
        .catch(err => {
          console.log('Error in Login :  ', err);
          handlePopup(dispatch, 'Something went worng', 'red');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.secondary_color}}>
      {/* <Loader loading={loading} /> */}
      {showPopUp && <PopUp color={popUpColor} message={PopUpMesage} />}
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <StackHeader title="Add Complaint" />

        <CInput
          placeholder="Enter Complaint"
          multiline={true}
          numberOfLines={7}
          textAlignVertical="top"
          width={wp(87)}
          value={complaint}
          onChangeText={text => setComplaint(text)}
        />

        <View
          style={{
            marginHorizontal: wp(8),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: Colors.primary_text,
                fontFamily: Fonts.PlusJakartaSans_Medium,
                fontSize: RFPercentage(2),
              }}>
              Add Images
            </Text>
            <Text
              style={{
                color:Colors.secondary_text,
                fontFamily: Fonts.PlusJakartaSans_Regular,
                fontSize: RFPercentage(1.7),
              }}>
              {' '}
              (optional)
            </Text>
          </View>
          <Text
            style={{
              color:Colors.secondary_text,
              fontFamily: Fonts.PlusJakartaSans_Regular,
              fontSize: RFPercentage(1.8),
              marginTop: 7,
              marginBottom: 15,
            }}>
            You can add maximum 5 images
          </Text>

          <View>
            <FlatList
              scrollEnabled={false}
              data={data}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: 'space-between',
              }}
              ItemSeparatorComponent={() => <View style={{height: 15}} />}
              renderItem={({item, index}) => {
                return (
                  <>
                    {index + 1 == data.length ? (
                      <TouchableOpacity
                        style={{
                          ...styles.imageContainer,
                          borderWidth: 0,
                        }}></TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => handleUploadImage(item)}
                        style={styles.imageContainer}>
                        {item?.image?.path ? (
                          <Image
                            source={{uri: item?.image?.path}}
                            style={styles.image}
                          />
                        ) : (
                          <Icons.UploadImage />
                        )}
                      </TouchableOpacity>
                    )}
                  </>
                );
              }}
            />
          </View>

          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 15,
            }}>
            <Text
              style={{
                color: Colors.primary_text,
                fontFamily: Fonts.PlusJakartaSans_Medium,
                fontSize: RFPercentage(2),
              }}>
              Add Video
            </Text>
            <Text
              style={{
                color:Colors.secondary_text,
                fontFamily: Fonts.PlusJakartaSans_Regular,
                fontSize: RFPercentage(1.7),
              }}>
              {' '}
              (optional)
            </Text>
          </View> */}

          <View style={{marginVertical: 15}}>
            <Text
              style={{
                color: Colors.primary_text,
                fontFamily: Fonts.PlusJakartaSans_Medium,
                fontSize: RFPercentage(2),
                marginBottom: 10,
              }}>
              Complaint For :{' '}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: wp(70),
              }}>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setComplaintFor('rider')}>
                {complaintFor == 'rider' ? (
                  <Icons.Check width={20} />
                ) : (
                  <Icons.UncheckCircle width={20} />
                )}
                <Text style={styles.radioButtonText}>Rider</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setComplaintFor('restaurant')}>
                {complaintFor == 'restaurant' ? (
                  <Icons.Check width={20} />
                ) : (
                  <Icons.UncheckCircle width={20} />
                )}
                <Text style={styles.radioButtonText}>Restaurant</Text>
              </TouchableOpacity>
            </View>
          </View>

         

          <CButton
            title="ADD"
            width={wp(82)}
            loading={loading}
            onPress={() => {
              handleAddComplaint();
            }}
          />

          <View style={{height: 15}} />
          <RBSheetSuccess
            refRBSheet={ref_RBSheet}
            title={'Complaint Added Successfully'}
            btnText={'OK'}
            onPress={() => {
              ref_RBSheet?.current?.close();
              navigation?.goBack();
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AddComplaint;

const styles = StyleSheet.create({
  imageContainer: {
    width: '28%',
    height: hp(9.5),
    borderWidth: 1,
    borderColor: Colors.borderGray,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
 

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  rowViewSB: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  imageContainer1: {
    width: '30%',
    height: hp(11),
    borderWidth: 1,
    borderColor: Colors.borderGray,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 15,
  },

  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonText: {
    marginLeft: 10,
    color: Colors.primary_text,
    fontSize: 14,
    fontFamily: Fonts.PlusJakartaSans_Regular,
  },
});
