import { Analytics, LinkNode } from "../types.js";

const linkRegex = new RegExp("^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,63}\\b[-a-zA-Z0-9()@:%_+.~#?&\\/=]*$");

export const linkRule = (node: LinkNode, analytics: Analytics) => {
    analytics.links.count++;
    if (node[1].href) {
        let link = node[1].href;

        linkRegex.test(link) ? analytics.links.external++ : analytics.links.internal++
    }
}