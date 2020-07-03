const db = require('../../config/db');
const { date } = require('../../lib/utils');
const { off } = require('../../config/db');

module.exports = {
  // === SELETC * ===
  all(callback) {
    const query = `
      SELECT ins.*, count(mem.name) as total_members
      FROM instructors ins 
      LEFT JOIN members mem ON ins.id = mem.instructor_id
      GROUP BY ins.id
    `;
    //Operação no banco de dados
    db.query(query, function(error, results) {
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

  // === SELECT FILTER ===
  findBy(filter, callback) {
    const query = `
      SELECT ins.*, count(mem.name) as total_members 
      FROM instructors ins 
      LEFT JOIN members mem ON ins.id = mem.instructor_id 
      WHERE ins.name ILIKE '%${filter}%' OR ins.services ILIKE '%${filter}%'
      GROUP BY ins.id
    `;
    //Operação no banco de dados
    db.query(query, function(error, results) {
      if(error) throw `Database SELECT FILTER Error!${error}`;
      
      //Retornando os resultados para o controller
      callback(results.rows);
    });
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
  },

  paginate(params) {
    //Desconstruindo objeto "params"
    const { filter, limit, offset, callback } = params;

    //Iniciando as variável query em bracno, filter em branco e totalQuery como subquery
    let query = '',
        filterQuery = '',
        totalQuery = `(SELECT count(*) FROM instructors ins) AS total`;

    //Caso exista valor dentro do filter
    if(filter) {
      //A variável recebe parte da query
      filterQuery = `
        WHERE ins.name ILIKE '%${filter}%'
        OR ins.services ILIKE '%${filter}%'
      `;

      //Subquery completada
      totalQuery = `
        (SELECT count(*) FROM instructors ins
        ${filterQuery}) AS total
      `;
    }

    //Query completa
    query = `
      SELECT ins.*, ${totalQuery}, count(mem) AS total_members
      FROM instructors ins
      LEFT JOIN members mem ON ins.id = mem.instructor_id
      ${filterQuery}
      GROUP BY ins.id ORDER BY ins.name LIMIT $1 OFFSET $2
    `;

    //Operação no banco de dados
    db.query(query, [ limit, offset ], function(error, results) {
      if(error) throw `Database PAGINATION Error!${error}`;
      callback(results.rows);
    });
  }
}