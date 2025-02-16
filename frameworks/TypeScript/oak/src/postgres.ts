import { Client } from "postgres";

import { Fortune, World } from "./types.ts";
import { rand } from "./util.ts";

const client = new Client({
  user: "benchmarkdbuser",
  password: "benchmarkdbpass",
  database: "hello_world",
  hostname: "tfb-database",
})

export const fortunes = async () => (await client.queryObject<Fortune>(`SELECT id, message FROM fortune`)).rows

export const find = (id: number) =>
	client.queryObject<World>(`SELECT id, randomNumber FROM world WHERE id = ${id}`).then(
		(res) => res.rows[0],
	)

export const findThenRand = (id: number) =>
	client.queryObject<World>(`SELECT id, randomNumber FROM world WHERE id = ${id}`).then(
		(res) => {
			res.rows[0].randomNumber = rand()
			return res.rows[0]
		},
	);

export const bulkUpdate = async (worlds: World[]) => {
	const caseStatements = new Array(worlds.length)
	const ids = new Array(worlds.length)

	for (let i = 0; i < worlds.length; i++) {
		const { id, randomNumber } = worlds[i]
		caseStatements[i] = `WHEN id = ${id} THEN ${randomNumber}`
		ids[i] = id
	}

	await client.queryArray(`
		UPDATE world
		SET randomNumber = CASE
			${caseStatements.join(' ')}
		END
		WHERE id IN (${ids});
	`)
}
