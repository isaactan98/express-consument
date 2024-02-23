// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import anime from "./routes/anime";
import meta from "./routes/meta";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// const allowedOrigins = ["*"];

const options: cors.CorsOptions = {
    origin: "*",
};

app.use(cors(options));

app.use("/anime", anime)
app.use("/meta", meta)

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});