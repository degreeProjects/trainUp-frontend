export interface LoginDto {
  email: string;
  password: string;
}
export interface UploadPostDto {
  notes?: string;
  picture?: File;
  city: string;
  type: string;
  trainingLength: number;
}

export interface PostToEdit extends UploadPostDto {
  postId: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  homeCity?: string;
  picture?: File;
  height: number;
  weight: number;
  age: number;
}

export interface PostFormInput {
  notes?: string;
  city: string;
  type: string;
  trainingLength: number;
}

export interface EditProfileFormInput {
  homeCity?: string;
  fullName: string;
  height: number;
  weight: number;
  age: number;
}

export interface RegisterFormInput {
  email: string;
  password: string;
  fullName: string;
  homeCity?: string;
  height: number;
  weight: number;
  age: number;
}

export interface CaloriesBurnInput {
  type: string;
  trainingLength: number;
  height: number;
  weight: number;
  age: number;
}
