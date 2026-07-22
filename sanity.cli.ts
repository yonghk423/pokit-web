import path from "node:path";
import { defineCliConfig } from "sanity/cli";

import { dataset, projectId } from "./src/sanity/env";

export default defineCliConfig({
  api: {
    projectId: projectId || "placeholder",
    dataset,
  },
  studioHost: "pokit",
  deployment: {
    appId: "wfmpyai4q2ptp3ferrsfb377",
  },
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "src"),
      },
    },
  },
});
