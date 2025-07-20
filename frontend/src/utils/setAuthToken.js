// client/src/utils/setAuthToken.js
import axios from 'axios';

const setAuthToken = token => {
  if (token) {
    console.log("Setting auth token in headers:", token.substring(0, 10) + "..."); // Ne pas afficher le token complet pour des raisons de sécurité
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    console.log("Removing auth token from headers");
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;