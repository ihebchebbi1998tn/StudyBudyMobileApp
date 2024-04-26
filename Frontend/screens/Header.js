// Updated Header component with design improvements

import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Icon, Avatar } from 'react-native-elements';
import { UserContext } from '../../Backend/UserContext';
import { useNavigation } from "@react-navigation/native"; // Import the navigation hook
import { BASE_URL } from '../../Backend/apiConfig';
const Header = () => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const connectedUser = {
    name: user && user.firstName ? user.firstName : '',
    image: user && user.profileImage ?`${BASE_URL}Studybuddy/api/${user.profileImage}` : null,
    forname: user && user.lastName ? user.lastName : '',
  };

  const handleLogout = () => {
  
    navigation.navigate('Login');
  };

  const handleProfile = () => {
    // Implement navigation to profile screen
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleProfile} style={styles.userInfo}>
        <Avatar source={{ uri: connectedUser.image }} size="medium" rounded />
        <Text style={styles.userName}>{connectedUser.name} {connectedUser.forname} </Text>
      </TouchableOpacity>
      <View style={styles.buttonsContainer}>
       
        <TouchableOpacity onPress={handleProfile} style={styles.profileButton}>
          <Icon
            name="user"
            type="antdesign"
            color="#fff"
            size={24}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon
            name="logout"
            type="antdesign"
            color="#fff"
            size={24}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 14,
    backgroundColor: '#007EA4',
    borderBottomWidth: 2,
    borderBottomColor: '#005C7A',

    elevation: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#005C7A',
  },
  profileButton: {
    marginLeft: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#005C7A',
  },
});

export default Header;
