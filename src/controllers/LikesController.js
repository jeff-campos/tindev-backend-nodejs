const Dev = require("../model/Devs");

module.exports = {
  async store(req, res) {
    const { user } = req.headers; // Usuário Logado na Apliçação, veja no Front
    const { devId } = req.params; // Usuário alvo, veja que no front, envio o usuário alvo pelo parametro da requisição.

    const loggedDev = await Dev.findById(user); // Crio uma variavel que carrega os dados do usuário logado. O (Dev) é uma instancia do banco de dados, veja o import. O findById, busca pelo Id do uruário os dados no banco.
    const targetDev = await Dev.findById(devId); // Mesma coisa que a parte de cima, só que para o usuário alvo.

    if (!targetDev) {
      // Meu usuário alvo não existe (improvável mas pode ocorrer).. Estoura um erro 400 e retorna uma mensagem de erro
      return res.status(400).json({ error: "Esse usuário não existe" });
    }
    // Logica do Match em tempo real
    // A ideia é, em tempo real, o usuário alvo ou logado receba um alerta de math caso.
    if (targetDev.likes.includes(loggedDev._id)) { // Na tabela de likes do usuário ALVO tenho o id do usuário logado ?
      const loggedSocket = req.connectedUsers[user]; // Crio uma instancia do usuário logado (caso tenha). Veja, eu recebo dentro da minha requisição um objeto com os usuários conectados na aplicaçao, esse objeto carrega o id socket e o id do usuário no banco.
      const targetSocket = req.connectedUsers[devId]; // Mesma coisa, esse objeto (connectedUsers), é uma variavél que carrega na memória todos os usuários logados na aplicação. Aqui, eu vejo se o usuário que recebeu o like está logado, se estiver, crio uma variavel que vai receber também, id socket e o id do usuário
      if (loggedSocket) { // Se por acaso o usuário logado estiver na lista de connectados (normalmente sim, ele está logado, certamente está a lista de connectados)
        req.io.to(loggedSocket).emit("match", targetDev);
        //pego a instancia de IO criada lá em server, uso o método TO passando o usuário logado/connectado e crio uma emissão chamada math para o front-end passando od dados do usuário alvo
      }
      if (targetSocket) { // Mesma coisa, veja descrição acima, mas para o usuário algo.
        req.io.to(targetSocket).emit("match", loggedDev);
      }
    }

    // Caso não passe no If acima, O usuário logado recebe na sua tabela de likes um id, esse Id é do usuário que recebeu um like
    loggedDev.likes.push(targetDev._id);
    await loggedDev.save(); // Aguarda salvar

    return res.json({ ok: true }); // retorna um OK para o Front-end
  }
};
