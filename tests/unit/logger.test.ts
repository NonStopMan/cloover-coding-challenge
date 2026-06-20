import { describe, it, expect, vi } from "vitest";
import * as loggerModule from "@/lib/logger";

describe("logger helpers", () => {
  it("logRequest calls logger.info", () => {
    const spy = vi
      .spyOn(loggerModule.logger, "info")
      .mockImplementation(() => {});
    loggerModule.logRequest({
      method: "GET",
      path: "/",
      status: 200,
      durationMs: 10,
    });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("logError calls logger.error", () => {
    const spy = vi
      .spyOn(loggerModule.logger, "error")
      .mockImplementation(() => {});
    loggerModule.logError(new Error("boom"), { extra: true });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
