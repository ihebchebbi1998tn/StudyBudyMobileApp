import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

function Welcome({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.studyBuddyText}>Study Buddy</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.buttonTextBlue}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 5,
    color: '#000',
    fontWeight: 'bold',
  },
  studyBuddyText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007EA4', // Blue color
  },
  logo: {
    width: 200,
    height: 150,
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#007EA4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    width: 150,
  },
  signUpButton: {
    backgroundColor: '#fff',
    borderColor: '#007EA4',
    borderWidth: 2,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
    width: 150,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonTextBlue: {
    color: '#007EA4',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Welcome;
