import { onRequestGet as __api_activity_ts_onRequestGet } from "/home/vyrus-extreme/Projects/Portfolio/functions/api/activity.ts"
import { onRequestPost as __api_book_ts_onRequestPost } from "/home/vyrus-extreme/Projects/Portfolio/functions/api/book.ts"
import { onRequestGet as __api_slots_ts_onRequestGet } from "/home/vyrus-extreme/Projects/Portfolio/functions/api/slots.ts"

export const routes = [
    {
      routePath: "/api/activity",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_activity_ts_onRequestGet],
    },
  {
      routePath: "/api/book",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_book_ts_onRequestPost],
    },
  {
      routePath: "/api/slots",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_slots_ts_onRequestGet],
    },
  ]