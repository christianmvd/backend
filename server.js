import express from 'express';
import moment from 'moment';
import cors from 'cors';
import routes from './routes/index.js';
import './config/db.js';
import config from './config/index.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import { createServer } from 'http';
import { Server } from 'socket.io';
import chatDao from './components/chat/dao.js';



 /* -------------- CONFIGURACIONES GENERALES ---------------- */


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors(`${config.cors}`));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

/* -------------- SESIONES ---------------- */
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.mongodb,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
    secret: 'coderhouse',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: Number(config.cookie_max_age), 
    },
    rolling: true,
  })
);

/* -------------- RUTAS ---------------- */
routes(app);


/* --------------SOCKETS---------------- */
io.on('connection', async (socket) => {
  console.log('nuevo cliente conectado!');

  io.sockets.emit('messages', await chatDao.listAll());

  socket.on('message', async (data) => {
    const { text, email } = data;
    const newMessage = {
      email,
      text,
      date: moment(new Date()).format('DD/MM/YYYY HH:mm'),
    };

    await chatDao.save(newMessage);

    io.sockets.emit('messages', await chatDao.listAll());
  });
});

/*-------------- VARIABLES GLOBALES ---------------- */
const PORT = config.port;

/*-------------- SERVIDOR ---------------- */
const server = httpServer.listen(PORT, () => {
  console.log(`Servidor inicializado en el puerto ${PORT}`);
});

server.on('error', (err) => {
  console.log('Error del servidor.' + err);
});
process.on('exit', (code) => {
  console.log('Exit code -> ' + code);
});
