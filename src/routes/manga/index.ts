import express, { Express } from "express";

import mangadex from './mangadex';

const app: Express = express();

app.use("/mangadex", mangadex)

export default app;