import { useEffect } from "react";

import { useLocation } from "react-router-dom";

const autoAuthWatcher = () => {
  const { search } = useLocation();

  useEffect(() => {
    if (!search.includes("token")) return undefined;

    return undefined;
  }, [search]);
};

export default autoAuthWatcher;
