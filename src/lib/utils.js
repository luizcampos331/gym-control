module.exports = {
  // === Calcula idade com base em timestamp ===
  age(timestamp) {
    //Salva a data de hoje
    const today = new Date();
    //Converte o paramtro timestamp em data comum
    const birthDate = new Date(timestamp);

    //Salva a diferença em anos dos duas datas
    let age = today.getFullYear() - birthDate.getFullYear();
    //Salva a diferença em meses das duas datas
    const month = today.getMonth() - birthDate.getMonth();

    /*Caso o mes seja menos ou igual a 0 e se for zero, caso o dia de hoje seja
    Menor ou igual ao ao do timestamp ele tira 1 ano da idade*/
    if(month < 0 || month == 0 && today.getDate() <= birthDate.getDate())
      age -= 1;
    
    return age;
  },

  // === Converte timestamp em data
  date(timestamp) {
    const date = new Date(timestamp);

    //Pega o ano yyyy
    const year = date.getUTCFullYear();

    //Pega o mês mm, os meses são contados de 0 a 11, por isso o +1
    //as crases colocam zempre um zero no frente do valor, porém, o slice
    //só pega os ultimos dois caracteres
    const month = `0${date.getUTCMonth() + 1}`.slice(-2);

    //Pega o dia dd
    const day = `0${date.getUTCDate()}`.slice(-2);

    return {
      iso: `${year}-${month}-${day}`,
      format: `${day}/${month}/${year}`,
    }
  },

  // === Correção do texto dos opations - seletcs ===
  goals(goal) {
    switch(goal) {
      case "-peso":
        return "Perda de peso"
      case "+peso":
        return "Ganho de peso"
      case "hipertrofia":
        return "Hipertrofia"
      case "forca":
        return "Ganho de força"
      default:
        return "Lutas"
    }
  }
}