export enum Gender {
  Male = "male",
  Female = "female",
}
export interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  gender: Gender;
  weightKg: number;
}

export interface RegisterResponseBody {
  status: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      gender: string;
      weightKg: number;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface LoginRequestBody {
  email: string;
  password: string;
}
export interface LoginResponseBody {
  status: string;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      gender: string;
      weightKg: number;
    };
    accessToken: string;
    refreshToken: string;
  };
}
