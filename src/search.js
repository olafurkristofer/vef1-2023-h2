export async function handleSearch() {
    const searchForm = document.getElementById('searchForm');

    if (searchForm) {
        searchForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const searchInput = document.getElementById('searchInput');

            if (searchInput === null) {
                return;
            }

            const searchTerm = searchInput.value.trim();

            if (!searchTerm) {
                return;
            }

            console.log(searchTerm);

            try {
                const response = await fetch(
                    `https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products`+'?search={'+searchTerm+'}'
                )

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                const container = document.querySelector('.products');

                
                empty(container, 'productSearchInput');

                if (data.items.length === 0) {
                    const noResultsMessage = el('a', { class: 'noResultsMessage' }, 'Vara fannst ekki.');
                    container.appendChild(noResultsMessage);
                } else {
                
                
                for (let index = 0; index < data.items.length; index++) {
                    const productBox = el('div', { class: 'productBox' });
                    const productName = el(
                        'h2',
                        { class: 'productTitle' },
                        data.items[index].title
                    );
                    const productPrice = el(
                        'h2',
                        { class: 'productPrice' },
                        data.items[index].price,
                        ' ',
                        'Kr.-'
                    );
                    const productImage = el('img', {
                        class: 'productImage',
                        src: `${data.items[index].image}`,
                    });
                    const productCat = el(
                        'p',
                        { class: 'productCat' },
                        'Category: ', data.items[index].category_title
                    );

                    const titlePriceDiv = el('div', { class: 'priceAndTitle' });

                    titlePriceDiv.appendChild(productName);
                    titlePriceDiv.appendChild(productPrice);

                    productBox.appendChild(titlePriceDiv);
                    productBox.appendChild(productImage);
                    productBox.appendChild(productCat);

                    container.appendChild(productBox);
                }
            } 
        }catch (error) {
                console.error('Error fetching data:', error);
            }

        });
    }
}




export function empty(element, excludeClass = '') {
    if (!element || !element.firstChild) {
        return;
    }

    while (element.firstChild) {
        const child = element.firstChild;
        if (excludeClass && child.classList && child.classList.contains(excludeClass)) {
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

document.addEventListener('DOMContentLoaded', handleSearch);







