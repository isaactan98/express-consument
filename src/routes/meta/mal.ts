import express, { Request, Response } from "express";
import { META, PROVIDERS_LIST } from "@consumet/extensions";

const router = express.Router();

let mal = new META.Myanimelist();

router.get('/', (_, rp) => {
    rp.status(200).send({
        intro:
            "Welcome to the mal provider: check out the provider's website @ https://mal.co/",
        routes: ['/:query', '/info/:id', '/watch/:episodeId'],
        documentation: 'https://docs.consumet.org/#tag/mal',
    });
});

router.get('/info/:id', async (request: Request, reply: Response) => {
    const id = (request.params as { id: string }).id;

    const provider = (request.query as { provider?: string }).provider;
    let fetchFiller = (request.query as { fetchFiller?: string | boolean }).fetchFiller;
    let isDub = (request.query as { dub?: string | boolean }).dub;
    const locale = (request.query as { locale?: string }).locale;

    if (typeof provider !== 'undefined') {
        const possibleProvider = PROVIDERS_LIST.ANIME.find(
            (p) => p.name.toLowerCase() === provider.toLocaleLowerCase(),
        );

        mal = new META.Myanimelist(possibleProvider);
    }

    if (isDub === 'true' || isDub === '1') isDub = true;
    else isDub = false;

    if (fetchFiller === 'true' || fetchFiller === '1') fetchFiller = true;
    else fetchFiller = false;

    try {
        const res = await mal.fetchAnimeInfo(id, isDub as boolean, fetchFiller as boolean);

        mal = new META.Myanimelist(undefined);
        reply.status(200).send(res);
    } catch (err: any) {
        reply.status(500).send({ message: err.message });
    }
});


export default router;