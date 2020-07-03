// === Cor do menu na página atual ===
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

// === Confirmação de DELETE ===
//Guarda todo o form-delete na variavel formDelete
const formDelete = document.querySelector('#form-delete')

function deleteInstructorOrMember(formDelete) {
  //Quando for gerado um evento de submit dentro do form-delete ele entra na function
  formDelete.addEventListener('submit', function(event) {
    //Mostra um popup de confirmação da exclusão
    const confirmation = confirm('Deseja deletar?')
    //Se a confirmação for cancelada ele interrompe o submit do botão deletar
    if(!confirmation) event.preventDefault()
  });
}

if(formDelete) {
  deleteInstructorOrMember(formDelete);
}

// === Paginação ===
function paginate(selectedPage, totalPages) {
  let pages = [],
      oldPage

  for(let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const firstAndLastPage = currentPage == 1 || currentPage == totalPages;
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2;
    const pagesBeforeSelectedPage = currentPage >= selectedPage -2;

    if(firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {
      if(oldPage && currentPage - oldPage > 2) {
        pages.push('...');
      }

      if(oldPage && currentPage - oldPage == 2) {
        pages.push(oldPage + 1);
      }

      pages.push(currentPage);

      oldPage = currentPage;
    }
  }

  return pages
}

function createPagination(pagination) {
  //Pega o valor de filter
  const filter = pagination.dataset.filter;
  //Pega o valor de page
  const page = +pagination.dataset.page;
  //Pega o valor de total
  const total = +pagination.dataset.total;
  //Recebe a paginação na variável pages
  const pages = paginate(page, total);

  let elements = '';

  console.log(filter);


  //Caso tenha mais de uma página
  if(pages.length > 1) {
    //Percorre todas as posições de pages
    for(let page of pages) {
      //Caso o page inclua os pontos ...
      if(String(page).includes('...')){
        //Variável recebe SPAN
        elements += `<span>${page}</span>`;
      } else {
        if(filter) {
          elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`;
        }
        else {
          elements += `<a href="?page=${page}">${page}</a>`;
        }
      }
    }
    //Caso seja somente uma página
  } else {
    if(filter) {
      elements += `<a href="?page=${pages}&filter=${filter}">${page}</a>`;
    }
    else {
      elements += `<a href="?page=${pages}">${pages}</a>`;
    }
  }

  //Adiciona ao HTML
  pagination.innerHTML = elements
}

//Guarda div de paginação
const pagination = document.querySelector('.pagination');

if(pagination) {
  createPagination(pagination);
}