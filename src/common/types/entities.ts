export interface IPost {
  _id: string;
  restaurant: string;
  description: string;
  image: string;
  user: IUser;
  comments: Array<IComment>;
  createdAt: string;
}

export interface IComment {
  user: IUser;
  body: string;
  date: string;
}

export interface IUser {
  _id: string;
  email: string;
  password: string;
  fullName: string;
  profileImage?: string;
}
