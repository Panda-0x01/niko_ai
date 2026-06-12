export interface User {
  id: string;
  full_name: string;
  email: string;
  profile_image?: string | null;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  full_name: string;
  email: string;
  password: string;
}

export interface PredictResponse {
  crop: string;
  disease: string;
  confidence: number;
  description: string;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
  prediction_id: string;
  image_url?: string | null;
}

export interface PredictionHistory {
  id: string;
  crop_name: string;
  disease_name: string;
  confidence: number;
  image_url?: string | null;
  created_at: string;
  description?: string | null;
  symptoms?: string[];
  treatment?: string[];
  prevention?: string[];
}

export interface UpdateProfileInput {
  full_name?: string;
  profile_image?: string;
}
