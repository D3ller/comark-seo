import type { Analytics, Issue } from "../types.js";

export const createIssue = (issue: Issue, analytics: Analytics) => {
  analytics.issues.push(issue);
};
