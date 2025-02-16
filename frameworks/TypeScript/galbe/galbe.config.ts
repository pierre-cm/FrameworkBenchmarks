import {config} from "galbe"

export default config({
  hostname: "0.0.0.0",
  port: 8080,
  reusePort: true,
  routes: ['src/routes/default.routes.ts', ...(Bun.env.DATABASE ? ['src/routes/postgres.routes.ts'] : [])],
})