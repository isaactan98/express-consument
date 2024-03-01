import express from "express";
import anilist from "./anilist";
import tmdb from "./tmdb";
import mal from "./mal";
import anilistManga from "./anilist-manga";

const router = express.Router();

router.use("/anilist", anilist)
router.use("/tmdb", tmdb)
router.use("/mal", mal)
router.use("/anilist-manga", anilistManga)

export default router;