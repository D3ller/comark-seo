import type { ComarkPluginFactory } from "comark";
import { defineComarkPlugin } from "comark/parse";

import { seo } from "./seo.js";
import type {
  Analytics,
  ComarkSeoMeta,
  ComarkSeoOptions,
  ContentAnalytics,
  HeadingAnalytics,
  ImagesAnalytics,
  Issue,
  LinksAnalytics,
  RepeatedWord,
} from "./types.js";

const plugin: ComarkPluginFactory<ComarkSeoOptions, ComarkSeoMeta> = defineComarkPlugin<ComarkSeoOptions, ComarkSeoMeta>((options = {}) => {
  const {
    enabled = true,
  } = options;

  return {
    name: "seo",

    post(state) {
      if (!enabled) return;
      state.tree.meta.seo = seo(state.tree.nodes, options);
    },
  };
});

export default plugin;
export type { Analytics, ContentAnalytics, HeadingAnalytics, ImagesAnalytics, Issue, LinksAnalytics, RepeatedWord };
