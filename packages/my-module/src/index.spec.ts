import { it, expect } from "vitest";
import { getHello } from "./index";

it("should print Hello, World!", () => {
  expect(getHello()).toBe("Hello, World!\n");
});
