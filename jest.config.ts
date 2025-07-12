import type { Config } from "jest";
import { createDefaultEsmPreset } from "ts-jest";

const config: Config = {
  // ESM preset
  ...createDefaultEsmPreset({ tsconfig: "tsconfig.json" }),
  // Coverage
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!**/node_modules/**"],
  coverageDirectory: "<rootDir>/coverage/",
  coveragePathIgnorePatterns: ["<rootDir>/src/index.ts"],
  // Custom
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
  },
  passWithNoTests: true,
  testEnvironment: "node",
};

export default config;
