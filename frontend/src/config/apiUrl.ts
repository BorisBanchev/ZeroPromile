const getApiUrl = () => {
  const nodeEnv = process.env.EXPO_PUBLIC_NODE_ENV || "development";

  switch (nodeEnv) {
    case "production":
      return "https://zeropromile-api.fly.dev/api";
    case "staging":
      return "https://zeropromile-api-staging.fly.dev/api";
    case "development":
    default:
      return "http://localhost:3001/api";
  }
};

export const API_URL = getApiUrl();
