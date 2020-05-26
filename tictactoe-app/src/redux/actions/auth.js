import axios from "axios";
import { SIGNUP_FAIL, SIGNUP_SUCCESS, LOGOUT, GET_DATA } from "./types";
import { toast } from "react-toastify";
import { setLoader, removeLoader } from "./alert";

export const signup = (username, password) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({
      username,
      password,
    });

    try {
      dispatch(setLoader());
      const res = await axios.post(
        "https://salty-retreat-01658.herokuapp.com/api/auth/register",
        body,
        config,
      );
      dispatch({
        type: SIGNUP_SUCCESS,
        payload: res.data,
      });
      dispatch(removeLoader());
      dispatch(getData(res.data.token));
      toast.success("Signed in successfully");
    } catch (err) {
      dispatch({
        type: SIGNUP_FAIL,
      });
      dispatch(removeLoader());
      toast.error(err.response.data.message);
    }
  };

export const getData = (token) =>
  async (dispatch) => {
    const config = {
      headers: {
        "x-access-token": token,
      },
    };
    dispatch(setLoader());
    const res = await axios.get(
      "https://salty-retreat-01658.herokuapp.com/api/auth/check",
      config,
    );
    dispatch({
      type: GET_DATA,
      payload: res.data.info,
    });
    localStorage.setItem("Coins", res.data.info.coins);
    localStorage.setItem("Name", res.data.info.username);
    localStorage.setItem("IdUser", res.data.info._id);
    dispatch(removeLoader());
  };

export const logout = () =>
  (dispatch) => {
    dispatch(setLoader());
    dispatch({ type: LOGOUT });
    dispatch(removeLoader());
  };
