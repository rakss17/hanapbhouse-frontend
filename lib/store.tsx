import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import userInfoSlices from "./features/userInfo/userInfoSlices";
import AsyncStorage from "@react-native-async-storage/async-storage";

const userInfoPersistConfig = {
  key: "userInfo",
  storage: AsyncStorage,
};

const persistedUserInfoReducer = persistReducer(
  userInfoPersistConfig,
  userInfoSlices
);

const store = configureStore({
  reducer: {
    userInfo: persistedUserInfoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export { store, persistor };
