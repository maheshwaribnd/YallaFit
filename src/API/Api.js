import axios from 'axios';

export const BASE_URL = 'https://yallafit.reviewdevelopment.net/api/';

const constructApiRequest = (path, method, body) => ({
  url: path,
  method: method,
  data: body,
});

const constructApiRequest1 = (path, method, body) => ({
  url: path,
  method: method,
  data: body,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

const Axios = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

const requests = {
  get: path => Axios(constructApiRequest(path, 'get')),
  post: (path, params) => Axios(constructApiRequest(path, 'post', params)),
  put: (path, params) => Axios(constructApiRequest(path, 'put', params)),
  delete: path => Axios(constructApiRequest(path, 'delete')),
};

const requests1 = {
  get: path => Axios(constructApiRequest1(path, 'get')),
  post: (path, params) => Axios(constructApiRequest1(path, 'post', params)),
  put: (path, params) => Axios(constructApiRequest1(path, 'put', params)),
  delete: path => Axios(constructApiRequest1(path, 'delete')),
};

// add request path here
const requestPath = {
  //Post request
  userLogin: 'auth/login',
  userSignup: 'auth/register',
  socialLogin: 'auth/socialLogin',
  userCompleteRegister: 'auth/completeRegisteration',
  signUpUpdateStatus: 'auth/updateStatus',
  checkPassword: 'auth/checkPassword',
  forgotPassword: 'auth/forgotpassword',
  setNewPassword: 'auth/setPassword',
  location: 'auth/updateLocation',
  searchLocation: 'auth/updateRecentLocations',
  userAnswer: 'auth/userAnswer',
  updateProfilePic: 'auth/updateUserDetails',
  postNotification: 'settings/saveNotifications',
  userCheckout: 'orders',
  updateFeedback: 'auth/updateFeedback',
  updateSubscription: 'orders/orderDatesUpdate',

  //Get request
  // updateStatus: 'auth/updateStatus',
  slider: 'question/sliders',
  termsNdCondition: 'auth/contents/5',
  recentlocationList: '/auth/recentLocations',
  questionList: 'question',
  myPlanPackage: 'meals/packages',
  mealsAddons: 'meals/mealsAddons',
  mealsCategories: 'meals/categories',
  mealsByCategory: 'meals/list',
  userDetails: 'auth/userDetaisById',
  getNotification: 'settings/notifications',
  deliveryCharges: 'settings/list',
  activeSubscription: 'orders/orderMealsById',
  customerNotification: 'auth/customerNotifications',
  updateNotification: 'auth/isNotifyCustomer',
}

const ApiManager = {
  //Post API
  userLogin: params => {
    return requests.post(`${requestPath.userLogin}`, params);
  },

  userSignUp: params => {
    return requests.post(requestPath.userSignup, params);
  },
  
  socialLogin: params => {
    return requests.post(`${requestPath.socialLogin}`, params)
  },

  userCompleteRegister: params => {
    return requests.post(requestPath.userCompleteRegister, params);
  },

  checkPassword: params => {
    return requests.post(`${requestPath.checkPassword}`, params);
  },

  forgotPassword: params => {
    return requests.post(`${requestPath.forgotPassword}`, params);
  },

  setNewPassword: params => {
    return requests.post(`${requestPath.setNewPassword}`, params);
  },

  Location: params => {
    return requests.post(`${requestPath.location}`, params);
  },

  SearchLocation: params => {
    return requests.post(`${requestPath.searchLocation}`, params);
  },

  userAnswerforQuestions: params => {
    return requests.post(`${requestPath.userAnswer}`, params);
  },

  updateUserProfilePicture: params => {
    return requests1.post(`${requestPath.updateProfilePic}`, params);
  },

  postNotificationEvents: params => {
    return requests.post(`${requestPath.postNotification}`, params);
  },

  checkout: params => {
    return requests.post(`${requestPath.userCheckout}`, params);
  },

  Feedback: params => {
    return requests.post(`${requestPath.updateFeedback}`, params);
  },

  updateSubscription: params => {
    return requests.post(`${requestPath.updateSubscription}`, params);
  },

  // Get API
  sliderAPI: () => {
    return requests.get(`${requestPath.slider}`);
  },

  signUpUpdateStatus: signupid => {
    return requests.get(`${requestPath.signUpUpdateStatus}/${signupid}`);
  },

  // getUpdateStatus: params => {
  //   return requests.get(`${requestPath.updateStatus}/${params.id}`);
  // },

  termsAndCondition: () => {
    return requests.get(`${requestPath.termsNdCondition}`);
  },

  recentLocationList: userid => {
    return requests.get(`${requestPath.recentlocationList}/${userid}`);
  },

  questionList: () => {
    return requests.get(`${requestPath.questionList}`);
  },

  userDetails: userid => {
    return requests.get(`${requestPath.userDetails}/${userid}`);
  },

  getNotificationEvents: () => {
    return requests.get(`${requestPath.getNotification}`);
  },

  myPlanPackage: categoryid => {
    return requests.get(`${requestPath.myPlanPackage}/${categoryid}`);
  },

  addonsInCalender: () => {
    return requests.get(`${requestPath.mealsAddons}`);
  },

  categoriesInMealOption: () => {
    return requests.get(`${requestPath.mealsCategories}`);
  },

  mealsByCategory: categoryid => {
    return requests.get(`${requestPath.mealsByCategory}/${categoryid}`);
  },

  deliveryCharges: () => {
    return requests.get(`${requestPath.deliveryCharges}`);
  },

  activeSubscription: userid => {
    return requests.get(`${requestPath.activeSubscription}/${userid}`);
  },

  notification: userId => {
    return requests.get(`${requestPath.customerNotification}/${userId}`);
  },

  updateNotification: userId => {
    return requests.get(`${requestPath.updateNotification}/${userId}`);
  },
};

export default ApiManager;
