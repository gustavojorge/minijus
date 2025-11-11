import express from "express";
import { responseBoxLock } from "./src/mocks/box-lock.mjs";
import { getRandomResponse } from "./src/mocks/argos-lock.mjs";

const app = express();
const port = 9777;

app.set("json spaces", 2);

app.get("/box-lock", (req, res) => {
  res.json(responseBoxLock);
});

app.get("/experiment/participate", (req, res) => {
  const responseBody = getRandomResponse(req);
  res.status(200).json(responseBody);
});

app.listen(port, () => {
  console.log(`Mock API running at http://localhost:${port}`);
});
