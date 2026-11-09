// Project data: one entry per slug. The /projects/[slug] page renders from this list.

export const projects = [
  {
    slug: "smoked-food-cli",
    title: "Northeastern Smoked Food — Deli Queue & Inventory CLI",
    summary:
      "A command-line tool for a hometown smoked-food deli: manages products, stock, and the customer queue, with JSON storage.",
    stack: ["Python", "JSON storage"],
    details: [
      "Customer queue management",
      "Inventory tracking",
      "Command-line flags --json / --quiet / --verbose",
      "Input validation and error handling",
    ],
    repo: "https://github.com/JiainingZhan/Northeastern-smoked-food-system",
    role: "Solo project (ISBA 2438 Assignment 1).",
  },
  {
    slug: "california-ev-dashboard",
    title: "California EV Adoption Dashboard",
    summary:
      "A Tableau dashboard tracking electric vehicle adoption across California counties.",
    stack: ["Tableau", "Excel", "California open data"],
    details: [
      "County-level EV adoption trends",
      "What-if growth scenarios",
      "Findings on which counties adopt fastest",
    ],
    repo: null,
    role: "Team: Joy (Jianing Zhan), Lanboer Zhao, Travis Tran (ISBA 2404 group project).",
  },
];

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug) ?? null;
}
