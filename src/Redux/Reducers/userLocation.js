import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  locationData: {},
};

const userLocation = createSlice({
  name: 'userLocation',
  initialState,
  reducers: {
    userLocationDetails(state, action) {
      return {
        locationData: action.payload.locationData,
      };
    },
  },
});

export const {userLocationDetails} = userLocation.actions;
export default userLocation.reducer;
