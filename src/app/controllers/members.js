const Member = require('../models/Member');
const { age, date, goals } = require('../../lib/utils');

module.exports = {
  // === Método Index - Visualizar página ===
  index(req, res){
    /*Chamo a function all do js Member, passo para ela uma function de
    renderização da tela de listagem dos instrutores. Recebendo os dados dos
    memberes da function all pelo callback*/
    Member.all(function(members) {

      for(let i = 0; i < members.length; i++) {
        members[i].goals = goals(members[i].goals);
      }

      //Retorna página de instrutores renderizada
      return res.render('members/index', { members });
    });
  },

  // === Método Create - Visualizar página ===
  create(req, res){
    //Retorna página de criação de instrutores
    return res.render('members/create');
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
      member.created_at = date(member.created_at).format;

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

      //Returno a página renderizada com as insformações do instrutor
      return res.render('members/edit', { member });
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