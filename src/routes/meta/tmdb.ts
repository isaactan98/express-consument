import express, { Request, Response } from "express";
import { ANIME, META, PROVIDERS_LIST } from "@consumet/extensions";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

const tmdbApi = process.env.TMDB_KEY;

router.get('/search/:query', async (request: Request, reply: Response) => {
    const query = (request.params as { query: string }).query;
    const page = (request.query as unknown as { page: number }).page;
    const tmdb = new META.TMDB(tmdbApi);

    const res = await tmdb.search(query, page);

    reply.status(200).send(res);
});

router.get('/info/:id', async (request: Request, reply: Response) => {
    console.log('info', tmdbApi);
    const id = (request.params as { id: string }).id;
    const type = (request.query as { type: string }).type;
    const provider = (request.query as { provider?: string }).provider;
    let tmdb = new META.TMDB(tmdbApi);

    if (!type) return reply.status(400).send({ message: "The 'type' query is required" });

    if (typeof provider !== 'undefined') {
        const possibleProvider = PROVIDERS_LIST.MOVIES.find(
            (p) => p.name.toLowerCase() === provider.toLocaleLowerCase(),
        );
        tmdb = new META.TMDB(tmdbApi, possibleProvider);
    }

    const res = await tmdb.fetchMediaInfo(id, type);
    reply.status(200).send(res);
});

router.get(
    '/watch/:episodeId',
    async (request: Request, reply: Response) => {
        const episodeId = (request.params as { episodeId: string }).episodeId;
        const id = (request.query as { id: string }).id;
        const provider = (request.query as { provider?: string }).provider;

        let tmdb = new META.TMDB(tmdbApi);
        if (typeof provider !== 'undefined') {
            const possibleProvider = PROVIDERS_LIST.MOVIES.find(
                (p) => p.name.toLowerCase() === provider.toLocaleLowerCase(),
            );
            tmdb = new META.TMDB(tmdbApi, possibleProvider);
        }
        try {
            const res = await tmdb
                .fetchEpisodeSources(episodeId, id)
                .catch((err) => reply.status(404).send({ message: err }));

            reply.status(200).send(res);
        } catch (err) {
            reply
                .status(500)
                .send({ message: 'Something went wrong. Contact developer for help.' });
        }
    },
);

export default router;