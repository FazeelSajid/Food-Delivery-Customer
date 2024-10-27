import {createSlice} from '@reduxjs/toolkit';



const initialState = {
  join_as_guest: false,
  otpConfirm: null,
  currentLocation: {
    id: null,
    latitude: 0.0,
    longitude: 0.0,
    address: '',
    city: '',
  },
  updateLocation: {
    id: null,
    latitude: 0.0,
    longitude: 0.0,
    address: '',
    city: '',
  },
  location: {
    id: null,
    latitude: 0.0,
    longitude: 0.0,
    address: '',
    city: '',
  },
  cuisines: [],
  deals: [],
  items: [],
  promos:[],
  dealsRecentResearch : [],
  customer_id: null,
  customer_detail: null,
  selectedLanguage: 'English',
  signUpWith: '',
  password : ''
}
const AuthSlice = createSlice({
  name: 'authSlice',
  initialState: initialState,
  reducers: {
    setJoinAsGuest(state, action) {
      state.join_as_guest = action.payload;
    },
    setOtpConfirm(state, action) {
      state.otpConfirm = action.payload;
    },
    setCurrentLocation(state, action) {
      state.currentLocation = action.payload;
    },
    setUpdateLocation(state, action) {
      state.updateLocation = action.payload;
    },
    setLocation(state, action) {
      state.location = action.payload;
    },
    setCustomerId(state, action) {
      state.customer_id = action.payload;
    },
    setCustomerDetail(state, action) {
      state.customer_detail = action.payload;
    },
    setSelectedLanguage(state, action) {
      state.selectedLanguage = action.payload;
    },
    setSignUpWith(state, action) {
      state.signUpWith = action.payload;
    },
    setcuisines(state, action) {
      state.cuisines = action.payload;
    },
    setitems(state, action) {
      state.items = action.payload;
    },
    setdeals(state, action) {
      state.deals = action.payload;
    },
    setPassword(state, action) {
      state.password = action.payload;
    },
    setPromos(state, action) {
      state.promos = action.payload;
    },
    setDealsResearch(state, action) {
      const exists = state.dealsRecentResearch.find(
        (query) => query === action.payload 
      );
      
      if (!exists) {
        state.dealsRecentResearch.push(action.payload);
      }
    },
    removeDealResearch(state, action) {
      console.log('remove', action.payload);
      
      state.dealsRecentResearch = state.dealsRecentResearch.filter(
        (query) => query!== action.payload
      );
    },
    
    resetState(state, action) {
      return initialState;
    }
   
  },
});

export const {
  setJoinAsGuest,
  setOtpConfirm,
  setCurrentLocation,
  setUpdateLocation,
  setLocation,
  setCustomerId,
  setCustomerDetail,
  setSelectedLanguage,
  setSignUpWith,
  setcuisines,
  resetState,
  setitems,
  setdeals,
  setPromos,
  setDealsResearch,
  removeDealResearch,
  setPassword
} = AuthSlice.actions;

export default AuthSlice.reducer;
