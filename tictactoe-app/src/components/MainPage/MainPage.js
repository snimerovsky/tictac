import React, { useState, useEffect } from "react";
import logo from "../../images/tictac.svg";
import logoPhone from "../../images/tictacPhone.svg";
import coin from "../../images/coin.svg";
import exit from "../../images/exit.svg";
import styles from "./MainPage.module.scss";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { signup, logout } from "../../redux/actions/auth";
import {
  startGameMultiplayer,
  startGameMultiplayerByName,
} from "../../redux/actions/game";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { socket } from "../../redux/actions/game";

function MainPage({
  signup,
  isAuthenticated,
  logout,
  coins,
  startGameMultiplayer,
  startGameMultiplayerByName,
}) {
  const [stage, setStage] = useState("Basic");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formDataPlay, setFormDataPlay] = useState({
    usernameType: "",
    coinsType: 0,
  });

  const { username, password } = formData;

  const clearInput = () => {
    setFormData({
      username: "",
      password: "",
    });
  };

  const logoutClick = () => {
    clearInput();
    logout();
  };

  const startGameRandom = () => {
    startGameMultiplayer({ coins: formDataPlay.coinsType });
  };
  const startGameByName = () => {
    startGameMultiplayerByName({
      coins: formDataPlay.coinsType,
      usernameType: formDataPlay.usernameType,
    });
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onChangeMultiplayer = (e) => {
    setFormDataPlay({ ...formDataPlay, [e.target.name]: e.target.value });
  };

  const onSubmit = () => {
    signup(username, password);
  };

  const renderSwitch = (stage) => {
    switch (stage) {
      case "Basic":
        return (
          <>
            <img
              src={exit}
              alt="exit"
              style={{
                cursor: "pointer",
                top: "1.5rem",
                left: "1.5rem",
                position: "absolute",
              }}
              onClick={() => logoutClick()}
            />
            <div className={styles.btnBox}>
              <div className={styles.box}>
                <div className={styles.coinsBox}>
                  <img src={coin} alt="coin" />
                  <p className={styles.text}>
                    Coins - {coins || localStorage.getItem("Coins") || 0}
                  </p>
                </div>
                <Button
                  type="green"
                  text="Play with random player"
                  onClick={() => setStage("RandomMultiplayer")}
                />
                <Button
                  type="red"
                  text="Play with player by name"
                  onClick={() => setStage("MultiplayerByName")}
                />
              </div>
            </div>
          </>
        );
      case "RandomMultiplayer":
        return (
          <div className={styles.btnBox}>
            <div className={styles.box}>
              <Input
                placeholder="Bet coins"
                type="number"
                name="coinsType"
                min={"1"}
                onChange={(e) => onChangeMultiplayer(e)}
              />
              <Button
                type="green"
                text="Play"
                onClick={() => startGameRandom()}
              />
            </div>
            <img
              src={exit}
              alt="exit"
              style={{
                cursor: "pointer",
                top: "1.5rem",
                left: "1.5rem",
                position: "absolute",
              }}
              onClick={() => setStage("Basic")}
            />
          </div>
        );
      case "MultiplayerByName":
        return (
          <div className={styles.btnBox}>
            <div className={styles.box}>
              <Input
                placeholder="Bet coins"
                type="number"
                name="coinsType"
                min={"1"}
                onChange={(e) => onChangeMultiplayer(e)}
              />
              <Input
                placeholder="Paste player name"
                name="usernameType"
                onChange={(e) => onChangeMultiplayer(e)}
              />
              <Button
                type="red"
                text="Play"
                onClick={() => startGameByName()}
              />
            </div>
            <img
              src={exit}
              alt="exit"
              style={{
                cursor: "pointer",
                top: "1.5rem",
                left: "1.5rem",
                position: "absolute",
              }}
              onClick={() => setStage("Basic")}
            />
          </div>
        );
      default:
        return (
          <>
            <img
              src={exit}
              alt="exit"
              style={{
                cursor: "pointer",
                top: "1.5rem",
                left: "1.5rem",
                position: "absolute",
              }}
              onClick={() => logoutClick()}
            />
            <div className={styles.btnBox}>
              <div className={styles.box}>
                <div className={styles.coinsBox}>
                  <img src={coin} alt="coin" />
                  <p className={styles.text}>
                    Coins - {coins || localStorage.getItem("Coins") || 0}
                  </p>
                </div>
                <Button type="green" text="Play with random player" />
                <Button type="red" text="Play with player by name" />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <>
      <div className={styles.titleBox}>
        <img src={logo} alt="tictac" className={styles.title} />
        <img
          src={logoPhone}
          alt="titlePhone"
          className={`${styles.titlePhone}`}
        />
      </div>
      {isAuthenticated || localStorage.getItem("token") ? (
        <>{renderSwitch(stage)}</>
      ) : (
        <>
          <div className={styles.btnBox}>
            <div className={styles.box}>
              <Input
                placeholder="Paste your username"
                name="username"
                value={username}
                onChange={(e) => onChange(e)}
              />
              <Input
                type="password"
                placeholder="Paste your password"
                name="password"
                value={password}
                onChange={(e) => onChange(e)}
              />
              <Button type="red" text="Sign in" onClick={() => onSubmit()} />
            </div>
          </div>
        </>
      )}
      <ToastContainer autoClose={2000} />
    </>
  );
}

MainPage.propTypes = {
  signup: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  startGameMultiplayer: PropTypes.func.isRequired,
  startGameMultiplayerByName: PropTypes.func.isRequired,
  coins: PropTypes.number,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  coins: state.auth.coins,
});

export default connect(mapStateToProps, {
  signup,
  logout,
  startGameMultiplayer,
  startGameMultiplayerByName,
})(MainPage);
