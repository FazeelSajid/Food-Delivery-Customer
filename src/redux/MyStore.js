import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AuthSlice from './AuthSlice';
import CartSlice from './CartSlice';
import OrderSlice from './OrderSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FavoriteSlice  from './FavoriteSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage, // Use AsyncStorage for persistence
  whitelist: ['store'] // Specify the slices you want to persist
};

const rootReducer = combineReducers({
      store: AuthSlice,
      cart: CartSlice,
      order: OrderSlice,
      favorite: FavoriteSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const MYStore = configureStore({
  reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
          immutableCheck: false,
          serializableCheck: false,
      }),
});


export const persistor = persistStore(MYStore);
