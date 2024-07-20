import {configureStore} from '@reduxjs/toolkit';
import userInfo from '../Reducers/userInfo';
import userLocation from '../Reducers/userLocation';
import userMealPlan from '../Reducers/usermealPlan';
import calenderDates from '../Reducers/calenderDates';
import userMealsOption from '../Reducers/mealsOption';
import userTotalAmount from '../Reducers/totalAmount';

const myStore = configureStore({
  reducer: {
    userInfo,
    userLocation,
    userMealPlan,
    calenderDates,
    userMealsOption,
    userTotalAmount,
  },
});

export default myStore;
