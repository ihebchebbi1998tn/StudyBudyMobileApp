import React, { useState, useContext } from "react";
import { Alert, View, Image, StyleSheet, ActivityIndicator } from "react-native";
import { Input, Button, CheckBox, Text, Icon } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native";
import { UserContext } from "../../Backend/UserContext";
import { BASE_URL } from "../../Backend/apiConfig";

const Login = ({ navigation }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateUser } = useContext(UserContext);

  const handleLoginPress = async () => {
    setLoading(true);
    try {
      if (!identifier.trim() || !password.trim()) {
        Alert.alert("Error", "Please enter both email/phone number and password.");
        setLoading(false);
        return;
      }
  
      // Simulate a delay for 4 seconds
      setTimeout(async () => {
        const url = `${BASE_URL}Studybuddy/api/login.php?email=${encodeURIComponent(identifier)}&password=${encodeURIComponent(password)}`;
  
        const response = await fetch(url);
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const data = await response.json(); // Parse response as JSON
  
        if (data.success) {
          updateUser(data.userData); // Update user data in the context
          navigation.navigate("Dashboard"); // Navigate to Dashboard
        } else {
          Alert.alert("Error", data.message || "An error occurred. Please try again later.");
        }
      }, 4000);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    }
  };
  
  

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Text style={styles.title}>Login</Text>
            <Image
              source={require("../assets/Login.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.inputTitle}>Email</Text>
            <Input
              placeholder="Enter Email"
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              placeholderTextColor="#007EA4"
              onFocus={() => {
                if (identifier === "") {
                  setIdentifier("");
                }
              }}
              value={identifier}
              onChangeText={(text) => setIdentifier(text)}
            />

            <Text style={styles.inputTitle}>Password</Text>
            <Input
              placeholder="*******"
              secureTextEntry
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              placeholderTextColor="#007EA4"
              value={password}
              onChangeText={(text) => setPassword(text)}
              onFocus={() => {
                if (password === "") {
                  setPassword("");
                }
              }}
            />

            <View style={styles.buttonContainer}>
              {loading ? (
                <ActivityIndicator size="large" color="#007EA4" />
              ) : (
                <Button
                  title="   Login"
                  buttonStyle={[
                    styles.loginButton,
                    { backgroundColor: "#007EA4" },
                  ]}
                  titleStyle={styles.buttonText}
                  icon={
                    <Icon
                      name="rocket"
                      type="font-awesome"
                      size={15}
                      color="white"
                    />
                  }
                  onPress={handleLoginPress}
                />
              )}
            </View>

            <View style={styles.signupContainer}>
              <Text style={styles.noAccountText}>Don't have an account?</Text>
              <Text
                style={styles.signUpText}
                onPress={() => navigation.navigate("SignUp")}
              >
                Sign Up
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 15,
    backgroundColor: "#E0EEF5",
    borderRadius: 10,
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  inputText: {
    fontSize: 16,
    color: "#000",
  },
  checkboxContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    margin: 0,
    padding: 0,
  },
  checkboxText: {
    color: "#007EA4",
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  loginButton: {
    width: 200,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
    height: 50,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#007EA4",
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  noAccountText: {
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signUpText: {
    color: "#007EA4",
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 16,
  },
  iconContainer: {
    alignItems: "center",
    marginTop: 20,
  },
});

export default Login;
