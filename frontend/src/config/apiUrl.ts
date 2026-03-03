import Constants from "expo-constants";

const getApiUrl = () => {
  const nodeEnv = process.env.EXPO_PUBLIC_NODE_ENV || "development";

  switch (nodeEnv) {
    case "production":
      return "https://zeropromile-api.fly.dev/api";
    case "staging":
      return "https://zeropromile-api-staging.fly.dev/api";
    case "development":
    default:
      // Get IP address from Expo debugger host
      const debuggerHost = Constants.expoConfig?.hostUri?.split(":").shift();
      // If physical device detected, use the IP address
      if (
        debuggerHost &&
        !debuggerHost.includes("localhost") &&
        debuggerHost !== "127.0.0.1"
      ) {
        return `http://${debuggerHost}:3001/api`;
      }

      return "http://localhost:3001/api";
  }
};

export const API_URL = getApiUrl();
