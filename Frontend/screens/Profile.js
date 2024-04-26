import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "./Header";
import CustomBottomNavbar from "../navigation/CustomBottomNavbar";
import { UserContext } from "../../Backend/UserContext";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { BASE_URL } from "../../Backend/apiConfig";
function Profile() {
  const { user, updateUser } = useContext(UserContext);
  const navigation = useNavigation(); // Initialize navigation

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(user.phonenumber);
  const [profileImage, setProfileImage] = useState(user.profileimage);
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("userID", user.userID); // Assuming you have userID in your user context
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phonenumber", phonenumber);

      const response = await fetch(
        `${BASE_URL}Studybuddy/api/update_profile.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        updateUser({
          // Corrected function name here
          ...user,
          firstName,
          lastName,
          email,
          phoneNumber,
        });
        Alert.alert("Success", "Profile updated successfully");
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "An error occurred while updating profile");
    }
  };

  const handleCancel = () => {
    // Implement your cancel logic here
    console.log("Update canceled");
  };

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Denied",
        "Permission to access camera roll is required!"
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.cancelled) {
      setProfileImage(pickerResult.uri);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete your account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const response = await fetch(
                `${BASE_URL}Studybuddy/api/delete_user.php?userID=${user.userID}`,
                {
                  method: "DELETE",
                }
              );
              const data = await response.json();
              if (data.success) {
                // Perform any additional actions after successful deletion
                Alert.alert("Success", "User deleted successfully");
                navigation.navigate('Login'); // Navigate to login screen
              } else {
                Alert.alert("Error", data.message);
              }
            } catch (error) {
              console.error("Error deleting user:", error);
              Alert.alert("Error", "An error occurred while deleting user");
            }
          },
        },
      ]
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollViewContent}> 
        <View style={styles.maincontainer}>
          <View style={styles.whiteContainer}>
            <TouchableOpacity
              onPress={handlePickImage}
              style={styles.avatarContainer}
            >
              <Image
                source={{ uri: `${BASE_URL}Studybuddy/api/${user.profileImage}` }}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={lastName}
              onChangeText={(text) => setLastName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword} // Changed here
              secureTextEntry
            />

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text)}
              keyboardType="phone-pad"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={handleUpdate} style={[styles.button, styles.updateButton]}>
                <FontAwesome name="check" size={20} color="#fff" />
                <Text style={styles.buttonText}> Update</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancel} style={[styles.button, styles.cancelButton]}>
                <FontAwesome name="times" size={20} color="#fff" />
                <Text style={styles.buttonText}> Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <CustomBottomNavbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  maincontainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  whiteContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#ddd",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 0.48, // Adjust as needed
  },
  updateButton: {
    backgroundColor: "#007EA4",
  },
  cancelButton: {
    backgroundColor: "#007EA4",
    borderColor: "#007EA4",
    borderWidth: 1,
  },
  deleteButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "#fff",
    marginLeft: 5,
  },
});

export default Profile;