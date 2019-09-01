const express = require("express"); // importando Express
const DevsController = require("./controllers/DevsController"); // importando DevsController
const LikesController = require("./controllers/LikesController"); // importando LikesController
const DislikeController = require("./controllers/DislikeController"); // importando DislikeController

const routes = express.Router(); // Criando uma intancia para express Router

/* 
    Basicamente, as rotas podem receber em seus métodos (GET, POST, DELETE, PUT) dois parâmetros, a rota, o caminho da URL e as regras que estão por trás dessa chamada. Veja:

    DevsController é um módulo que exporta dois métodos (index e store)
    Index: recebe a requisição feita através da URL ('/devs'), aplicaca as regras estabelecidas pela função  e retorna um resultado.
    Store: mesma coisa, veja a descriação desses métodos dentro de DevsController

*/

routes.get("/devs", DevsController.index);
routes.post("/devs", DevsController.store);
routes.post("/devs/:devId/likes", LikesController.store);
routes.post("/devs/:devId/dislikes", DislikeController.store);

module.exports = routes; // no final, esse módulo é exportado.
