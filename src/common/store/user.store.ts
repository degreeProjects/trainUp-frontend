import { makeAutoObservable } from "mobx";
import type { IUser } from "../types";

class UserStore {
  user: IUser | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setUser(user: IUser | null) {
    this.user = user;
  }
}

export default new UserStore();
