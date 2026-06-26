import { onRequestGet as __api_activity_ts_onRequestGet } from "/home/vyrus-extreme/Projects/Portfolio/functions/api/activity.ts"

export const routes = [
    {
      routePath: "/api/activity",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_activity_ts_onRequestGet],
    },
  ]