import { makeAutoObservable } from "mobx";
import postsService from "../../services/postService";

class TrainingTypesStore {
  types: string[] = [];
  isDataLoaded = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async fetchTrainingTypes() {
    try {
      if (this.isDataLoaded) return;

      // Training types change rarely, so memoize after the first request to
      // avoid hammering the API every time a component mounts.
      const res = await postsService.getTrainingTypes();
      this.types = (await res.request).data;
      this.isDataLoaded = true;
    } catch (err) {
      console.log(err);
    }
  }
}

export default new TrainingTypesStore();
