import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Text, Icon, Avatar, Card, Button ,Image } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomBottomNavbar from "../navigation/CustomBottomNavbar";
import { UserContext } from "../../Backend/UserContext";
import { useContext } from "react";
import Header from "./Header";
import FriendsSection from "./FriendsSection";
import { BASE_URL } from "../../Backend/apiConfig";
import SessionParticipationChart from "./SessionParticipationChart";

const OngoingSessionsSection = () => {
  const navigation = useNavigation();
  const [ongoingSessionsData, setOngoingSessionsData] = useState([]);
  const { user } = useContext(UserContext);

  
  useEffect(() => {
    const interval = setInterval(fetchOngoingSessionsData, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchOngoingSessionsData = () => {
    fetch(`${BASE_URL}Studybuddy/api/get_user_active_sessions.php?user_id=${user.userID}`)
      .then((response) => response.json())
      .then((data) => setOngoingSessionsData(data))
      .catch((error) => console.error("Error fetching ongoing sessions:", error));
  };

  const handleJoinSession = (sessionId) => {
    navigation.navigate("DetailSession", { sessionId });
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Sessions</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AllSessions")}>
          <Text style={styles.seeAllText}>See all sessions</Text>
        </TouchableOpacity>
      </View>
      {ongoingSessionsData.length === 0 ? (
         <View style={styles.imageContainer}>
         <TouchableOpacity onPress={() => {/* Handle image click */}}>
         <Image
 source={{ uri: 'https://i.ibb.co/wRhDdWF/image.png' }} 
 style={styles.image}
 resizeMode='contain'
/>

         </TouchableOpacity>
         <Text style={styles.noFriendsText}>Join sessions so you can see them here</Text>
       </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sessionsContainer}
        >
          {ongoingSessionsData.map((session, index) => (
            <Card key={index} containerStyle={styles.sessionCard}>
              <View style={styles.sessionDetails}>
                <Text style={styles.sessionTitle}>{session.title}</Text>
                <Text style={styles.detailsText}>
                  Participants: {session.GroupNumber} 
                </Text>
                <Text style={styles.detailsText}>
                  Location: {session.location}
                </Text>
                <Text style={styles.detailsText}>
                  Duration: {session.startTime} - {session.endTime} 
                </Text>
                <Text style={styles.detailsText}>Topic: {session.Subject}</Text>
              </View>
              <TouchableOpacity
                onPress={() => console.log(`Join ${session.title}`)}
                style={styles.joinButtonContainer}
              >
                <Button
                  title=" See more"
                  type="solid"
                  buttonStyle={styles.joinButton}
                  titleStyle={styles.joinButtonText}
                  icon={
                    <Icon
                      name="expand-alt"
                      type="font-awesome-5"
                      size={18}
                      color="white"
                    />
                  }
                  onPress={() => handleJoinSession(session.sessionID)} // Pass session ID to handleJoinSession function
                />
              </TouchableOpacity>
            </Card>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const Dashboard = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Header />
        <ScrollView style={styles.contentContainer}>
          <FriendsSection userId={user.userID} />
          <SessionParticipationChart userID={user.userID} />
          <OngoingSessionsSection />
        </ScrollView>
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
  contentContainer: {
    paddingVertical: 15,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007EA4",
  },
  seeAllText: {
    color: "#007EA4",
  },
  sessionCard: {
    width: 250,
    marginRight: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FFF",
    elevation: 3,
  },
  sessionsContainer: {
    paddingBottom: 10,
  },
  sessionDetails: {
    flex: 1,
  },
  sessionTitle: {
    color: "#007EA4",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  detailsText: {
    color: "#555",
    fontSize: 12,
  },
  joinButtonContainer: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  joinButton: {
    backgroundColor: "#007EA4",
    borderRadius: 5,
  },
  joinButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  noSessionsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  noFriendsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 100,
  },
});

export default Dashboard;
