import { Text, View, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setUserInfo } from "@/lib/features/userInfo/userInfoSlices";
import {
  setIsDarkMode,
  setIsLoggedIn,
  setOnAdmission,
} from "@/lib/features/statusInfo/statusInfoSlices";
import { Colors, Viewport } from "@/styles/styles";
import { ThemedContainer } from "@/components/ThemedContainer";
import { Button } from "@/components/Button";
import { useRouter } from "expo-router";

export default function Profile() {
  const [isEnabled, setIsEnabled] = useState(false);
  const isDarkMode = useSelector(
    (state: RootState) => state.statusInfo.is_dark_mode
  );
  const dispatch = useDispatch();
  const router = useRouter();
  return (
    <ThemedContainer
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Switch
        trackColor={{ false: "#767577", true: Colors.primaryDarkModeColor2 }}
        thumbColor={isEnabled && isDarkMode ? "#f5dd4b" : Colors.primaryColor1}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => {
          setIsEnabled((previousState) => !previousState);
          dispatch(setIsDarkMode(isEnabled));
        }}
        value={isDarkMode}
      />
      <Button
        buttonStyle={{
          width: Viewport.width * 0.33,
          height: Viewport.height * 0.06,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.primaryColor1,
        }}
        text="Sign out"
        onPress={() => {
          AsyncStorage.clear();
          dispatch(setUserInfo(null));
          dispatch(setIsLoggedIn(false));
          dispatch(setOnAdmission(false));
          router.push("/(auth)/(signin)");
        }}
      />
    </ThemedContainer>
  );
}
