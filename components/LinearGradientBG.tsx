import { LinearGradientBGProps } from "@/interfaces/LinearGradientBGInterface";
import { ImageBackground } from "react-native";

export const LinearGradientBG: React.FC<LinearGradientBGProps> = ({
  children,
  style,
}) => {
  return (
    <ImageBackground
      source={require("@/assets/images/backgroundgradient.png")}
      resizeMode="cover"
      style={style}
    >
      {children}
    </ImageBackground>
  );
};
