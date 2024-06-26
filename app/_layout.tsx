import { Stack } from "expo-router";
import { ToastProvider } from "react-native-toast-notifications";
import { Text } from "react-native";
import { Viewport } from "@/styles/styles";

export default function RootLayout() {
  return (
    <ToastProvider
      icon={<Text>👋</Text>}
      style={{ top: Viewport.height * 0.03 }}
    >
      <Stack initialRouteName="(auth)" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ToastProvider>
  );
}
