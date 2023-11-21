/* import { el } from './elements'; */

/**
 * @typedef {import('./api').ProductInfo}
 */


function renderFrontPage() {
  const mainBox = document.getElementsByClassName('main');
  let response = fetch('https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products?limit=6');

  let data = response.then(response => response.json())

  
}

renderFrontPage();
