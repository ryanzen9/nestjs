import { describe, it } from "vitest";
import { OpenObserveConfig } from "../open-observe.interfaces";
import { OBLogger } from "../open-observe.logger";

const mockConfig = (): OpenObserveConfig => ({
  observerTraceUrl: "http://10.0.5.134:5080",
  observerScope: "example",
  observerStream: "test-logs",
  observerUsername: "rcerp@rctea.com",
  observerPassword: "rcerp@rctea.com",
});

describe("Send logs to Open Observe", () => {
  it("should send logs to Open Observe", () => {
    const config = mockConfig();
    const logger = new OBLogger(config);

    const errorTrace = new Error("This is a test error message").stack;

    logger.log("This is a test log message", "TestContext");
    logger.error("This is a test error message", errorTrace, "TestContext");
    logger.warn("This is a test warning message", "TestContext");
    logger.debug("This is a test debug message", "TestContext");
    logger.verbose("This is a test verbose message", "TestContext");
  });

  it("should send logs to Open Observe And Add Payload", () => {
    const config = mockConfig();
    const logger = new OBLogger(config);
    const processInfo = {
      time: new Date().toISOString(),
      pid: process.pid,
      dir: __dirname,
      file: __filename,
    };

    const errorTrace = new Error("This is a test error message").stack;

    logger.log("This is a test log message", "TestContext", 123);
    logger.error("This is a test error message", errorTrace, "TestContext", "test error payload");
    logger.warn("This is a test warning message", "TestContext", true);
    logger.debug("This is a test debug message", "TestContext", 123, "test", true);
    logger.verbose("This is a test verbose message", "TestContext", processInfo);
  });
});
