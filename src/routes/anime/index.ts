import express from "express";
import gogoanime from "./gogoanime";
import zoro from "./zoro";

const router = express.Router();

router.use("/gogoanime", gogoanime);
router.use("/zoro", zoro);

export default router;
