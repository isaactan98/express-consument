import express, { Request, Response } from "express";
import { ANIME, META, PROVIDERS_LIST, IMovieInfo, ISearch, IMovieResult, IAnimeResult } from "@consumet/extensions";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

const url = `https://api.themoviedb.org/3/`;
const tmdbApi = process.env.TMDB_KEY;
const imgPath = "https://image.tmdb.org/t/p/original";

router.get('/', (request: Request, reply: Response) => {
    reply.status(200).send("TMDB API");
});

router.get('/search/:query', async (request: Request, reply: Response) => {
    const query = (request.params as { query: string }).query;
    const page = (request.query as unknown as { page: number }).page;

    const res = await fetchSearch("tv", query, page || 1).catch((err) => err) as ISearch<IMovieResult | IAnimeResult>;

    reply.status(200).send(res);
});

router.get('/info/:id', async (request: Request, reply: Response) => {
    console.log('info', tmdbApi);
    const id = (request.params as { id: string }).id;
    const type = (request.query as { type: string }).type;

    if (!type) return reply.status(400).send({ message: "The 'type' query is required" });

    try {
        const res = await fetchMediaInfo(id, type);
        reply.status(200).send(res);
    } catch (error) {
        reply.status(500).send({ message: error });
    }
});

router.get('/season/:id/:season', async (request: Request, reply: Response) => {
    console.log('info', tmdbApi);
    const id = (request.params as { id: string }).id;
    const type = (request.query as { type: string }).type;
    const season = (request.params as { season: string }).season;

    if (!type) return reply.status(400).send({ message: "The 'type' query is required" });

    try {
        const res = await fetchAnimeSeason(id, season, type);
        reply.status(200).json(res);
    } catch (error) {
        reply.status(500).send({ message: error });
    }
});

const fetchSearch = async (type: string, query: string, page: number) => {
    const res = await fetch(`${url}search/${type}?query=${query}&api_key=${tmdbApi}&language=en-US&page=${page}`)
        .then((res) => res.json())
        .then((data) => data).catch((err) => err) as ISearch<IMovieResult | IAnimeResult>;
    return res;
};

const fetchMediaInfo = async (id: string, type: string) => {
    const res = await fetch(`${url}${type}/${id}?api_key=${tmdbApi}&language=en-US&append_to_response=release_dates,watch/providers,alternative_titles,credits,external_ids,images,keywords,recommendations,reviews,similar,translations,videos&include_image_language=en`)
        .then((res) => res.json())
        .then((data) => data).catch((err) => err) as IMovieInfo | IAnimeResult;
    return res;
};

const fetchAnimeSeason = async (id: string, season: string, type: string) => {
    const res = await fetch(`${url}${type}/${id}/season/${season}?api_key=${tmdbApi}&language=en-US&append_to_response=credits,external_ids,images,videos&include_image_language=en`)
        .then((res) => res.json())
        .then((data) => data).catch((err) => err) as IMovieInfo | IAnimeResult;
    return res;
};

export default router;