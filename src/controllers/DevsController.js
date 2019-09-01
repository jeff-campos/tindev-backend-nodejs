const axios = require("axios"); // importando o axios para fazer as requisições
const Dev = require("../model/Devs"); // Importando o MODEL DEVs (ver descrição)

module.exports = {
  /*
    Esse módulo exporta dois métodos assinconos

    Index:
    esse método recebe uma REQuisição (enviada pela url) e retorna uma RESposta
    1 - Primeiro ela recebe o usuário logado no Header da Requisição (ver Insominia) - Esse user é o ID dele no banco

    2 - Crio uma instância desse usuário pegando todos os dados dele bo banco de dados. Faço isso usando o método findById passando o id no parametro.
    veja que uso o await para aguardar a busca desses dados no banco.

    3 - Users vai armazenar todos os usuários que estão no banco seguindo o sequinte FILTRO:

    4 - $and  - indica && - todos os filtros devem respeitar essas condições:
        4.1 - _id $ne (Não é igual) ao usuário logado, no caso
        4.2 - _id $nin (Não esteja) dentro de um vetor, no caso LIKES
        4.3 - _id $nin (Não esteja) dentro de um vetor, no caso DISLIKS

    No final das contas ele trás usuários que o user logado não deu like e nem dislike.

    store:
    Recebe uma requisição pela URL e Devolve uma Resposta;

    - como é uma POST, pego no corpo da requisição o username. portanto, no coprpo deve ter após /devs/username=198209u30912830198, esse valor do ursername é pego nesse momento;

    - Depois, em userExists guardo uma instancia desse usuário;
    - Verifico se ele existe
    - Se sim retorno e instância dele no banco

    - Se não, em response, guardo o retorno de uma consulta a API d github com os dados do user

    - Descontruo os dados pegando nome, bio e avatar
    - E uso o create a partir do modulo DEV passando nome, user, bio e avatar, esse model, se observamos lá em /model/devs, vamos perceber que ele é uma abstração do nosso banco de dados.

    - Como armazenei tudo numa variavel DEV, no final como resposta passo esse usuário criado no banco


*/
  async index(req, res) {
    const { user } = req.headers; // 1

    const loggedDev = await Dev.findById(user); // 2

    const users = await Dev.find({
      // 3
      $and: [
        // 4
        { _id: { $ne: user } }, //4.1
        { _id: { $nin: loggedDev.likes } }, //4.2
        { _id: { $nin: loggedDev.dislikes } } //4.3
      ]
    });
    return res.json(users);
  },

  async store(req, res) {
    const { username } = req.body;

    const userExists = await Dev.findOne({ user: username });
    const response = await axios.get(
      `https://api.github.com/users/${username}`
    );

    if (userExists) {
      return res.json(userExists);
    }
    const { name, bio, avatar_url: avatar } = response.data;

    const dev = await Dev.create({
      name,
      user: username,
      bio,
      avatar
    });

    return res.json(dev);
  }
};
