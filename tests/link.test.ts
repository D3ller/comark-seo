import { describe, expect, test } from "vitest";

import { analyze } from "./utils/analyze.js";

describe("links", () => {
  test("reports a link with an invalid url", async () => {
    const { analytics } = await analyze("# i love you\n[Duck Duck Go](hmm://javascript:alert(1))");

    expect(analytics.issues).toContainEqual({ reason: "invalid-link", href: "hmm://javascript:alert(1)" });
  });

  test("reports a link without url", async () => {
    const { analytics } = await analyze("# i love you\n[Hello World]()");

    expect(analytics.issues).toContainEqual({ reason: "missing-url", text: "Hello World" });
  });
});
