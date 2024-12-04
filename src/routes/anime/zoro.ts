import express, { Express, type Request, type Response } from "express";
import { ANIME, type StreamingServers } from "@consumet/extensions";

const router = express.Router();
const zoro = new ANIME.Zoro();

router.get("/", (req: Request, res: Response) => {
	res.send({
		intro:
			"Welcome to the zoro provider: check out the provider's website @ https://www1.gogoanime.bid/",
		routes: [
			"/:query",
			"/info/:id",
			"/watch/:episodeId",
			"/servers/:episodeId",
			"/genre/:genre",
			"/genre/list",
			"/top-airing",
			"/movies",
			"/popular",
			"/recent-episodes",
		],
		documentation: "https://docs.consumet.org/#tag/zoro",
	});
});

router.get("/search/:query", async (req: Request, res: Response) => {
    const { query } = req.params;
    const { page } = req.query;

    if (!query) return res.status(400).json({ error: "Title is required" });

    const data = await zoro.search(query.toString(), Number.parseInt(page?.toString() ?? "1"));
    res.json(data);
});

router.get("/info/:id", async (req: Request, res: Response) => {
	const { id } = req.params;
	if (!id) return res.status(400).json({ error: "ID is required" });

	const data = await zoro.fetchAnimeInfo(id.toString());
	res.json(data);
});

router.get("/watch/:episodeId", async (req: Request, res: Response) => {
	const { episodeId } = req.params;
	const server = req.query.server?.toString() as StreamingServers ?? "vidstreaming" as StreamingServers;
	if (!episodeId)
		return res.status(400).json({ error: "Episode ID is required" });

	const data = await zoro
		.fetchEpisodeSources(episodeId.toString(), server)
		.catch((err) => {
			return res.status(400).json({ error: err.message });
		});
	res.json(data);
});


export default router;