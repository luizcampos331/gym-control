const Member = require('../models/Member');
const { age, date, goals } = require('../../lib/utils');

module.exports = {
  // === Método Index - Visualizar página ===
  index(req, res){
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
      callback(members) {
        const pagination = {
          //Math.ceil arredonda para cima
          total: Math.ceil(members[0].total / limit),
          page
        }

        for(let i = 0; i < members.length; i++) {
          members[i].goals = goals(members[i].goals)
        }

        //Retorna página de instrutores renderizada
        return res.render('members/index', { members, pagination, filter });
      }
    }

    // Inicia o paginate passado o objeto params como parametro
    Member.paginate(params);
  },

  // === Método Create - Visualizar página ===
  create(req, res){
    Member.instructorsSelectOptions(function(options) {
      //Retorna página de criação de instrutores
      return res.render('members/create', { instructorOptions: options });
    })
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

    /*Chamo a function create do js Member, passo para ela uma function de
    redirecionamento para a tela de detalhes do instrutor cadastrado. Recebendo
    os dados da function create pelo callback*/
    Member.create(req.body, function(member) {
      //Redireciona para página de detalhes do instrutor cadastrado
      return res.redirect(`members/${member.id}`)
    })
  },

  // === Método Show - Visualizar página ===
  show(req, res){
    /*Chamo a function find do js Member, passo para ela uma function de
    renderização da tela de detalhes do instrutor selecionado. Recebendo
    os dados da function find pelo callback*/
    Member.find(req.params.id, function(member) {
      //Verifico se o instrutor existe
      if(!member) return res.send('Member not found!');

      //Formato os dados necessários
      member.age = age(member.birth);
      member.goals = goals(member.goals);

      //Returno a página renderizada com as insformações do instrutor
      return res.render('members/show', { member });
    })
  },

  // === Método Edit - Visualizar página ===
  edit(req, res){
    /*Chamo a function find do js Member, passo para ela uma function de
    renderização da tela de detalhes do instrutor selecionado. Recebendo
    os dados da function find pelo callback*/
    Member.find(req.params.id, function(member) {
      //Verifico se o instrutor existe
      if(!member) return res.send('Member not found!');

      //Formato os dados necessários
      member.birth = date(member.birth).iso;

      Member.instructorsSelectOptions(function(options) {
        //Returno a página renderizada com as insformações do instrutor
        return res.render('members/edit', { member, instructorOptions: options });
      });
    });
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

    Member.update(req.body, function() {
      return res.redirect(`/members/${req.body.id}`)
    })
  },

  // === Método Delete - Ação ===
  delete(req, res){
    /*Chamo a function find do js Member, passo para ela uma function de
    renderização da tela de detalhes do instrutor selecionado. Recebendo
    os dados da function find pelo callback*/
    Member.delete(req.body.id, function() {
      //Redireciona para a página de instrutores
      return res.redirect('/members');  
    })
  },
}