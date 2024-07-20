const {createSlice} = require('@reduxjs/toolkit');

const initialState = {
  mealoption: [],
};

const userMealsOption = createSlice({
  name: 'usermealsoption',
  initialState,
  reducers: {
    mealOptionDetails(state, action) {
      return {
        mealoption: action.payload.mealoption,
      };
    },
  },
});

export const {mealOptionDetails} = userMealsOption.actions;
export default userMealsOption.reducer;
