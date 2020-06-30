const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {
  // === SELETC * ===
  all(callback) {
    //Operação no banco de dados
    db.query('SELECT * FROM instructors ORDER BY id', function(error, results) {
      if(error) throw `Database SELECT Error!${error}`;
      
      //Retornando os resultados para o controller
      callback(results.rows);
    });
  },

  // === INSERT ===
  create(data, callback) {
    //Criando a query de inserção
    const query = `
      INSERT INTO instructors (
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    //Guardando os valores do formulário
    const values = [
      data.avatar_url,
      data.name,
      date(data.birth).iso,
      data.gender,
      data.services,
      date(Date.now()).iso,
    ];

    //Operação no banco de dados
    db.query(query, values, function(error, results) {
      if(error) throw `Database INSERT Id Error!${error}`;

      //Retornando os resultados para o controller
      callback(results.rows[0])
    });
  },

  // === SELECT id ===
  find(id, callback) {
    //Operação no banco de dados
    db.query(`SELECT * FROM instructors WHERE id = $1`, [id], function(error, results) {
      if(error) throw `Database Select Id Error!${error}`;

      callback(results.rows[0]);
    })
  },

  // === UPDATE id ===
  update(data, callback) {
    //Query de atualização dos dados
    const query = `
      UPDATE instructors SET
        avatar_url = ($1),
        name = ($2),
        birth = ($3),
        gender = ($4),
        services = ($5)
      WHERE id = $6
    `;

    //Valares do update, mandados por parâmetro do controller
    const values = [
      data.avatar_url,
      data.name,
      date(data.birth).iso,
      data.gender,
      data.services,
      data.id
    ]; 
    
    //Operação no banco de dados
    db.query(query, values, function(error, results) {
      if(error) throw `Database Select UPDATE Error!${error}`;

      //Retornando status de finalizado para o controller
      callback();
    })
  },

  // === DELETE id ===
  delete(id, callback) {
    //Operação no banco de dados
    db.query(`DELETE FROM instructors WHERE id = $1`, [id], function(error) {
      if(error) throw `Database DELETE Id Error!${error}`;

      callback();
    })
  }
}