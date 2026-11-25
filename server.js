import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import web from './routes/web.js';
import api from './routes/api.js';
import cors from 'cors';

const app = express();

// Configuração EJS
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // lê os dados enviados pelos formulários (req.body)
app.use(express.json()); // lê os dados enviados em JSON (req.body) pela API
app.set("view engine", "ejs");
app.set("views", ["./views"]);

// Sessão: necessária para guardar as mensagens flash entre o redirect e a próxima requisição
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());

// Este middleware precisa executar antes das rotas que renderizam os templates.
app.use(function(req, res, next) {
  // Disponibiliza as mensagens flash para todos os templates (são lidas uma única vez)
  res.locals.messages = {
    success: req.flash("success"),
    error: req.flash("error"),
  };

  res.locals.isActive = function(path) {
    return req.path === path ? "active" : "";
  }
  next();
});

app.use(web);

app.use('/api', cors({
    origin: 'http://localhost:5173'
}), api);

import { sequelize, createDatabase } from './core/sequelize.js';
createDatabase(sequelize);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is running on port: http://localhost:" + PORT);
});
