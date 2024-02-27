// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import anime from "./routes/anime";
import meta from "./routes/meta";

import manga from "./routes/manga";

import news from "./routes/news";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

// const allowedOrigins = ["*"];

const options: cors.CorsOptions = {
    origin: "*",
};

app.use(cors(options));

app.use("/anime", anime)
app.use("/meta", meta)

app.use("/manga", manga)

app.use("/news", news)

app.get("/", (req: Request, res: Response) => {
    const htmlPath = path.join(__dirname, 'index.html');
    res.sendFile(htmlPath);
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});