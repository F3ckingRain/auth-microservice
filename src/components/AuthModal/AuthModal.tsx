import React from "react";

import AuthWindow from "../AuthWindow/AuthWindow";

import { ServerUrl } from "@/config/server";

const AuthModal = () => (
  <div>
    <AuthWindow serverUrl={ServerUrl} frontUrl={window.location} />
  </div>
);

export default AuthModal;
