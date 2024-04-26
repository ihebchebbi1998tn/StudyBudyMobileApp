import React from 'react';
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity } from 'react-native';

const DetailSession = () => {
  // Dummy data for participants
  const participants = [
    { id: 1, name: 'User 1', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 2, name: 'User 2', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { id: 3, name: 'User 3', image: 'https://randomuser.me/api/portraits/men/3.jpg' },
    // Add more participants as needed
  ];

  return (
    <View style={styles.container}>
      {/* Session Details */}
      <View style={styles.sessionDetails}>
        {/* Top half of the screen */}
        <View style={styles.topHalf}>
          {/* Title */}
          <Text style={styles.title}>Session Title</Text>
          
          {/* Description */}
          <Text style={styles.description}>Session Description goes here...</Text>
          
          {/* Date */}
          <Text style={styles.date}>Date: January 1, 2025</Text>
          
          {/* Location */}
          <Text style={styles.location}>Location: New York City</Text>
          
          {/* Number of Participants */}
          <Text style={styles.participants}>Participants: {participants.length}</Text>
          
          {/* Display user images */}
          <ScrollView horizontal style={styles.userImages}>
            {participants.map(participant => (
              <TouchableOpacity key={participant.id} style={styles.userImageContainer}>
                <Image source={{ uri: participant.image }} style={styles.userImage} />
                <Text style={styles.userName}>{participant.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Bottom half of the screen */}
        <ScrollView style={styles.bottomHalf}>
          {/* Chat between members */}
          {/* Add your chat component here */}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  sessionDetails: {
    flex: 1,
  },
  topHalf: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    marginBottom: 10,
  },
  location: {
    fontSize: 16,
    marginBottom: 10,
  },
  participants: {
    fontSize: 16,
    marginBottom: 10,
  },
  userImages: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  userImageContainer: {
    marginRight: 10,
    alignItems: 'center',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userName: {
    marginTop: 5,
  },
  bottomHalf: {
    flex: 1,
    padding: 20,
  },
});

export default DetailSession;
