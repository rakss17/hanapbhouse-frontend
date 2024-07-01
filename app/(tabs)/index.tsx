import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function Index() {
  const userInfo = useSelector((state: RootState) => state.userInfo.data);
  const firstName = userInfo?.first_name;
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Welcome {firstName}</Text>
    </View>
  );
}
