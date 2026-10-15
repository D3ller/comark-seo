import { parseMarkdown } from "comark";

import { seo } from "../../src/seo.js";
import type { ComarkSeoOptions } from "../../src/types.js";

export const analyze = async (content: string, options?: ComarkSeoOptions) => {
  const markdown = await parseMarkdown(content);
  const analytics = seo(markdown.nodes, options);

  return { markdown, analytics };
};
