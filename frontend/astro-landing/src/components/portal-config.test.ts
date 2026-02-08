import { describe, expect, it } from "vitest";
import { portalConfig } from "./portal-config";

describe("portalConfig", () => {
  it("defines both authors and default position", () => {
    expect(portalConfig.content.novis.name).toBe("Novis");
    expect(portalConfig.content.lilin.name).toBe("Lilin");
    expect(portalConfig.content.defaultPos).toBe(0.5);
  });

  it("keeps wave offsets within a reasonable range", () => {
    expect(portalConfig.visuals.waveOffset).toBeGreaterThan(0);
    expect(portalConfig.visuals.waveOffset).toBeLessThan(1);
    expect(portalConfig.visuals.foamOffset).toBeGreaterThan(0);
    expect(portalConfig.visuals.foamOffset).toBeLessThan(1);
  });
});
