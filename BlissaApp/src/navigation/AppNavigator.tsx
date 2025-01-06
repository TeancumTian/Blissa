import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import HomePage from "../components/HomePage";
// import ExpertDashboard from '../screens/ExpertDashboard';
// import Appointments from '../screens/Appointments';
// import ForgotPassword from '../screens/ForgotPassword';
// import ExpertRegister from '../screens/ExpertRegister';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="Home"
          component={HomePage}
        />
        {/* <Stack.Screen
          name="ExpertDashboard"
          component={ExpertDashboard}
        />
        <Stack.Screen
          name="Appointments"
          component={Appointments}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
        />
        <Stack.Screen
          name="ExpertRegister"
          component={ExpertRegister}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
