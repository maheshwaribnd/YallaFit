const {createSlice} = require('@reduxjs/toolkit');

const initialState = {
  totalAmount: '',
  forDelivery: '',
  saveAs: '',
};

const userTotalAmount = createSlice({
  name: 'usertotalamount',
  initialState,
  reducers: {
    TotalAmountDetails(state, action) {
      return {
        totalAmount: action.payload.totalAmount,
        forDelivery: action.payload.forDelivery,
        saveAs: action.payload.saveAs,
      };
    },
  },
});

export const {TotalAmountDetails} = userTotalAmount.actions;
export default userTotalAmount.reducer;
