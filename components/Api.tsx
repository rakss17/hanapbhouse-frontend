import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivationProps,
  SigninDataProps,
  SignupDataProps,
} from "@/interfaces/AuthDataProps";

const debug = true;

export let serverSideUrl: any;
export let serverSideMediaUrl: any;

if (debug) {
  serverSideUrl = "http://192.168.1.17:8000/";
  serverSideMediaUrl = "http://192.168.1.17:8000/media/";
}

const instance = axios.create({
  baseURL: serverSideUrl,
  timeout: 5000,
});

export function parseError(error: any) {
  if (error.response && error.response.data) {
    return JSON.stringify(error.response.data)
      .replaceAll(/[{}()"]/g, " ")
      .replaceAll(/,/g, "\n")
      .replaceAll("[", "")
      .replaceAll("]", "")
      .replaceAll(".", "")
      .replaceAll(/"/g, "")
      .replaceAll("non_field_errors", "")
      .trim();
  }
  return "Unable to reach server";
}

export async function getAccessToken() {
  const accessToken = await AsyncStorage.getItem("access_token");
  return accessToken;
}

export async function getRefreshToken() {
  const refreshToken = await AsyncStorage.getItem("refresh_token");
  return refreshToken;
}

export async function setAccessToken(access: string) {
  await AsyncStorage.setItem("access_token", access);
  return true;
}

export async function setRefreshToken(refresh: string) {
  await AsyncStorage.setItem("refresh_token", refresh);
  return true;
}

export async function SignupAPI(
  data: SignupDataProps,
  toast: any,
  setIsLoading: any,
  router: any,
  setIsSuccess: any
) {
  setIsLoading(true);

  try {
    await instance.post("api/v1/accounts/users/", data).then(() => {
      setIsLoading(false);
      setIsSuccess(true);
      toast.show("Success! Please check your email to activate your account.", {
        type: "success",
        placement: "top",
        duration: 6000,
        animationType: "slide-in",
      });
      setTimeout(() => {
        router.push("/(auth)/signup/success");
        setIsSuccess(false);
      }, 1000);
    });
  } catch (error: any) {
    setIsLoading(false);
    let error_message = parseError(error);
    toast.show(error_message, {
      type: "danger",
      placement: "top",
      duration: 6000,
      animationType: "slide-in",
    });
  }
}

export function UserActivation(
  activation: ActivationProps,
  toast: any,
  router: any,
  setIsLoading: any
) {
  instance
    .post("api/v1/accounts/users/activation/", activation)
    .then(() => {
      setIsLoading(false);
      toast.show("Activation Completed! You can now sign in to your account.", {
        type: "success",
        placement: "top",
        duration: 6000,
        animationType: "slide-in",
      });
      setTimeout(() => {
        router.push("/(auth)/(signin)");
      }, 1000);
    })
    .catch((error: any) => {
      setIsLoading(false);
      let error_message = parseError(error);
      if (error_message.includes("Stale token for given user")) {
        toast.show("Account is already activated.", {
          type: "warning",
          placement: "top",
          duration: 6000,
          animationType: "slide-in",
        });
      } else {
        toast.show("Activation unsuccessful. Please contact support.", {
          type: "warning",
          placement: "top",
          duration: 6000,
          animationType: "slide-in",
        });
      }
      setTimeout(() => {
        router.push("/(auth)/(signin)");
      }, 1000);
    });
}

export async function SigninAPI(
  data: SigninDataProps,
  toast: any,
  setIsLoading: any,
  router: any,
  setIsSuccess: any,
  setIsError: any
) {
  setIsLoading(true);

  try {
    await instance
      .post("api/v1/accounts/jwt/create/", data)
      .then((response) => {
        setAccessToken(response.data.access);
        setRefreshToken(response.data.refresh);
        setIsLoading(false);
        setIsSuccess(true);
        setIsError(false);
        toast.show("Successfully login!", {
          type: "success",
          placement: "top",
          duration: 6000,
          animationType: "slide-in",
        });
        setTimeout(() => {
          router.push("/(tabs)");
          setIsSuccess(false);
        }, 1000);
      });
  } catch (error: any) {
    setIsLoading(false);
    let error_message = parseError(error);
    if (
      error_message.includes(
        "No active account found with the given credentials"
      ) ||
      error_message.includes("This field may not be blank")
    ) {
      setIsError(true);
      toast.show("Oops! Incorrect username or password. Please try again.", {
        type: "danger",
        placement: "top",
        duration: 6000,
        animationType: "slide-in",
      });
    } else {
      toast.show(error_message, {
        type: "danger",
        placement: "top",
        duration: 6000,
        animationType: "slide-in",
      });
    }
  }
}
