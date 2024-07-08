import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivationProps,
  SigninDataProps,
  SignupDataProps,
} from "@/interfaces/AuthDataProps";
import { setUserInfo } from "@/lib/features/userInfo/userInfoSlices";
import {
  setIsLoggedIn,
  setOnAdmission,
} from "@/lib/features/statusInfo/statusInfoSlices";

const debug = true;

export let serverSideUrl: any;

if (debug) {
  serverSideUrl = "http://192.168.1.12:8000/";
}

const instance = axios.create({
  baseURL: serverSideUrl,
  timeout: 8000,
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

export function UserActivationAPI(
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
  setIsError: any,
  dispatch: any
) {
  setIsLoading(true);

  try {
    const signInResponse = await instance.post(
      "api/v1/accounts/jwt/create/",
      data
    );

    const userInfoAPI = await instance.get("api/v1/accounts/me/", {
      headers: {
        Authorization: `Bearer ${signInResponse.data.access}`,
        "Content-Type": "application/json",
      },
    });

    dispatch(setUserInfo(userInfoAPI.data));
    dispatch(setIsLoggedIn(true));
    setAccessToken(signInResponse.data.access);
    setRefreshToken(signInResponse.data.refresh);

    setIsLoading(false);
    setIsSuccess(true);
    setIsError(false);
    if (
      userInfoAPI.data.preferred_area === null ||
      userInfoAPI.data.preferred_area === ""
    ) {
      dispatch(setOnAdmission(true));
      setTimeout(() => {
        router.push("/(auth)/admission");
        setIsSuccess(false);
      }, 1000);
    } else {
      setTimeout(() => {
        dispatch(setOnAdmission(false));
        router.push("/(tabs)");
        setIsSuccess(false);
      }, 1000);
    }
    toast.show("Successfully login!", {
      type: "success",
      placement: "top",
      duration: 6000,
      animationType: "slide-in",
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

export async function TokenRevalidation(
  toast: any,
  router: any,
  setIsRestoringSessionLoading: any,
  setRestoringMessage: any,
  dispatch: any
) {
  setIsRestoringSessionLoading(true);
  try {
    const accessToken = await getAccessToken();
    await instance
      .post("api/v1/accounts/jwt/verify/", { token: accessToken })
      .then(() => {
        setIsRestoringSessionLoading(false);
        toast.show("Previous session found.", {
          type: "success",
          placement: "top",
          duration: 3000,
          animationType: "slide-in",
        });
      });
    return true;
  } catch (error: any) {
    const refreshToken = await getRefreshToken();
    setIsRestoringSessionLoading(true);
    setRestoringMessage("Renewing session.");
    try {
      const response = await instance.post("api/v1/accounts/jwt/refresh/", {
        refresh: refreshToken,
      });
      await setAccessToken(response.data.access);
      setIsRestoringSessionLoading(false);
      toast.show("Session renewed.", {
        type: "success",
        placement: "top",
        duration: 3000,
        animationType: "slide-in",
      });
      return true;
    } catch (refreshError) {
      setIsRestoringSessionLoading(false);
      toast.show("Session expired. Please login again.", {
        type: "warning",
        placement: "top",
        duration: 3000,
        animationType: "slide-in",
      });
      setTimeout(() => {
        AsyncStorage.clear();
        dispatch(setUserInfo(null));
        dispatch(setIsLoggedIn(false));
        dispatch(setOnAdmission(false));
        router.push("/(auth)/(signin)");
      }, 700);
    }
  }
  return false;
}

export async function ResetPasswordAPI(
  email: any,
  toast: any,
  setEmail: any,
  setIsForgotPasswordPressed: any,
  setIsLoading: any,
  setIsSuccess: any,
  setIsErrorEmail: any
) {
  setIsLoading(true);
  try {
    await instance
      .post(
        "api/v1/accounts/users/reset_password/",
        {
          email: email,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        setIsLoading(false);
        setIsSuccess(true);
        setIsErrorEmail(false);
        setEmail("");
        toast.show(
          "Success! Please check you email to reset your password. Thank you!",
          {
            type: "success",
            placement: "top",
            duration: 6000,
            animationType: "slide-in",
          }
        );
        setTimeout(() => {
          setIsForgotPasswordPressed(false);
          setEmail("");
          setIsSuccess(false);
        }, 1000);
      });
  } catch (error: any) {
    setIsLoading(false);
    let error_message = parseError(error);
    if (error_message.includes("User with given email does not exist")) {
      setIsErrorEmail(true);
      toast.show("We couldn't find an account with that email address.", {
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

export async function ResetPasswordConfirmAPI(
  uid: any,
  token: any,
  newPassword: any,
  toast: any,
  router: any,
  setIsLoading: any,
  setIsSuccess: any,
  setData: any
) {
  setIsLoading(true);
  try {
    await instance
      .post(
        "api/v1/accounts/users/reset_password_confirm/",
        {
          uid: uid,
          token: token,
          new_password: newPassword,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        setIsLoading(false);
        setIsSuccess(true);

        setData({
          uid: "",
          token: "",
          password: "",
        });
        toast.show("Your password has been successfully reset. Thank you!", {
          type: "success",
          placement: "top",
          duration: 6000,
          animationType: "slide-in",
        });
        setTimeout(() => {
          setIsSuccess(false);
          router.push("/(auth)/(signin)");
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

export async function FinishingAdmissionAPI(
  preferredArea: any,
  toast: any,
  router: any,
  setIsLoading: any,
  setIsSuccess: any,
  setData: any,
  dispatch: any
) {
  try {
    const accessToken = await getAccessToken();
    await instance.patch(
      "api/v1/accounts/me/",
      {
        preferred_area: preferredArea,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    setIsLoading(false);
    setIsSuccess(true);
    dispatch(setOnAdmission(false));
    setData({
      street_3: "",
      city: "",
      province: "",
      region: "",
    });
    toast.show("Successfully updated. Thank you!", {
      type: "success",
      placement: "top",
      duration: 6000,
      animationType: "slide-in",
    });
    setTimeout(() => {
      setIsSuccess(false);
      router.push("/(tabs)");
    }, 1000);
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

export async function FetchPublicFeedsAPI(
  page: number,
  street_3: string | undefined,
  city: string | undefined,
  category: string | undefined,
  toast: any,
  setIsLoading: any
) {
  try {
    const accessToken = await getAccessToken();
    const response = await instance.get("api/v1/feed/public-feed-listing/", {
      params: {
        page: page,
        street_3: street_3,
        city: city,
        category: category,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    let error_message = parseError(error);
    toast.show(error_message, {
      type: "danger",
      placement: "top",
      duration: 6000,
      animationType: "slide-in",
    });
  }
}

export async function FetchSavedFeedsAPI(
  page: number,
  toast: any,
  setIsLoading: any
) {
  try {
    const accessToken = await getAccessToken();
    const response = await instance.get(
      "api/v1/feed/saved-feed-creation-listing/",
      {
        params: {
          page: page,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    let error_message = parseError(error);
    toast.show(error_message, {
      type: "danger",
      placement: "top",
      duration: 6000,
      animationType: "slide-in",
    });
  }
}
