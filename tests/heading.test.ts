import { describe, expect, test } from "vitest";

import { analyze } from "./utils/analyze.js";

describe("headings", () => {
  test("reports a missing h1", async () => {
    const { analytics } = await analyze("## hey");

    expect(analytics.issues).toContainEqual({ reason: "missing-heading-one" });
  });

  test("reports multiple h1", async () => {
    const { analytics } = await analyze("# hey\n# hey 2");

    expect(analytics.issues).toContainEqual({ reason: "multiple-h1", count: 2 });
  });

  test("reports a skipped heading level", async () => {
    const { analytics } = await analyze("# H1\n###### H6");

    expect(analytics.issues).toContainEqual({ reason: "heading-hierarchy", from: "h1", to: "h6" });
  });
});
