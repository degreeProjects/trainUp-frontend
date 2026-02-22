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
    // Create a per-call AbortController so each request can be cancelled independently
    // (e.g., on unmount, route change, or filter switch) without cancelling others.
    const controller = new AbortController();

    const request = apiClientWithAuth.post(
      this.endpoint,
      createFormData(uploadDto),
      {
        signal: controller.signal,
        headers: {
          // Sending files + fields (multipart form data)
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Return both the request promise and a cancel function for the caller.
    return { request, cancel: () => controller.abort() };
  }

  getPost(postId: string) {
    // Fetch a single post by id (cancellable).
    const controller = new AbortController();
    const request = apiClientWithAuth.get<IPost>(`${this.endpoint}/${postId}`, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  getByCityAndType(
    selectedCity: string,
    selectedType: string,
    page: number = 1,
    pageSize: number = config.defaultPageSize
  ) {
    // Search posts by city/type with pagination. Empty values default to "all".
    const controller = new AbortController();
    const city = selectedCity ? selectedCity : "all";
    const type = selectedType ? selectedType : "all";

    const request = apiClientWithAuth.get(
      `${this.endpoint}/search/cityAndType/?city=${city}&type=${type}&page=${page}&pageSize=${pageSize}`,
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  addCommentToPost(
    addCommentDto: { body: string; date: Date },
    postId: string
  ) {
    // Add a comment to a post (cancellable).
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
    // Get the current user's posts with pagination (cancellable).
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
    // Update a post by id. Uses multipart form data to support file changes (cancellable).
    const controller = new AbortController();

    const request = apiClientWithAuth.put(
      `${this.endpoint}/${postId}`,
      createFormData(editDto),
      {
        signal: controller.signal,
        headers: {
          // Sending files + fields (multipart form data)
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  deletePost(postId: string) {
    // Delete a post by id (cancellable).
    const controller = new AbortController();
    const request = apiClientWithAuth.delete(`${this.endpoint}/${postId}`, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  getTrainingTypes() {
    // Fetch available training types (cancellable).
    const controller = new AbortController();
    const request = apiClientWithAuth.get(`${this.endpoint}/training/types`, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  addLike(postId: string, userId: string) {
    // Like a post as a specific user (cancellable).
    const controller = new AbortController();
    const request = apiClientWithAuth.put(
      `${this.endpoint}/addLike/${postId}?userId=${userId}`,
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  removeLike(postId: string, userId: string) {
    // Remove a like from a post as a specific user (cancellable).
    const controller = new AbortController();
    const request = apiClientWithAuth.put(
      `${this.endpoint}/removeLike/${postId}?userId=${userId}`,
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  getLikedPostsByUser(userId: string) {
    // Get all posts liked by a given user (cancellable).
    const controller = new AbortController();
    const request = apiClientWithAuth.get(
      `${this.endpoint}/likedPosts/${userId}`,
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }
}

const postsService = new PostsService();

export default postsService;
