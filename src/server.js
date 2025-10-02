//vercel

const express = require("express");
const app = express();
const routers = require("../src/routers");

app.use =(express.json());
app.use =("/api",routers);

module.exports =app;