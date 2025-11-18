export interface IPost {
  _id: string;
  description: string;
  image: string;
  city: string;
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
  homeCity?: string;
  profileImage?: string;
}
