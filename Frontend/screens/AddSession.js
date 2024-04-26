import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
  ScrollView,
  Modal,
} from "react-native";
import { TimerPickerModal } from "react-native-timer-picker";
import DateTimePicker from "react-native-ui-datepicker";
import Icon from "react-native-vector-icons/FontAwesome"; // Import the icon library
import Header from "./Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native"; // Import the navigation hook
import { UserContext } from '../../Backend/UserContext';
import { useContext } from "react";
import { BottomNavigation } from "react-native-paper";
import CustomBottomNavbar from "../navigation/CustomBottomNavbar";
import { BASE_URL } from "../../Backend/apiConfig";

const AddSession = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [numMembers, setNumMembers] = useState("");
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [subject, setSubject] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation(); // Get the navigation object
  const { user } = useContext(UserContext);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  const handleCreateSession = () => {
    // Format date to YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
      // Convert numMembers to a number
  const parsedNumMembers = parseInt(numMembers);

  // Check if numMembers is less than 2
  if (parsedNumMembers < 2) {
    // Display an error message to the user
    Alert.alert('Error', 'Number of members must be at least 2');
    return; // Exit the function early
  }
    // Format startTime and endTime to HH:MM AM/PM
    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);
  
    // Perform logic to create a new session with the entered data
    const url = `${BASE_URL}Studybuddy/api/add_session.php?userID=${user.userID}&location=${location}&title=${title}&subject=${subject}&description=${description}&startDate=${formattedDate}&startTime=${formattedStartTime}&endTime=${formattedEndTime}&maxGroupNumber=${numMembers}`;
      
    fetch(url)
      .then(response => response.text())
      .then(result => {
        console.log(result);
        setModalVisible(true); // Show modal when session is added
      })
      .catch(error => console.error('Error:', error));
  };
  
  // Function to format time to HH:MM AM/PM
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    let formattedHours = parseInt(hours, 10);
    const suffix = formattedHours >= 12 ? 'PM' : 'AM';
    formattedHours = formattedHours % 12 || 12;
    return `${formattedHours.toString().padStart(2, '0')}:${minutes} ${suffix}`;
  };

  const closeModal = () => {
    setModalVisible(false);
    // Navigate back to the AllSessions page
    navigation.navigate('AllSessions');
  };


  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.formContainer}>
            <Text style={styles.title}>New Session</Text>

            <View style={styles.inputContainer}>
              <View style={styles.iconContainer}>
                <Icon
                  name="pencil"
                  size={20}
                  color="#007fa5"
                  style={styles.icon}
                />
                <Text style={styles.label}>Title</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter title"
                value={title}
                onChangeText={(text) => setTitle(text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.iconContainer}>
                <Icon
                  name="info-circle"
                  size={20}
                  color="#007fa5"
                  style={styles.icon}
                />
                <Text style={styles.label}>Description</Text>
              </View>
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Enter description"
                value={description}
                multiline
                numberOfLines={4}
                onChangeText={(text) => setDescription(text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.iconContainer}>
                <Icon
                  name="book"
                  size={20}
                  color="#007fa5"
                  style={styles.icon}
                />
                <Text style={styles.label}>Subject</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter subject"
                value={subject}
                onChangeText={(text) => setSubject(text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.iconContainer}>
                <Icon
                  name="map-marker"
                  size={20}
                  color="#007fa5"
                  style={styles.icon}
                />
                <Text style={styles.label}>Location</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter location"
                value={location}
                onChangeText={(text) => setLocation(text)}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.iconContainer}>
                <Icon
                  name="users"
                  size={20}
                  color="#007fa5"
                  style={styles.icon}
                />
                <Text style={styles.label}>Number of Members</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter number of members"
                value={numMembers}
                onChangeText={(text) => setNumMembers(text)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.iconContainer}>
                <Icon
                  name="calendar"
                  size={20}
                  color="#007fa5"
                  style={styles.icon}
                />
                <Text style={styles.label}>Date</Text>
              </View>
              <DateTimePicker
                mode="single"
                date={date}
                onChange={(params) => handleDateChange(params.date)}
                containerStyle={styles.dateTimePickerContainer}
              />
            </View>

            <View style={styles.timeInputContainer}>
              <View style={styles.timeInputWrapper}>
                <View style={styles.iconContainer}>
                  <Icon
                    name="clock-o"
                    size={20}
                    color="#007fa5"
                    style={styles.icon}
                  />
                  <Text style={styles.label}>Start Time</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="HH:MM"
                  value={startTime}
                  onFocus={() => setShowStartTimePicker(true)}
                />
                <TimerPickerModal
                  visible={showStartTimePicker}
                  setIsVisible={setShowStartTimePicker}
                  onConfirm={(pickedDuration) => {
                    setStartTime(
                      pickedDuration.hours + ":" + pickedDuration.minutes
                    );
                    setShowStartTimePicker(false);
                  }}
                  onCancel={() => setShowStartTimePicker(false)}
                />
              </View>

              <View style={styles.timeInputWrapper}>
                <View style={styles.iconContainer}>
                  <Icon
                    name="clock-o"
                    size={20}
                    color="#007fa5"
                    style={styles.icon}
                  />
                  <Text style={styles.label}>End Time</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="HH:MM"
                  value={endTime}
                  onFocus={() => setShowEndTimePicker(true)}
                />
                <TimerPickerModal
                  visible={showEndTimePicker}
                  setIsVisible={setShowEndTimePicker}
                  onConfirm={(pickedDuration) => {
                    setEndTime(
                      pickedDuration.hours + ":" + pickedDuration.minutes
                    );
                    setShowEndTimePicker(false);
                  }}
                  onCancel={() => setShowEndTimePicker(false)}
                />
              </View>
            </View>

            <Button
              title="Create Session ✔"
              onPress={handleCreateSession}
              color="#007fa5"
            />
          </View>
        </ScrollView>
      </View>
       <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Session Added</Text>
            <Button title="CLOSE" onPress={closeModal} color="#007fa5" />
          </View>
        </View>
      </Modal>
      <CustomBottomNavbar />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f0",
  },
  formContainer: {
    margin: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#007fa5",
  },

  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#007fa5",
  },
  input: {
    height: 40,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: "#000",
  },
  descriptionInput: {
    height: 90,
  },
  timeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeInputWrapper: {
    flex: 1,
    marginRight: 10,
  },
  dateTimePickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 2,
  },
  icon: {
    marginRight: 10, // Add some space between input and icon
  },
  iconContainer: {
    marginBottom: 8,
    flexDirection: "row", // Align icon and input horizontally
    alignItems: "center", // Align icon and input vertically
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default AddSession;
