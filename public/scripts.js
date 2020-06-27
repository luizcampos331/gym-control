//location vem do obejto global window, assim como document, por isso posso usalo direto
//Será guardado na variável currentPage a rota selecionada, /instructors ou /members
const currentPage = location.pathname;
//Guarda na variável menuItems os links do menu
const menuItems = document.querySelectorAll('header .links a');

//Percorre os items do menu
for(item of menuItems) {
  /*Caso dentro do currentPage tenha alguma string que seja igual ao href de algum dos links,
  ele entra no if */
  if(currentPage.includes(item.getAttribute('href'))) {
    //Adiciona a classe active ao a do menu
    item.classList.add('active');
  }
}

//Guarda todo o form-delete na variavel formDelete
const formDelete = document.querySelector('#form-delete')
//Quando for gerado um evento de submit dentro do form-delete ele entra na function
formDelete.addEventListener('submit', function(event) {
  //Mostra um popup de confirmação da exclusão
  const confirmation = confirm('Deseja deletar?')
  //Se a confirmação for cancelada ele interrompe o submit do botão deletar
  if(!confirmation) event.preventDefault()
})