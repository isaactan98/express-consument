import express, { Express, Request, Response } from "express";
import { ANIME, META, PROVIDERS_LIST } from "@consumet/extensions";
import NineAnime from '@consumet/extensions/dist/providers/anime/9anime';
import Anilist from '@consumet/extensions/dist/providers/meta/anilist';

const anilist = new META.Anilist();
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.status(200).send({
        intro:
            "Welcome to the anilist provider: check out the provider's website @ https://anilist.co/",
        routes: ['/:query', '/info/:id', '/watch/:episodeId'],
        documentation: 'https://docs.consumet.org/#tag/anilist',
    });
});

router.get('/search/:query', async (request: Request, reply: Response) => {
    const anilist = generateAnilistMeta();

    const query = (request.params as { query: string }).query;

    const page = (request.query as unknown as { page: number }).page;
    const perPage = (request.query as unknown as { perPage: number }).perPage;

    const res = await anilist.search(query, page, perPage);

    reply.status(200).send(res);
});

router.get('/info/:id', async (request: Request, reply: Response) => {
    const id = (request.params as { id: string }).id;
    const today = new Date();
    const dayOfWeek = today.getDay();
    const provider = (request.query as { provider?: string }).provider;
    let fetchFiller = (request.query as { fetchFiller?: string | boolean }).fetchFiller;
    let isDub = (request.query as { dub?: string | boolean }).dub;
    const locale = (request.query as { locale?: string }).locale;

    let anilist = generateAnilistMeta(provider);

    if (isDub === 'true' || isDub === '1') isDub = true;
    else isDub = false;

    if (fetchFiller === 'true' || fetchFiller === '1') fetchFiller = true;
    else fetchFiller = false;

    try {
        reply.status(200).send(
            await anilist.fetchAnimeInfo(id, isDub as boolean, fetchFiller as boolean),
        );
    } catch (err: any) {
        reply.status(500).send({ message: err.message });
    }
});

router.get('/recent-episodes', async (request: Request, reply: Response) => {
    const provider = (request.query as { provider: 'gogoanime' | 'zoro' }).provider;
    const page = (request.query as unknown as { page: number }).page;
    const perPage = (request.query as unknown as { perPage: number }).perPage;

    const anilist = generateAnilistMeta(provider);

    const res = await anilist.fetchRecentEpisodes(provider, page, perPage);

    reply.status(200).send(res);
});

router.get('/trending', async (request: Request, reply: Response) => {
    const page = (request.query as unknown as { page: number }).page;
    const perPage = (request.query as unknown as { perPage: number }).perPage;
    const anilist = generateAnilistMeta();
    reply.status(200).send(await anilist.fetchTrendingAnime(page, perPage));
});

router.get('/airing-schedule', async (request: Request, reply: Response) => {
    const page = (request.query as unknown as { page: number }).page;
    const perPage = (request.query as unknown as { perPage: number }).perPage;
    const weekStart = (request.query as { weekStart: number | string }).weekStart;
    const weekEnd = (request.query as { weekEnd: number | string }).weekEnd;
    const notYetAired = (request.query as unknown as { notYetAired: boolean }).notYetAired;

    const anilist = generateAnilistMeta();
    const _weekStart = Math.ceil(Date.now() / 1000);

    const res = await anilist.fetchAiringSchedule(
        page ?? 1,
        perPage ?? 20,
        weekStart ?? _weekStart,
        weekEnd ?? _weekStart + 604800,
        notYetAired ?? true,
    );

    reply.status(200).send(res);
});

router.get('/popular', async (request: Request, reply: Response) => {
    const page = (request.query as unknown as { page: number }).page;
    const perPage = (request.query as unknown as { perPage: number }).perPage;
    const anilist = generateAnilistMeta();
    reply.status(200).send(await anilist.fetchPopularAnime(page, perPage));
});

const generateAnilistMeta = (provider: string | undefined = undefined): Anilist => {
    if (typeof provider !== 'undefined') {
        let possibleProvider = PROVIDERS_LIST.ANIME.find(
            (p) => p.name.toLowerCase() === provider.toLocaleLowerCase(),
        );

        if (possibleProvider instanceof NineAnime) {
            possibleProvider = new ANIME.NineAnime(
                process.env?.NINE_ANIME_HELPER_URL,
                {
                    url: process.env?.NINE_ANIME_PROXY as string,
                },
                process.env?.NINE_ANIME_HELPER_KEY as string,
            );
        }

        return new META.Anilist(possibleProvider, {
            url: process.env.PROXY as string | string[],
        });
    } else {
        return new Anilist(undefined, {
            url: process.env.PROXY as string | string[],
        });
    }
};

export default router;