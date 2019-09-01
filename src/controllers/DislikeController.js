const Dev = require("../model/Devs");

module.exports = {
  async store(req, res) {
    const { user } = req.headers; // pegando o usuário logado
    const { devId } = req.params; // pegando o id enviado pelo parametro - Dê uma console.log(req.params)
    console.log(req.params);

    const loggedDev = await Dev.findById(user); // Criando uma intância do usuario logado, com todos os dados dele do banco.
    const targetDev = await Dev.findById(devId); // Criando uma intância do usuario que recebeu um deslike, com todos os dados dele do banco.

    if (!targetDev) {
      return res.status(400).json({ error: "Esse usuário não existe" });
    } // Não tenho um usuário alvo do like, apresentar um erro

    loggedDev.dislikes.push(targetDev._id); // caso contrario, pega o usuário logado, na prop dislikes que e um array e coloque o id do usuário que recebeu o like.
    await loggedDev.save(); // já que tenho uma instancia daquele usuário e inclui um id nele, preciso usar o metodo save() e salvar no banco

    return res.json({ ok: true });
  }
};
