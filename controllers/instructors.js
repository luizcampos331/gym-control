//File System
const fs = require('fs');
const data = require('../data.json');

const { age, date } = require('../utils');

// === Método Index - Visualizar página ===
exports.index = function(req, res) {

  let instructors = []

  let service = {}

  for(let i = 0; i < data.instructors.length; i++) {
    service = {
      ...data.instructors[i],
      services: data.instructors[i].services.split(',')
    }

    instructors.push(service)
  }

  return res.render('instructors/index', { instructors });
}

// === Método Show - Visualizar página ===
exports.show = function(req, res) {
  //Pega o id que está vindo como parametro na url
  const { id } = req.params;
  
  //Se algum id de instrutores for igual ao id passado pela url
  //os dados do instrutor serão guardados na variável foundInstructor
  const foundInstructor = data.instructors.find(function(instructor) {
    return instructor.id == id
  });

  //Se não for achado nenhum instrutor com id igual ao da url é retornada uma mensagem
  if(!foundInstructor) return res.send('Instructor not found!');

  const instructor = {
    //Espalhando dados no objeto
    ...foundInstructor,
    age: age(foundInstructor.birth),
    //Operador condicional ternário
    //Forma simplificada de usar um if
    gender: foundInstructor.gender == 'M' ? 'Masculino' : 'Feminino',
    //Split transforma a string de services em um arrya, cada posição do array será
    //feita quando for achado uma virgula
    services: foundInstructor.services.split(','),
    //Intl.DateTimeFormat é um construtor para objetos que permitem formatação
    //de data e hora sensíveis ao idioma
    created_at: new Intl.DateTimeFormat('pt-BR').format(foundInstructor.created_at),
  }

  //Caso seja achado é renderizada a página de detalhes do instrutor com seus dados
  return res.render('instructors/show', { instructor });
}

// === Método Create - Visualizar página ===
exports.create = function(req, res) {
  return res.render('instructors/create');
}

// === Método Post - Ação ===
exports.post = function(req, res) {
  //Variáveis recebendo um array com todos os campos do formulário
  const keys = Object.keys(req.body);

  //Percorrendo o array keys
  for(let key of keys){
    //Verificando a existencia de valores em cada uma das chaves do req.body
    if(req.body[key] == "")
      return res.send('Please, fill all fields!');
  }

  let { avatar_url, name, birth, gender, services } = req.body;

  //Converter a data de nascimento em timestamp
  birth = Date.parse(birth)
  //Criando de data de criação
  const created_at = Date.now();
  //Criação de ID único
  const id = Number(data.instructors.length + 1);

  //Adiciona um novo objetivo ao final do array de instructors
  data.instructors.push({
    id,
    avatar_url,
    name,
    birth,
    gender,
    services,
    created_at,
  })

  //escrevendo no arquivo data.json,
  //Convertendo req.body em json,
  //CallBack = não deixa o sistema travado esperando a finalização do processamento
  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(error) {
    if(error) return res.send("Write file error!")

    return res.redirect("/instructors")
  });
}

// === Método Edit - Visualizar página ===
exports.edit = function(req, res) {
  //Pega o id que está vindo como parametro na url
  const { id } = req.params;

  //Se algum id de instrutores for igual ao id passado pela url
  //os dados do instrutor serão guardados na variável foundInstructor
  const foundInstructor = data.instructors.find(function(instructor) {
    return instructor.id == id
  });

  //Se não for achado nenhum instrutor com id igual ao da url é retornada uma mensagem
  if(!foundInstructor) return res.send('Instructor not found!');

  const instructor = {
    ...foundInstructor,
    birth: date(foundInstructor.birth)
  }
  
  return res.render('instructors/edit', { instructor })
}

// === Método Update - Ação ===
exports.put = function(req, res) {
  //Pega o id que está vindo no corpo da requisição
  const { id } = req.body;

  let index = 0;
  
  /*Se algum id de instrutores for igual ao id passado corpo da requisição
  os dados do instrutor serão guardados na variável foundInstructor */
  const foundInstructor = data.instructors.find(function(instructor, foundIndex) {
    if (id == instructor.id) {
      index = foundIndex;
      return true;
    }
  });

  //Se não for achado nenhum instrutor com id igual ao da url é retornada uma mensagem
  if(!foundInstructor) return res.send('Instructor not found!');

  const instructor = {
    ...foundInstructor,
    ...req.body,
    id: Number(req.body.id),
    birth: Date.parse(req.body.birth),
  }

  data.instructors[index] = instructor;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(error) {
    if(error) return res.send('Write error!');

    return res.redirect(`instructors/${id}`)
  })
}

// === Método Delete - Ação ===
exports.delete = function(req, res) {
  const { id } = req.body;

  const filteredInstructor = data.instructors.filter(function(instructor) {
    return id != instructor.id;
  });

  data.instructors = filteredInstructor;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(error) {
    if(error) return res.send('Write error!');

    return res.redirect('/instructors');
  })
}