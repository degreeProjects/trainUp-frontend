import { gatherCookie } from "../common/utils/token";
import axios from "axios";
import { config } from "../config";

const apiClient = axios.create({
  baseURL: config.backendUrl,
});

const apiClientWithAuth = axios.create({
  baseURL: config.backendUrl,
});

// Attach the current access token to each request automatically,
// so callers don't need to pass Authorization headers manually.
apiClientWithAuth.interceptors.request.use((config) => {
  config.headers["Authorization"] = `Bearer ${gatherCookie("access_token")}`;
  return config;
});

// Refresh flow: if a request fails with 401, try to refresh the access token once
// using the refresh token, then retry the original request.
apiClientWithAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If the request was cancelled, just bubble it up.
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // If refresh itself is unauthorized, don't loop.
    if (
      error.response.status === 401 &&
      originalRequest.url === "/auth/refresh"
    ) {
      return Promise.reject(error);
    }

    // On first 401, attempt token refresh and retry the original request.
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await apiClient.get("/auth/refresh", {
          headers: {
            Authorization: `Bearer ${gatherCookie("refresh_token")}`,
          },
        });

        // Persist new tokens for future requests.
        document.cookie = `access_token=${response.data.accessToken}; path=/`;
        document.cookie = `refresh_token=${response.data.refreshToken}; path=/`;

        // Update default header for non-auth client (optional convenience).
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
