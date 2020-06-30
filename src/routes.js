const express = require('express');

const instructors = require('./app/controllers/instructors');
const members = require('./app/controllers/members');

//Express da a variável a responsabilidade pelas rotas
const routes = express.Router();


//Rota tipo GET para a página principal
routes.get('/', function(req, res) {
  return res.redirect('/instructors');
});


// === Rotas - Instructor ===
//Rota tipo GET para página de instructors
routes.get('/instructors', instructors.index);
//Rota tipo GET para a página de create instructors
routes.get('/instructors/create', instructors.create);
//Rota tipo GET para a página de detalhes do instructor daseado no id
routes.get('/instructors/:id', instructors.show);
//Rota GET para a página de edição de um instructor baseado no id
routes.get('/instructors/:id/edit', instructors.edit);
//Rota tipo POST para criação do instrutor
routes.post('/instructors', instructors.post);
//Rota tipo PUT para alteração dos dados do instrutor
routes.put('/instructors', instructors.put);
//Rota tipo DELETE para a exclusão de um instructor
routes.delete('/instructors', instructors.delete);


// === Rotas - Members ===
//Rota tipo GET para página de members
routes.get('/members', members.index);
//Rota tipo GET para a página de create members
routes.get('/members/create', members.create);
//Rota tipo GET para a página de detalhes do member daseado no id
routes.get('/members/:id', members.show);
//Rota GET para a página de edição de um member baseado no id
routes.get('/members/:id/edit', members.edit);
//Rota tipo POST para criação do instrutor
routes.post('/members', members.post);
//Rota tipo PUT para alteração dos dados do member
routes.put('/members', members.put);
//Rota tipo DELETE para a exclusão de um member
routes.delete('/members', members.delete);


//Exportando a variável routes
module.exports = routes;