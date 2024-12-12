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


    
  
    React.useEffect(() => {

      // socket.on("connect", () => {
      //   console.log("Socket connected:", socket.id);
      //   // socket.emit("getContacts", { rider_id });
      // });
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

            // console.log({obj});
            
  
            dispatch(setColors(obj));
          } else {
            throw new Error(data.message || "Failed to fetch colors.");
          }
        } catch (error) {
          console.error("Error fetching colors by restaurant:", error);
        }
      }
  
      getColorsByRestaurant("res_4074614");
    }, [dispatch]);
  
    return <React.Fragment />; // Safer null-like return for React components
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

// const obj ={
//   "plus_code": {
//     "compound_code": "M32J+RMP Rawalpindi, Pakistan",
//     "global_code": "8J5MM32J+RMP"
//   },
//   "results": [
//     {
//       "address_components": [
//         {
//           "long_name": "Main",
//           "short_name": "Main",
//           "types": [
//             "street_number"
//           ]
//         },
//         {
//           "long_name": "Murree Road",
//           "short_name": "Murree Rd",
//           "types": [
//             "route"
//           ]
//         },
//         {
//           "long_name": "Shamsabad",
//           "short_name": "Shamsabad",
//           "types": [
//             "political",
//             "sublocality",
//             "sublocality_level_1"
//           ]
//         },
//         {
//           "long_name": "Rawalpindi",
//           "short_name": "RWP",
//           "types": [
//             "locality",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Rawalpindi",
//           "short_name": "Rawalpindi",
//           "types": [
//             "administrative_area_level_3",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Rawalpindi",
//           "short_name": "Rawalpindi",
//           "types": [
//             "administrative_area_level_2",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Punjab",
//           "short_name": "Punjab",
//           "types": [
//             "administrative_area_level_1",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Pakistan",
//           "short_name": "PK",
//           "types": [
//             "country",
//             "political"
//           ]
//         }
//       ],
//       "formatted_address": "3rd Floor, Office No.31, Aries Tower, Shamsabad, Main Murree Rd, Shamsabad, Rawalpindi, Punjab, Pakistan",
//       "geometry": {
//         "location": {
//           "lat": 33.6521234,
//           "lng": 73.0816609
//         },
//         "location_type": "ROOFTOP",
//         "viewport": {
//           "northeast": {
//             "lat": 33.6534723802915,
//             "lng": 73.0830098802915
//           },
//           "southwest": {
//             "lat": 33.6507744197085,
//             "lng": 73.0803119197085
//           }
//         }
//       },
//       "place_id": "ChIJIet5OSW_3zgRMp6bFLeqd18",
//       "plus_code": {
//         "compound_code": "M32J+RM Rawalpindi, Pakistan",
//         "global_code": "8J5MM32J+RM"
//       },
//       "types": [
//         "establishment",
//         "point_of_interest",
//         "travel_agency"
//       ]
//     },


    
//     {
//       "address_components": [
//         {
//           "long_name": "M32J+RM",
//           "short_name": "M32J+RM",
//           "types": [
//             "plus_code"
//           ]
//         },
//         {
//           "long_name": "Rawalpindi",
//           "short_name": "RWP",
//           "types": [
//             "locality",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Rawalpindi",
//           "short_name": "Rawalpindi",
//           "types": [
//             "administrative_area_level_3",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Rawalpindi",
//           "short_name": "Rawalpindi",
//           "types": [
//             "administrative_area_level_2",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Punjab",
//           "short_name": "Punjab",
//           "types": [
//             "administrative_area_level_1",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Pakistan",
//           "short_name": "PK",
//           "types": [
//             "country",
//             "political"
//           ]
//         }
//       ],
//       "formatted_address": "M32J+RM Rawalpindi, Pakistan",
//       "geometry": {
//         "bounds": {
//           "northeast": {
//             "lat": 33.652125,
//             "lng": 73.08175
//           },
//           "southwest": {
//             "lat": 33.652,
//             "lng": 73.081625
//           }
//         },
//         "location": {
//           "lat": 33.6520751,
//           "lng": 73.0816881
//         },
//         "location_type": "GEOMETRIC_CENTER",
//         "viewport": {
//           "northeast": {
//             "lat": 33.6534114802915,
//             "lng": 73.0830364802915
//           },
//           "southwest": {
//             "lat": 33.6507135197085,
//             "lng": 73.0803385197085
//           }
//         }
//       },
//       "place_id": "GhIJmYRmMnfTQEARO365YDpFUkA",
//       "plus_code": {
//         "compound_code": "M32J+RM Rawalpindi, Pakistan",
//         "global_code": "8J5MM32J+RM"
//       },
//       "types": [
//         "plus_code"
//       ]
//     },
//     {
//       "address_components": [
//         {
//           "long_name": "Unnamed Road",
//           "short_name": "Unnamed Road",
//           "types": [
//             "route"
//           ]
//         },
//         {
//           "long_name": "Shamsabad",
//           "short_name": "Shamsabad",
//           "types": [
//             "political",
//             "sublocality",
//             "sublocality_level_1"
//           ]
//         },
//         {
//           "long_name": "Rawalpindi",
//           "short_name": "RWP",
//           "types": [
//             "locality",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Rawalpindi",
//           "short_name": "Rawalpindi",
//           "types": [
//             "administrative_area_level_3",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Rawalpindi",
//           "short_name": "Rawalpindi",
//           "types": [
//             "administrative_area_level_2",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Punjab",
//           "short_name": "Punjab",
//           "types": [
//             "administrative_area_level_1",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Pakistan",
//           "short_name": "PK",
//           "types": [
//             "country",
//             "political"
//           ]
//         }
//       ],
//       "formatted_address": "Unnamed Road, Shamsabad, Rawalpindi, Punjab, Pakistan",
//       "geometry": {
//         "bounds": {
//           "northeast": {
//             "lat": 33.6523149,
//             "lng": 73.0820272
//           },
//           "southwest": {
//             "lat": 33.6522723,
//             "lng": 73.0812807
//           }
//         },
//         "location": {
//           "lat": 33.6522843,
//           "lng": 73.0816531
//         },
//         "location_type": "GEOMETRIC_CENTER",
//         "viewport": {
//           "northeast": {
//             "lat": 33.6536425802915,
//             "lng": 73.0830029302915
//           },
//           "southwest": {
//             "lat": 33.6509446197085,
//             "lng": 73.0803049697085
//           }
//         }
//       },
//       "place_id": "ChIJpcKAiDGV3zgR4PwMFTXjT9w",
//       "types": [
//         "route"
//       ]
//     },
//     {
//       "address_components": [
//         {
//           "long_name": "Shamsabad",
//           "short_name": "Shamsabad",
//           "types": [
//             "political",
//             "sublocality",
//             "sublocality_level_1"
//           ]
//         },
//         {
//           "long_name": "Rawalpindi",
//           "short_name": "RWP",
//           "types": [
//             "locality",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Rawalpindi",
//           "short_name": "Rawalpindi",
//           "types": [
//             "administrative_area_level_3",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Rawalpindi",
//           "short_name": "Rawalpindi",
//           "types": [
//             "administrative_area_level_2",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Punjab",
//           "short_name": "Punjab",
//           "types": [
//             "administrative_area_level_1",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Pakistan",
//           "short_name": "PK",
//           "types": [
//             "country",
//             "political"
//           ]
//         }
//       ],
//       "formatted_address": "Shamsabad, Rawalpindi, Punjab, Pakistan",
//       "geometry": {
//         "bounds": {
//           "northeast": {
//             "lat": 33.6564675,
//             "lng": 73.0938456
//           },
//           "southwest": {
//             "lat": 33.6436287,
//             "lng": 73.0719069
//           }
//         },
//         "location": {
//           "lat": 33.6491491,
//           "lng": 73.0833224
//         },
//         "location_type": "APPROXIMATE",
//         "viewport": {
//           "northeast": {
//             "lat": 33.6564675,
//             "lng": 73.0938456
//           },
//           "southwest": {
//             "lat": 33.6436287,
//             "lng": 73.0719069
//           }
//         }
//       },
//       "place_id": "ChIJMe9G8S2V3zgRiGfn9ufbNh0",
//       "types": [
//         "political",
//         "sublocality",
//         "sublocality_level_1"
//       ]
//     },
//     {
//       "address_components": [
//         {
//           "long_name": "Dhok Ali Akbar",
//           "short_name": "Dhok Ali Akbar",
//           "types": [
//             "administrative_area_level_5",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Rawalpindi",
//           "short_name": "RWP",
//           "types": [
//             "locality",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Punjab",
//           "short_name": "Punjab",
//           "types": [
//             "administrative_area_level_1",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Pakistan",
//           "short_name": "PK",
//           "types": [
//             "country",
//             "political"
//           ]
//         }
//       ],
//       "formatted_address": "Dhok Ali Akbar, Rawalpindi, Punjab, Pakistan",
//       "geometry": {
//         "bounds": {
//           "northeast": {
//             "lat": 33.6640397,
//             "lng": 73.1066537
//           },
//           "southwest": {
//             "lat": 33.6241398,
//             "lng": 73.0710537
//           }
//         },
//         "location": {
//           "lat": 33.6379618,
//           "lng": 73.0907
//         },
//         "location_type": "APPROXIMATE",
//         "viewport": {
//           "northeast": {
//             "lat": 33.6640397,
//             "lng": 73.1066537
//           },
//           "southwest": {
//             "lat": 33.6241398,
//             "lng": 73.0710537
//           }
//         }
//       },
//       "place_id": "ChIJaQIKxNTq3zgRmpAli9st57A",
//       "types": [
//         "administrative_area_level_5",
//         "political"
//       ]
//     },
//     {
//       "address_components": [
//         {
//           "long_name": "Rawalpindi",
//           "short_name": "RWP",
//           "types": [
//             "locality",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Rawalpindi",
//           "short_name": "Rawalpindi",
//           "types": [
//             "administrative_area_level_3",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Rawalpindi",
//           "short_name": "Rawalpindi",
//           "types": [
//             "administrative_area_level_2",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Punjab",
//           "short_name": "Punjab",
//           "types": [
//             "administrative_area_level_1",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Pakistan",
//           "short_name": "PK",
//           "types": [
//             "country",
//             "political"
//           ]
//         }
//       ],
//       "formatted_address": "Rawalpindi, Punjab, Pakistan",
//       "geometry": {
//         "bounds": {
//           "northeast": {
//             "lat": 33.6647041,
//             "lng": 73.1471612
//           },
//           "southwest": {
//             "lat": 33.4583251,
//             "lng": 72.8891345
//           }
//         },
//         "location": {
//           "lat": 33.5651107,
//           "lng": 73.0169135
//         },
//         "location_type": "APPROXIMATE",
//         "viewport": {
//           "northeast": {
//             "lat": 33.6647041,
//             "lng": 73.1471612
//           },
//           "southwest": {
//             "lat": 33.4583251,
//             "lng": 72.8891345
//           }
//         }
//       },
//       "place_id": "ChIJy5pBdImU3zgRD9MyFn41hAk",
//       "types": [
//         "locality",
//         "political"
//       ]
//     },
//     {
//       "address_components": [
//         {
//           "long_name": "Rawalpindi",
//           "short_name": "Rawalpindi",
//           "types": [
//             "administrative_area_level_3",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Rawalpindi",
//           "short_name": "Rawalpindi",
//           "types": [
//             "administrative_area_level_2",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Punjab",
//           "short_name": "Punjab",
//           "types": [
//             "administrative_area_level_1",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Pakistan",
//           "short_name": "PK",
//           "types": [
//             "country",
//             "political"
//           ]
//         }
//       ],
//       "formatted_address": "Rawalpindi, Punjab, Pakistan",
//       "geometry": {
//         "bounds": {
//           "northeast": {
//             "lat": 33.6616071,
//             "lng": 73.2972871
//           },
//           "southwest": {
//             "lat": 33.1410519,
//             "lng": 72.6297959
//           }
//         },
//         "location": {
//           "lat": 33.3592889,
//           "lng": 72.9460566
//         },
//         "location_type": "APPROXIMATE",
//         "viewport": {
//           "northeast": {
//             "lat": 33.6616071,
//             "lng": 73.2972871
//           },
//           "southwest": {
//             "lat": 33.1410519,
//             "lng": 72.6297959
//           }
//         }
//       },
//       "place_id": "ChIJrasQizOJ3zgRwAkDPNbsEqk",
//       "types": [
//         "administrative_area_level_3",
//         "political"
//       ]
//     },
//     {
//       "address_components": [
//         {
//           "long_name": "Rawalpindi",
//           "short_name": "Rawalpindi",
//           "types": [
//             "administrative_area_level_2",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Punjab",
//           "short_name": "Punjab",
//           "types": [
//             "administrative_area_level_1",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Pakistan",
//           "short_name": "PK",
//           "types": [
//             "country",
//             "political"
//           ]
//         }
//       ],
//       "formatted_address": "Rawalpindi, Punjab, Pakistan",
//       "geometry": {
//         "bounds": {
//           "northeast": {
//             "lat": 34.0187062,
//             "lng": 73.6335751
//           },
//           "southwest": {
//             "lat": 33.0681779,
//             "lng": 72.6297959
//           }
//         },
//         "location": {
//           "lat": 33.4619677,
//           "lng": 73.3708696
//         },
//         "location_type": "APPROXIMATE",
//         "viewport": {
//           "northeast": {
//             "lat": 34.0187062,
//             "lng": 73.6335751
//           },
//           "southwest": {
//             "lat": 33.0681779,
//             "lng": 72.6297959
//           }
//         }
//       },
//       "place_id": "ChIJ3TmK3AmO3zgRO95j9K2MxgA",
//       "types": [
//         "administrative_area_level_2",
//         "political"
//       ]
//     },
//     {
//       "address_components": [
//         {
//           "long_name": "Punjab",
//           "short_name": "Punjab",
//           "types": [
//             "administrative_area_level_1",
//             "political"
//           ]
//         },
//         {
//           "long_name": "Pakistan",
//           "short_name": "PK",
//           "types": [
//             "country",
//             "political"
//           ]
//         }
//       ],
//       "formatted_address": "Punjab, Pakistan",
//       "geometry": {
//         "bounds": {
//           "northeast": {
//             "lat": 34.0434647,
//             "lng": 75.3814777
//           },
//           "southwest": {
//             "lat": 27.7055479,
//             "lng": 69.3288726
//           }
//         },
//         "location": {
//           "lat": 31.1704063,
//           "lng": 72.7097161
//         },
//         "location_type": "APPROXIMATE",
//         "viewport": {
//           "northeast": {
//             "lat": 34.0434647,
//             "lng": 75.3814777
//           },
//           "southwest": {
//             "lat": 27.7055479,
//             "lng": 69.3288726
//           }
//         }
//       },
//       "place_id": "ChIJy5pBdImU3zgRoOxO0hgwnjo",
//       "types": [
//         "administrative_area_level_1",
//         "political"
//       ]
//     },
//     {
//       "address_components": [
//         {
//           "long_name": "Pakistan",
//           "short_name": "PK",
//           "types": [
//             "country",
//             "political"
//           ]
//         }
//       ],
//       "formatted_address": "Pakistan",
//       "geometry": {
//         "bounds": {
//           "northeast": {
//             "lat": 37.0914146,
//             "lng": 77.1204247
//           },
//           "southwest": {
//             "lat": 23.6344999,
//             "lng": 60.8729721
//           }
//         },
//         "location": {
//           "lat": 30.375321,
//           "lng": 69.345116
//         },
//         "location_type": "APPROXIMATE",
//         "viewport": {
//           "northeast": {
//             "lat": 37.0914146,
//             "lng": 77.1204247
//           },
//           "southwest": {
//             "lat": 23.6344999,
//             "lng": 60.8729721
//           }
//         }
//       },
//       "place_id": "ChIJH3X9-NJS2zgRXJIU5veht0Y",
//       "types": [
//         "country",
//         "political"
//       ]
//     }
//   ],
//   "status": "OK"
// }

