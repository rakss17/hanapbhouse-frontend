import { ThemedTextProps } from "@/interfaces/ThemedTextProps";
import { Text } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Colors } from "@/styles/styles";

export const ThemedText: React.FC<ThemedTextProps> = ({ style, value }) => {
  const isDarkMode = useSelector(
    (state: RootState) => state.statusInfo.is_dark_mode
  );

  return (
    <Text
      style={[
        style,
        { color: isDarkMode ? Colors.secondaryColor1 : Colors.secondaryColor3 },
      ]}
    >
      {value}
    </Text>
  );
};
