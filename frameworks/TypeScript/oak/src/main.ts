import { Application, Router } from "@oak/oak"
import { escape } from "@std/html/entities"
import * as db from "./postgres.ts"
import { parseQueriesNumber, rand } from "./util.ts"

const port = parseInt(Deno.args[0]) || 8080;

const router = new Router()

router.head("/", (ctx) => {
  ctx.response.status = 200
})

router.get("/plaintext", (ctx) => {
  ctx.response.headers.set("server", "Oak")
  ctx.response.body = "Hello, World!"
})

router.get("/json", (ctx) => {
  ctx.response.headers.set("server", "Oak")
  ctx.response.body = { message: "Hello, World!" }
})

router.get("/db", async (ctx) => {
  ctx.response.headers.set("server", "Oak")
  ctx.response.body = await db.find(rand())
})

router.get("/fortunes", async (ctx) => {

  const fortunes = await db.fortunes()

  fortunes.push({
    id: 0,
    message: "Additional fortune added at request time.",
  })

  fortunes.sort((a, b) => {
    if (a.message < b.message) return -1
    return 1
  })

  ctx.response.headers.set("server", "Oak")
  ctx.response.headers.set("content-type", "text/html; charset=utf-8")

  const n = fortunes.length

  let html = ""
  for (let i = 0; i < n; i++) {
    html += `<tr><td>${fortunes[i].id}</td><td>${escape(
      fortunes[i].message,
    )}</td></tr>`
  }

  ctx.response.body = `<!DOCTYPE html><html><head><title>Fortunes</title></head><body><table><tr><th>id</th><th>message</th></tr>${html}</table></body></html>`
})

router.get("/queries", async (ctx) => {
  const num = parseQueriesNumber(ctx.request.url.searchParams.get("queries"))
  const worldPromises = new Array(num)

  for (let i = 0; i < num; i++) worldPromises[i] = db.find(rand())

  ctx.response.headers.set("server", "Oak")
  ctx.response.body = await Promise.all(worldPromises)
})

router.get("/updates", async (ctx) => {
  const num = parseQueriesNumber(ctx.request.url.searchParams.get("queries"))
  const worldPromises = new Array(num)

  for (let i = 0; i < num; i++)
    worldPromises[i] = db.findThenRand(rand())

  const worlds = await Promise.all(worldPromises)

  await db.bulkUpdate(worlds)

  ctx.response.headers.set("server", "Oak")
  ctx.response.body = await Promise.all(worldPromises)
})

const app = new Application()
app.use(router.routes())
app.use(router.allowedMethods())

app.listen({ port })

console.log(`Listening on port http://localhost:${port}`)