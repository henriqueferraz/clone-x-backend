import { Router } from "express";
import * as pingController from "../controllers/ping"

export const mainRouter = Router();

mainRouter.get('/ping', pingController.ping);
//mainRouter.get('/privateping');

mainRouter.post('/auth/singnup');
mainRouter.post('/auth/singnin');

mainRouter.post('/tweet'); // Inserir um tweet
mainRouter.get('/tweet/:id'); // Pegar um tweet especifico
mainRouter.get('/tweet/:id/answers'); // Respostas do tweet
mainRouter.post('/tweet/:id/like'); // Dar ou retirar um like no tweet

mainRouter.get('/user/:slug'); //Slug do usuário
mainRouter.get('/user/:slug/tweets'); //Tweets do usuario