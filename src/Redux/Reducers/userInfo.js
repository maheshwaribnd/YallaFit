const {createSlice} = require('@reduxjs/toolkit');

const initialState = {
  data: {},
};

const userInfo = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    userInfoDetails(state, action) {
      return {
        data: action.payload.data,
      };
    },
  },
});

export const {userInfoDetails} = userInfo.actions;
export default userInfo.reducer;
