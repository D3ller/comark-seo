import { Analytics } from "../types.js";
import { createIssue } from "../utils/issue.js";
import type { Node } from "comark";
import { flatten } from "../utils/flatten.js";

export const headingRule = (previousHeading: { value: string }, node: Node, analytics: Analytics) => {

    let currentHeading = node[0] as string;

    const text = flatten(node).trim()
    if (text.length > 60) {
        createIssue({ reason: "heading-too-long", from: currentHeading, text }, analytics)
    }

    if (currentHeading === "h1") {
        analytics.headings.h1Count++;
    }
    analytics.headings.count++;

    if (previousHeading.value) {
        isHierarchyValid(previousHeading.value, currentHeading, analytics)
    }
    previousHeading.value = currentHeading;

}

const isHierarchyValid = (firstValue: string, secondValue: string, analytics: Analytics) => {

    const headingValue: Record<string, number> = {
        "h1": 1,
        "h2": 2,
        "h3": 3,
        "h4": 4,
        "h5": 5,
        "h6": 6
    }

    if (headingValue[firstValue] === undefined || headingValue[secondValue] === undefined) {
        createIssue({reason: "invalid-heading"}, analytics);
        analytics.headings.hierarchyValid = false
        return;
    }
    if ((headingValue[secondValue] - headingValue[firstValue]) > 1) {
        createIssue({reason: 'heading-hierarchy', from: firstValue, to: secondValue}, analytics)
        analytics.headings.hierarchyValid = false;
    }

    return;
}