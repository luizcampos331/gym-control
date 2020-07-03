const Instructor = require('../models/Instructor');
const { age, date } = require('../../lib/utils');

module.exports = {
  // === Método Index - Visualizar página ===
  index(req, res){
    //Obtendo parametros passados pela URL (query usado após o ? em uma URL)
    let { filter, page, limit } = req.query;

    //page recebe ele mesmo ou 1 caso ele esteja vazio
    page = page || 1;
    //limit recebe ele mesmo ou 2 caso ele esteja vazio
    limit = limit || 2;
    //Tendo os valores padrões acima, offset recebe 2 * (1 - 1) = 0
    let offset = limit * (page - 1);

    // Cria objeto params
    const params = {
      filter,
      limit,
      offset,
      callback(instructors) {
        const pagination = {
          //Math.ceil arredonda para cima
          total: Math.ceil(instructors[0].total / limit),
          page
        }

        //Percorre o array de instrutors
        for(let i = 0; i < instructors.length; i++){
          //Separa os serviços dos instrutores em um array de serviços para apresentação
          instructors[i].services = instructors[i].services.split(',');
        }
        //Retorna página de instrutores renderizada
        return res.render('instructors/index', { instructors, pagination, filter });
      }
    }

    // Inicia o paginate passado o objeto params como parametro
    Instructor.paginate(params);
  },

  // === Método Create - Visualizar página ===
  create(req, res){
    //Retorna página de criação de instrutores
    return res.render('instructors/create');
  },

  // === Método Post - Ação ===
  post(req, res){
    //Variáveis recebendo um array com todos os campos do formulário
    const keys = Object.keys(req.body);

    //Percorrendo o array keys
    for(let key of keys){
      //Verificando a existencia de valores em cada uma das chaves do req.body
      if(req.body[key] == "")
        return res.send('Please, fill all fields!');
    }

    /*Chamo a function create do js Instructor, passo para ela uma function de
    redirecionamento para a tela de detalhes do instrutor cadastrado. Recebendo
    os dados da function create pelo callback*/
    Instructor.create(req.body, function(instructor) {
      //Redireciona para página de detalhes do instrutor cadastrado
      return res.redirect(`instructors/${instructor.id}`)
    })
  },

  // === Método Show - Visualizar página ===
  show(req, res){
    /*Chamo a function find do js Instructor, passo para ela uma function de
    renderização da tela de detalhes do instrutor selecionado. Recebendo
    os dados da function find pelo callback*/
    Instructor.find(req.params.id, function(instructor) {
      //Verifico se o instrutor existe
      if(!instructor) return res.send('Instructor not found!');

      //Formato os dados necessários
      instructor.age = age(instructor.birth);
      instructor.services = instructor.services.split(',');
      instructor.created_at = date(instructor.created_at).format;

      //Returno a página renderizada com as insformações do instrutor
      return res.render('instructors/show', { instructor });
    })
  },

  // === Método Edit - Visualizar página ===
  edit(req, res){
    /*Chamo a function find do js Instructor, passo para ela uma function de
    renderização da tela de detalhes do instrutor selecionado. Recebendo
    os dados da function find pelo callback*/
    Instructor.find(req.params.id, function(instructor) {
      //Verifico se o instrutor existe
      if(!instructor) return res.send('Instructor not found!');

      //Formato os dados necessários
      instructor.birth = date(instructor.birth).iso;

      //Returno a página renderizada com as insformações do instrutor
      return res.render('instructors/edit', { instructor });
    })
  },

  // === Método Update - Ação ===
  put(req, res){
    //Variáveis recebendo um array com todos os campos do formulário
    const keys = Object.keys(req.body);

    //Percorrendo o array keys
    for(let key of keys){
      //Verificando a existencia de valores em cada uma das chaves do req.body
      if(req.body[key] == "")
        return res.send('Please, fill all fields!');
    }

    Instructor.update(req.body, function() {
      return res.redirect(`/instructors/${req.body.id}`)
    })
  },

  // === Método Delete - Ação ===
  delete(req, res){
    /*Chamo a function find do js Instructor, passo para ela uma function de
    renderização da tela de detalhes do instrutor selecionado. Recebendo
    os dados da function find pelo callback*/
    Instructor.delete(req.body.id, function() {
      //Redireciona para a página de instrutores
      return res.redirect('/instructors');  
    })
  },
}