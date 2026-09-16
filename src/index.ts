import { ComarkPluginFactory, Node } from 'comark'
import { defineComarkPlugin } from 'comark/parse'
import {
    Analytics,
    HeadingAnalytics,
    LinksAnalytics,
    ImagesAnalytics,
    ContentAnalytics,
    ComarkSeoMeta,
    ComarkSeoOptions,
    Issue,
} from "./types.js";
import type { ImageNode } from "./types.js";
import { frenchStopWords, englishStopWords } from "./constants.js";

import { headingRule } from "./rules/heading.js";
import { linkRule } from "./rules/link.js";
import { imageRule } from "./rules/image.js";
import { createIssue } from "./utils/issue.js";
import { contentRule } from "./rules/content.js";

const headingType = new Set(['h1', 'h2', "h3", 'h4', 'h5', 'h6']);

const browse = (node: Node, analytics: Analytics, previousHeading: { value: string }, stoppingWords: Set<string>) => {

    if (typeof node === "string") return;

    if (headingType.has(node[0]!)) {
        headingRule(previousHeading, node[0]!, analytics)
    }
    if (node[0] === "a") {
        linkRule(node, analytics);
    }
    if (node[0] === "img") {
        imageRule(node as ImageNode, analytics);
    }

    contentRule(analytics, node, stoppingWords, previousHeading, browse);
}


const seo = (TreeNode: Node[], options: ComarkSeoOptions = {}): Analytics => {

    const {
        readingSpeed = 200
    } = options

    const analytics: Analytics = {
        content: {
            words: 0,
            readingTime: null,
            repeatedWords: new Map<string, number>([])
        },
        links: {
            count: 0,
            internal: 0,
            external: 0,
            special: {
                anchor: 0,
                emails: 0,
                phone: 0
            },
            invalid: 0
        },
        images: {
            count: 0,
            missingAlt: 0
        },
        headings: {
            h1Count: 0,
            count: 0,
            hierarchyValid: true
        },
        issues: []
    }

    let stoppingWords: Set<string> = new Set<string>();
    const previousHeading = {value: ""};
    const lang = options.language;

    if (lang) {
        lang === "fra" ? stoppingWords = frenchStopWords : stoppingWords = englishStopWords
    }

    TreeNode.forEach((event) => {
        browse(event, analytics, previousHeading, stoppingWords);
    })

    if (analytics.headings.h1Count > 1) {
        createIssue({reason: "multiple-h1", count: analytics.headings.h1Count}, analytics)
    }

    analytics.content.readingTime = Math.round(analytics.content.words / readingSpeed);

    return analytics
}

const plugin: ComarkPluginFactory<ComarkSeoOptions, ComarkSeoMeta> = defineComarkPlugin<ComarkSeoOptions, ComarkSeoMeta>((options = {}) => {

    const {
        enabled = true,
    } = options

    return {
        name: 'seo',

        post(state) {
            if (!enabled) return;
            state.tree.meta.seo = seo(state.tree.nodes, options)
        }
    }
})

export default plugin;
export type { Analytics, Issue, HeadingAnalytics, ContentAnalytics, LinksAnalytics, ImagesAnalytics };