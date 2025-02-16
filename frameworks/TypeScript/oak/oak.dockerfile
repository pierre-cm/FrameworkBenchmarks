FROM denoland/deno

EXPOSE 8080

WORKDIR /app

USER deno

COPY . .

RUN deno cache src/main.ts

CMD [ "run", "--allow-all", "src/main.ts" ]
