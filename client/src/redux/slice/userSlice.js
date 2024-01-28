import { createSlice, configureStore } from "@reduxjs/toolkit";

const name = JSON.parse(localStorage.getItem("name"));
const initialState = {
  isLoggedIn: false,
  name: name || " ",
  user: {
    name: "",
    email: "",
    phone: "",
    bio: "",
    photo: "",
  },
  account: "",
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    SET_NAME: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    SET_LOGIN: (state, action) => {
      localStorage.setItem("isLoggedIn", true);
      state.name = action.payload;
    },
    SET_ACCOUNT: (state, action) => {
      state.account = action.payload;
    },
    SET_USER: (state, action) => {
      const profile = action.payload;
      state.user.name = profile.name;
      state.user.email = profile.email;
      state.user.phone = profile.phone;
      state.user.bio = profile.bio;
      state.user.photo = profile.photo;
    },
  },
});

export const { SET_NAME, SET_USER, SET_LOGIN, SET_ACCOUNT } = userSlice.actions;

export const selectIsLoggedIn = (state) => state.user.name;
export const selectName = (state) => state.user.name;
export const selectUser = (state) => state.user.user;
export const selectAccount = (state) => state.user.account;

export default userSlice.reducer;
