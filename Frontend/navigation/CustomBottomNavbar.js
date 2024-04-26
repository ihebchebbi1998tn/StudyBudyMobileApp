import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";


const CustomBottomNavbar = () => {
  return (
    <View style={styles.container}>
      <TabButton icon="home" label="Home" screen="Dashboard" />
      <TabButton icon="book" label=" Sessions" screen="AllSessions" />
      <TabButton icon="stopwatch" label="Study" screen="TimerInterface" />

      <TabButton icon="add-circle" label="Add Session" screen="AddSession" />
      <TabButton icon="checkmark-done-circle-sharp" label="Task" screen="TaskPage" />
    </View>
  );
};

const TabButton = ({ icon, label, screen }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const isActive = route.name === screen;

  const navigateTo = () => {
    navigation.navigate(screen);
  };

  return (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={navigateTo}
    >
      <Ionicons name={icon} size={24} color={isActive ? "#FFF" : "#007EA4"} />
      {isActive && <Text style={styles.tabLabel}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFF",
    elevation: 5,
    paddingHorizontal: 20,
    paddingVertical: 0,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  activeTabButton: {
    backgroundColor: "#007EA4",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  tabLabel: {
    marginTop: 5,
    fontSize: 12,
    color: "#fff",
  },
});

export default CustomBottomNavbar;
