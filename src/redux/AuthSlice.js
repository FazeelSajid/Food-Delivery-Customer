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
  customerCartId: null,
  selectedLanguage: 'English',
  signUpWith: '',
  password : '',
  showPopUp: false,
  popUpColor: '',
  PopUpMesage: '',
  walletTotalAmount: 0,
  setAllLocation: [],
  Bill: {
    total_amount: 0,
    subtotal: 0,
    cartItemIds: [],
    delivery_charges: 0,
    gst_charges: 0,
    total_amount: 0
  },
  contacts: [],
  restautantDetails: null,
  Colors: {
    button: {
      primary_button: "#FF5722",
      primary_button_text: "#FFFFFF",
      secondary_button: "#FFFFFF",
      secondary_button_text: "#FF5722",
      secondary_button_border: "#FF5722",
    },
    primary_color: "#FF5722",
    primary_text: '#0A212B',
    secondary_text: '#56585B',
    secondary_color: '#FFFFFF',
    icon: "#FF5722",

  Orange: 'green',
  OrangeLight: '#F99145',
  OrangeExtraLight: '#FFF6F3',
  White: '#FFFFFF',
  Black: '#000000',
  Text: '#0A212B',
  grayText: '#999999',
  borderGray: '#EAE9E9',
  favoriteHeart: '#B00020',
  darkTextColor: '#545151',
  pending: '#C08C22',
  preparing: '#22A3C0',
  outForDelivery : '#225AC0',
  completed:'#19BA46',
  cancelled: 'red'
}
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
    setShowPopUp(state, action) {
      state.showPopUp = action.payload;
    },
    setPopUpColor(state, action) {
      state.popUpColor = action.payload;
    }, 
    setPopUpMesage(state, action) {
      state.PopUpMesage = action.payload;
    },
    setWalletTotalAmount(state, action) {
      state.walletTotalAmount = action.payload;
    },
    setSetAllLocation(state, action) {
      state.setAllLocation = action.payload;
    },
    setBill (state, action) {
      state.Bill = {...state.Bill, ...action.payload}
    },
    setContacts (state, action) {
      state.contacts = action.payload;
    },
    setColors (state, action) {
      state.Colors = {...state.Colors,...action.payload}
    },
    setCustomerCartId (state, action) {
      state.customerCartId = action.payload;
    },
    setRestautantDetails (state, action) {
      state.restautantDetails = action.payload;
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
  setPassword,
  setShowPopUp,
  setPopUpColor,
  setPopUpMesage,
  setWalletTotalAmount,
  setSetAllLocation,
  setBill,
  setContacts,
  setColors,
  setCustomerCartId,
  setRestautantDetails
} = AuthSlice.actions;

export default AuthSlice.reducer;
