// import Chatkit from "@pusher/chatkit-client";
// import request from 'request';
// import fs from 'fs';

const CHATKIT_SECRET_KEY = "9b627f79-3aba-48df-af55-838bbb72222d:Pk9vcGeN/h9UQNGVEv609zhjyiPKtmnd0hlBW2T4Hfw="
const CHATKIT_TOKEN_PROVIDER_ENDPOINT = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/7a5d48bb-1cda-4129-88fc-a7339330f5eb/token";
const CHATKIT_INSTANCE_LOCATOR = "v1:us1:7a5d48bb-1cda-4129-88fc-a7339330f5eb";
// const CHATKIT_TOKEN_PROVIDER_ENDPOINT = "https://nott-auth.herokuapp.com/authenticate";

const 
  firebaseConfig = {
    apiKey: "AIzaSyBUkOB1x1F-bsZcGDnxXQI76JbU-4n8vqI",
    authDomain: "nottmystyle-447aa.firebaseapp.com",
    databaseURL: "https://nottmystyle-447aa.firebaseio.com",
    projectId: "nottmystyle-447aa",
    storageBucket: "nottmystyle-447aa.appspot.com",
    messagingSenderId: "791527199565"
  };

const geocodeKey = "AIzaSyBUkOB1x1F-bsZcGDnxXQI76JbU-4n8vqI";
  

export {firebaseConfig, geocodeKey, CHATKIT_SECRET_KEY, CHATKIT_TOKEN_PROVIDER_ENDPOINT, CHATKIT_INSTANCE_LOCATOR}