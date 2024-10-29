import {createSlice} from '@reduxjs/toolkit';

export const OrderSlice = createSlice({
  name: 'cart',
  initialState: {
    all_orders: [],
    order_history: [],
  },
  reducers: {
    setAllOrders: (state, action) => {
      state.all_orders = action.payload;
    },
    setOrderHistory: (state, action) => {
      state.order_history = action.payload;
    },
  },
});

export const {setAllOrders, setOrderHistory} = OrderSlice.actions;

export default OrderSlice.reducer;
