//File System
const fs = require('fs');
const data = require('../data.json');

const { age, date, goals } = require('../utils');

// === Método Index - Visualizar página ===
exports.index = function(req, res) {

  let members = []

  let goal = {}

  for(let i = 0; i < data.members.length; i++) {
    goal = {
      ...data.members[i],
      goals: goals(data.members[i].goals)
    }

    members.push(goal)
  }


  return res.render('members/index', { members });
}

// === Método Show - Visualizar página ===
exports.show = function(req, res) {
  //Pega o id que está vindo como parametro na url
  const { id } = req.params;
  
  //Se algum id de instrutores for igual ao id passado pela url
  //os dados do instrutor serão guardados na variável foundMember
  const foundMember = data.members.find(function(member) {
    return member.id == id
  });

  //Se não for achado nenhum instrutor com id igual ao da url é retornada uma mensagem
  if(!foundMember) return res.send('Instructor not found!');

  const member = {
    //Espalhando dados no objeto
    ...foundMember,
    age: age(foundMember.birth),
    goals: goals(foundMember.goals),
    //Operador condicional ternário
    //Forma simplificada de usar um if
    gender: foundMember.gender == 'M' ? 'Masculino' : 'Feminino',
  }

  //Caso seja achado é renderizada a página de detalhes do instrutor com seus dados
  return res.render('members/show', { member });
}

// === Método Create - Visualizar página ===
exports.create = function(req, res) {
  return res.render('members/create');
}

// === Método Post - Ação ===
exports.post = function(req, res) {
  //Variáveis recebendo um array com todos os campos do formulário
  const keys = Object.keys(req.body);

  //Percorrendo o array keys
  for(let key of keys){
    //Verificando a existencia de valores em cada uma das chaves do req.body
    if(req.body[key] == "" || req.body[key] == "Escolha uma opção")
      return res.send('Please, fill all fields!');
  }

  //Desestrutorando o objeto que vem do req.body
  let { 
    avatar_url, 
    name, 
    email, 
    birth, 
    gender, 
    goals, 
    weight, 
    height 
  } = req.body;

  //Converter a data de nascimento em timestamp
  birth = Date.parse(birth);
  //Pego o ultimo membro do array
  const lastMember = data.members[data.members.length - 1]
  //Inicio o id com 1
  let id = 1;
  //Se lastMember não estiver vazio ele guarda o lastMember.id + 1 na variável id
  if(lastMember) id = lastMember.id + 1;

  /*Adiciona um novo objetivo ao final do array de members, usado dessa forma
  para que o id fique acima de todos */
  data.members.push({
    id,
    avatar_url,
    name,
    email,
    birth,
    gender,
    goals,
    weight,
    height,
  });

  //escrevendo no arquivo data.json,
  //Convertendo req.body em json,
  //CallBack = não deixa o sistema travado esperando a finalização do processamento
  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(error) {
    if(error) return res.send("Write file error!")

    return res.redirect("/members")
  });
}

// === Método Edit - Visualizar página ===
exports.edit = function(req, res) {
  //Pega o id que está vindo como parametro na url
  const { id } = req.params;

  //Se algum id de instrutores for igual ao id passado pela url
  //os dados do instrutor serão guardados na variável foundMember
  const foundMember = data.members.find(function(member) {
    return member.id == id
  });

  //Se não for achado nenhum instrutor com id igual ao da url é retornada uma mensagem
  if(!foundMember) return res.send('Member not found!');

  const member = {
    ...foundMember,
    birth: date(foundMember.birth)
  }
  
  return res.render('members/edit', { member })
}

// === Método Update - Ação  ===
exports.put = function(req, res) {
  //Pega o id que está vindo no corpo da requisição
  const { id } = req.body;

  let index = 0;
  
  /*Se algum id de instrutores for igual ao id passado corpo da requisição
  os dados do instrutor serão guardados na variável foundMember */
  const foundMember = data.members.find(function(member, foundIndex) {
    if (id == member.id) {
      index = foundIndex;
      return true;
    }
  });

  //Se não for achado nenhum instrutor com id igual ao da url é retornada uma mensagem
  if(!foundMember) return res.send('Member not found!');

  const member = {
    ...foundMember,
    ...req.body,
    id: Number(req.body.id),
    birth: Date.parse(req.body.birth),
  }

  data.members[index] = member;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(error) {
    if(error) return res.send('Write error!');

    return res.redirect(`members/${id}`)
  })
}

// === Método Delete - Ação  ===
exports.delete = function(req, res) {
  const { id } = req.body;

  const filteredMember = data.members.filter(function(member) {
    return id != member.id;
  });

  data.members = filteredMember;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(error) {
    if(error) return res.send('Write error!');

    return res.redirect('/members');
  })
}