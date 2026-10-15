import { describe, expect, test } from "vitest";

import { analyze } from "./utils/analyze.js";

describe("images", () => {
  test("reports an image without alt text", async () => {
    const { analytics } = await analyze("# hey\n ![](image.jpg)");

    expect(analytics.issues).toContainEqual({ reason: "missing-alt", src: "image.jpg" });
  });

  test("reports an image without width and height", async () => {
    const { analytics } = await analyze("# hey\n ![](image.jpg)");

    expect(analytics.issues).toContainEqual({ reason: "missing-dimensions", src: "image.jpg", missing: "both" });
  });
});
