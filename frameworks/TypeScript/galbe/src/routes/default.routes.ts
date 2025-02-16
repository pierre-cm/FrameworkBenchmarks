import type { Galbe } from "galbe"

export default (g: Galbe) => {
  g.get("/plaintext", () => "Hello, World!")
  g.get("/json", () => ({ message: "Hello, World!" }))
}
