import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import receiverSlice from "./slice/receiverSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    receiver: receiverSlice,
  },
});
export default store;
