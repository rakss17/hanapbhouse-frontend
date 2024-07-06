import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/styles/styles";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const isDarkMode = useSelector(
    (state: RootState) => state.statusInfo.is_dark_mode
  );
  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primaryColor1,
          tabBarActiveBackgroundColor: isDarkMode
            ? Colors.primaryDarkModeColor2
            : Colors.secondaryColor1,
          tabBarInactiveBackgroundColor: isDarkMode
            ? Colors.primaryDarkModeColor2
            : Colors.secondaryColor1,
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                color={color}
                size={28}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome5
                name={focused ? "user-alt" : "user"}
                color={color}
                size={28}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
