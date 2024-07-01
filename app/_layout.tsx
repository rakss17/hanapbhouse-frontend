import { Stack } from "expo-router";
import { ToastProvider } from "react-native-toast-notifications";
import { Text } from "react-native";
import { Viewport } from "@/styles/styles";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/lib/store";

export default function RootLayout() {
  return (
    <ToastProvider
      icon={<Text>👋</Text>}
      style={{ top: Viewport.height * 0.03 }}
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Stack
            initialRouteName="(auth)"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </PersistGate>
      </Provider>
    </ToastProvider>
  );
}
