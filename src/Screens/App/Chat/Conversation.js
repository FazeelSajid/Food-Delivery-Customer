import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import React, {useState, useEffect, useCallback, memo, useRef} from 'react';
import ChatHeader from '../../../components/Header/ChatHeader';
import {Colors, Fonts, Icons, Images} from '../../../constants';

import {GiftedChat, Bubble, InputToolbar} from 'react-native-gifted-chat';
import {RFPercentage} from 'react-native-responsive-fontsize';

import uuid from 'react-native-uuid';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/firestore';
import Loader from '../../../components/Loader';
import {getUserFcmToken} from '../../../utils/helpers';
import {firebase_server_key} from '../../../utils/globalVariables';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Conversation = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const ref = useRef('');
  const inputRef = useRef('');

  // let docId = 'restaurant-customer';
  // const [user_id, setUser_id] = useState('customer');
  // const [userId, setUserId] = useState('customer');

  const [userId, setUserId] = useState('');
  const [docId, setDocId] = useState('');

  const handleDocId = async () => {
    console.log('handleDocId called...');
    if (route?.params?.userId) {
      let customer_id = await AsyncStorage.getItem('customer_id'); //current user
      let doc = '';
      if (route?.params?.type == 'restaurant') {
        doc = route?.params?.userId + '-' + customer_id;
      } else {
        doc = customer_id + '-' + route?.params?.userId;
      }
      console.log('new doc : ', doc);
      setDocId(doc);
      // setUser_id(customer_id);
      setUserId(customer_id);
    } else {
      console.log('else userId not found');
    }
  };

  useEffect(() => {
    handleDocId();
  }, [route?.params, docId]);

  useEffect(() => {
    ref.current = '';
  }, []);

  useEffect(() => {
    setLoading(true);
    initializeConversation(docId); // Create conversation if not exist
    const unsubscribeMessages = firebase
      .firestore()
      .collection('conversations')
      .doc(docId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const messageList = snapshot?.docs?.map(doc => {
          let data = doc.data();
          //update message read status
          console.log('update message status read : ', data?.user?._id, userId);
          if (
            data?.user?._id != userId &&
            typeof data?.user?._id != 'undefined' &&
            userId?.length !== 0
          ) {
            console.log('updated.....');
            doc?.ref
              .update({
                received: true,
              })
              .catch(err => {
                console.log('err while updating message read status');
              });
          }
          // --------------------------

          if (data.createdAt) {
            return {
              ...doc.data(),
              createdAt: doc.data().createdAt.toDate(),
            };
          } else {
            return {
              ...doc.data(),
              createdAt: new Date(),
            };
          }
        });
        setMessages(messageList);
        setLoading(false);
      });

    return () => unsubscribeMessages();
  }, [docId]);

  const handleReadMessage = async messageId => {
    // Update the message to mark it as read by the current user
    // await firebase
    //   .firestore()
    //   .collection('conversations')
    //   .doc(docId)
    //   .collection('messages')
    //   .doc(messageId)
    //   .update({
    //     readBy: firebase.firestore.FieldValue.arrayUnion(user.uid),
    //   });
  };

  const initializeConversation = async docId => {
    // Check if the conversation exists
    const conversationRef = firebase
      .firestore()
      .collection('conversations')
      .doc(docId);
    // const conversationDoc = await conversationRef.get();

    // if (!conversationDoc.exists) {
    //   // Create the conversation document
    //   await conversationRef.set({
    //     participants: [userId], // You can add more data here
    //   });
    // }
  };

  const onSend = async text => {
    if (text?.trim()?.length == 0) return; //don't want to send empty string
    ref.current = '';
    inputRef.current = '';

    let obj = {
      _id: uuid.v4(),
      text: text?.trim(),
      // createdAt: new Date(),
      user: {
        _id: userId,
        name: 'React Native',
        avatar: 'https://placeimg.com/140/140/any',
      },
      sent: true,
      received: false,
    };

    // Add the new message to Firestore

    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    console.log('docId  :  ', docId);
    firestore()
      .collection('conversations')
      .doc(docId)
      .collection('messages')
      .add({
        ...obj,
        createdAt: new Date(),
        // createdAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        //message sended successfully
        handleSendPushNotification(obj.text);
      })
      .catch(err => {
        console.log('error while sending new message : ', err);
      });
  };

  const handleSendPushNotification = async text => {
    // const receiver_fcm = await getUserFcmToken();
    const receiver_fcm = route?.params?.fcm_token;
    let customer_detail = await AsyncStorage.getItem('customer_detail');
    if (customer_detail) {
      let parsed = JSON.parse(customer_detail);
      current_user_name = parsed?.user_name;
    }

    if (receiver_fcm) {
      let body = {
        to: receiver_fcm,
        notification: {
          title: current_user_name,
          body: text ? text : 'sended a message',
          // mutable_content: true,
          sound: 'default',
        },
        data: {
          // user_id: user,
          type: 'chat',
        },
        priority: 'high',
      };

      var requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `key=${firebase_server_key}`,
        },
        body: JSON.stringify(body),
      };

      fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
        .then(response => response.text())
        .then(response => {
          let res = JSON.parse(response);
          console.log('push notification response :  ', res);
        })
        .catch(err => {
          console.log('error :  ', err);
        });
    } else {
      console.log('receiver_fcm not found');
    }
  };

  const CustomBubble = props => {
    return (
      <View>
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: Colors.Orange,
              borderBottomRightRadius: 15,
              borderBottomLeftRadius: 15,
              borderTopRightRadius: 5,
              borderTopLeftRadius: 15,
              marginBottom: 35,
              marginRight: 10,
              alignItems: 'flex-end', // Align the content to the right
              paddingTop: 10,
              paddingBottom: 5,
              paddingHorizontal: 5,
              marginRight: 20,
            },
            left: {
              backgroundColor: '#F1F1F1',
              borderBottomRightRadius: 15,
              borderBottomLeftRadius: 15,
              borderTopRightRadius: 15,
              borderTopLeftRadius: 5,
              marginBottom: 35,
              marginLeft: 10,
              alignItems: 'flex-start', // Align the content to the left
              paddingTop: 10,
              paddingBottom: 5,
              paddingHorizontal: 5,
              marginLeft: 20,
            },
          }}
          containerStyle={{
            backgroundColor: 'red',
          }}
          timeTextStyle={{
            left: {
              color: '#000000',
              fontFamily: Fonts.Inter_Medium,
              fontSize: RFPercentage(1.4),
              marginBottom: -35,
              top: 18,
              position: 'relative',
              left: -8,
            },
            right: {
              color: '#000000',
              fontFamily: Fonts.Inter_Medium,
              fontSize: RFPercentage(1.4),
              marginBottom: -35,
              top: 18,
              position: 'relative',
              right: -20,
            },
          }}
        />

        {props?.currentMessage?.user?._id != userId ? (
          <View
            style={{
              backgroundColor: '#F1F1F1',
              height: 10,
              width: 20,
              borderTopLeftRadiusRadius: 2,
              borderBottomLeftRadius: 8,
              position: 'absolute',
              top: 0,
              left: 15,
            }}
          />
        ) : (
          <View
            style={{
              backgroundColor: Colors.Orange,
              height: 10,
              width: 20,
              borderTopRightRadius: 2,
              borderBottomRightRadius: 8,
              position: 'absolute',
              top: 0,
              right: 15,
            }}
          />
        )}
      </View>
    );
  };

  const CustomTicks = currentMessage => {
    // console.log('props::::   ', currentMessage);
    // console.log('currentMessage?.sent  : ', !!currentMessage?.sent);
    // console.log('currentMessage?.received  : ', !!currentMessage?.received);

    return (
      <View style={{position: 'relative', top: 21, left: -50}}>
        {/* <Text style={[{color: Colors.Orange}]}>✓✓</Text> */}
        {/* {!!currentMessage?.sent && !!currentMessage?.received && ( */}
        {currentMessage?.sent == true &&
          !!currentMessage?.received == true &&
          currentMessage?.user?._id == userId && <Icons.DoubleTick />}
      </View>
    );
  };

  const CustomInputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          paddingVertical: 20,
          paddingTop: 8,
          borderTopWidth: 0,
          width: '90%',
          marginHorizontal: 20,
        }}
        // renderComposer={props => renderComposer(props)}
        renderComposer={props => {
          return <RenderComposer {...props} />;
        }}
        renderSend={props => {
          return <RenderSend {...props} />;
        }}
      />
    );
  };

  const RenderSend = props => {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log('ref :: ', inputRef.current);
          onSend(inputRef.current);
        }}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 8,
        }}>
        <View
          style={{
            justifyContent: 'center',
            padding: 20,
            paddingVertical: 15,
            borderRadius: 10,
            borderWidth: 0,
            backgroundColor: Colors.Orange,
          }}>
          <Icons.Send />
        </View>
      </TouchableOpacity>
    );
  };

  const onChangeText = item => {
    ref.current = item;
    inputRef.current = item;
  };

  const RenderComposer = props => {
    return (
      <TextInput
        {...props}
        ref={ref}
        style={{
          flex: 1,
          fontSize: 16,
          paddingHorizontal: 15,
          borderRadius: 10,
          backgroundColor: '#F5F5F5',
        }}
        placeholder="Write message..."
        multiline={true}
        // value={newMessage}
        // value={typeof ref.current == 'string' ? ref.current : ''}
        // onChangeText={text => setNewMessage(text)}
        onChangeText={onChangeText}
      />
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ChatHeader
        profile={route?.params?.image ? route?.params?.image : null}
        title={route?.params?.name ? route?.params?.name : ''}
      />

      <Loader loading={loading} />
      <View style={{flex: 1}}>
        <GiftedChat
          messagesContainerStyle={{paddingBottom: 30}}
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            // _id: user_id,
            _id: userId,
          }}
          renderInputToolbar={props => {
            return <CustomInputToolbar {...props} />;
          }}
          // renderAvatar={props => {
          //   return null;
          // }}
          renderAvatar={null}
          renderBubble={props => {
            return <CustomBubble {...props} />;
          }}
          renderTicks={props => {
            return <CustomTicks {...props} />;
          }}
          alwaysShowSend
          onInputTextChanged={text => {
            console.log('text : ', text);
          }}
          // renderChatEmpty={() => (
          //   <View
          //     style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          //     {loading ? null : (
          //       <Text
          //         style={{
          //           color: 'gray',
          //           fontSize: 14,
          //           transform: [{scaleY: -1}],
          //         }}>
          //         No Record Found
          //       </Text>
          //     )}
          //   </View>
          // )}
          disableComposer={true}
        />
      </View>
    </View>
  );
};

export default Conversation;
