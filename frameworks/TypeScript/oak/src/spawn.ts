
const cpuCount = navigator.hardwareConcurrency || 1;
const basePort = 8080;
const servers = Array.from({ length: cpuCount }, (_, i) => basePort + i + 1);

function startServer(port: number) {
  new Deno.Command(Deno.execPath(), {
    args: ["run", "--allow-all", "src/main.ts", port.toString()],
    stdout: "inherit",
    stderr: "inherit",
  }).spawn();
}

for (const port of servers) {
  startServer(port);
}

async function isServerReady(port: number): Promise<boolean> {
  try {
    const response = await fetch(`http://localhost:${port}`, {method: 'HEAD'});
    return response.ok;
  } catch {
    return false;
  }
}

// Wait for all servers to start
async function waitForServers() {
  console.log("Waiting for servers to be ready...");
  while (true) {
    const checks = await Promise.all(servers.map(isServerReady));
    if (checks.every((ready) => ready)) break;
    await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms before retrying
  }
  console.log("All servers are ready! Starting load balancer...");
}

await waitForServers()

let index = 0; // Round-robin index

Deno.serve({ port: basePort }, async (req) => {
  const targetPort = servers[index];
  index = (index + 1) % servers.length; // Round-robin selection

  const url = new URL(req.url);
  url.host = `localhost:${targetPort}`;

  const res = await fetch(url.toString(), {
    method: req.method,
    headers: req.headers,
    body: req.body,
  });
  return res;
});

console.log(`Load balancer running on port ${basePort}`);
