import { Galbe } from "galbe"
import { postgres } from 'bun'

// if(Bun.env.DATABASE)
//     postgres({
//         host: "tfb-database",
//         user: "benchmarkdbuser",
//         password: "benchmarkdbpass",
//         database: "hello_world",
//         max: 1,
//     })

// const sql = new SQL({
//     hostname: "localhost",
//     username: "user",
//     password: "password",
//     ssl: "disable", // | "prefer" | "require" | "verify-ca" | "verify-full"
//   });

const g = new Galbe()

g.use({
    name: 'test',
    afterHandle(response) {
        response.headers.set('server', 'Galbe')
    },
})

g.onStart(() => {
    console.log(`Galbe server running at http://${g.config.hostname}:${g.config.port}`)
})

export default g