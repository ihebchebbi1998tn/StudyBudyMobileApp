// NavigationContainer.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome5, AntDesign, MaterialCommunityIcons, Feather } from '@expo/vector-icons';


const NavigationContainer = ({ state, descriptors, navigation }) => {
  const icons = {
    Home: <Ionicons name="ios-home" size={24} color="gray" />,
    Courses: <FontAwesome5 name="book" size={24} color="gray" />,
    'New Session': <AntDesign name="pluscircleo" size={24} color="gray" />,
    'All Sessions': <MaterialCommunityIcons name="account-group" size={24} color="gray" />,
    History: <Feather name="clock" size={24} color="gray" />,
  };

  return (
    <View style={styles.footer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            onPress={onPress}
            style={styles.tab}
          >
            {icons[route.name]}
            <Text style={{ color: isFocused ? '#007EA4' : 'gray', marginTop: 4 }}>{route.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    paddingVertical: 8,
  },
  tab: {
    alignItems: 'center',
  },
});

export default NavigationContainer;
