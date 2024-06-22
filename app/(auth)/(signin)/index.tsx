import { Text, View, Image } from "react-native";
import { useState } from "react";
import { LinearGradientBG } from "@/components/LinearGradientBG";
import {
  customizeFont,
  Colors,
  FontSizes,
  Styles,
  Viewport,
} from "@/styles/styles";
import { InputField } from "@/components/InputField";

export default function Signin() {
  const fontLoaded = customizeFont();
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  return (
    <LinearGradientBG
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={Styles.container}>
        <View style={Styles.flexRow}>
          <Image source={require("@/assets/images/icon-logo.png")} />
          {fontLoaded[0] && (
            <Text
              style={{
                fontFamily: "InriaSans",
                color: Colors.secondaryColor1,
                fontSize: FontSizes.large,
              }}
            >
              HanapBHouse
            </Text>
          )}
        </View>
        <View
          style={{
            width: Viewport.width * 0.85,
            marginTop: Viewport.height * 0.03,
            alignItems: "center",
          }}
        >
          {fontLoaded[0] && (
            <Text
              style={{
                fontFamily: "Inter",
                color: Colors.secondaryColor1,
                fontSize: FontSizes.small,
              }}
            >
              Open your doors to new possibilities, earn with ease, find your
              ideal boarding house, and forge new connections!
            </Text>
          )}
        </View>
        <View
          style={{
            width: Viewport.width * 0.85,
            marginTop: Viewport.height * 0.03,
            alignItems: "center",
            gap: 20,
          }}
        >
          <InputField
            value={data.username}
            placeholder="Username"
            autoCapitalize="none"
            style={{
              width: Viewport.width * 0.8,
              height: Viewport.height * 0.05,
              paddingLeft: 10,
            }}
            onChangeText={(value) => {
              setData({
                ...data,
                username: value,
              });
            }}
            floatingPlaceHolder
          />
          <InputField
            value={data.password}
            placeholder="Password"
            autoCapitalize="none"
            style={{
              width: Viewport.width * 0.8,
              height: Viewport.height * 0.05,
              paddingLeft: 10,
            }}
            onChangeText={(value) => {
              setData({
                ...data,
                password: value,
              });
            }}
            floatingPlaceHolder
            secureTextEntry
          />
        </View>
      </View>
    </LinearGradientBG>
  );
}
