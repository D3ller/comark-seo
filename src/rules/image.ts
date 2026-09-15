import { Analytics, ImageNode } from "../types.js";
import { createIssue } from "../utils/issue.js";

export const imageRule = (node: ImageNode, analytics: Analytics) => {
    analytics.images.count++;
    if (node[1].alt === undefined || node[1].alt === null) {
        analytics.images.missingAlt++;
        createIssue({reason: "missing-alt", src: node[1].src}, analytics)
    }
    if (!node[1].width || !node[1].height) {
        createIssue({reason: "missing-dimensions", src: node[1].src, missing: "both"}, analytics)
    }
}