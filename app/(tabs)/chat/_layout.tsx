import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function ChatLayout() {
  const isDarkMode = useSelector(
    (state: RootState) => state.statusInfo.is_dark_mode
  );
  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Slot />
    </>
  );
}
