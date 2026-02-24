import { apiClient } from "./apiClient";
import { CaloriesBurnInput } from "../common/types";
class CaloriesService {
  private readonly endpoint;

  constructor() {
    this.endpoint = "/calories";
  }

  calculate(data: CaloriesBurnInput) {
    const controller = new AbortController();
    const request = apiClient.post(`${this.endpoint}/calculate`, data, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }
}

const caloriesService = new CaloriesService();

export default caloriesService;
