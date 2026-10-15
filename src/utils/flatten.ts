import type { Node } from "comark";

export const flatten = (node: Node): string =>
  typeof node === "string"
    ? node
    : (node as Node[]).slice(2).map(flatten).join("");
