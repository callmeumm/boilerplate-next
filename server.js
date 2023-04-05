const path = require("path");
const { parse } = require("url");

const express = require("express");
const compression = require("compression");
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const build_dir = path.join(process.cwd(), ".next");
const nextApp = next({ dev, port });
const handle = nextApp.getRequestHandler();

const app = express();

// Express middleware
app.use(compression());

// Everything else (like assets) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("public", { maxAge: "1h" }));

nextApp.prepare().then(() => {
  app
    .all("*", async (req, res) => {
      try {
        if (dev) purgeRequireCache();

        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Error occurred handling", req.url, err);
        res.statusCode = 500;
        res.end("internal server error");
      }
    })

    // tslint:disable-next-line:no-console
    .listen(port, () => {
      console.log(
        `> Server listening at http://localhost:${port} as ${
          dev ? "development" : process.env.NODE_ENV
        }`,
      );
    });
});

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, but then you'll have to reconnect to databases/etc on each
  // change. We prefer the DX of this, so we've included it for you by default
  for (const key in require.cache) {
    if (key.startsWith(build_dir)) {
      delete require.cache[key];
    }
  }
}
