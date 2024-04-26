import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import ChatMessages from "./ChatMessages";
import Header from "./Header";
import DetailsSessionsCard from "./DetailsSessionsCard";
import { UserContext } from "../../Backend/UserContext";
import { BASE_URL } from "../../Backend/apiConfig";

const JoinSessionModal = ({ isVisible, onBackdropPress, onJoin, onCancel }) => (
  <Modal
    isVisible={isVisible}
    onBackdropPress={onBackdropPress}
    backdropPressToClose={false}
    style={styles.modalContainer}
  >
    <View style={styles.modalContent}>
      <Ionicons
        name="information-circle-outline"
        size={50}
        color="#007EA4"
        style={styles.icon}
      />
      <Text style={styles.modalText}>Would you like to join the session?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.joinButton]}
          onPress={onJoin}
        >
          <Text style={styles.buttonText}>JOIN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.buttonText}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const SessionFullModal = ({ isVisible, onBackdropPress, onGoBack }) => (
  <Modal
    isVisible={isVisible}
    onBackdropPress={onBackdropPress}
    backdropPressToClose={false}
    style={styles.modalContainer}
  >
    <View style={styles.modalContent}>
      <Ionicons
        name="close-circle-outline"
        size={50}
        color="red"
        style={styles.icon}
      />
      <Text style={styles.modalText}>Sorry, the session is full.</Text>
      <TouchableOpacity
        style={styles.goBackButton}
        onPress={onGoBack}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.goBackText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  </Modal>
);

const DetailSession = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { sessionId } = route.params;
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showSessionFullModal, setShowSessionFullModal] = useState(false);
  const [userExistsInSession, setUserExistsInSession] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetch(
      `${BASE_URL}Studybuddy/api/check_joined.php?session_id=${sessionId}&user_id=${user.userID}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setUserExistsInSession(data.exists);
        if (!data.exists) {
          checkSessionFull();
        }
      })
      .catch((error) => {
        console.error("Error checking user session:", error);
      });
  }, [sessionId]);

  const checkSessionFull = () => {
    setTimeout(() => {
      fetch(
        `${BASE_URL}Studybuddy/api/check_session_full.php?sessionId=${sessionId}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.status === "full") {
            setShowSessionFullModal(true);
          } else {
            setShowJoinModal(true);
          }
        })
        .catch((error) => {
          console.error("Error checking session status:", error);
        });
    }, 1000); // 2000 milliseconds = 2 seconds
  };
  
  const handleJoinSession = () => {
    fetch(
      `${BASE_URL}Studybuddy/api/join_session.php?session_id=${sessionId}&user_id=${user.userID}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setShowJoinModal(false);
      })
      .catch((error) => {
        console.error("Error joining session:", error);
      });
  };

  const handleCancel = () => {
    setShowJoinModal(false);
    setShowSessionFullModal(false);
    navigation.navigate("AllSessions");
  };

  const handleGoBack = () => {
    setShowSessionFullModal(false);
    navigation.navigate("AllSessions");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <DetailsSessionsCard sessionId={sessionId} />
      <ChatMessages sessionId={sessionId} />
      <JoinSessionModal
        isVisible={showJoinModal}
        onBackdropPress={handleCancel}
        onJoin={handleJoinSession}
        onCancel={handleCancel}
      />
      <SessionFullModal
        isVisible={showSessionFullModal}
        onBackdropPress={handleGoBack}
        onGoBack={handleGoBack}
      />
    </SafeAreaView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: width * 0.9,
    marginTop: "93%",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  icon: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    padding: 15,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  joinButton: {
    backgroundColor: "#007EA4",
  },
  cancelButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  goBackButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  goBackText: {
    fontSize: 16,
    marginLeft: 5,
  },
});

export default DetailSession;
