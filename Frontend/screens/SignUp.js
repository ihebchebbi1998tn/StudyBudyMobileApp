import React, { useState } from 'react';
import { View, Image, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Input, Button, Text, Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions'; // Import Permissions module
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../Backend/apiConfig';

const SignUp = () => {
  const navigation = useNavigation();

  const [imageURI, setImageURI] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Function to request permission to access camera roll
  const requestCameraRollPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      console.log('Permission to access camera roll denied');
      return false;
    }
    return true;
  };

  // Function to pick an image from the camera roll
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (status !== 'granted') {
      // Handle permission denied scenario
      console.log('Permission denied for accessing the camera roll');
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      setImageURI(result.uri);
    }
    
  };
  

  const signUp = async () => {
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    } else {
      setPasswordsMatch(true);
    }

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    formData.append('password', password);
    formData.append('profileImage', {
      uri: imageURI,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });

    try {
      const response = await fetch(`${BASE_URL}studybuddy/api/create_profile.php`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const responseData = await response.json();
      if (responseData.success) {
        Alert.alert('Success', 'User created successfully', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        Alert.alert('Error', responseData.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior="height">
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Text style={styles.title}>Sign Up</Text>
            <TouchableOpacity onPress={pickImage}>
              {imageURI ? (
                <Image source={{ uri: imageURI }} style={styles.profileImage} resizeMode="cover" />
              ) : (
                <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.profileImage} resizeMode="cover" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.nameContainer}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.inputTitle}>First Name</Text>
                <Input
                  placeholder="John"
                  containerStyle={styles.inputContainer}
                  inputStyle={styles.inputText}
                  placeholderTextColor="#007EA4"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputTitle}>Last Name</Text>
                <Input
                  placeholder="Doe"
                  containerStyle={styles.inputContainer}
                  inputStyle={styles.inputText}
                  placeholderTextColor="#007EA4"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            <Text style={styles.inputTitle}>Enter Email</Text>
            <Input
              placeholder="YourEmail@example.com"
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              placeholderTextColor="#007EA4"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.inputTitle}>Phone Number</Text>
            <Input
              placeholder="Your Phone Number"
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              keyboardType="numeric"
              placeholderTextColor="#007EA4"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />

            <Text style={styles.inputTitle}>Choose a password</Text>
            <Input
              placeholder="*******"
              secureTextEntry
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              placeholderTextColor="#007EA4"
              value={password}
              onChangeText={setPassword}
            />

            <Text style={styles.inputTitle}>Confirm password</Text>
            <Input
              placeholder="*******"
              secureTextEntry
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              placeholderTextColor="#007EA4"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            
            {!passwordsMatch && <Text style={{ color: 'red' }}>Passwords do not match</Text>}

            <View style={styles.buttonContainer}>
              <Button
                title="Sign Up"
                icon={<Icon name="user-plus" type="font-awesome" size={18} color="white" />}
                buttonStyle={[styles.signUpButton, { backgroundColor: '#007EA4' }]}
                titleStyle={styles.buttonText}
                onPress={signUp}
              />
            </View>

            <View style={styles.loginContainer}>
              <Text style={styles.haveAccountText}>Already have an account?</Text>
              <Text style={styles.loginText} onPress={() => navigation.navigate('Login')}>Login</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007EA4',
    marginBottom: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#007EA4',
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007EA4',
    marginBottom: 5,
  },
  inputText: {
    fontSize: 16,
    color: '#000',
  },
  buttonContainer: {
    alignItems: 'right',
    marginTop: 20,
  },
  signUpButton: {
    width: '100%',
    borderRadius: 10,
    height: 50,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  haveAccountText: {
    color: '#007EA4',
    textAlign: 'center',
    marginRight: 5,
    fontSize: 16,
  },
  loginText: {
    color: '#007EA4',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SignUp;
