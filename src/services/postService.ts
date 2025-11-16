import { apiClientWithAuth } from "./apiClient";
import type { IPost, IComment, UploadPostDto } from "../common/types";
import { config } from "../config";
import { createFormData } from "../common/utils/createFormData";

class PostsService {
  private readonly endpoint;

  constructor() {
    this.endpoint = "/posts";
  }

  uploadPost(uploadDto: UploadPostDto) {
    const controller = new AbortController();

    const request = apiClientWithAuth.post(
      this.endpoint,
      createFormData(uploadDto),
      {
        signal: controller.signal,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  getPost(postId: string) {
    const controller = new AbortController();
    const request = apiClientWithAuth.get<IPost>(`${this.endpoint}/${postId}`, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  addCommentToPost(
    addCommentDto: { body: string; date: Date },
    postId: string
  ) {
    const controller = new AbortController();
    const request = apiClientWithAuth.post<IComment>(
      `${this.endpoint}/${postId}/comment`,
      addCommentDto,
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  getByUser(page: number = 1, pageSize: number = config.defaultPageSize) {
    const controller = new AbortController();
    const request = apiClientWithAuth.get(
      `${this.endpoint}/user/me?page=${page}&pageSize=${pageSize}`,
      {
        signal: controller.signal,
      }
    );
    return { request, cancel: () => controller.abort() };
  }

  editPost(postId: string, editDto: UploadPostDto) {
    const controller = new AbortController();

    const request = apiClientWithAuth.put(
      `${this.endpoint}/${postId}`,
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

  deletePost(postId: string) {
    const controller = new AbortController();
    const request = apiClientWithAuth.delete(`${this.endpoint}/${postId}`, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }
}

const postsService = new PostsService();

export default postsService;
