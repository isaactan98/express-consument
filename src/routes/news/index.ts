import express, { Request, Response } from "express";

import ann from "./Ann";

const router = express.Router();

router.use("/ann", ann)

export default router;