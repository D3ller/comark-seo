import type { Analytics, ImageNode } from "../types.js";
import { createIssue } from "../utils/issue.js";

export const imageRule = (node: ImageNode, analytics: Analytics) => {
  analytics.images.count++;
  if (node[1].alt === undefined || node[1].alt === null) {
    analytics.images.missingAlt++;
    createIssue({ reason: "missing-alt", src: node[1].src }, analytics);
  }

  const { width, height, src } = node[1];

  if (!width || !height) {
    const missing = !width && !height ? "both" : !width ? "width" : "height";

    createIssue({ reason: "missing-dimensions", src, missing }, analytics);
  }
};
