export interface LoginDto {
  email: string;
  password: string;
}
export interface UploadPostDto {
  restaurant: string;
  description: string;
  picture?: File;
}

export interface PostToEdit extends UploadPostDto {
  postId: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  picture?: File;
}

export interface PostFormInput {
  restaurant: string;
  description: string;
}

export interface EditProfileFormInput {
  fullName: string;
}

export interface RegisterFormInput {
  email: string;
  password: string;
  fullName: string;
}
