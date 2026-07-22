import type { HomepageContent } from "../types";

export const githubData: Pick<HomepageContent, "githubCard"> = {
  githubCard: {
    username: "christsx",
    missingTokenMessage:
      "Add a classic GitHub PAT (`read:user`) as `PORTFOLIO_TOKEN` so private contributions are included.",
    graphText: {
      monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      dayLabels: ["", "Mon", "", "Wed", "", "Fri", ""],
      legendLessLabel: "Less",
      legendMoreLabel: "More",
      summaryMiddleLabel: "contributions in the last",
      summaryDaysLabel: "days",
      contributionSingularLabel: "contribution",
      contributionPluralLabel: "contributions",
      tooltipOnLabel: "on",
    },
  },
};
