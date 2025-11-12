import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user.slice";
import pronosticoReducer from "../features/pronostico.slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    pronostico: pronosticoReducer,
  },
});