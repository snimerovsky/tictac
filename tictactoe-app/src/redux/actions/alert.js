import { REMOVE_LOADING, SET_LOADING } from "./types";

export const setLoader = () => (dispatch) => {
  dispatch({
    type: SET_LOADING,
  });
};

export const removeLoader = () => (dispatch) => {
  dispatch({
    type: REMOVE_LOADING,
  });
};
