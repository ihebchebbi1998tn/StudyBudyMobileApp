import React, { useState } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
import Dashboard from "../screens/Dashboard";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import Profile from "../screens/Profile";
import Welcome from "../screens/Welcome";
import { UserProvider } from "../../Backend/UserContext";
import AllSessions from "../screens/AllSessions";
import AddSession from "../screens/AddSession";
import MySessions from "../screens/MySessions";
import DetailSession from "../screens/DetailSession";
import { LogBox } from 'react-native';
import TimerInterface from "../screens/TimerInterface";
import TaskPage from "../screens/TaskPage";
const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [user, setUser] = useState(null);

  // Ignore the specific warning about VirtualizedLists nesting inside ScrollViews
  LogBox.ignoreLogs([' ERROR  VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.']);

  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          {/* Dashboard screen */}
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{ headerShown: false }}
          />

          {/* Welcome screen */}
          <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{ headerShown: false }}
          />

          {/* Login screen */}
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />

          {/* SignUp screen */}
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          />

          {/* Profile screen */}
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
          />

          {/* AllSessions screen */}
          <Stack.Screen
            name="AllSessions"
            component={AllSessions}
            options={{ headerShown: false }}
          />

          {/* MySessions screen */}
          <Stack.Screen
            name="MySessions"
            component={MySessions}
            options={{ headerShown: false }}
          />
          
          {/* DetailSession screen */}
          <Stack.Screen
            name="DetailSession"
            component={DetailSession}
            options={{ headerShown: false }}
          />
       <Stack.Screen
            name="TimerInterface"
            component={TimerInterface}
            options={{ headerShown: false }}
          />
          {/* AddSession screen */}
          <Stack.Screen
            name="AddSession"
            component={AddSession}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="TaskPage"
            component={TaskPage}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

export default RootNavigator;
