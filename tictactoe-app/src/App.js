import React from "react";
import Content from "./components/Content/Content";

import { Provider } from "react-redux";
import store from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <Content />
    </Provider>
  );
}

export default App;
