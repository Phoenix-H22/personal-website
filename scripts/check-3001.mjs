import http from "http";

function get(path) {
  return new Promise((resolve, reject) => {
    http
      .get(`http://localhost:3001${path}`, (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () =>
          resolve({ status: res.statusCode, body }),
        );
      })
      .on("error", reject);
  });
}

const page = await get("/");
console.log("page", page.status);
const assets = [
  ...page.body.matchAll(/\/_next\/static\/chunks\/[^"']+\.(?:css|js)/g),
].map((m) => m[0]);
const uniq = [...new Set(assets)].slice(0, 12);
for (const u of uniq) {
  const r = await get(u);
  console.log(r.status, u);
}
