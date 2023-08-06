import React, { useState } from "react";

import AuthWindow from "./components/AuthWindow/AuthWindow";

import { ServerUrl } from "@/config/server";

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <AuthWindow serverUrl={ServerUrl} frontUrl={window.location} />

      <button>open modal</button>
    </div>
  );
};

export default App;
