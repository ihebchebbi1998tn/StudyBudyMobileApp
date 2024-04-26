import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { UserContext } from '../../Backend/UserContext';
import { useContext } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BASE_URL } from '../../Backend/apiConfig';
const ChatMessages = ({ sessionId }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const scrollViewRef = useRef();
  const { user } = useContext(UserContext);
  
  const fetchChatMessages = () => {
    fetch(`${BASE_URL}Studybuddy/api/get_discution.php?sessionId=${sessionId}`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setChatMessages(data.reverse());
        } else {
          setChatMessages([]);
        }
      })
      .catch(error => console.error(error));
  };
  
  useEffect(() => {
    fetchChatMessages();
  
    const intervalId = setInterval(fetchChatMessages, 1000);
  
    return () => clearInterval(intervalId);
  }, [sessionId]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !user) {
      return; 
    }
    
    const queryParams = new URLSearchParams({
      session_id: sessionId,
      sender_name: user.firstName || 'Unknown',
      sender_image: user.profileImage || '',
      message: inputMessage.trim(),
    });
    
    fetch(`${BASE_URL}Studybuddy/api/create_message.php?${queryParams}`, {
      method: 'POST',
    })
    .then(response => {
      if (response.ok) {
        setInputMessage('');
      } else {
        throw new Error('Failed to send message');
      }
    })
    .catch(error => {
      console.error('Error sending message:', error);
    });
  };
  
  const scrollToBottom = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {chatMessages.map(message => (
          <View
            key={message.id}
            style={[
              styles.chatMessageContainer,
              message.userId === 1 ? styles.sentMessage : styles.receivedMessage
            ]}
          >
            <Image source={{ uri: `${BASE_URL}Studybuddy/api/${message.sender_image}` }} style={styles.userImage} />
            <View style={styles.messageContent}>
              {message.userId !== 1 && (
                <Text style={styles.senderName}>{message.sender_name}</Text>
              )}
              <View style={styles.message}>
                <Text style={styles.chatMessage}>{message.message}</Text>
              </View>
              <Text style={styles.chatTimestamp}>{message.timestamp}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type your message..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  scrollContent: {
    // paddingBottom: 80, // Remove or set to 0
  },
  chatMessageContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'flex-start',
  },
  sentMessage: {
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
  },
  messageContent: {
    maxWidth: '80%',
    marginLeft: 10,
  },
  senderName: {
    fontSize: 12,
    color: '#007EA4',
    marginBottom: 2,
  },
  message: {
    backgroundColor: '#007EA4',
    padding: 10,
    borderRadius: 8,
  },
  chatMessage: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  chatTimestamp: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
    alignSelf: 'flex-end',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#007EA4',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007EA4',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default ChatMessages;
