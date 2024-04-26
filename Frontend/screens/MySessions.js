import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Text, Icon, Card, Button } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomBottomNavbar from "../navigation/CustomBottomNavbar";
import Header from "./Header";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from '../../Backend/UserContext';
import { useContext } from "react";
import { BASE_URL } from "../../Backend/apiConfig";
const MySessions = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(null);
  const [sessionsData, setSessionsData] = useState([]);
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  useEffect(() => {
    // Get the userID from your authentication context or wherever it's available
    const userID = user.userID;

    fetch(`${BASE_URL}studybuddy/api/get_all_user_sessions.php?userID=${userID}`)
      .then((response) => response.json())
      .then((data) =>
        setSessionsData(
          data.map((session) => ({
            ...session,
            MaxGroupNumber: session.maxGroupNumber,
            GroupNumber: session.GroupNumber,
          }))
        )
      )
      .catch((error) => console.error("Error fetching sessions:", error));
  }, []);

  const filterSessionsByDate = (date) => {
    return sessionsData;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };
  
  const renderSessionItem = ({ item }) => {
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
              <Text style={styles.detailsText}>{`${item.GroupNumber} out of ${item.MaxGroupNumber} people joined this session`}</Text>
            </View>
            <View style={styles.detailsRow}>
              <Icon name="event" type="material-icons" color="#007EA4" />
              <Text style={styles.detailsText}>
                {formatDate(item.dateStart)} ( {item.startTime} - {item.endTime} )
              </Text>
            </View>
          </View>
          <Button
            title="Join Session  "
            icon={<Icon name="arrow-right" type="font-awesome-5" size={13} color="white" />}
            iconRight
            type="solid"
            buttonStyle={styles.joinButton}
            titleStyle={styles.joinButtonText}
            onPress={() => console.log(`Join ${item.title}`)}
          />
        </View>
      </Card>
    );
  };

  const navigateToAddSession = () => {
    navigation.navigate("AddSession");
  };

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
            icon={<Icon name="book" type="material-icons" color="#fff" />}
            onPress={() => navigation.navigate('AllSessions')}
          />
          <Button
            title=" MY SESSIONS"
            type="clear"
            buttonStyle={styles.mysessionsbutton}
            titleStyle={[styles.mysessionsbuttonTitle, { textAlign: "left" }]}
            icon={<Icon name="people" type="material-icons" color="#007EA4" />}
          />
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
      </SafeAreaView>
      <CustomBottomNavbar />
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
    marginLeft: 5
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
    backgroundColor: "#007EA4",
    width: "100%",
    marginBottom: 10,
  },
  mysessionsbutton: {
    backgroundColor: "#f0f0f0",
    width: "100%",
    marginBottom: 10,
  },
  mysessionsbuttonTitle: {
    color: "#007EA4",
    fontWeight: "bold",
  },
  buttonTitle: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default MySessions;
