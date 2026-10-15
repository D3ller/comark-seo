import type { Node } from "comark";

import type { Analytics } from "../types.js";

// We exclude this type of word bc it's polute the real word count
const excludeWordCount = new Set<string>(["pre", "code"]);

export const contentRule = (analytics: Analytics, node: Node, stoppingWords: Set<string>, previousHeading: {
  value: string;
}, wordCounts: Map<string, number>, browse: (node: Node, analytics: Analytics, previousHeading: { value: string }, stoppingWords: Set<string>, wordCounts: Map<string, number>) => void) => {
  for (let i = 2; i < node.length; i++) {
    const child = node[i];

    if (Array.isArray(child)) {
      browse(child, analytics, previousHeading, stoppingWords, wordCounts);
    } else if (typeof child === "string") {
      if (excludeWordCount.has(node[0] as string)) continue;

      const words = child.split(/[ .:;?!~,`"&|()—<>{}[\]\r\n/\\]+/).filter((w) => w !== "");

      analytics.content.words += words.length;

      words.forEach((word: string) => {
        const w = word.toLocaleLowerCase();

        if (stoppingWords.has(w)) return;
        wordCounts.set(w, (wordCounts.get(w) ?? 0) + 1);
      });
    }
  }
};
