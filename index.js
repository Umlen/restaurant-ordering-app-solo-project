import { menuObj } from './data.js';


const mainEl = document.getElementById('main-content');

function render() {
    for(let key in menuObj) {
        if(menuObj.hasOwnProperty(key)) {
            let mainInner = ``;
            menuObj[key].forEach(item => {
                mainInner += `
                    <div class="menu-item">
                        <img src="${item.picture}" class="menu-item-img" alt="${item.name}">
                        <div class="menu-item-desc">
                            <h4 class="menu-item-name">${item.name}</h4>
                            <p class="additional-text">${item.ingredients.join(', ')}</p>
                            <p>
                                ${
                                    key !== 'beer' ? 
                                    item.vegetarian ? 'Vegetarian: yes' : 'Vegetarian: no' : 
                                    item.nonAlcoholic ? 'Non-alcoholic: yes' : 'Non-alcoholic: no'
                                }
                            </p>
                            <p class="bold-text">$ ${item.price}</p>
                        </div>
                        <i class="fa-regular fa-square-plus"></i>
                    </div>
                `;
            });
            mainEl.innerHTML += `<h3 class="menu-section-header">${key[0].toUpperCase() + key.slice(1)}</h3>`;
            mainEl.innerHTML += mainInner;
        }
    }
}

render();