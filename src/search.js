import { setLoading, setNotLoading } from './index.js';

export async function handleSearch(parentElement, search) {
  const container = parentElement.querySelector('.products');
  empty(container);

  if (container === null) {
    return;
  }

  let response;

  try {
    setLoading(parentElement);
    response = await fetch(`https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products?search=${search}`).then(response => response.json()).then(data => data.items);
    setNotLoading(parentElement)
  } catch (e) {
    console.error('Villa');
    return;
  }

  if (response.length === 0) {
    container.appendChild(el('h2', { class: 'FannIkke' }, 'Fann ekki vörur'));
  }

  for (const data of response){
    const productBox = el('div', { class: 'productBox' });
    const productName = el(
      'a',
      { class: 'productTitle', href: `/?id=${data.id}` },
      data.title
    );
    const productPrice = el(
      'h2',
      { class: 'productPrice' },
      data.price,
      ' ',
      'Kr.-'
    );
    const productImage = el('img', {
      class: 'productImage',
      src: `${data.image}`,
    });
    const productCat = el(
      'p',
      { class: 'productCat' },
      'Flokkur: ',
      data.category_title
    );

    productBox.appendChild(productName);
    productBox.appendChild(productPrice);
    productBox.appendChild(productImage);
    productBox.appendChild(productCat);

    container.appendChild(productBox);
  }
}

export function empty(element, excludeClass = '') {
  if (!element || !element.firstChild) {
    return;
  }

  while (element.firstChild) {
    const child = element.firstChild;
    if (
      excludeClass &&
      child.classList &&
      child.classList.contains(excludeClass)
    ) {
      continue;
    }
    element.removeChild(child);
  }
}

export function el(name, attributes = {}, ...children) {
  const e = document.createElement(name);

  for (const key of Object.keys(attributes)) {
    e.setAttribute(key, attributes[key]);
  }

  for (const child of children) {
    if (!child) {
      console.warn('Child is null', name, attributes);
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
