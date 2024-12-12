import React, { useState, useRef } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './Styles';
import CustomButton from '../../../components/Buttons/customButton';
import Onbording1 from '../../../Assets/svg/Onboarding1.svg';
import Onbording2 from '../../../Assets/svg/Onboarding2.svg';
import Onbording3 from '../../../Assets/svg/Onboarding3.svg';
import ChevronRightOrange from '../../../Assets/svg/ChevronRightOrange.svg';
import Svg from '../../../Assets/svg/svg';
import PagerView from 'react-native-pager-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Colors, Fonts } from '../../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { setJoinAsGuest, setSignUpWith } from '../../../redux/AuthSlice';
import CRBSheetComponent from '../../../components/BottomSheet/CRBSheetComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RadioButton } from 'react-native-paper';
import { RFPercentage } from 'react-native-responsive-fontsize';
import CButton from '../../../components/Buttons/CButton';

const Onboarding = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState(0); // Track the current page index
  const pagerRef = useRef(null); // Ref to control pager
  const dispatch = useDispatch()
  const { signUpWith } = useSelector(store => store.store)

  const btmSheetRef = useRef()

  const showBtmSheet = () => {
    btmSheetRef?.current?.open()
  }
  const closeBtmSheet = () => {
    btmSheetRef?.current?.close()
  }

  const toggleSelection = (param) => {
    if (param === 'phone'){
      signUpWith === param ? dispatch(setSignUpWith('')) : dispatch(setSignUpWith(param))
      navigation.navigate('SignUpWithPhone')
      closeBtmSheet()
    }
    if (param === 'email'){
      signUpWith === 'email' ? dispatch(setSignUpWith('')) : dispatch(setSignUpWith(param))
      navigation.navigate('SignUpWithEmail')
      closeBtmSheet()
    }
  }

  const ItemSeparator = () => (
    <View
      style={{
        height: hp(0.1),
        marginVertical: 10,
        backgroundColor: Colors.borderGray,
      }}
    />
  );


  const pages = [
    {
      image: <Onbording1 width={wp(80)} height={hp(35)} />,
      heading: `Food Delivery!${`\n`} your meal at your doorstep`,
      subHeading: `Deals, cuisines, and your perfect meal ${`\n`} just a tap away, delivered!`
    },
    {
      image: <Onbording2 width={wp(100)} height={hp(35)} />,
      heading: `Customize Your Delivery - ${`\n`} Food at Your Doorstep`,
      subHeading: `Enter your location or share your live location to ${`\n`} get your food delivered straight to your door`,
    },
    {
      image: <Onbording3 width={wp(75)} height={hp(35)} />,
      heading: `Secure Payments & Seamless ${`\n`} Amount Transactions`,
      subHeading: `Enjoy secure, hassle-free payments with our ${`\n`} wallet—we'll take care of the rest.`,
    },
  ];

  const handleContinue = () => {
    // Move to the next page if there is a next page, else navigate to 'CreateAcc'
    if (currentPage < pages.length - 1) {
      pagerRef.current.setPage(currentPage + 1); // Navigate via PagerView
    } else {
      navigation.navigate('SignIn')
    }
  };

  const lastPage = currentPage === pages.length - 1
  const firstPage = currentPage === 0;


  const onPageSelected = (e) => {
    // Update the page when the user swipes
    setCurrentPage(e.nativeEvent.position);

  };

  const renderPaginationDots = () => {
    return (
      <View
        style={[styles.paginationContainer]}>
        {pages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: currentPage === index ? Colors.primary_color : Colors.secondary_text,
                width: currentPage === index ? wp(6.5) : wp(2),
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={{ flex: 10, paddingTop: wp(5) }}>
        {/* Skip button */}
        {currentPage !== pages.length - 1 && (
          <CustomButton
            text={'Skip'}
            textStyle={styles.skipBtn}
            containerStyle={{ alignSelf: 'flex-end' }}
            onPress={() => navigation.navigate('SignIn')}
          />
        )}

        {/* PagerView for swiping */}
        <PagerView
          style={[{ height: hp(63), backgroundColor: 'white' }, lastPage && { marginTop: wp(7) }]}
          initialPage={0}
          onPageSelected={onPageSelected}
          ref={pagerRef} // Reference to control PagerView programmatically

        >
          {pages.map((page, index) => (
            <View key={index} style={styles.imgContainer}>
              {page.image}
              <Text style={styles.text}>{page.heading}</Text>

              {page.subHeading && (
                <Text
                  style={styles.subHeading}>
                  {page.subHeading}
                </Text>
              )}
            </View>
          ))}
        </PagerView>

         {renderPaginationDots()}
      </View>

      {/* Continue button */}

      {!lastPage ? <View style={{ flex: 1, paddingHorizontal: wp(10), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
       

        {/* <CustomButton svg={<ChevronRightOrange />} containerStyle={{ paddingBottom: hp(8.5) }} onPress={handleContinue} /> */}

        <CButton
          title="Continue"
          width={wp(85)}
          // height={hp(6)}
          // transparent={true}
         onPress={handleContinue} 
          bgColor={Colors.button.primary_button}
          // leftIcon={<ChevronRightOrange />}
          
        />

      </View> :
        <View >
         
            
             {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            width: wp(100),
            justifyContent: 'space-between',
          }}>
          <CButton
            title="SIGN IN"
            // height={hp(5.5)}
            marginTop={hp(15)}
            width={wp(38)}
            onPress={() => navigation.navigate('SignIn')}
          />
          <CButton
            title="SIGN UP"
            // height={hp(5.7)}
            marginTop={hp(15)}
            width={wp(38)}
            onPress={() => showBtmSheet()}
          />
        </View> */}
        <CButton
          title="Sign Up"
          width={wp(85)}
          // height={hp(6)}
          // transparent={true}
          onPress={() => showBtmSheet()}
        />
        <CButton
          title="Skip"
          width={wp(85)}
          // height={hp(6)}
          transparent={true}
          onPress={() => {
            dispatch(setJoinAsGuest(true));
            navigation?.navigate('Drawer');
          }}
        />
          
            
        </View>
      }
       <CRBSheetComponent
          height={145}
          refRBSheet={btmSheetRef}
          content={
            <View style={{ width: wp(90) }} >
              <View style={styles.rowViewSB1}>
                <Text style={styles.rbSheetHeading}>Select an option</Text>
                <TouchableOpacity
                  onPress={() => closeBtmSheet()}>
                  <Ionicons name={'close'} size={22} color={'#1E2022'} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.rowView} onPress={() =>toggleSelection('phone')} >
                {/* <RadioButton color={Colors.primary_color} uncheckedColor={Colors.primary_color} status={signUpWith === 'phone' ? 'checked' : 'unchecked'} onPress={() =>toggleSelection('phone')}/> */}
                <Text
                  style={{
                    color: Colors.secondary_text,
                    fontFamily: Fonts.PlusJakartaSans_Regular,
                    fontSize: RFPercentage(2),
                    marginLeft: wp(4)
                  }}>
                  Phone Number
                </Text>

              </TouchableOpacity  >
              <ItemSeparator />
              <TouchableOpacity style={styles.rowView} onPress={() => toggleSelection('email')}>
                {/* <RadioButton color={Colors.primary_color} uncheckedColor={Colors.primary_color} status={signUpWith === 'email' ? 'checked' : 'unchecked'} onPress={() => toggleSelection('email')} /> */}
                <Text
                  style={{
                    color: Colors.secondary_text,
                    fontFamily: Fonts.PlusJakartaSans_Regular,
                    fontSize: RFPercentage(2),
                    marginLeft: wp(4)
                  }}>
                  Email
                </Text>

              </TouchableOpacity  >
            </View>
          }

        />
    </View>
  );
};

export default Onboarding;
