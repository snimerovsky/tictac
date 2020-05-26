import React from "react";
import { Ellipsis } from "react-spinners-css";
import styles from "./Progress.module.scss";
import { connect } from "react-redux";
import PropTypes from "prop-types";

function Progress({ loading }) {
  return (
    <div
      className={styles.progressBack}
      style={{ display: loading ? "flex" : "none" }}
    >
      <Ellipsis color="#fff" size={200} />
    </div>
  );
}

Progress.propTypes = {
  loading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  loading: state.alert.loading,
});

export default connect(mapStateToProps)(Progress);
