import {createSlice} from '@reduxjs/toolkit';

export const CartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: [],
    cart_restaurant_id: null,
    comment: '',
    selected_payment_type: 'cash', // cash or card
    selected_payment_string: '', // cash on delivery/card payment

    my_cart: [], // store all items in this cart
  },
  reducers: {
    addItemToMYCart: (state, action) => {
      // state.cart = action.payload;
      state.my_cart.push(action.payload);
      // const index = state.cart.findIndex(item => item.id === action.payload.id);
      // if (index !== -1) {
      //   state.cart[index].quantity += 1;
      // } else {
      // state.cart.push({...action.payload, quantity: action.payload.quantity});
      // }
    },
    clearMyCart: (state, action) => {
      state.cart = [];
    },
    removeItemFromMyCart: (state, action) => {
      const index = state.my_cart.findIndex(
        item => item.cart_item_id === action.payload,
      );
      if (index !== -1) {
        state.my_cart.splice(index, 1);
      }
    },

    updateMyCartList: (state, action) => {
      state.my_cart = action.payload;
    },

    //

    addToCart: (state, action) => {
      state.cart = action.payload;
      // const index = state.cart.findIndex(item => item.id === action.payload.id);
      // if (index !== -1) {
      //   state.cart[index].quantity += 1;
      // } else {
      //   state.cart.push({...action.payload, quantity: action.payload.quantity});
      // }
    },

    removeFromCart: (state, action) => {
      const index = state.cart.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        state.cart.splice(index, 1);
      }
    },
    incrementQuantity: (state, action) => {
      const index = state.cart.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        state.cart[index].quantity += 1;
      }
    },
    decrementQuantity: (state, action) => {
      const index = state.cart.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        state.cart[index].quantity -= 1;
        if (state.cart[index].quantity === 0) {
          state.cart.splice(index, 1);
        }
      }
    },
    setCartRestaurantId(state, action) {
      state.cart_restaurant_id = action.payload;
    },
    setOrderComment(state, action) {
      state.comment = action.payload;
    },
    setSelectedPaymentType(state, action) {
      state.selected_payment_type = action.payload;
    },
    setSelectedPaymentString(state, action) {
      state.selected_payment_string = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  setCartRestaurantId,
  setOrderComment,
  setSelectedPaymentString,
  setSelectedPaymentType,
  ///

  addItemToMYCart,
  clearMyCart,
  removeItemFromMyCart,
  updateMyCartList,
} = CartSlice.actions;

export default CartSlice.reducer;
