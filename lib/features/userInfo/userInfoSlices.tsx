import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfoProps } from "@/interfaces/AuthDataProps";

interface UserState {
  data: UserInfoProps | null;
}

const initialState: UserState = {
  data: null,
};

const userInfoSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfoProps>) => {
      state.data = action.payload;
    },
  },
});

export const { setUserInfo } = userInfoSlice.actions;

export default userInfoSlice.reducer;
