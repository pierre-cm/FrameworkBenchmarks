# [Galbe](https://galbe.dev/) - Fast, lightweight and highly customizable JavaScript web framework

<p align="center">
  <a href="https://galbe.dev"><img src="https://galbe.dev/galbe.svg" alt="Logo" height=150></a>
</p>

## Introduction

Galbe is a fast, lightweight and highly customizable JavaScript web framework based on [Bun](https://bun.sh).

Galbe offers a clear, concise, and feature-rich API that is easy to use and highly configurable. Every feature is optional and can be easily customized to meet your specific needs.
With Galbe you can structure your project in a way that works best for you and your team.

Galbe also takes advantage of TypeScript's static type inference to ensure type safety and catch errors early in the development process.
Schema Type definitions allow fast and automatic request parsing and validation, ensuring that your server always receives valid data.

> [__Galbe Docs__](https://galbe.dev/documentation/)

## Database
There are **no database endpoints** or drivers attached by default.

To initialize the application with one of these, run any _one_ of the following commands:

```sh
$ DATABASE=postgres bun run dev
```

## Test URLs
### JSON

http://localhost:8080/json

### PLAINTEXT

http://localhost:8080/plaintext

### DB

http://localhost:8080/db

### QUERY

http://localhost:8080/queries?queries=10

### UPDATE

http://localhost:8080/updates?queries=10

### Fortune

http://localhost:8080/fortunes
