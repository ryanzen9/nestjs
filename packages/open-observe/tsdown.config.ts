import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],

  outDir: "lib",

  format: ["cjs", "esm"],

  dts: {
    sourcemap: true,
  },

  clean: true,

  sourcemap: true,

  minify: process.env.NODE_ENV === "production",

  treeshake: true,

  // 排除第三方框架依赖
  deps: {
    neverBundle: ["@nestjs/common", "@nestjs/core", "reflect-metadata", "rxjs"],
  },
  target: false,
});
