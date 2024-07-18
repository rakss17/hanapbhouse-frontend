import { Tabs } from "expo-router";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/styles/styles";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const isDarkMode = useSelector(
    (state: RootState) => state.statusInfo.is_dark_mode
  );

  const tabBarBackgroundColor = isDarkMode
    ? Colors.primaryDarkModeColor2
    : Colors.secondaryColor1;

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primaryColor1,
          tabBarActiveBackgroundColor: tabBarBackgroundColor,
          tabBarInactiveBackgroundColor: tabBarBackgroundColor,
          tabBarStyle: {
            borderTopWidth: 0,
            backgroundColor: tabBarBackgroundColor,
          },
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
          name="chat"
          options={{
            title: "Messages",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "chatbox" : "chatbox-outline"}
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
