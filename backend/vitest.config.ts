import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    include: ["tests/**/*.test.ts", "tests/**/*.spec.ts"],
    setupFiles: "tests/setup.ts",
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      reporter: ["html"],
      reportsDirectory: "./coverage",
      exclude: [
        "node_modules/",
        "dist/",
        "**/*.d.ts",
        "**/*.spec.ts",
        "**/*.test.ts",
        "src/index.ts",
        "src/app.ts",
        "src/config/**",
        "src/types/**",
        "src/generated/**",
      ],
    },
  },
});
