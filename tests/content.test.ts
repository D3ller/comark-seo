import { describe, expect, test } from "vitest";

import { analyze } from "./utils/analyze.js";

describe("content", () => {
  test("excludes <pre> and <code> from the word count", async () => {
    const { analytics } = await analyze("<code> i </code> want an <pre>egg</pre>");

    expect(analytics.content.words).toBe(2);
  });

  test("never reports a reading time below one minute", async () => {
    const { analytics } = await analyze("# Hello world");

    expect(analytics.content.readingTime).toBeGreaterThanOrEqual(1);
  });

  test("sorts repeated words by frequency", async () => {
    const { analytics } = await analyze("# Bonjour comment allez-vous monsieur ? Bonjour monsieur je vais bien ! Bonjour");

    const repeatedWords = analytics.content.repeatedWords;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const wordOne = repeatedWords[0]!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const wordTwo = repeatedWords[1]!;

    expect(wordOne.word).toBe("bonjour");
    expect(wordOne.count).toBe(3);

    expect(wordTwo.word).toBe("monsieur");
    expect(wordTwo.count).toBe(2);
  });
});
