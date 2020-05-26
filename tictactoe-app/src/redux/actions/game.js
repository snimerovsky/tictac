import axios from "axios";
import { START_GAME, WIN_GAME, END_GAME } from "./types";
import { setLoader, removeLoader } from "./alert";
import { toast } from "react-toastify";
import io from "socket.io-client";
import { getData } from "./auth";
const ENDPOINT = "https://salty-retreat-01658.herokuapp.com/";

export const socket = io(ENDPOINT);

export const startGameMultiplayer = ({ coins }) =>
  async (dispatch) => {
    let name = localStorage.getItem("Name");
    let token = localStorage.getItem("token");
    let getCoin = localStorage.getItem("Coins");
    const config = {
      headers: {
        "x-access-token": token,
      },
    };
    dispatch(setLoader());
    // const res = await axios.get("https://salty-retreat-01658.herokuapp.com/api/auth/check", config);
    if (coins < 0 || coins > parseInt(getCoin)) {
      toast.error(`You can not bet more or less coins than you have`);
      dispatch(removeLoader());
    } else {
      await socket.emit(
        "join",
        { name, coins, token, isByName: false },
        (error) => {
          if (error) {
            toast.error("error");
          }
        },
      );
      await socket.emit("randomPlayer", { name }, () => {});
      await socket.on("data", (data) => {
        dispatch({
          type: START_GAME,
          payload: data,
        });
        dispatch(removeLoader());
      });
    }
  };

export const startGameMultiplayerByName = ({ coins, usernameType }) =>
  async (
    dispatch,
  ) => {
    let name = localStorage.getItem("Name");
    let token = localStorage.getItem("token");
    let getCoin = localStorage.getItem("Coins");
    const config = {
      headers: {
        "x-access-token": token,
      },
    };
    dispatch(setLoader());
    if (coins < 0 || coins > parseInt(getCoin)) {
      toast.error(`You can not bet more or less coins than you have`);
      dispatch(removeLoader());
    } else if (usernameType == "") {
      toast.error(`Player name can't be empty`);
      dispatch(removeLoader());
    } else {
      await socket.emit(
        "join",
        { name, coins, token, isByName: true },
        (error) => {
          if (error) {
            toast.error("error");
          }
        },
      );
      await socket.emit("namePlayer", { name, usernameType }, () => {});
      await socket.on("data", (data) => {
        dispatch({
          type: START_GAME,
          payload: data,
        });
        dispatch(removeLoader());
      });
    }
  };

export const pushBlock = (id, room, cross) =>
  async (dispatch) => {
    await socket.emit("pushBlock", { id, room, cross }, () => {});
  };

export const winGame = (winner, you, player, blocksSuccess) =>
  async (
    dispatch,
  ) => {
    console.log("winner", winner);
    if (blocksSuccess.length > 0) {
      winner.cross
        ? blocksSuccess.forEach((element) => {
          element.classList.add("successCross");
        })
        : blocksSuccess.forEach((element) => {
          element.classList.add("successNull");
        });
    }
    let config = {
      headers: {
        "x-access-token": you.token,
        name: you.name,
      },
    };
    let res = await axios.get(
      "https://salty-retreat-01658.herokuapp.com/api/auth/check",
      config,
    );
    const yourCoins = res.data.info.coins;
    if (res.data.info.username === winner.name) {
      const body = {
        coins: yourCoins + player.coins + you.coins,
      };
      await axios.post(
        "https://salty-retreat-01658.herokuapp.com/api/user/userUpdateCoins",
        body,
        config,
      );
      await socket.emit("updateCoins", { user: you, coins: body.coins });
    } else {
      const body = {
        coins: yourCoins - you.coins,
      };
      await axios.post(
        "https://salty-retreat-01658.herokuapp.com/api/user/userUpdateCoins",
        body,
        config,
      );
      await socket.emit("updateCoins", { user: you, coins: body.coins });
    }
    config = {
      headers: {
        "x-access-token": player.token,
        name: player.name,
      },
    };
    res = await axios.get(
      "https://salty-retreat-01658.herokuapp.com/api/auth/check",
      config,
    );
    const playerCoins = res.data.info.coins;
    if (res.data.info.username === winner.name) {
      const body = {
        coins: playerCoins + you.coins + player.coins,
      };
      await axios.post(
        "https://salty-retreat-01658.herokuapp.com/api/user/userUpdateCoins",
        body,
        config,
      );
      await socket.emit("updateCoins", { user: player, coins: body.coins });
    } else {
      const body = {
        coins: playerCoins - player.coins,
      };
      await axios.post(
        "https://salty-retreat-01658.herokuapp.com/api/user/userUpdateCoins",
        body,
        config,
      );
      await socket.emit("updateCoins", { user: player, coins: body.coins });
    }
    setTimeout(() => {
      dispatch({
        type: WIN_GAME,
        payload: {
          player: player,
          winner: winner,
          you: you,
        },
      });
    }, 1000);
  };

export const endGame = () =>
  (dispatch) => {
    dispatch({
      type: END_GAME,
    });
  };

export const leaveGame = (you, player, room) =>
  async (dispatch) => {
    await socket.emit("leaveGame", { you, player, room });
  };

export const leaveGameAndLose = (you, player, room) =>
  async (dispatch) => {
    await socket.emit("forceGame", { you, player, room });
  };
