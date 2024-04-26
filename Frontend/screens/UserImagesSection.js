import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Image, Text, StyleSheet, Modal, View } from 'react-native';
import { Button, Icon, Avatar } from 'react-native-elements';
import { UserContext } from "../../Backend/UserContext";
import { useContext } from "react";
import { BASE_URL } from '../../Backend/apiConfig';
const UserImagesSection = ({ sessionId }) => {
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchParticipants = () => {
      fetch(`${BASE_URL}Studybuddy/api/get_participants.php?sessionId=${sessionId}`)
        .then(response => response.json())
        .then(data => {
          setParticipants(data);
        })
        .catch(error => console.error("Error fetching participants:", error));
    };

    // Initial fetch
    fetchParticipants();

    // Refresh every second
    const intervalId = setInterval(fetchParticipants, 1000);

    // Cleanup interval
    return () => clearInterval(intervalId);
  }, [sessionId]);

  const openModal = (participant) => {
    setSelectedParticipant(participant);
    setModalVisible(true);
  };

  const addFriend = () => {
    if (selectedParticipant) {
      console.log(selectedParticipant); // Log the selectedParticipant object
     
      // Fetch API endpoint to add the friend
      fetch(`${BASE_URL}Studybuddy/api/add_friend.php?user1_id=${user.userID}&user2_id=${selectedParticipant.userID}`)
        .then(response => response.text())
        .then(data => {
          console.log(data); // Log response from the server
          setModalVisible(false); // Close modal after adding friend
        })
        .catch(error => console.error("Error adding friend:", error));
    }
  };

  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
        {participants.map((participant, index) => (
          <TouchableOpacity key={index} style={styles.participant} onPress={() => openModal(participant)}>
            <Avatar source={{ uri: `${BASE_URL}Studybuddy/api/${participant.profileImage}` }} size={60} rounded />
            <Text style={styles.name}>{participant.firstName}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Avatar source={{ uri: `${BASE_URL}Studybuddy/api/${selectedParticipant && selectedParticipant.profileImage}` }} size={100} rounded />
            <Text style={styles.modalText}>{selectedParticipant && selectedParticipant.firstName}</Text>
            <Text style={styles.bioText}>{selectedParticipant && selectedParticipant.bio}</Text>
            <Button
              icon={
                <Icon
                  name="user-plus"
                  type="font-awesome"
                  size={20}
                  color="white"
                  style={{ marginRight: 10 }}
                />
              }
              title="Add Friend"
              onPress={addFriend}
              buttonStyle={styles.addButton}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Icon
                name="close"
                type="material"
                size={30}
                color="#007EA4"
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  participant: {
    marginRight: 15,
    alignItems: 'center',
  },
  name: {
    marginTop: 5,
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bioText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#007EA4',
    marginTop: -10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default UserImagesSection;
