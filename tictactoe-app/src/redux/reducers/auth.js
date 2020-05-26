import {
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  LOGOUT,
  GET_DATA,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SIGNUP_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        isAuthenticated: true,
        loading: true,
        token: payload.access,
      };
    case GET_DATA:
      return {
        ...state,
        coins: payload.coins,
        username: payload.username,
        idUser: payload._id,
      };
    case SIGNUP_FAIL:
    case LOGOUT:
      localStorage.removeItem("token");
      localStorage.removeItem("Coins");
      localStorage.removeItem("Name");
      localStorage.removeItem("IdUser");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
}
