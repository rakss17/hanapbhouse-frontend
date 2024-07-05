import { useCallback, useEffect, useState } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { CustomizedModal } from "@/components/CustomizedModat";
import { Colors, FontSizes, Viewport } from "@/styles/styles";
import { TokenRevalidation, getAccessToken } from "@/components/Api";
import { useFocusEffect, useRouter } from "expo-router";
import { useToast } from "react-native-toast-notifications";

export default function Index() {
  const [accessToken, setAccessToken] = useState("");
  const toast = useToast();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isRestoringSessionLoading, setIsRestoringSessionLoading] =
    useState(false);
  const [restoringMessage, setRestoringMessage] = useState("");
  const userInfo = useSelector((state: RootState) => state.userInfo.data);
  const firstName = userInfo?.first_name;

  useEffect(() => {
    async function fetchToken() {
      const token = await getAccessToken();
      if (token) {
        setAccessToken(token);
      }
    }
    fetchToken();
  }, []);

  useEffect(() => {
    if (accessToken) {
      TokenRevalidation(
        toast,
        router,
        setIsRestoringSessionLoading,
        setRestoringMessage,
        dispatch
      );
    }
  }, [accessToken]);

  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Welcome {firstName}</Text>
      </View>
      <CustomizedModal
        visible={isRestoringSessionLoading}
        animationType="fade"
        transparent={true}
        hasHeader={true}
        headerContent={
          restoringMessage ? restoringMessage : "Restoring previous session."
        }
        headerStyle={{ fontSize: FontSizes.normal, fontWeight: "bold" }}
        viewStyle={{
          width: Viewport.width * 0.78,
          height: Viewport.height * 0.25,
          borderRadius: 25,
          backgroundColor: Colors.primaryColor2,
          gap: 20,
        }}
        onCloseRequest={() => {}}
      >
        <View style={{ width: Viewport.width * 0.6, alignItems: "center" }}>
          <ActivityIndicator color={Colors.secondaryColor3} size={80} />
          <Text style={{ fontSize: FontSizes.small }}>Please wait...</Text>
        </View>
      </CustomizedModal>
    </>
  );
}
