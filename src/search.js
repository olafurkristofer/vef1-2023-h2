export function handleSearch() {
    const searchForm = document.getElementById('searchForm');

    if (searchForm) {
        searchForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const searchInput = document.getElementById('searchInput');

            if (searchInput === null) {
                return;
            }

            const searchTerm = searchInput.value;

            console.log(searchTerm)

            const response = await fetch(
                `https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products?limit=6&q=${encodeURIComponent(searchTerm)}`
            )
                .then((response) => response.json())
                .then((data) => data.items);

            const container = document.querySelector('.products');
            empty(container);

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
                    response[index].price
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
        });
    }
}

export function empty(element) {
    if (!element || !element.firstChild) {
        return;
    }

    while (element.firstChild) {
        element.removeChild(element.firstChild);
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


handleSearch();
