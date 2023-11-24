import { el, empty, handleSearch } from './search.js';

/* Grunn URL fyrir API */
const baseUrl = 'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/';

function route() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const products = params.has('products');

  if (id) {
    renderDetails(document.body, id);
  } else if (products) {
    renderProducts(document.body);
  }
  else {
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
  const heading = el('h1', { class: 'NewProducts' }, 'Nýjar Vörur');
  parentElement.querySelector('form').appendChild(heading);

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
      'Flokkur: ',
      response[index].category_title
    );

    productBox.appendChild(productName);
    productBox.appendChild(productPrice);
    productBox.appendChild(productImage);
    productBox.appendChild(productCat);

    container.appendChild(productBox);
  }
  const productList = el(
    'a',
    { class: 'productListLink', href: `/?products` },
    'Skoða Vörusíðu'
  );
  container.appendChild(productList);

  return container;
}

/* Fall til að sýna allan vörulista */
async function renderProducts(parentElement) {
  const container = parentElement.querySelector('.products');
  empty(container);
  if (container === null) {
    return;
  }
  const heading = el('h1', { class: 'productList' }, 'Vörulisti');
  parentElement.querySelector('form').appendChild(heading);

  setLoading(container);
  const response = await fetch(
    'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products'
  )
    .then((response) => response.json())
    .then((data) => data.items);

  setNotLoading(container);

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
      { class: 'productCat' }, 'Flokkur: ',
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

  parentElement.querySelector('main').appendChild(backElement);

  return container;
}

/* Loading föll, bæði til að setja loading state á síðu og taka það burt */
function setLoading(parentElement) {
  let loadingElement = parentElement.querySelector('.loading');

  if (!loadingElement) {
    loadingElement = el('div', { class: 'loading' }, 'Sæki gögn...');
    parentElement.appendChild(loadingElement);
  }
}

function setNotLoading(parentElement) {
  const loadingElement = parentElement.querySelector('.loading');

  if (loadingElement) {
    loadingElement.remove();
  }
}

/* Fall til að sýna bara eina vöru */
async function renderDetails(parentElement, id) {

  const product = parentElement.querySelector('.products')

  product.remove()

  empty(parentElement.querySelector('products'));
  const container = el('div', { class: 'productIdDiv' });
  const backElement = el(
    'div',
    { class: 'back' },
    el('a', { href: '/' }, 'Til baka')
  );

  const mainEl = parentElement.querySelector('main');

  setLoading(container);
  const result = await getProductId(id);
  setNotLoading(container);

  if (!result) {
    container.appendChild(el('p', {}, 'Villa við að sækja gögn um vöru!'));
    container.appendChild(backElement);
    return;
  }

  const productIdName = el('h1', { class: 'productIdName' }, result.title);
  const productIdPrice = el(
    'p',
    { class: 'productIdPrice' },
    result.price,
    ' ',
    'Kr.-'
  );
  const productIdDesc = el('p', { class: 'productIdDesc' }, result.description);
  const productIdImage = el('img', {
    class: 'productIdImage',
    src: `${result.image}`,
  });
  const productIdCat = el(
    'p',
    { class: 'productIdCat' }, 'Flokkur: ',
    result.category_title
  );

  container.appendChild(productIdName);
  container.appendChild(productIdPrice);
  container.appendChild(productIdDesc);
  container.appendChild(productIdImage);
  container.appendChild(productIdCat);

  container.appendChild(backElement);

  mainEl.appendChild(container);

    
    const relatedProducts = await getRelatedProducts(result.category_id, id);

    if (relatedProducts && relatedProducts.length > 0) {
      const relatedProductsContainer = el('div', { class: 'relatedProducts' });
      const relatedProductsHeading = el('h2', {}, 'Vörur úr sama flokki');
  
      relatedProductsContainer.appendChild(relatedProductsHeading);
  
      for (let i = 0; i < Math.min(3, relatedProducts.length); i++) {
        const relatedProductBox = el('div', { class: 'productBox' });
        const relatedProductName = el(
          'a',
          { class: 'productTitle', href: `/?id=${relatedProducts[i].id}` },
          relatedProducts[i].title
        );
        const relatedProductPrice = el(
          'h2',
          { class: 'productPrice' },
          relatedProducts[i].price,
          ' ',
          'Kr.-'
        );
        const relatedProductImage = el('img', {
          class: 'productImage',
          src: `${relatedProducts[i].image}`,
        });
        const relatedProductCat = el(
          'p',
          { class: 'productCat' },
          'Flokkur: ',
          relatedProducts[i].category_title
        );
  
        relatedProductBox.appendChild(relatedProductName);
        relatedProductBox.appendChild(relatedProductPrice);
        relatedProductBox.appendChild(relatedProductImage);
        relatedProductBox.appendChild(relatedProductCat);
  
        relatedProductsContainer.appendChild(relatedProductBox);
      }
  
      mainEl.appendChild(relatedProductsContainer);
    }
  
    return mainEl;
  }
  
  async function getRelatedProducts(categoryId, currentProductId) {
    const url = new URL(`/products?category_id=${categoryId}&limit=3&id_ne=${currentProductId}`, baseUrl);

  
    let response;
  
    try {
      response = await fetch(url);
    } catch (e) {
      console.error('Villa við að sækja gögn fyrir tengdar vörur', categoryId);
      return [];
    }
  
    if (!response.ok) {
      console.error('Fékk ekki 200 status frá API');
      return [];
    }
  
    let data;
  
    try {
      data = await response.json();
    } catch (e) {
      console.error('Villa við að lesa gögn um tengdar vörur', categoryId);
      return [];
    }
  
    
    const relatedProducts = data.items.filter((product) => product.id !== currentProductId);
  
    return relatedProducts;
  }
  


/* Fall til að sækja json data um sérstaka vöru */
async function getProductId(id) {
  const url = new URL(`/products/${id}`, baseUrl);

  let response;

  try {
    response = await fetch(url);
  } catch (e) {
    console.error('Villa við að sækja gögn fyrir vöru', id);
    return;
  }

  if (!response.ok) {
    console.error('Fékk ekki 200 status frá API');
    return null;
  }

  let data;

  try {
    data = await response.json();
  } catch (e) {
    console.error('Villa við að lesa gögn um vöru', id);
    return;
  }

  return data;
}
