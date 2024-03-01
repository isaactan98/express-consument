import express, { Express, Request, Response } from "express";
import { ANIME, META, PROVIDERS_LIST } from "@consumet/extensions";

const router = express.Router();

let anilist = new META.Anilist.Manga();


router.get('/', (_, rp) => {
    rp.status(200).send({
        intro: `Welcome to the anilist manga provider: check out the provider's website @ ${anilist.provider.toString.baseUrl}`,
        routes: ['/:query', '/info', '/read'],
        documentation: 'https://docs.consumet.org/#tag/anilist',
    });
});

router.get('/search/:query', async (request: Request, reply: Response) => {
    const query = (request.params as { query: string }).query;

    const res = await anilist.search(query);

    reply.status(200).send(res);
});

router.get('/info/:id', async (request: Request, reply: Response) => {
    const id = (request.params as { id: string }).id;
    const provider = (request.query as { provider: string }).provider;

    if (typeof provider !== 'undefined') {
        const possibleProvider = PROVIDERS_LIST.MANGA.find(
            (p) => p.name.toLowerCase() === provider.toLocaleLowerCase(),
        );
        anilist = new META.Anilist.Manga(possibleProvider);
    }

    if (typeof id === 'undefined')
        return reply.status(400).send({ message: 'id is required' });

    try {
        const res = await anilist
            .fetchMangaInfo(id)
            .catch((err) => reply.status(404).send({ message: err }));

        reply.status(200).send(res);
    } catch (err) {
        reply
            .status(500)
            .send({ message: 'Something went wrong. Please try again later.' });
    }
});

router.get('/read/:chapterId', async (request: Request, reply: Response) => {
    const chapterId = (request.params as { chapterId: string }).chapterId;
    const provider = (request.query as { provider: string }).provider;

    if (typeof provider !== 'undefined') {
        const possibleProvider = PROVIDERS_LIST.MANGA.find(
            (p) => p.name.toLowerCase() === provider.toLocaleLowerCase(),
        );
        anilist = new META.Anilist.Manga(possibleProvider);
    }

    if (typeof chapterId === 'undefined')
        return reply.status(400).send({ message: 'chapterId is required' });

    try {
        const res = await anilist
            .fetchChapterPages(chapterId)
            .catch((err: Error) => reply.status(404).send({ message: err.message }));

        reply.status(200).send(res);
    } catch (err) {
        reply
            .status(500)
            .send({ message: 'Something went wrong. Please try again later.' });
    }
});

export default router;