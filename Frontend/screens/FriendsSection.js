import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Text, Avatar, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../../Backend/apiConfig";
import { UserContext } from "../../Backend/UserContext";
import { useContext } from "react";

const FriendsSection = () => {
  const [friendsData, setFriendsData] = useState([]);
  const navigation = useNavigation();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const interval = setInterval(fetchFriendsData, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchFriendsData = () => {
    fetch(`${BASE_URL}studybuddy/api/get_friends.php?userID=${user.userID}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setFriendsData(data);
        }
      })
      .catch((error) => console.error("Error fetching friends:", error));
  };

  const renderEmptyCircles = () => {
    const emptyCircles = [];
    for (let i = 0; i < 6; i++) { // Render 6 empty circles, you can adjust the number as needed
      emptyCircles.push(
        <View key={i} style={styles.emptyCircle} />
      );
    }
    return emptyCircles;
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Friends</Text>
      {friendsData.length === 0 ? (
        <View style={styles.emptyFriendsContainer}>
          <Icon name="user-friends" type="font-awesome-5" color="#888" size={60} />
          <Text style={styles.emptyFriendsText}>You haven't made any friends yet</Text>
        </View>
      ) : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.friendsContainer}
      >
        {friendsData.map((friend, index) => (
          <View key={index} style={styles.friendContainer}>
            <Avatar
              source={{ uri: `${BASE_URL}Studybuddy/api/${friend.profileImage}` }}
              size="large"
              rounded
              containerStyle={styles.avatarContainer}
            />
            <Text style={styles.friendName}>{friend.firstName}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007EA4",
  },
  friendsContainer: {
    paddingBottom: 10,
  },
  friendContainer: {
    marginRight: 15,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 5,
    borderWidth: 2,
    borderColor: "#007EA4",
  },
  friendName: {
    color: "#333",
    fontSize: 14,
  },
  emptyFriendsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F5F5F5",
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyFriendsText: {
    marginTop: 10,
    color: "#888",
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FriendsSection;
