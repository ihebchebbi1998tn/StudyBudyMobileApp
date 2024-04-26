import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import UserImagesSection from './UserImagesSection';
import { BASE_URL } from '../../Backend/apiConfig';
const DetailsSessionsCard = ({ sessionId }) => {
  const [sessionDetails, setSessionDetails] = useState(null);
  const [participantCount, setParticipantCount] = useState(0);
  const navigation = useNavigation();

  const fetchSessionDetails = () => {
    fetch(`${BASE_URL}Studybuddy/api/get_sessions_details.php?sessionId=${sessionId}`)
      .then(response => response.json())
      .then(data => {
        setSessionDetails(data);
      })
      .catch(error => {
      });
  };

  const fetchParticipantCount = () => {
    fetch(`${BASE_URL}Studybuddy/api/count_participants.php?sessionId=${sessionId}`)
      .then(response => response.json())
      .then(data => {
        setParticipantCount(data.participantCount);
      })
      .catch(error => {
      });
  };

  const updateGroupNumber = () => {
    setParticipantCount(prevParticipantCount => {
      fetch(`${BASE_URL}Studybuddy/api/update_group_number.php?sessionId=${sessionId}&newGroupNumber=${prevParticipantCount}`)
        .then(response => response.json())
        .then(data => {
          console.log(data); // Log the response from the API
        })
        .catch(error => {
        });
      // Return the previous participant count
      return prevParticipantCount;
    });
  };
  

  useEffect(() => {
    // Initial fetch
    updateGroupNumber();
    fetchSessionDetails();
    fetchParticipantCount();

    // Refresh every second
    const intervalId = setInterval(() => {
      fetchSessionDetails();
      fetchParticipantCount();
    }, 1000);

    // Cleanup interval
    return () => clearInterval(intervalId);
  }, [sessionId, participantCount]);

  return (
    <View style={styles.container}>
      <View style={styles.whiteContainer}>
        <ScrollView contentContainerStyle={styles.sessionDetails}>
          {sessionDetails && (
            <View style={styles.topHalf}>
              <View style={styles.titleContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('AllSessions')} style={styles.goBack}>
                  <Ionicons name="arrow-back" size={35} color="#007EA4" />
                </TouchableOpacity>
                <Text style={styles.title}>{sessionDetails.title}</Text>
              </View>
              <Text style={styles.description}>{sessionDetails.description}</Text>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={24} color="#007EA4" style={styles.icon} />
                <Text style={styles.infoText}>{sessionDetails.dateStart} ({sessionDetails.startTime} - {sessionDetails.endTime})</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={24} color="#007EA4" style={styles.icon} />
                <Text style={styles.infoText}>Location: {sessionDetails.location}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="people" size={24} color="#007EA4" style={styles.icon} />
                <Text style={styles.infoText}>Participants: {participantCount} / {sessionDetails.maxGroupNumber}</Text>
              </View>
              <UserImagesSection sessionId={sessionId} />
            </View>
          )}
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
  goBack: {
    marginRight: 2,
    marginTop: -8,
  },
  whiteContainer: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    margin: 0,
    elevation: 2,
  },
  sessionDetails: {
    paddingBottom: 0,
    borderBottomColor: '#ccc',
  },
  topHalf: {
    marginBottom: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007EA4',
    marginLeft: 10, // Adjust the spacing between the back button and the title
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
});

export default DetailsSessionsCard;
