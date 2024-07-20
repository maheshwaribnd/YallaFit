const {createSlice} = require('@reduxjs/toolkit');

const initialState = {
  data: [],
  planNames: '',
  mealPlanPrice: '',
  howmanyWeeks: '',
  noOfDays: [],
  indivualMealPrice: [],
  indivualMealId: []
  // deliveryTimes: '',
};

const userMealPlan = createSlice({
  name: 'usermealPlan',
  initialState,
  reducers: {
    mealPlanDetails(state, action) {
      return {
        data: action.payload.data,
        planNames: action.payload.planNames,
        mealPlanPrice: action.payload.mealPlanPrice,
        howmanyWeeks: action.payload.howmanyWeeks,
        noOfDays: action.payload.noOfDays,
        indivualMealPrice: action.payload.indivualMealPrice,
        indivualMealId: action.payload.indivualMealId,
        // deliveryTimes: action.payload.deliveryTimes,
      };
    },
  },
});

export const {mealPlanDetails} = userMealPlan.actions;
export default userMealPlan.reducer;
