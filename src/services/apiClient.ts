import { gatherCookie } from "../common/utils/token";
import axios from "axios";
import { config } from "../config";

const apiClient = axios.create({
  baseURL: config.backendUrl,
});

const apiClientWithAuth = axios.create({
  baseURL: config.backendUrl,
});

// Attach the latest JWT to every authenticated request so components can call
// services without juggling headers manually.
apiClientWithAuth.interceptors.request.use((config) => {
  config.headers["Authorization"] = `Bearer ${gatherCookie("access_token")}`;
  return config;
});

// Centralized refresh-token flow: automatically retry once when we detect the
// access token expired, minting a fresh pair of tokens before replaying.
apiClientWithAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest.url === "/auth/refresh"
    ) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await apiClient.get("/auth/refresh", {
          headers: {
            Authorization: `Bearer ${gatherCookie("refresh_token")}`,
          },
        });
        document.cookie = `access_token=${response.data.accessToken}; path=/`;
        document.cookie = `refresh_token=${response.data.refreshToken}; path=/`;
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;
        return apiClientWithAuth(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export { apiClient, apiClientWithAuth };
