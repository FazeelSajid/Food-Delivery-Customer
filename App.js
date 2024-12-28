import * as React from 'react';
import 'react-native-get-random-values';
import {NavigationContainer} from '@react-navigation/native';
import Router from './src/Routes/router';
import {Provider, useDispatch} from 'react-redux';
import {MYStore, persistor} from './src/redux/MyStore';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BASE_URL } from './src/utils/globalVariables';
import { setColors } from './src/redux/AuthSlice';
import { navigationRef } from './src/utils/helpers';
import socket from './src/utils/Socket';

export default function App() {

  function FetchColorsWrapper() {
    const dispatch = useDispatch();


    
     async function getColorsByRestaurant(restaurantId) {
        try {
          const response = await fetch(
            `${BASE_URL}appConfiguration/getColorsByRestaurant?restaurant_id=${restaurantId}`,
            {
              method: "GET",
            }
          );
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
  
          if (data.status) {
            // console.log("Colors fetched successfully:", data.result);
            const color = data?.result[0];
  
            const obj = {
              button: {
                primary_button: color?.primary_btn_color,
                primary_button_text: color?.primary_text_color_btn,
                secondary_button: color?.secondary_btn_color,
                secondary_button_text: color?.secondary_text_color_btn,
                secondary_button_border: color?.secondary_btn_border,
                icon: color?.icon_color,
              },
              primary_color: color?.primary_color,
              primary_text: color?.primary_text_color,
              secondary_text: color?.secondary_text_color,
              secondary_color: color?.secondary_color,
            };
            dispatch(setColors(obj));
          } else {
            throw new Error(data.message || "Failed to fetch colors.");
          }
        } catch (error) {
          console.error("Error fetching colors by restaurant:", error);
        }
      }

    

    React.useEffect(() => {
      // Function to be called repeatedly
      const fetchColors = () => {
        getColorsByRestaurant("res_4074614");
      };
  
      // Set up the interval
      const intervalId = setInterval(fetchColors, 6000); // 60000ms = 1 minute
  
      // Cleanup interval on unmount
      return () => clearInterval(intervalId);
    }, [dispatch]); 
  
    return <React.Fragment />; 
  }

  return (
    
    <Provider store={MYStore}>
       <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{flex: 1}}>
        <FetchColorsWrapper />
       <NavigationContainer ref={navigationRef} >
        <Router/>
      </NavigationContainer>
      </GestureHandlerRootView>
       </PersistGate>
    </Provider>
  );
}



