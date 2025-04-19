import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl:"http://localhost:4000/",
    credentials: "include",
  }),
  reducerPath: "adminApi",
  tagTypes: ["Admins", "Events", "Users", "Committees"],
  endpoints: (build) => ({}),
});
 
