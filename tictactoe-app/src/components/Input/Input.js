import React from "react";
import styles from "./Input.module.scss";

const Input = (props) => {
  return (
    <input
      type={props.type || "text"}
      className={styles.input}
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
    />
  );
};

export default Input;
