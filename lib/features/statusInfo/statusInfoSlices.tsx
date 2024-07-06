import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  is_logged_in: false,
  on_admission: false,
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
  },
});

export const { setIsLoggedIn, setOnAdmission } = statusInfoSlices.actions;

export default statusInfoSlices.reducer;
