import { menuObj } from './data.js';

let mainEl = document.getElementById('main-content');

let mainInner = ``;

let menuItems = Object.keys(menuObj);

for(let key in menuObj) {
    if(menuObj.hasOwnProperty(key)) {
        menuObj[key].forEach(item => {
            mainInner += `
                <div>
                    <h3>${item.name}</h3>
                    <p>${item.ingredients.join(', ')}</p>
                    <p>${item.price}</p>
                    <p>${item.picture}</p>
                    <p>${key !== 'beer' ? item.vegetarian : item.nonAlcoholic}</p>
                </div>
            `;
        });
    }
}

mainEl.innerHTML = mainInner;

console.log(menuItems);