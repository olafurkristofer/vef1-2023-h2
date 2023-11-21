
function renderFrontPage(){
    let response
    try {
       let response = fetch('https://vef1-2023-h2-api-791d754dda5b.herokuapp.com/products?limit=6').then(response => { return response.json()}).then(data => data)
    } catch (e) {
        console.error('Villa við að sækja gögn', e)
        return;
    }
    
    if (!response.ok) {
        console.error('Fékk ekki 200 status frá API', response);
        return null;
      }

    let data;

    try {
        let data = await response.json()
    } catch (error) {
        
    }

    const productsContainer = document.getElementsByTagName('main');


}

renderFrontPage()
