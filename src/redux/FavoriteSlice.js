import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favoriteItems: [],
  favoriteDeals: [],
};

const FavoriteSlice = createSlice({
  name: 'FavoriteSlice',
  initialState: initialState,
  reducers: {
    // Set favorite items
    setFavoriteItems(state, action) {
      state.favoriteItems = action.payload;
    },
    // Set favorite deals
    setFavoriteDeals(state, action) {
      state.favoriteDeals = action.payload;
    },
    // Add favorite item (push object to array)
    addFavoriteItem(state, action) {
      state.favoriteItems.push(action.payload);
    },
    // Add favorite deal (push object to array)
    addFavoriteDeal(state, action) {
      state.favoriteDeals.push(action.payload);
    },
    // Remove favorite item by id
    removeFavoriteItem(state, action) {
      state.favoriteItems = state.favoriteItems.filter(
        item => item?.item?.item_id !== action.payload
      );
    },
    // Remove favorite deal by id
    removeFavoriteDeal(state, action) {
      state.favoriteDeals = state.favoriteDeals.filter(
        deal => deal.id !== action.payload
      );
    },
    // Reset state to initial values
    resetState(state) {
      return initialState;
    },
  },
});

export const {
  resetState,
  setFavoriteItems,
  setFavoriteDeals,
  addFavoriteItem,
  addFavoriteDeal,
  removeFavoriteItem,
  removeFavoriteDeal,
} = FavoriteSlice.actions;

export default FavoriteSlice.reducer;
