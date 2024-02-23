import express from "express";
import gogoanime from "./gogoanime";


const router = express.Router();

router.use("/gogoanime", gogoanime)

export default router;