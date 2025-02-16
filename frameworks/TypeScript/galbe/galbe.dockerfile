FROM oven/bun:1.2

EXPOSE 8080

WORKDIR /app

COPY . .

ENV NODE_ENV=production

RUN bun install --production

RUN bun run build

USER bun

CMD ["bun", "spawn.ts"]
