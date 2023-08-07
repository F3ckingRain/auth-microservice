import React from "react";

import useCount from "@/recoil/atoms/countState/countState";

const Counter = () => {
  const [{ count }, setCountState] = useCount();

  const countHandler = () => {
    // setCountState((state) => ({ ...state, count: count + 1 }));
    setCountState({ count: count + 1 });
  };

  return <button onClick={countHandler}>click: {count}</button>;
};

export default Counter;
