export interface User {
  id: string;
  email: string;
  name: string;
  gender?: "MALE" | "FEMALE";
  weightKg?: number;
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
