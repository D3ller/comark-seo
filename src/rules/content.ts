import { Analytics } from "../types.js";
import type { Node } from "comark";

export const contentRule = (analytics: Analytics, node: Node, stoppingWords: Set<string>, previousHeading: {
    value: string
}, browse: (node: Node, analytics: Analytics, previousHeading: { value: string }, stoppingWords: Set<string>) => void) => {
    for (let i = 2; i < node.length; i++) {
        const child = node[i];

        if (Array.isArray(child)) {
            browse(child, analytics, previousHeading, stoppingWords)
        } else if (typeof child === "string") {
            const words = child.split(/[ .:;?!~,`"&|()<>{}\[\]\r\n/\\]+/).filter((w) => w !== '')
            analytics.content.words += words.length

            words.forEach((word: string) => {
                const w = word.toLocaleLowerCase();
                if (stoppingWords.has(w)) return;
                if (analytics.content.repeatedWords.has(w)) {
                    const currentWord = analytics.content.repeatedWords.get(w);
                    if (!currentWord) return;
                    analytics.content.repeatedWords.set(w, currentWord + 1)
                } else {
                    analytics.content.repeatedWords.set(w, 1)
                }

            })
        }
    }
}