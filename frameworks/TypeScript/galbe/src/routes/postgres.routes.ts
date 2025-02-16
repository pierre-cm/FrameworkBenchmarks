import type { Galbe } from "galbe"
import type { Fortune } from "../types"

import { SQL } from "bun"

const sql = new SQL("postgres://benchmarkdbuser:benchmarkdbpass@tfb-database/hello_world?sslmode=disable")

export function rand() {
	return Math.ceil(Math.random() * 10000);
}

function parseQueriesNumber(q?: string) {
	return Math.min(+q! || 1, 500);
}

export default (g: Galbe) => {

  g.get("/db", async () => (await sql`SELECT id, randomNumber FROM world WHERE id = ${rand()}`)[0])

  g.get("/fortunes", async (ctx) => {

    const fortunes = await sql`SELECT id, message FROM fortune`
  
    fortunes.push({
      id: 0,
      message: "Additional fortune added at request time.",
    })
  
    fortunes.sort((a: Fortune, b: Fortune) => {
      if (a.message < b.message) return -1
      return 1
    })
  
    ctx.set.headers["content-type"] = "text/html; charset=utf-8"
  
    const n = fortunes.length
  
    let html = "";
    for (let i = 0; i < n; i++) {
      html += `<tr><td>${fortunes[i].id}</td><td>${Bun.escapeHTML(
        fortunes[i].message,
      )}</td></tr>`;
    }
  
    return `<!DOCTYPE html><html><head><title>Fortunes</title></head><body><table><tr><th>id</th><th>message</th></tr>${html}</table></body></html>`;
  })

  g.get('/queries', (ctx) => {
    const num = parseQueriesNumber(ctx.query.queries);
    const worldPromises = new Array(num);

    for (let i = 0; i < num; i++) 
      worldPromises[i] = sql`SELECT id, randomNumber FROM world WHERE id = ${rand()}`.then((arr) => arr[0])

    return Promise.all(worldPromises);
  })

  g.get('/updates', async (ctx) => {
		const num = parseQueriesNumber(ctx.query.queries);
		const worldPromises = new Array(num);

		for (let i = 0; i < num; i++)
			worldPromises[i] = sql`SELECT id, randomNumber FROM world WHERE id = ${rand()}`.then(
        (arr) => {
          arr[0].randomNumber = rand()
          return arr[0]
        },
      )
  
    const worlds = await Promise.all(worldPromises)

    let caseStatements = new Array(worlds.length)
    let ids = new Array(worlds.length)

    for (let i = 0; i < worlds.length; i++) {
      let { id, randomNumber } = worlds[i]
      caseStatements[i] = `WHEN id = ${id} THEN ${randomNumber}`
      ids[i] = id
    }

    await sql.unsafe(`
      UPDATE world
      SET randomNumber = CASE
        ${caseStatements.join(' ')}
      END
      WHERE id IN (${ids});
    `);

    return worlds

	})
}