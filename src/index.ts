// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import anime from "./routes/anime";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const allowedOrigins = ['http://localhost:3000', "*"];

const options: cors.CorsOptions = {
    origin: allowedOrigins
};

app.use(cors(options));

app.use("/anime", anime)

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});