import { el,empty,handleSearch } from './search.js';

/* Grunn URL fyrir API */
const baseUrl = 'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/';

function route() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const query = params.get('search');

  if (id) {
    renderDetails(document.body, id);
  } else {
    renderFrontPage(document.body);
  }
}

route();

// Bregst við því þegar við notum vafra til að fara til baka eða áfram.
window.onpopstate = () => {
  empty(document.body);
  route();
};

/* Fall til að sýna forsíðu */
async function renderFrontPage(parentElement) {
  setLoading(parentElement);
  const response = await fetch(
    'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products?limit=6'
  )
    .then((response) => response.json())
    .then((data) => data.items);
  setNotLoading(parentElement);
  const container = parentElement.querySelector('.products');
  if (container === null) {
    return;
  }

  for (let index = 0; index < response.length; index++) {
    const productBox = el('div', { class: 'productBox' });
    const productName = el(
      'a',
      { class: 'productTitle', href: `/?id=${response[index].id}` },
      response[index].title
    );
    const productPrice = el(
      'h2',
      { class: 'productPrice' },
      response[index].price,
      ' ',
      'Kr.-'
    );
    const productImage = el('img', {
      class: 'productImage',
      src: `${response[index].image}`,
    });
    const productCat = el(
      'p',
      { class: 'productCat' },
      'Category: ' , response[index].category_title
    );

    

    const titlePriceDiv = el('div', { class: 'priceAndTitle' });

    titlePriceDiv.appendChild(productName);
    titlePriceDiv.appendChild(productPrice);

    productBox.appendChild(titlePriceDiv);
    productBox.appendChild(productImage);
    productBox.appendChild(productCat);

    container.appendChild(productBox);
  }

  return container;
}

/* renderFrontPage(document.body); */

/* Fall til að sýna allan vörulista */
async function renderProducts(parentElement) {
  const container = parentElement.querySelector('products');
  empty(container);
  if (container === null) {
    return;
  }
  const heading = el('h1', { class: 'productList' }, 'Vörulisti');
  container.appendChild(heading);

  setLoading(parentElement);
  const response = await fetch(
    'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products'
  )
    .then((response) => response.json())
    .then((data) => data.items);

  setNotLoading();

  for (let index = 0; index < response.length; index++) {
    const productBox = el('div', { class: 'productBox' });
    const productName = el(
      'h2',
      { class: 'productTitle' },
      response[index].title
    );
    const productPrice = el(
      'p',
      { class: 'productPrice' },
      response[index].price,
      ' ',
      'Kr.-'
    );
    const productImage = el('img', {
      class: 'productImage',
      src: `${response[index].image}`,
    });
    const productCat = el(
      'p',
      { class: 'productCat' },
      response[index].category_title
    );

    productBox.appendChild(productName);
    productBox.appendChild(productPrice);
    productBox.appendChild(productImage);
    productBox.appendChild(productCat);

    container.appendChild(productBox);
  }

  const backElement = el(
    'div',
    { class: 'back' },
    el('a', { href: '/' }, 'Fara á forsíðu')
  );

  container.appendChild(backElement);

  return container;
}

/* Loading föll, bæði til að setja loading state á síðu og taka það burt */
function setLoading(parentElement){
  let loadingElement = parentElement.querySelector('.loading');

  if (!loadingElement) {
    loadingElement = el('div', { class: 'loading' }, 'Sæki gögn...');
    parentElement.appendChild(loadingElement);
  }
}

function setNotLoading(parentElement){
  const loadingElement = parentElement.querySelector('.loading');

  if (loadingElement) {
    loadingElement.remove();
  }
}

async function renderDetails(parentElement, id){


}
