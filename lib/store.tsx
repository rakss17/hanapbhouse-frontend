import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import userInfoSlices from "./features/userInfo/userInfoSlices";
import statusInfoSlices from "./features/statusInfo/statusInfoSlices";
import AsyncStorage from "@react-native-async-storage/async-storage";

const userInfoPersistConfig = {
  key: "userInfo",
  storage: AsyncStorage,
};

const persistedUserInfoReducer = persistReducer(
  userInfoPersistConfig,
  userInfoSlices
);

const statusInfoPersistConfig = {
  key: "statusInfo",
  storage: AsyncStorage,
};

const persistedStatusInfoReducer = persistReducer(
  statusInfoPersistConfig,
  statusInfoSlices
);

const store = configureStore({
  reducer: {
    userInfo: persistedUserInfoReducer,
    statusInfo: persistedStatusInfoReducer,
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
