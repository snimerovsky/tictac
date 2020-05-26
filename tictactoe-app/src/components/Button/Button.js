import React from "react";
import styles from "./Button.module.scss";

function Button(props) {
  const renderBtn = (type) => {
    switch (type) {
      case "red":
        return (
          <div
            className={`${styles.btn} ${styles.red}`}
            onClick={props.onClick}
          >
            {props.text}
          </div>
        );
      case "green":
        return (
          <div
            className={`${styles.btn} ${styles.green}`}
            onClick={props.onClick}
          >
            {props.text}
          </div>
        );
      default:
        return (
          <div
            className={`${styles.btn} ${styles.red}`}
            onClick={props.onClick}
          >
            {props.text}
          </div>
        );
    }
  };
  return (
    <>
      {renderBtn(props.type)}
    </>
  );
}

export default Button;
