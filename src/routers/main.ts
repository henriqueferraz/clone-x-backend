import { Router } from "express";
import * as pingController from "../controllers/ping"
import * as authController from "../controllers/auth"
import * as tweetController from "../controllers/tweet"
import { verifyJWT } from "../utils/jwt";

export const mainRouter = Router();

mainRouter.get('/ping', pingController.ping);
mainRouter.get('/privateping', verifyJWT, pingController.privatePing);

mainRouter.post('/auth/signup', authController.signup);       // Login
mainRouter.post('/auth/signin', authController.signin);       // Logout

mainRouter.post('/tweet', verifyJWT, tweetController.addTweet);              // Inserir um tweet
//mainRouter.get('/tweet/:id');           // Pegar um tweet especifico
//mainRouter.get('/tweet/:id/answers');   // Respostas do tweet
//mainRouter.post('/tweet/:id/like');     // Dar ou retirar um like no tweet

//mainRouter.get('/user/:slug');          // Slug do usuário
//mainRouter.get('/user/:slug/tweets');   // Tweets do usuario
//mainRouter.post('/user/:slug/follow');  // Parar de seguir
//mainRouter.put('/user')                 // Trocar informações do usuário
//mainRouter.put('/user/avatar')          // Trocar avatar
//mainRouter.put('/user/cover')           // Trocar imagem da capa

//mainRouter.get('/feed')                 // Feeds
//mainRouter.get('/search')               // Busca
//mainRouter.get('/trending')             // HasTags
//mainRouter.get('/suggestions')          // Sugestões de usuários