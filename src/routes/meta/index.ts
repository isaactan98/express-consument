import express from "express";
import anilist from "./anilist";
import tmdb from "./tmdb";


const router = express.Router();

router.use("/anilist", anilist)
router.use("/tmdb", tmdb)

export default router;