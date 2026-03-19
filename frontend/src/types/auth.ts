export interface User {
  id: string;
  email: string;
  name: string;
  gender: "male" | "female";
  weightKg: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  gender: "male" | "female" | null;
  weightKg: number;
}

export interface LoginResponse {
  status: string;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      gender: "male" | "female";
      weightKg: number;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface RegisterResponse {
  status: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      gender: "male" | "female";
      weightKg: number;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenResponse {
  status: string;
  data: {
    accessToken: string;
  };
}
