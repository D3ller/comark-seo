import { Analytics, Issue, LinkNode, LinkType } from "../types.js";
import { createIssue } from "../utils/issue.js";
import { flatten } from "../utils/flatten.js";

const linkRegex = new RegExp("^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,63}\\b[-a-zA-Z0-9()@:%_+.~#?&\\/=]*$");
const mailToRegex = new RegExp("^mailto:", "i");
const telRegex = new RegExp("^tel:", "i");

export const linkRule = (node: LinkNode, analytics: Analytics) => {
    analytics.links.count++;
    if (node[1].href) {
        let link = node[1].href;

        const type = guessLinkType(link)
        if (type === "invalid") createInvalidUrlIssue({reason: "invalid-link", href: link}, analytics);
        else if (type === "external") analytics.links.external++
        else if (type === "internal") analytics.links.internal++
        else analytics.links.special[type]++

    } else {
        const text = flatten(node).trim();
        createInvalidUrlIssue({reason:"missing-url", text}, analytics)
    }
}

const guessLinkType = (url: string): LinkType => {
    if(url.startsWith("#")) return "anchor"
    if(mailToRegex.test(url)) return "emails";
    if(telRegex.test(url)) return "phone";
    if (linkRegex.test(url)) return "external";
    if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return "invalid"
    if (url.startsWith("//")) return "external"
    return "internal"
}

const createInvalidUrlIssue = (type: Extract<Issue, {reason: "missing-url" | "invalid-link"}>, analytics: Analytics) => {
    analytics.links.invalid++;
    createIssue({...type}, analytics)
}