import type { ElementNodeAttributes, Node } from "comark";

/** Available lang for stopping words */
type Language = "fra" | "eng";

export interface ComarkSeoOptions {
  /**
     * Set to false for disable the plugin
     * @default true
     * */
  enabled?: boolean;

  /** If define use the stopping words array for repeatedWords
     * @enum {fra,eng} */
  language?: Language;

  readingSpeed?: number;
}

export interface ComarkSeoMeta {
  seo: Analytics;
}

export interface Analytics {
  headings: HeadingAnalytics;
  content: ContentAnalytics;
  links: LinksAnalytics;
  images: ImagesAnalytics;
  issues: Issue[];
}

export interface HeadingAnalytics {
  h1Count: number;
  count: number;
  hierarchyValid: boolean;
}

/** A word kept in `repeatedWords`, with the number of times it appears. */
export interface RepeatedWord {
  word: string;
  count: number;
}

export interface ContentAnalytics {
  words: number;

  /** Words appearing more than once, sorted by descending count then alphabetically.
     * Stop words are excluded when `language` is set. */
  repeatedWords: RepeatedWord[];

  /** How many time your document take min to be read
     * @type number
     * @example 5
     * */
  readingTime: number;
}

export interface LinksAnalytics {
  count: number;
  internal: number;
  external: number;
  special: {
    anchor: number;
    emails: number;
    phone: number;
  };
  invalid: number;
}

export interface ImagesAnalytics {
  count: number;
  missingAlt: number;
}

/**
 * Describe the type of issue your seo can have
 */
export type Issue
  = | {
    reason: "missing-heading-one";
  }
  | {
    reason: "heading-hierarchy";
    from: string;
    to: string;
  }
  | {
    reason: "invalid-heading";
  }
  | {
    reason: "missing-alt";
    src: string;
  }
  | {
    reason: "invalid-link";
    href: string;
  }
  | {
    reason: "multiple-h1";
    count: number;
  }
  | {
    reason: "missing-dimensions";
    src: string;
    missing: ImageMissing;
  }
  | {
    reason: "heading-too-long";
    from: string;
    text: string;
  }
  | {
    reason: "missing-url";
    text?: string;
  };

/** Element node whose attributes bag is narrowed to the keys a rule reads. */
type TypedElementNode<A> = [string, ElementNodeAttributes & A, ...Node[]];

export type LinkNode = TypedElementNode<{ href?: string }>;

export type ImageNode = TypedElementNode<{
  src: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
}>;

type ImageMissing = "height" | "width" | "both";
export type LinkType = "external" | "internal" | "anchor" | "emails" | "phone" | "invalid";
