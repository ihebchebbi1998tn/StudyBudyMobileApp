import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity } from "react-native";
import { Text, Icon, Card, Button } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomBottomNavbar from "../navigation/CustomBottomNavbar";
import Header from "./Header";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../../Backend/apiConfig";
import { UserContext } from "../../Backend/UserContext";

const AllSessions = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(null);
  const [sessionsData, setSessionsData] = useState([]);
  const [sessionStates, setSessionStates] = useState({});
  const navigation = useNavigation();
  const { user } = useContext(UserContext);

  // Function to update session state
  const updateSessionState = (sessionId, exists) => {
    setSessionStates(prevState => ({
      ...prevState,
      [sessionId]: exists
    }));
  };

  // Function to check if the session is full
  const checkjoined = async (sessionId) => {
    try {
      const response = await fetch(
        `${BASE_URL}Studybuddy/api/check_joined.php?session_id=${sessionId}&user_id=${user.userID}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      // Set user exists in session state for this session
      updateSessionState(sessionId, data.exists);

    } catch (error) {
      console.error("Error checking user session:", error);
      // Handle error gracefully
    }
  };

  useEffect(() => {
    const fetchSessionsData = () => {
      fetch(`${BASE_URL}studybuddy/api/get_all_sessions.php`)
        .then((response) => response.json())
        .then((data) => {
          setSessionsData(data);
          data.forEach((session) => {
            checkjoined(session.sessionID); // Assuming sessionID is the correct field
          });
        })
        .catch((error) => {
        });
    };
  
    fetchSessionsData();
    // Refresh every second
    const intervalId = setInterval(fetchSessionsData, 1000);
  
    // Cleanup interval
    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const handleJoinSession = (sessionId) => {
    navigation.navigate("DetailSession", { sessionId });
  };

  const renderSessionItem = ({ item }) => {
    const buttonText = sessionStates[item.sessionID] ? "Session Joined " : "Join session";
    const iconname = sessionStates[item.sessionID] ? "user-check" : "arrow-right";

    return (
      <Card containerStyle={styles.sessionCard}>
        <View style={styles.sessionDetails}>
          <Text style={styles.sessionTitle}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.detailsRow}>
              <Icon name="book" type="material-community" color="#007EA4" />
              <Text style={styles.detailsText}>{item.Subject}</Text>
            </View>
            <View style={styles.detailsRow}>
              <Icon name="people" type="material-icons" color="#007EA4" />
              <Text style={styles.detailsText}>{`${item.GroupNumber} out of ${item.maxGroupNumber} people joined this session`}</Text>
            </View>
            <View style={styles.detailsRow}>
              <Icon name="event" type="material-icons" color="#007EA4" />
              <Text style={styles.detailsText}>
                {formatDate(item.dateStart)} ( {item.startTime} - {item.endTime} )
              </Text>
            </View>
          </View>
          <Button
            title={buttonText +" "}
            icon={<Icon name={iconname} type="font-awesome-5" size={13} color="white" />}
            iconRight
            type="solid"
            buttonStyle={styles.joinButton}
            titleStyle={styles.joinButtonText}
            onPress={() => handleJoinSession(item.sessionID)} // Pass session ID to handleJoinSession function
          />
        </View>
      </Card>
    );
  };

  const renderDateItem = (date, index) => {
    return (
      <TouchableOpacity
        key={date}
        style={[styles.dateItem, selectedDate === date && styles.selectedDate]}
        onPress={() => setSelectedDate(date === "See all" ? null : date)}
      >
        <Text
          style={[
            styles.dateText,
            selectedDate === date && styles.selectedDateText,
          ]}
        >
          {date}
        </Text>
      </TouchableOpacity>
    );
  };

  const filterSessionsByDate = (date) => {
    if (!date || date === "See all") {
      return sessionsData;
    }
    const filteredSessions = sessionsData.filter(
      (session) => formatDate(session.dateStart) === date
    );
    return filteredSessions;
  };

  // Define the dates array based on selected date
  const dates = [
    "See all",
    ...Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return formatDate(date);
    }),
  ];

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.buttonContainer}>
          <Button
            title=" ALL SESSIONS"
            type="clear"
            buttonStyle={styles.button}
            titleStyle={[styles.buttonTitle, { textAlign: "left" }]}
            icon={<Icon name="book" type="material-icons" color="#007EA4" />}
          />
          <Button
            title=" MY SESSIONS"
            type="clear"
            buttonStyle={styles.mysessionsbutton}
            titleStyle={[styles.mysessionsbuttonTitle, { textAlign: "left" }]}
            icon={<Icon name="people" type="material-icons" color="#fff" />}
            onPress={() => navigation.navigate('MySessions')}
          />
        </View>
        <View style={styles.datePickerContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* Render date items */}
            {dates.map(renderDateItem)}
          </ScrollView>
        </View>
        <FlatList
          data={filterSessionsByDate(selectedDate)}
          keyExtractor={(item) => item.sessionID.toString()}
          renderItem={renderSessionItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.noSessionsText}>No sessions for this date.</Text>
          }
        />
            <CustomBottomNavbar />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  datePickerContainer: {
    paddingVertical: 10,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  dateItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  selectedDate: {
    backgroundColor: "#007EA4",
  },
  dateText: {
    color: "#000",
    fontWeight: "bold",
  },
  selectedDateText: {
    color: "#fff",
  },
  sessionCard: {
    width: "90%",
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#FFF",
    elevation: 3,
  },
  sessionDetails: {
    padding: 15,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007EA4",
    marginBottom: 5,
  },
  description: {
    marginBottom: 10,
  },
  detailsContainer: {
    marginBottom: 5,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  detailsText: {
    marginLeft: 5,
    color: "#555",
  },
  joinButton: {
    backgroundColor: "#007EA4",
    marginTop: 10,
    borderRadius: 5,
    paddingHorizontal: 20,
  },
  joinButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 5,
  },
  listContainer: {
    flexGrow: 1,
  },
  noSessionsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
  button: {
    backgroundColor: "#f0f0f0",
    width: "100%",
    marginBottom: 10,
  },
  mysessionsbutton: {
    backgroundColor: "#007EA4",
    width: "100%",
    marginBottom: 10,
  },
  mysessionsbuttonTitle: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonTitle: {
    color: "#007EA4",
    fontWeight: "bold",
  },
});

export default AllSessions;
