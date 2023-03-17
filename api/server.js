const express = require("express");
const server = express();
const usersRouter = require("./users/users-router");
const authRouter = require("../api/auth/auth-router");
const tweetRouter = require("../api/tweets/tweet-router");
const commetsRouter = require("./commets/commets-router");
const mdw = require("./token/token-middlawere");

server.use(express.json());

server.use("/api/users", mdw.checkToken, usersRouter);
server.use("/api/auth", authRouter);
server.use("/api/tweets", mdw.checkToken, tweetRouter);
server.use("/api/comments", mdw.checkToken, commetsRouter);

server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
