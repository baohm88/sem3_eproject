import axiosClient from "./axiosClient";

const authApi = {
  login: (data) => axiosClient.post("/auth/login", data),
  register: (data) => axiosClient.post("/auth/register", data),
  changePassword: (data) => axiosClient.put("/auth/change-password", data),
  updateAccount: (data) => axiosClient.put("/auth/update-account", data),
};

export default authApi;
