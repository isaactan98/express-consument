// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import anime from "./routes/anime";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use("/anime", anime)
app.use("/", (req: Request, res: Response) => {
    res.set("Access-Control-Allow-Origi", "*");
});

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});