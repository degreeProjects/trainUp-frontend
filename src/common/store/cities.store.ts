import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";
import { config } from "../../config";

const LOCATION_NAME_FIELD = "שם_ישוב_לועזי";

class CitiesStore {
  cities: string[] = [];
  isDataLoaded = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async fetchCities() {
    // Load cities once, dedupe results, and store a clean list for the UI.
    try {
      if (this.isDataLoaded) return;

      const res = await axios.get(config.citiesApiUrl);

      runInAction(() => {
        // Extract city names, trim whitespace, drop empty values, then remove duplicates.
        this.cities = [
          ...new Set(
            res.data?.result?.records
              .map((city: any) => city[LOCATION_NAME_FIELD]?.trim())
              .filter(Boolean)
          ),
        ] as string[];

        this.isDataLoaded = true;
      });
    } catch (err) {
      console.log(err);
    }
  }
}

export default new CitiesStore();
