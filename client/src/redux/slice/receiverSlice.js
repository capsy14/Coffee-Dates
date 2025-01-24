import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  receiver: null,
  receiverName: "",
  receiverPhoto: "",
  receiverEmail: "",
  conversationId: null,
  message: [],
};

export const receiverSlice = createSlice({
  name: "receiver",
  initialState,
  reducers: {
    setReceiver: (state, action) => {
      state.receiver = action.payload;
    },
    setReceiverName: (state, action) => {
      state.receiverName = action.payload;
    },
    setReceiverPhoto: (state, action) => {
      state.receiverPhoto = action.payload;
    },
    setReceiverEmail: (state, action) => {
      state.receiverEmail = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setConversationId: (state, action) => {
      state.conversationId = action.payload;
    },
    addNewMessage: (state, action) => {
      state.message.push(action.payload); // Add a new message to the existing list
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setReceiver,
  setReceiverName,
  setReceiverPhoto,
  setReceiverEmail,
  setMessage,
  addNewMessage,
  setConversationId,
} = receiverSlice.actions;

export default receiverSlice.reducer;
