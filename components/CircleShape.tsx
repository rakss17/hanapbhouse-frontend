import { Colors, Viewport } from "@/styles/styles";
import { View } from "react-native";
import { CircleShapeProps } from "@/interfaces/CircleProps";

export const CircleShape: React.FC<CircleShapeProps> = ({ style }) => {
  return (
    <View
      style={[
        style,
        {
          width: Viewport.width * 1,
          height: Viewport.height * 0.5,
          borderRadius: 200,
          position: "absolute",
        },
      ]}
    />
  );
};
