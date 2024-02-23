import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { ANIME } from "@consumet/extensions";

const gogoanime = new ANIME.Gogoanime();
const app: Express = express();
const router = express.Router();


router.get("/", (req: Request, res: Response) => {
    res.send({
        intro:
            "Welcome to the gogoanime provider: check out the provider's website @ https://www1.gogoanime.bid/",
        routes: [
            '/:query',
            '/info/:id',
            '/watch/:episodeId',
            '/servers/:episodeId',
            '/genre/:genre',
            '/genre/list',
            '/top-airing',
            '/movies',
            '/popular',
            '/recent-episodes',
        ],
        documentation: 'https://docs.consumet.org/#tag/gogoanime',
    });
});

router.get("/search/:query", async (req: Request, res: Response) => {
    const { query } = req.params;
    const { page } = req.query;

    if (!query) return res.status(400).json({ error: "Title is required" });

    const data = await gogoanime.search(query.toString(), parseInt(page?.toString() ?? "1"));
    res.json(data);
});

router.get("/info/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "ID is required" });

    const data = await gogoanime.fetchAnimeInfo(id.toString());
    res.json(data);
});

router.get("/watch/:episodeId", async (req: Request, res: Response) => {
    const { episodeId } = req.params;
    if (!episodeId) return res.status(400).json({ error: "Episode ID is required" });

    const data = await gogoanime.fetchEpisodeSources(episodeId.toString()).catch((err) => {
        return res.status(400).json({ error: err.message });
    });
    res.json(data);
});

router.get("/servers/:episodeId", async (req: Request, res: Response) => {
    const { episodeId } = req.params;
    if (!episodeId) return res.status(400).json({ error: "Episode ID is required" });

    const data = await gogoanime.fetchEpisodeServers(episodeId).catch((err) => {
        return res.status(400).json({ error: err.message });
    });
    res.json(data);
});

router.get("/top-airing", async (req: Request, res: Response) => {
    const { page } = req.query || 1;
    const data = await gogoanime.fetchTopAiring();
    res.json(data);
});

router.get("/popular", async (req: Request, res: Response) => {
    const { page } = req.query || 1;
    const data = await gogoanime.fetchPopular();
    res.json(data);
});

router.get("/recent-episodes", async (req: Request, res: Response) => {
    console.log("query anime/gogoanime/recent-episodes ", req.query);
    const { page } = req.query || 1;
    const data = await gogoanime.fetchRecentEpisodes();
    // res.json(data);
    res.status(200).send(data)
});


export default router;