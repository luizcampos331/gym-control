const db = require('../../config/db');
const { age, date } = require('../../lib/utils');

module.exports = {
  // === SELETC * ===
  all(callback) {
    //Operação no banco de dados
    db.query('SELECT * FROM members ORDER BY name', function(error, results) {
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
        instructor_id
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
      data.instructor_id,
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
    const query = `
      SELECT mem.*, ins.name as instructor_name 
      FROM members mem 
      LEFT JOIN instructors ins ON mem.instructor_id = ins.id
      WHERE mem.id = $1
    `;
    //Operação no banco de dados
    db.query(query, [id], function(error, results) {
      if(error) throw `Database Select Id Error!${error}`;

      callback(results.rows[0]);
    })
  },

  // === SELECT FILTER ===
  findBy(filter, callback) {
    const query = `
      SELECT mem.*
      FROM members mem 
      WHERE mem.name ILIKE '%${filter}%'
      ORDER BY mem.name
    `;
    db.query(query, function(error, results) {
      if(error) throw `Database SELECT Error!${error}`;
      
      //Retornando os resultados para o controller
      callback(results.rows);
    });
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
        height = ($8),
        instructor_id = ($9)
      WHERE id = $10
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
      data.instructor_id,
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
  },

  instructorsSelectOptions(callback) {
    db.query(`SELECT id, name FROM instructors`, function(error, results) {
      if(error) throw `Database INSTRUCTORS Error!${error}`;

      callback(results.rows);
    });
  },

  paginate(params) {
    //Desconstruindo objeto "params"
    const { filter, limit, offset, callback } = params;

    //Iniciando as variável query em bracno, filter em branco e totalQuery como subquery
    let query = '',
        filterQuery = '',
        totalQuery = `(SELECT count(*) FROM members mem) AS total`;

    //Caso exista valor dentro do filter
    if(filter) {
      //A variável recebe parte da query
      filterQuery = `
        WHERE mem.name ILIKE '%${filter}%'
      `;

      //Subquery completada
      totalQuery = `
        (SELECT count(*) FROM members mem
        ${filterQuery}) AS total
      `;
    }

    //Query completa
    query = `
      SELECT *, ${totalQuery}
      FROM members mem
      ${filterQuery}
      ORDER BY mem.name LIMIT $1 OFFSET $2
    `;

    //Operação no banco de dados
    db.query(query, [ limit, offset ], function(error, results) {
      if(error) throw `Database PAGINATION Error!${error}`;
      callback(results.rows);
    });
  }
}