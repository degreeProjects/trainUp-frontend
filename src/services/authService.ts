import { apiClient } from "./apiClient";
import { gatherCookie } from "../common/utils/token";
import type { LoginDto, RegisterDto } from "../common/types";
import { createFormData } from "../common/utils/createFormData";

class AuthService {
  private readonly endpoint;

  constructor() {
    this.endpoint = "/auth";
  }

  register(registerDto: RegisterDto) {
    // Auth flows also expose AbortControllers so forms can safely unmount or
    // users can navigate away without leaving pending HTTP requests hanging.
    const controller = new AbortController();

    const request = apiClient.post(
      `${this.endpoint}/register`,
      createFormData(registerDto),
      {
        signal: controller.signal,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  login(loginDto: LoginDto) {
    const controller = new AbortController();
    const request = apiClient.post(`${this.endpoint}/login`, loginDto, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  loginByGoogle(token: string) {
    const controller = new AbortController();
    const request = apiClient.post(
      `${this.endpoint}/google-login`,
      { token },
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  logout() {
    const controller = new AbortController();
    const request = apiClient.get(`${this.endpoint}/logout`, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${gatherCookie("refresh_token")}`,
      },
    });

    return { request, cancel: () => controller.abort() };
  }
}

const authService = new AuthService();

export default authService;
