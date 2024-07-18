import { ModalProps } from "@/interfaces/ModalProps";
import { Viewport } from "@/styles/styles";
import { Modal, View, Text } from "react-native";
import { useEffect } from "react";
import { BackHandler } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Colors } from "@/styles/styles";
import { ThemedText } from "./ThemedText";

export const CustomizedModal: React.FC<ModalProps> = ({
  visible,
  animationType,
  transparent,
  viewStyle,
  hasHeader,
  headerStyle,
  headerContent,
  children,
  onCloseRequest,
}) => {
  const isDarkMode = useSelector(
    (state: RootState) => state.statusInfo.is_dark_mode
  );
  useEffect(() => {
    if (visible) {
      const backAction = () => {
        onCloseRequest();
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }
  }, [visible, onCloseRequest]);
  return (
    <Modal
      visible={visible}
      animationType={animationType}
      transparent={transparent}
      onRequestClose={onCloseRequest}
    >
      <View
        style={{
          height: Viewport.height * 1,
          width: Viewport.width * 1,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          zIndex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={[
            viewStyle,
            {
              backgroundColor: isDarkMode
                ? Colors.primaryDarkModeColor2
                : Colors.secondaryColor1,
            },
          ]}
        >
          {hasHeader && (
            <ThemedText style={[headerStyle]} value={headerContent} />
          )}
          {children}
        </View>
      </View>
    </Modal>
  );
};
