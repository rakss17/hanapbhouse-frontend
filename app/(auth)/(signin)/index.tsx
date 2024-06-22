import { Text, View, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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
import { Button } from "@/components/Button";

export default function Signin() {
  const fontLoaded = customizeFont();
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        width: Viewport.width * 1,
        height: Viewport.height * 1.1,
      }}
      keyboardShouldPersistTaps="handled"
      scrollEnabled={true}
      enableAutomaticScroll={false}
      enableOnAndroid={true}
    >
      <LinearGradientBG
        style={{
          width: Viewport.width * 1,
          height: Viewport.height * 1.1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
        <View
          style={{
            width: Viewport.width * 0.8,
            height: Viewport.height * 0.35,
            marginTop: Viewport.height * 0.01,
            gap: 40,
          }}
        >
          <View
            style={{
              width: Viewport.width * 0.8,
              alignItems: "flex-end",
            }}
          >
            <Button
              text="Forgot password?"
              buttonStyle={{
                width: Viewport.width * 0.35,
                alignItems: "flex-end",
              }}
              textStyle={{
                color: Colors.secondaryColor1,
                fontSize: FontSizes.small,
              }}
            />
          </View>
          <Button
            text="Sign in"
            buttonStyle={{
              width: Viewport.width * 0.8,
              height: Viewport.height * 0.06,
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: Colors.primaryColor1,
            }}
            textStyle={{
              color: Colors.secondaryColor1,
              fontSize: FontSizes.small,
            }}
          />
          <View>
            <Button
              text="Don't have an account?"
              text2="Sign up"
              buttonStyle={{
                width: Viewport.width * 0.8,
                height: Viewport.height * 0.04,
                justifyContent: "space-between",
                flexDirection: "row",
                backgroundColor: "transparent",
                borderColor: Colors.secondaryColor1,
                borderBottomWidth: 2,
              }}
              textStyle={{
                color: Colors.secondaryColor1,
                fontSize: FontSizes.small,
              }}
            />
          </View>
        </View>
      </LinearGradientBG>
    </KeyboardAwareScrollView>
  );
}
