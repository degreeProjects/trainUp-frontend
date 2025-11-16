import { apiClientWithAuth } from "./apiClient";
import { createFormData } from "../common/utils/createFormData";

class UsersService {
  private readonly endpoint;

  constructor() {
    this.endpoint = "/users";
  }

  getMe() {
    const controller = new AbortController();
    const request = apiClientWithAuth.get(`${this.endpoint}/me`, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  editProfile(
    editDto: Partial<{
      fullName: string;
      email: string;
      homeCity: string;
      picture: File;
    }>
  ) {
    const controller = new AbortController();

    const request = apiClientWithAuth.put(
      this.endpoint,
      createFormData(editDto),
      {
        signal: controller.signal,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return { request, cancel: () => controller.abort() };
  }
}

const usersService = new UsersService();

export default usersService;
