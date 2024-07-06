import { View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Colors } from "@/styles/styles";
import { ThemedContainerProps } from "@/interfaces/ThemedContainerProps";

export const ThemedContainer: React.FC<ThemedContainerProps> = ({
  children,
  style,
}) => {
  const isDarkMode = useSelector(
    (state: RootState) => state.statusInfo.is_dark_mode
  );
  return (
    <View
      style={[
        style,
        {
          flex: 1,
          backgroundColor: isDarkMode
            ? Colors.primaryDarkModeColor1
            : Colors.primaryColor2,
          flexDirection: "column",
        },
      ]}
    >
      {children}
    </View>
  );
};
