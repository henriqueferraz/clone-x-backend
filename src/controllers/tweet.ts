import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { addTweetSchema } from "../schemas/add-tweet";
import { createTweet, findTweet } from "../services/tweet";

export const addTweet = async (req: ExtendedRequest, res: Response) => {
    // validar os dados enviados
    const safeData = addTweetSchema.safeParse(req.body);
    if (!safeData.success) {
        return res.json({ error: safeData.error.flatten().fieldErrors });
    }

    // verificar se é resposta
    if (safeData.data.answer) {
        const hasAnswerTweet = await findTweet(safeData.data.answer);
        if (!hasAnswerTweet) {
            return res.json({ error: 'Tweet Inexistente' });
        }
    }

    // criat o tweet
    const newTweet = await createTweet(
        req.userSlug as string,
        safeData.data.body,
        safeData.data.answer ? parseInt(safeData.data.answer) : 0
    )
    // adicionar a Hashtag ao trend

    res.json({ tweet: newTweet })
}