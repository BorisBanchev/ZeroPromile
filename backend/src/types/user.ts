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
  };
}

export interface ErrorResponseBody {
  error: string;
}
