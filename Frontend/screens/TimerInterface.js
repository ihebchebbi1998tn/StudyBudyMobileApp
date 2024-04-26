import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ActivityIndicator, Modal, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BASE_URL } from "../../Backend/apiConfig";
import Header from "./Header";
import CustomBottomNavbar from "../navigation/CustomBottomNavbar";
import { ScrollView } from "react-native";
import { UserContext } from '../../Backend/UserContext';
import { useContext } from "react";

const TimerInterface = () => {
  const [studyTime, setStudyTime] = useState("");
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility
  const intervalRef = useRef(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!isNaN(studyTime)) {
      setTimer(parseInt(studyTime) * 60);
    }
  }, [studyTime]);

  useEffect(() => {
    if (isRunning) {
      setSessionStartTime(Date.now());

      intervalRef.current = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 0) {
            clearInterval(intervalRef.current);
            executeHttpRequest();
            setModalVisible(true); // Show modal when timer is up
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const executeHttpRequest = () => {
    setIsLoading(true);
    // Convert studyTime to a number
    const studyHours = parseFloat(studyTime);
    // Get the current date
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
  
    // Prepare URL with parameters
    const apiUrl = `${BASE_URL}Studybuddy/api/add_study_time.php?user_id=${user.userID}&study_date=${year}-${month}-${day}&study_hours=${studyHours}`;
  
    // Execute GET request
    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      setIsLoading(false);
      if (response.ok) {
      } else {
      }
    })
    .catch(error => {
      setIsLoading(false);
      console.error('Error:', error);
    });
  };
  
  const startTimer = () => {
    if (!isNaN(studyTime) && parseInt(studyTime) > 0) {
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setTimer(0);
    setIsRunning(false);
    setSessionStartTime(null);
    setStudyTime("");
  };

  const formatTime = (time) => {
    if (isNaN(time) || time < 0) {
      return "00:00:00";
    }
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <Image source={require('../../assets/study.jpg')} style={styles.image} />
          <Text style={styles.timer}>{formatTime(timer)}</Text>

          <Text style={styles.label}>Set Study Time (Hours)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter study time"
            value={studyTime}
            onChangeText={(text) => setStudyTime(text)}
          />
          <TouchableOpacity style={[styles.button, { backgroundColor: isRunning ? "#FF6347" : "#007EA4" }]} onPress={isRunning ? pauseTimer : startTimer}>
            <Text style={styles.buttonText}>{isRunning ? "Pause" : "Start Study"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: "#007EA4" }]} onPress={resetTimer}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
          {isLoading && <ActivityIndicator size="large" color="#007EA4" />}
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          // Reload the page when the modal is closed
          window.location.reload();
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Good job for studying!</Text>
          <Button title="Back" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      <CustomBottomNavbar />
    </SafeAreaView> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  innerContainer: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007EA4",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 18,
  },
  button: {
    width: "100%",
    backgroundColor: "#007EA4",
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  timer: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007EA4",
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 0,
    marginTop: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Modal styles
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20
  }
});

export default TimerInterface;
