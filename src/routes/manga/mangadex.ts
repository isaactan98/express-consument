import express, { Express, Request, Response } from "express";
import { MANGA } from "@consumet/extensions";

const router = express.Router();

const mangadex = new MANGA.MangaDex();

router.get('/', (_, rp) => {
    rp.status(200).send({
        intro:
            "Welcome to the mangadex provider: check out the provider's website @ https://mangadex.org/",
        routes: ['/:query', '/info/:id', '/read/:chapterId'],
        documentation: 'https://docs.consumet.org/#tag/mangadex',
    });
});

router.get('/:query', async (request: Request, reply: Response) => {
    const query = (request.params as { query: string }).query;
    const page = (request.query as unknown as { page: number }).page;
    const res = await mangadex.search(query, page);

    reply.status(200).send(res);
});

router.get('/info/:id', async (request: Request, reply: Response) => {
    const id = decodeURIComponent((request.params as { id: string }).id);
    try {
        const res = await mangadex
            .fetchMangaInfo(id)
            .catch((err) => reply.status(404).send({ message: err }));

        reply.status(200).send(res);
    } catch (err) {
        reply
            .status(500)
            .send({ message: 'Something went wrong. Please try again later.' });
    }
});

router.get(
    '/read/:chapterId',
    async (request: Request, reply: Response) => {
        const chapterId = (request.params as { chapterId: string }).chapterId;
        try {
            const res = await mangadex.fetchChapterPages(chapterId);

            reply.status(200).send(res);
        } catch (err) {
            reply
                .status(500)
                .send({ message: 'Something went wrong. Please try again later.' });
        }
    },
);

export default router;
