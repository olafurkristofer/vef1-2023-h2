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
  const response = await fetch(
    'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products?limit=6'
  )
    .then((response) => response.json())
    .then((data) => data.items);
  const container = parentElement.querySelector('.products');
  if (container === null) {
    return;
  }

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

  const productlist = el('a', { class: 'productsLink', href:'javascript:void(0);'}, 'Skoða vörulista')
  productlist.addEventListener('click', renderProducts(document.body));
  
  container.appendChild(productlist);

  return container;
}

/* renderFrontPage(document.body); */

/* Fall til að sýna allan vörulista */
async function renderProducts(parentElement) {
  const container = parentElement.querySelector('products');
  empty(container);
  const heading = el('h1', { class: 'productList' }, 'Vörulisti');
  container.appendChild(heading);

  const response = await fetch(
    'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products'
  )
    .then((response) => response.json())
    .then((data) => data.items);

  if (container === null) {
    return;
  }

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

/* Fall til að sýna upplýsinga um sérstaka vöru */
async function renderDetails(parentElement, id) {}

function getProductID() {}

/* Fall til að tæma allt af síðunni */
function empty(element) {
  if (!element || !element.firstChild) {
    return;
  }

  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/* Fall til að búa til HTML element */
function el(name, attributes = {}, ...children) {
  const e = document.createElement(name);

  for (const key of Object.keys(attributes)) {
    e.setAttribute(key, attributes[key]);
  }

  for (const child of children) {
    if (!child) {
      console.warn('Child is null', name, attributes);
      // eslint-disable-next-line no-continue
      continue;
    }

    if (typeof child === 'string' || typeof child === 'number') {
      e.appendChild(document.createTextNode(child.toString()));
    } else {
      e.appendChild(child);
    }
  }

  return e;
}
