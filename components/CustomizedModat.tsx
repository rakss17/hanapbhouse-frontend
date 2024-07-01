import { ModalProps } from "@/interfaces/ModalProps";
import { Viewport } from "@/styles/styles";
import { Modal, View, Text } from "react-native";

export const CustomizedModal: React.FC<ModalProps> = ({
  visible,
  animationType,
  transparent,
  viewStyle,
  hasHeader,
  headerStyle,
  headerContent,
  children,
}) => {
  return (
    <Modal
      visible={visible}
      animationType={animationType}
      transparent={transparent}
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
              paddingTop: Viewport.height * 0.03,
              paddingLeft: Viewport.width * 0.08,
            },
          ]}
        >
          {hasHeader && <Text style={[headerStyle]}>{headerContent}</Text>}
          {children}
        </View>
      </View>
    </Modal>
  );
};
