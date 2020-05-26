import React from "react";
import { connect } from "react-redux";
import exit from "../../images/exit.svg";
import avatar from "../../images/avatar.svg";
import coin from "../../images/coin.svg";
import PropTypes from "prop-types";
import styles from "./Modal.module.scss";
import cross from "../../images/cross.svg";
import nullImg from "../../images/null.svg";
import { endGame } from "../../redux/actions/game";

function Modal({ open, winner, you, player, exitTo }) {
  return (
    <div style={{ display: open ? "block" : "none" }}>
      <div className={styles.modalBox}>
        <div className={styles.modal}>
          <div className={styles.profileBox}>
            <img src={avatar} alt="profile" className={styles.profileImg} />
            <p className={styles.name}>{winner.name || ""}</p>
            {winner.cross ? (
              <img src={cross} alt="cross" className={styles.methodImg} />
            ) : (
              <img src={nullImg} alt="cross" className={styles.methodImg} />
            )}
          </div>
          <div className={styles.rightBox}>
            <h1 className={styles.titleWon}>WON!</h1>
            <div className={styles.boxCoins}>
              <div className={styles.coinsBox}>
                <img src={coin} alt="coin" />
                <p className={styles.text}>{you.coins + player.coins}</p>
              </div>
            </div>
            <img
              src={exit}
              alt="exit"
              style={{ cursor: "pointer", marginTop: "0.8rem" }}
              onClick={exitTo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  open: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  open: state.game.open,
  winner: state.game.winner,
  you: state.game.you,
  player: state.game.player,
});

export default connect(mapStateToProps)(Modal);
