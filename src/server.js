const express = require("express"); // importando express responsavél pelas rotas
const mongoose = require("mongoose"); // Importando mangoose responsável pela comunicação com  MongoDB
const cors = require("cors"); // Importando cors responsável deixar visivél as URLS das Api's

const routes = require("./routes"); // Importando as ROTAS

const app = express(); // Criando uma instancia do express
const server = require("http").Server(app); // criando um server com o HTTP padrão que já vem com o node + o WebSocket
const io = require("socket.io")(server); // Esse requere("socket.io") retorna uma função e logo em seguida chamo essa função passando server.

const connectedUsers = {};

// O websocket é um  protocolo de transferencia de dados como o HTTP. Ele permite que o backend possa enviar mensagens ao front-end e vise-versa em tempo real sem a necessidade de requisições.
io.on("connection", socket => { // Toda vem quem alguem se conectar com WS, no CB recebo uma socket
  const { user } = socket.handshake.query; // que ao ser executado guarda o user, mas nesse caso do Socketr
  connectedUsers[user] = socket.id;
  console.log(connectedUsers)
    socket.on('hello', message => {
        console.log(message)
    })
});

mongoose.connect(
  "mongodb+srv://jeff-campos:gege4614@cluster0-8uyvs.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true
  }
); // Conexão com banco de dados

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
});

// O USE é um método que inclui dentro da intancia que foi gerada algum outro método, pluggin, etc. Ex:
// CONST SERVER é uma instancia de EXPRESS, utilizo o use para incluir a ele, o CORS.

app.use(cors()); // Incluindo CORS ao SERVER
app.use(express.json()); // Incluindo express JSon ao server
app.use(routes); // Incluindo Rotas ao Server

server.listen(3333); // Servidor ouve a porta 3333
