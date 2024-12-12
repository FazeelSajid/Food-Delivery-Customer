/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification, {Importance} from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import { Colors, Icons } from './src/constants';
import { navigate } from './src/utils/helpers';
import { MYStore } from './src/redux/MyStore';


// Listen for incoming foreground messages
messaging().onMessage(async remoteMessage => {
  // Display the notification manually
  // You can use your UI components here
  console.log('onMessage  :  ', remoteMessage);

  

});



PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    // console.log('TOKEN:', token);
    //to fix that notification is not pop-up when app is in foreground state
    PushNotification.createChannel(
      {
        channelId: 'fcm_fallback_notification_channel', // (required)
        channelName: 'My channel', // (required)
        
        channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
        playSound: false, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
         color: `${Colors.primary_color}40`,
         largeIcon: Icons.OrderInProcess, // Large icon displayed in the notification
          smallIcon: Icons.OrderInProcess, // Small icon displayed in the status bar
        
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
  },
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    let data = notification?.data;
    // navigate('Order');
   
    console.log('OnNotifications  :+: ', notification?.data);
    // Check if the notification was triggered by a user interaction
 if (notification.userInteraction) {
  // Navigate to the Notifications screen and pass the title and message
  if (data.type === 'order') {
    navigate('OrderDetails', {
        type: 'all',
        id: data?.orderId,
        // item: ,
      });
    
  } else if (data.type === 'wallet') {
    navigate('Wallet', {
      title: notification.title,
      message: notification.message,
    });
  } else if (data.type === 'chat'){

    if (data.senderId.startsWith('rider_')) {
      const contac = { "customer_id": MYStore.getState().store.customer_id,  "receiver_id":data.senderId,  "rider_id": data.senderId, "room_id": data.roomId, "sender_id": MYStore.getState().store.customer_id, "sender_type": "customer", }
      navigate('Conversation', {
        contact: contac,
        name: data.senderName,
      });
    }
    else if (data.senderId.startsWith('res')) {
      const contac = { "customer_id": MYStore.getState().store.customer_id,  "receiver_id":data.senderId,  "rider_id": null, 'restaurant_id' : data.senderId , "room_id": data.roomId, "sender_id": MYStore.getState().store.customer_id, "sender_type": "customer", }
      navigate('Conversation', {
        contact: contac,
        name: data.senderName,
      });
    }
    // navigate('Conversation'{
  
    // })
  }
  
}

  },
  //   requestPermissions: Platform.OS === 'ios',

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    // console.log('ACTION:', notification.action);
    console.log('onActionNotification :', notification);
    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage.data);
const data = remoteMessage.data
if (data.type === 'order') {
  navigate('OrderDetails', {
      type: 'all',
      id: data?.orderId,
      // item: ,
    });
  
} else if (data.type === 'wallet') {
  navigate('Wallet', {
    title: data.title,
    message: data.message,
  });
}else if (data.type === 'chat'){

  if (data.senderId.startsWith('rider_')) {
    const contac = { "customer_id": MYStore.getState().store.customer_id,  "receiver_id":data.senderId,  "rider_id": data.senderId, "room_id": data.roomId, "sender_id": MYStore.getState().store.customer_id, "sender_type": "customer", }
    navigate('Conversation', {
      contact: contac,
      name: data.senderName,
    });
  }
  else if (data.senderId.startsWith('res')) {
    const contac = { "customer_id": MYStore.getState().store.customer_id,  "receiver_id":data.senderId,  "rider_id": null, 'restaurant_id' : data.senderId , "room_id": data.roomId, "sender_id": MYStore.getState().store.customer_id, "sender_type": "customer", }
    navigate('Conversation', {
      contact: contac,
      name: data.senderName,
    });
  }
  // navigate('Conversation'{

  // })
}

;
    

  



  // yaha par Handle background notification navigation here
  // navigate('NotificationUser', {notificationData: remoteMessage.data});
  
  // console.log('setBackgroundMessageHandler', remoteMessage.data);
  
  // if (remoteMessage) {
  //   navigate('NotificationUser', {
  //     title: remoteMessage.notification.title,
  //     body: remoteMessage.notification.body,
  //   });
  // }
});

// messaging().onNotificationOpenedApp(remoteMessage => {
//   console.log(
//     'Notification caused app to open from background state:',
//     remoteMessage.notification,
//   );
//   // Navigate to the Notifications screen and pass the notification content
//   if (remoteMessage.notification) {
//     navigate('NotificationUser', {
//       title: remoteMessage.notification.title,
//       body: remoteMessage.notification.body,
//     });
//   }
//   // navigate('NotificationUser', {notificationData: remoteMessage.data});
//   //navigation.navigate(remoteMessage.data.type);
// });

// Check whether an initial notification is available
// messaging()
//   .getInitialNotification()
//   .then(remoteMessage => {
//     if (remoteMessage) {
//       console.log(
//         'Notification caused app to open from quit state:',
//         remoteMessage.notification,
        
//       );
//       // navigate('NotificationUser', {notificationData: remoteMessage.data});
//     // Navigate to the Notifications screen and pass the notification content
//     if (remoteMessage.notification) {
//       navigate('NotificationUser', {
//         title: remoteMessage.notification.title,
//         body: remoteMessage.notification.body,
//       });
//     }
//     }
//   });

AppRegistry.registerComponent(appName, () => App);
