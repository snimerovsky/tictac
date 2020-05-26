import React, { useState } from "react";
import MainPage from "../MainPage/MainPage";
import Progress from "../Progress/Progress";
import Game from "../Game/Game";
import { connect } from "react-redux";
import PropTypes from "prop-types";

function Content({ isGame }) {
  const renderGame = (isGame) => {
    switch (isGame) {
      case true:
        return <Game />;
      case false:
        return <MainPage />;
      default:
        return <MainPage />;
    }
  };
  return (
    <>
      <Progress />
      <>{renderGame(isGame)}</>
    </>
  );
}

MainPage.propTypes = {
  isGame: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isGame: state.game.isGame,
});

export default connect(mapStateToProps)(Content);
