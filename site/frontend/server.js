/* server.js */

const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev
});
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.get("/user/:query", (req, res) => {
      return app.render(req, res, "/user", {
        query: req.params.query
      });
    });

    server.get("/location/:userid/:locationid", (req, res) => {
      return app.render(req, res, "/location", {
        userid: req.params.userid,
        locationid: req.params.locationid
      });
    });

    server.get("/location/:userid", (req, res) => {
      return app.render(req, res, "/location", {
        userid: req.params.userid
      });
    });

    server.get("/event/:userid", (req, res) => {
      console.dir(
        "/event/:userid req.params.id = " + JSON.stringify(req.params.userid)
      );
      return app.render(req, res, "/event", {
        userid: req.params.userid
      });
    });

    server.get("/event/:userid/:eventid", (req, res) => {
      console.dir(
        "/event/:userid req.params.id = " + JSON.stringify(req.params.userid)
      );
      return app.render(req, res, "/event", {
        userid: req.params.userid,
        eventid: req.params.eventid
      });
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, err => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });