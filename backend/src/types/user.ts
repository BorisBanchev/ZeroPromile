export interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponseBody {
  status: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
    };
    token: string;
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
    };
    token: string;
  };
}
export interface ErrorResponseBody {
  error: string;
}
