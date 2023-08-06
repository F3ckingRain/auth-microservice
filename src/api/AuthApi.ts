import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { SignRequest } from "@/api/types";

export const AuthApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/plain, */*",
    },
  }),
  tagTypes: ["Auth"],
  endpoints: (build) => ({
    signIn: build.mutation<string, SignRequest>({
      query: ({ headers, body }) => ({
        ...headers,
        ...body,
      }),
    }),
  }),
});
