"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    preset: "ts-jest/presets/default-esm",
    testEnvironment: "node",
    extensionsToTreatAsEsm: [".ts"],
    globals: {
        "ts-jest": {
            useESM: true,
            tsconfig: "tsconfig.test.json",
        },
    },
};
