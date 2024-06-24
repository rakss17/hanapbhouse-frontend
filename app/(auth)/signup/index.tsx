import { Button } from "@/components/Button";
import { CircleShape } from "@/components/CircleShape";
import { InputField } from "@/components/InputField";
import { Colors, FontSizes, Viewport, customizeFont } from "@/styles/styles";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RNPickerSelect from "react-native-picker-select";

export default function SignUp() {
  const fontLoaded = customizeFont();
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    contact_number: "",
    email: "",
    username: "",
    password: "",
    confirm_password: "",
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
      <StatusBar style="dark" />
      <View
        style={{
          width: Viewport.width * 1,
          height: Viewport.height * 1.1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.primaryColor2,
          position: "relative",
        }}
      >
        <CircleShape
          style={{
            backgroundColor: Colors.primaryColor3,
            bottom: Viewport.height * 0.9,
            left: Viewport.width * 0.65,
          }}
        />
        <View style={{ width: Viewport.width * 0.8 }}>
          {fontLoaded[0] && (
            <>
              <Text
                style={{
                  fontFamily: "Inter",
                  color: Colors.secondaryColor3,
                  fontSize: FontSizes.large,
                  fontWeight: "bold",
                }}
              >
                Sign up
              </Text>
              <Text
                style={{
                  fontFamily: "Inter",
                  color: Colors.secondaryColor3,
                  fontSize: FontSizes.small,
                }}
              >
                Create your account to start earning, find your ideal boarding
                house, and connect with the community!
              </Text>
            </>
          )}
        </View>
        <View
          style={{
            width: Viewport.width * 0.8,
            marginTop: Viewport.height * 0.02,
            gap: 20,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <InputField
              value={data.first_name}
              placeholder="First name"
              autoCapitalize="words"
              style={{
                width: Viewport.width * 0.38,
                height: Viewport.height * 0.05,
                paddingLeft: 10,
              }}
              onChangeText={(value) => {
                setData({
                  ...data,
                  first_name: value,
                });
              }}
              floatingPlaceHolder
              floatingDarkColor
              darkColor
            />
            <InputField
              value={data.last_name}
              placeholder="Last name"
              autoCapitalize="words"
              style={{
                width: Viewport.width * 0.38,
                height: Viewport.height * 0.05,
                paddingLeft: 10,
              }}
              onChangeText={(value) => {
                setData({
                  ...data,
                  last_name: value,
                });
              }}
              floatingPlaceHolder
              floatingDarkColor
              darkColor
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <RNPickerSelect
              value={data.gender}
              placeholder={{
                label: "Gender",
                value: null,
              }}
              style={{
                placeholder: {
                  color: Colors.secondaryColor4,
                  right: 8,
                  bottom: 8,
                },
                viewContainer: {
                  width: Viewport.width * 0.38,
                  height: Viewport.height * 0.05,
                  borderColor: Colors.secondaryColor4,
                  borderBottomWidth: 2,
                },
                inputAndroid: {
                  width: Viewport.width * 0.38,
                  height: Viewport.height * 0.05,
                  color: Colors.secondaryColor3,
                  right: 8,
                  bottom: 8,
                },
                inputIOS: {
                  width: Viewport.width * 0.38,
                  height: Viewport.height * 0.02,
                  color: Colors.secondaryColor3,
                  right: 8,
                  bottom: 8,
                },
              }}
              onValueChange={(value) =>
                setData({
                  ...data,
                  gender: value,
                })
              }
              items={[
                { key: "Male", label: "Male", value: "Male" },
                { key: "Female", label: "Female", value: "Female" },
              ]}
            />

            <InputField
              value={data.contact_number}
              placeholder="Mobile number"
              autoCapitalize="none"
              keyboardType="numeric"
              style={{
                width: Viewport.width * 0.38,
                height: Viewport.height * 0.05,
                paddingLeft: 10,
              }}
              onChangeText={(value) => {
                setData({
                  ...data,
                  contact_number: value,
                });
              }}
              floatingPlaceHolder
              floatingDarkColor
              darkColor
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <InputField
              value={data.email}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              style={{
                width: Viewport.width * 0.8,
                height: Viewport.height * 0.05,
                paddingLeft: 10,
              }}
              onChangeText={(value) => {
                setData({
                  ...data,
                  email: value,
                });
              }}
              floatingPlaceHolder
              floatingDarkColor
              darkColor
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
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
              floatingDarkColor
              darkColor
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
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
              floatingDarkColor
              darkColor
              secureTextEntry
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <InputField
              value={data.confirm_password}
              placeholder="Confirm password"
              autoCapitalize="none"
              style={{
                width: Viewport.width * 0.8,
                height: Viewport.height * 0.05,
                paddingLeft: 10,
              }}
              onChangeText={(value) => {
                setData({
                  ...data,
                  confirm_password: value,
                });
              }}
              floatingPlaceHolder
              floatingDarkColor
              darkColor
              secureTextEntry
            />
          </View>
        </View>
        <View
          style={{
            width: Viewport.width * 0.8,
            height: Viewport.height * 0.15,
            marginTop: Viewport.height * 0.05,
            gap: 20,
          }}
        >
          <Button
            text="Sign up"
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
            onPress={() => {
              console.log("data", data);
            }}
          />

          <Link href="/(auth)/(signin)" asChild>
            <Button
              text="Already have an account?"
              text2="Sign in"
              buttonStyle={{
                width: Viewport.width * 0.8,
                height: Viewport.height * 0.04,
                justifyContent: "space-between",
                flexDirection: "row",
                backgroundColor: "transparent",
                borderColor: Colors.secondaryColor3,
                borderBottomWidth: 2,
              }}
              textStyle={{
                color: Colors.secondaryColor3,
                fontSize: FontSizes.small,
              }}
            />
          </Link>
        </View>
        <CircleShape
          style={{
            backgroundColor: Colors.primaryColor4,
            top: Viewport.height * 0.9,
            right: Viewport.width * 0.65,
          }}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}
