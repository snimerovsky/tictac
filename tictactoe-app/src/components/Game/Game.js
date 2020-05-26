import React, { useState, useEffect, useRef } from "react";
import styles from "./Game.module.scss";
import avatar from "../../images/avatar.svg";
import cross from "../../images/cross.svg";
import nullImg from "../../images/null.svg";
import coin from "../../images/coin.svg";
import exit from "../../images/exit.svg";
import done_red from "../../images/done_red.svg";
import done_green from "../../images/done_green.svg";
import { connect } from "react-redux";
import {
  pushBlock,
  winGame,
  leaveGame,
  endGame,
  leaveGameAndLose,
} from "../../redux/actions/game";
import PropTypes from "prop-types";
import { socket } from "../../redux/actions/game";
import MultiRef from "react-multi-ref";
import scrollIntoView from "scroll-into-view-if-needed";
import Modal from "../Modal/Modal";
import { isWin } from "./validator";
import "./style.css";

function Game({
  room,
  you,
  player,
  pushBlock,
  winGame,
  leaveGame,
  leaveGameAndLose,
  endGame,
  Blocks,
}) {
  const [blockRefs] = useState(() => new MultiRef());
  const [isMovePlayer, setIsMovePlayer] = useState(true);
  const [users, setUsers] = useState({
    room: room,
    you: you.name === localStorage.getItem("Name") ? you : player,
    player: you.name !== localStorage.getItem("Name") ? you : player,
  });

  const exitGame = () => {
    leaveGame(users.you, users.player, users.room);
  };
  const exitGameAndLose = () => {
    leaveGame(users.you, users.player, users.room);
    // leaveGameAndLose(users.you, users.player, users.room);
  };

  const scrollTo = (ref) => {
    if (ref) {
      ref.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  };

  useEffect(() => {
    socket.on("pushBlockTo", ({ id, isCross, isMove }) => {
      if (blockRefs.map.size > 0) {
        if (!Blocks.length > 0) {
          blockRefs.map.forEach((input) => {
            Blocks.push(input);
          });
        }
        setIsMovePlayer(isMove);
        Blocks[id - 1].classList.add(
          isCross ? `${styles.cross}` : `${styles.null}`,
        );
        scrollIntoView(Blocks[id - 1], {
          behavior: "smooth",
          scrollMode: "if-needed",
          inline: "center",
        });
        isWin(
          id - 1,
          isCross ? `${styles.cross}` : `${styles.null}`,
          Blocks,
          winGame,
          { winner: isCross },
          you,
          player,
        );
      }
    });
    socket.on("coins", (coins) => {
      localStorage.setItem("Coins", coins);
    });
    socket.on("leaveGameUsers", () => {
      endGame();
    });
    socket.on("forceGameGet", (data) => {
      endGame();
      // winGame(data.player, data.you, data.player, []);
    });
    socket.on("disconnectGame", () => {
      console.log("disconnect");
      exitGame();
    });
  }, [socket]);

  const pushClick = (e) => {
    if (
      (!users.you.cross && isMovePlayer) ||
      (users.you.cross && !isMovePlayer)
    ) {
      if (
        !e.target.classList.contains(`${styles.cross}`) &&
        !e.target.classList.contains(`${styles.null}`)
      ) {
        pushBlock(e.target.getAttribute("data-id"), room, {
          cross: users.you.cross,
          isMove: !isMovePlayer,
        });
      }
    }
  };

  const createTable = () => {
    let block = [];
    let num = 1;
    // Outer loop to create parent
    for (let i = 1; i <= 100; i++) {
      let children = [];
      //Inner loop to create children
      for (let j = 1; j <= 100; j++) {
        children.push(
          <div
            className={styles.gridBoxElem}
            key={num}
            data-id={num}
            ref={blockRefs.ref(num)}
            onClick={(e) => pushClick(e)}
          >
          </div>,
        );
        num += 1;
      }
      //Create the parent and add the children
      block.push(
        <div className={styles.gridBoxX} key={num}>
          {children}
        </div>,
      );
    }
    return block;
  };
  return (
    <>
      <Modal exitTo={exitGame} />
      <div className={styles.boxMenuTop}>
        <div className={styles.boxMenuCenter}>
          <img
            src={exit}
            alt="exit"
            style={{ cursor: "pointer" }}
            onClick={() => exitGameAndLose()}
          />
          <div className={styles.coinsBox}>
            <img src={coin} alt="coin" />
            <p className={styles.text}>
              {users.you.coins + users.player.coins}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.profiles}>
        <div className={styles.boxProfile}>
          <div className={styles.profileBox}>
            <img src={avatar} alt="profile" className={styles.profileImg} />
            <p className={styles.name}>{users.you.name}</p>
            {users.you.cross
              ? (
                <img src={cross} alt="cross" className={styles.methodImg} />
              )
              : (
                <img src={nullImg} alt="null" className={styles.methodImg} />
              )}
          </div>
          {!users.you.cross && isMovePlayer
            ? (
              <img src={done_green} alt="done" className={styles.done} />
            )
            : (
              ""
            )}
          {users.you.cross && !isMovePlayer
            ? (
              <img src={done_red} alt="done" className={styles.done} />
            )
            : (
              ""
            )}
        </div>
        <div className={styles.boxProfile}>
          <div className={styles.profileBox}>
            <img src={avatar} alt="profile" className={styles.profileImg} />
            <p className={styles.name}>{users.player.name}</p>
            {users.player.cross
              ? (
                <img src={cross} alt="cross" className={styles.methodImg} />
              )
              : (
                <img src={nullImg} alt="null" className={styles.methodImg} />
              )}
          </div>
          {!users.player.cross && isMovePlayer
            ? (
              <img src={done_green} alt="done" className={styles.done} />
            )
            : (
              ""
            )}
          {users.player.cross && !isMovePlayer
            ? (
              <img src={done_red} alt="done" className={styles.done} />
            )
            : (
              ""
            )}
        </div>
      </div>
      <div className={styles.gridBox} ref={scrollTo}>
        {createTable()}
      </div>
    </>
  );
}

Game.propTypes = {
  pushBlock: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  room: state.game.room,
  you: state.game.you,
  player: state.game.player,
  Blocks: state.game.blocks,
});

export default connect(mapStateToProps, {
  pushBlock,
  winGame,
  leaveGame,
  endGame,
  leaveGameAndLose,
})(Game);
