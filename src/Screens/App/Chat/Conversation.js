import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import ChatHeader from '../../../components/Header/ChatHeader';
import Loader from '../../../components/Loader';
import { io } from 'socket.io-client';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CameraBottomSheet from '../../../components/BottomSheet/CameraBottomSheet';
import { BASE_URL } from '../../../utils/globalVariables';

const Conversation = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const contact = route?.params?.contact;
  const { customer_id, Colors } = useSelector(store => store.store);
  const cameraBtmSheetRef = useRef()
  const [image, setImage] = useState()
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState(null);

  // const ref = useRef('');

  // useEffect(() => {
  //   const newSocket = io(socketUrl);
  //   setSocket(newSocket);

  //   // Join room and fetch previous messages
  //   newSocket.emit('joinRoom', {
  //     room_id: contact.room_id,
  //     rest_ID: contact.restaurant_id || '',
  //     customer_id: contact.customer_id,
  //     rider_id: contact.rider_id || '',
  //   });

  //   // newSocket.emit('joinRoom', customer_id);
  //   // newSocket.on('roomJoined', ({ roomId }) => {
  //   //     setRoomId(roomId);
  //   //     console.log(`Joined room: ${roomId}`);
  //   // });

  //   // setRoomId(contact.room_id);

  //   newSocket.on('previousMessages', ({ messages }) => {
  //     const formattedMessages = messages.map((msg, index) => ({
  //       ...msg,
  //       createdAt: new Date(msg.created_at),
  //     }));
  //     setMessages(formattedMessages.reverse());
  //   });

  //   newSocket.on('newMessage', (message) => {
  //     setMessages((prevMessages) => [message, ...prevMessages]);
  //   });

  //   return () => {
  //     newSocket.disconnect();
  //   };
  // }, []);

  const room_id = contact.room_id; // Use the room ID from the contact details

  // console.log(contact, 'asdasasd');
  
  useEffect(() => {
    const newSocket = io(BASE_URL);
    setSocket(newSocket);
    newSocket.on('connect', () => {
      // if (contact.rider_id) {
      //   newSocket.emit('joinRoom', {
      //     room_id,
      //     // rest_ID: null,
      //     customer_id: customer_id, // Example customer ID
      //     rider_id: contact.rider_id,
      //   });
      //   newSocket.on('roomJoined', ({ roomId }) => {
      //     console.log(`Joined room: ${roomId}, Conversations screen`);
      //     setRoomId(roomId);
      //   });

        
    
      // } else if (roomId) {
      //   newSocket.emit('joinRoom', {
      //     room_id,
      //     rest_ID: contact.restaurant_id,
      //     customer_id: customer_id, // Example customer ID
      //     rider_id: null
      //   });
      //   newSocket.on('roomJoined', ({ roomId }) => {
      //     console.log(`Joined room: ${roomId}, conversations`);
      //     setRoomId(roomId);
      //   });

      //   console.log('somewhere', {
      //     room_id,
      //     rest_ID: contact.restaurant_id,
      //     customer_id: customer_id, // Example customer ID
      //     rider_id: null
      //   });
    
      // }
      //  else {
      //   newSocket.emit('joinRoom', customer_id);
      //   newSocket.on('roomJoined', ({ roomId }) => {
      //     console.log(`Joined room: ${roomId}, conversation Screen`);
      //     setRoomId(roomId);
      //   });
      //   console.log('else from customer conversation screen useeffect unexpectedly');
      // }
// console.log(room_id);

      // if (room_id) {
        newSocket.emit('joinRoom', {
              room_id,
              rest_ID: contact.restaurant_id,
              customer_id: customer_id, // Example customer ID
              rider_id: contact.rider_id,
              order_id: contact.order_id
            });
            newSocket.on('roomJoined', ({ roomId }) => {
              console.log(`Joined room: ${roomId}, conversations`);
              setRoomId(roomId);
            });
    
            // console.log('somewhere', {
            //   room_id,
            //   rest_ID: contact.restaurant_id,
            //   customer_id: customer_id, // Example customer ID
            //   rider_id: null
            // });
      // } 
      // else {
      //     newSocket.emit('joinRoom', customer_id);
      //     newSocket.on('roomJoined', ({ roomId }) => {
      //       console.log(`Joined room: ${roomId}, conversation Screen`);
      //       setRoomId(roomId);
      //     });
      //     // console.log('else from customer conversation screen useeffect unexpectedly');
      //   }
  });

    newSocket.on('previousMessages', ({ messages }) => {
      const formattedMessages = messages.map((msg, index) => ({
        ...msg,
        createdAt: new Date(msg.created_at),

      }));
      setMessages(formattedMessages.reverse());
    });

    // Listen for new messages
    newSocket.on('newMessage', (message) => {
      console.log(' new message received', message);
      
      setMessages((prevMessages) => [message, ...prevMessages]);
    });

    // Cleanup listeners on unmount
    return () => {
      newSocket.off('roomJoined');
      newSocket.off('previousMessages');
      newSocket.off('newMessage');
    };
  }, [contact]);



  const sendMessage = () => {
    if (message.trim()) {

      if (image) {
        socket.emit('sendMessage', {
          roomId,
          sender_type: 'customer',
          senderId: customer_id,
          receiver_type: contact.rider_id ? 'rider' : 'restaurant',
          receiverId: contact.rider_id || contact.restaurant_id,
          message,
          image_url: image.base64,
          order_id: contact.order_id
        });
       
        
      } else {
        socket.emit('sendMessage', {
          roomId,
          sender_type: 'customer',
          senderId: customer_id,
          receiver_type: contact.rider_id ? 'rider' : 'restaurant',
          receiverId: contact.rider_id || contact.restaurant_id,
          message,
          order_id: contact.order_id
        });
        console.log({
          roomId,
          sender_type: 'customer',
          senderId: customer_id,
          receiver_type: contact.rider_id ? 'rider' : 'restaurant',
          receiverId: contact.rider_id || contact.restaurant_id,
          message,
         
        });
      }

      setMessage('');
      setImage(null)
    }
  };


  

  const renderItem = ({ item }) => {
    const isCustomer = item.sender_type === 'customer';

    
    return (
      <View
        style={[
          styles.messageContainer,
          isCustomer ? styles.messageRight : styles.messageLeft,
        ]}
      >
        <View
          style={[
            styles.bubble,
            isCustomer ? styles.customerBubble : styles.restaurantBubble,
          ]}
        >
          
          {item?.image_url ? (
            <Image
              source={{ uri: item?.image_url }}
              style={styles.chatImage}
            />
          ): item?.imageUrl ? (
            <Image
              source={{ uri: item?.imageUrl }}
              style={styles.chatImage}
            />
          ): null }
            {item.message && (
            <Text
              style={[
                styles.messageText,
                isCustomer ? { color: Colors.secondary_color } : { color: Colors.primary_text },
              ]}
            >
              {item.message}
            </Text>
          )}

        </View>

        <Text style={styles.timestamp}>
          { item.created_at ? new Date(item.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }) : new Date(item.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };
  const styles = StyleSheet.create({
    chatContainer: {
      paddingHorizontal: wp('4%'),
      paddingBottom: hp('2%'),
    },
    messageContainer: {
      marginVertical: hp('1%'),
      flexDirection: 'column',
    },
    messageRight: {
      alignItems: 'flex-end',
    },
    messageLeft: {
      alignItems: 'flex-start',
    },
    bubble: {
      maxWidth: wp('70%'),
      borderRadius: wp('3%'),
      padding: wp('1%'),
      overflow:'hidden',
    },
    customerBubble: {
      backgroundColor: Colors.primary_color,
      borderTopRightRadius: 0,
      width: wp(62)
     
    },
    restaurantBubble: {
      backgroundColor: Colors.borderGray,
      borderTopLeftRadius: 0,
    },
    messageText: {
      fontSize: wp('4%'),
      color: Colors.primary_text,
      marginBottom: hp('0.5%'),
      marginTop: hp('0.5%'),
      marginLeft : wp('1%'),
      // width: wp(80)
    },
    timestamp: {
      fontSize: wp('3.2%'),
      color: Colors.secondary_text,
      marginTop: hp('0.5%'),
    },
    // Image Styling
    chatImage: {
      height: hp(30), // Set proportional height for better responsiveness
      width: wp(60),  // Adjust width to fit bubble size
      borderRadius: wp(2), // Add rounded corners
      // marginTop: hp(1), // Add spacing from text
      alignSelf: 'center', // Center the image
      resizeMode: 'stretch', // Ensure the image covers the area proportionally
      shadowColor: '#000', // Add shadow for depth
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.3, 
      shadowRadius: 4,
      // elevation: 3, // Shadow support for Android
      borderWidth: 1, // Optional: Add border for a sleek look
      // borderColor: '#ddd', // Border color
      overflow: 'hidden',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.secondary_color,
      paddingVertical: hp('1%'),
      paddingHorizontal: wp('4%'),
      borderTopWidth: 1,
      borderTopColor: Colors.borderGray,
    },
    textInput: {
      flex: 1,
      height: hp('5%'),
      borderWidth: 1,
      borderColor: Colors.borderGray,
      borderRadius: wp('5%'),
      paddingHorizontal: wp('4%'),
      backgroundColor: Colors.secondary_color,
      fontSize: wp('4%'),
      color: Colors.primary_text,
    },
    sendButton: {
      marginLeft: wp('2%'),
      backgroundColor: Colors.button.primary_button,
      borderRadius: wp('5%'),
      padding: wp('3%'),
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendText: {
      color: Colors.button.primary_button_text ,
      fontSize: wp('5%'),
      fontWeight: 'bold',
    },
  });
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ChatHeader
        profile={route?.params?.image ? route?.params?.image : null}
        title={route?.params?.name ? route?.params?.name : ''}
      />

      <Loader loading={loading} />

      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
        inverted
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Write message..."
          value={message}
          onChangeText={(text) => setMessage(text)}
          placeholderTextColor={Colors.secondary_text}
        />
    
    <TouchableOpacity style={{marginHorizontal: wp('2%'),}} onPress={()=> cameraBtmSheetRef?.current?.open()} >
        <Ionicons name="camera" size={wp('9')} color={Colors.button.primary_button} />

        </TouchableOpacity>
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendText}>➤</Text>
        </TouchableOpacity>
      </View>

      <CameraBottomSheet refRBSheet={cameraBtmSheetRef} onImagePick={setImage} obj={{
          roomId,
          sender_type: 'customer',
          senderId: customer_id,
          receiver_type: contact.rider_id ? 'rider' : 'restaurant',
          receiverId: contact.rider_id || contact.restaurant_id,
          socket : socket,
          order_id: contact.order_id
          
        }} />
    </View>
  );
};

export default Conversation;


