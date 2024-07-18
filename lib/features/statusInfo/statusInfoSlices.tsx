import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  is_logged_in: false,
  on_admission: false,
  is_dark_mode: false,
};

const statusInfoSlices = createSlice({
  name: "data",
  initialState,
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.is_logged_in = action.payload;
    },
    setOnAdmission: (state, action) => {
      state.on_admission = action.payload;
    },
    setIsDarkMode: (state, action) => {
      state.is_dark_mode = action.payload;
    },
  },
});

export const { setIsLoggedIn, setOnAdmission, setIsDarkMode } =
  statusInfoSlices.actions;

export default statusInfoSlices.reducer;
