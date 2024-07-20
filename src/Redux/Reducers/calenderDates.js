const { createSlice } = require('@reduxjs/toolkit');

const initialState = {
  date: [],
  addOn: [],
  startDate: '',
  endDate: '',
  datesforAddon: [],
  multiplayprice: ''
};

const calenderDates = createSlice({
  name: 'selectedDates',
  initialState,
  reducers: {
    showSelectedWeeks(state, action) {
      return {
        date: action.payload.date,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
        addOn: action.payload.addOn,
        datesforAddon: action.payload.datesforAddon,
        multiplayprice: action.payload.multiplayprice
      };
    },
  },
});

export const { showSelectedWeeks } = calenderDates.actions;
export default calenderDates.reducer;
