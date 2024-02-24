import express from "express";
import anilist from "./anilist";
import tmdb from "./tmdb";
import mal from "./mal";

const router = express.Router();

router.use("/anilist", anilist)
router.use("/tmdb", tmdb)
router.use("/mal", mal)

export default router;