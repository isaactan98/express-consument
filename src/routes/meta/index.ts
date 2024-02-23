import express from "express";
import anilist from "./anilist";


const router = express.Router();

router.use("/anilist", anilist)

export default router;