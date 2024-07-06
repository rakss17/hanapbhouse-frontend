import { Text, View, Switch } from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setIsDarkMode } from "@/lib/features/statusInfo/statusInfoSlices";
import { Colors } from "@/styles/styles";

export default function Profile() {
  const [isEnabled, setIsEnabled] = useState(false);
  const isDarkMode = useSelector(
    (state: RootState) => state.statusInfo.is_dark_mode
  );
  const dispatch = useDispatch();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isDarkMode
          ? Colors.primaryDarkModeColor1
          : Colors.primaryColor2,
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
    </View>
  );
}
