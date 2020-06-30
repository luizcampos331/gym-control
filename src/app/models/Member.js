const db = require('../../config/db');
const { age, date } = require('../../lib/utils');

module.exports = {
  // === SELETC * ===
  all(callback) {
    //Operação no banco de dados
    db.query('SELECT * FROM members ORDER BY id', function(error, results) {
      if(error) throw `Database SELECT Error!${error}`;
      
      //Retornando os resultados para o controller
      callback(results.rows);
    });
  },

  // === INSERT ===
  create(data, callback) {
    //Criando a query de inserção
    const query = `
      INSERT INTO members (
        avatar_url,
        name,
        email,
        birth,
        gender,
        goals,
        weight,
        height,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `;

    //Guardando os valores do formulário
    const values = [
      data.avatar_url,
      data.name,
      data.email,
      date(data.birth).iso,
      data.gender,
      data.goals,
      data.weight,
      data.height,
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
    db.query(`SELECT * FROM members WHERE id = $1`, [id], function(error, results) {
      if(error) throw `Database Select Id Error!${error}`;

      callback(results.rows[0]);
    })
  },

  // === UPDATE id ===
  update(data, callback) {
    //Query de atualização dos dados
    const query = `
      UPDATE members SET
        avatar_url = ($1),
        name = ($2),
        email = ($3),
        birth = ($4),
        gender = ($5),
        goals = ($6),
        weight = ($7),
        height = ($8)
      WHERE id = $9
    `;

    //Valares do update, mandados por parâmetro do controller
    const values = [
      data.avatar_url,
      data.name,
      data.email,
      date(data.birth).iso,
      data.gender,
      data.goals,
      data.weight,
      data.height,
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
    db.query(`DELETE FROM members WHERE id = $1`, [id], function(error) {
      if(error) throw `Database DELETE Id Error!${error}`;

      callback();
    })
  }
}