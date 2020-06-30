//Guarda a autorização de um usuário para executar querys
const { Pool } = require('pg');

//Configurações de acesso ao banco de dados
module.exports = new Pool({
  user: 'luiz',
  password: '',
  host: 'localhost',
  port: 5432,
  database: 'gym_manager'
});