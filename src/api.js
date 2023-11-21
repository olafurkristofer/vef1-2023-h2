import { el } from './elements';

/* Grunnslóð á API */

const API_URL = 'https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/';

/* Skilgreina upplýsingar sem við fáum frá APi */

/**
 * @typedef {object} ProductInfo
 * @property {string} title nafn á vöru 
 * @property {string} price verð á vöru
 * @property {string} description lýsing á vöru
 * @property {string} image mynd af vöru
 * @property {string} category_title nafn á flokk vöru
 */

export function renderFrontPage(){
    const url = new URL('https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products?limit=6');
    
    const products = el('div', { class: 'products'});
}


export async function searchLaunches(query) {
  const url = new URL('launch', API_URL);
  url.searchParams.set('mode', 'list');
  url.searchParams.set('search', query);

  let response;
  try {
    response = await fetch(url);
  } catch (e) {
    console.error('Villa við að sækja gögn', e);
    return null;
  }

  if (!response.ok) {
    console.error('Fékk ekki 200 status frá API', response);
    return null;
  }

  let data;

  try {
    data = await response.json();
  } catch (e) {
    console.error('Villa við að lesa gögn', e);
    return null;
  }

  const results = data?.results ?? [];

  return results;
}
