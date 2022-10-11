import { menuObj } from './data.js';

const mainEl = document.getElementById('main-content');
const paymentForm = document.getElementById('payment-form');

paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    completedMessageShow();
});

render();

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
                        <i class="fa-regular fa-square-plus" data-uuid="${item.uuid}" data-category="${key}"></i>
                    </div>
                `;
            });
            mainEl.innerHTML += `<h3 class="menu-category-header">${key[0].toUpperCase() + key.slice(1)}</h3>`;
            mainEl.innerHTML += mainInner;
        }
    }
}

document.addEventListener('click', (e) => {
    if (e.target.dataset.uuid) {
        addToOrderList(e.target.dataset.uuid, e.target.dataset.category);
    } else if (e.target.classList.contains('remove-button')) {
        removeFromOrderList(e.target);
    } else if (e.target.id === 'complete-order-btn') {
        paymentFormShow();
    } else if (e.target.name === "rating") {
        setTimeout(completedMessageRemove, 1000);
    }
});

function addToOrderList(itemUuid, itemCategory) {
    if (document.getElementById('order').classList.contains('hide')) {
        document.getElementById('order').classList.remove('hide');
    }
    const menuItem = menuObj[itemCategory].filter( item => item.uuid === itemUuid)[0];
    if (!menuItem.isOrdered) {
        document.getElementById('order-list').innerHTML += `
        <div class="order-item" data-name="${menuItem.name}" data-category="${itemCategory}">
            <p class="bold-text">
                ${menuItem.name}
                <span class="remove-button">remove</span>
            </p>
            <p data-count="count">1</p>
            <p>* $${menuItem.price}</p>
            <p data-price="price">$${menuItem.price}</p>
        </div>
        `;
        menuItem.isOrdered = !menuItem.isOrdered;
    } else {
        const existedMenuItem = document.querySelector(`[data-name="${menuItem.name}"]`);
        existedMenuItem.querySelector('p[data-count="count"]').textContent = Number(existedMenuItem.querySelector('p[data-count="count"]').textContent.replace('x', '')) + 1;
        existedMenuItem.querySelector('p[data-price="price"]').textContent = '$'+(Number(existedMenuItem.querySelector('p[data-count="count"]').textContent) * menuItem.price).toFixed(2);
    }
    totalPriceCount();
}

function removeFromOrderList(node) {
    const elForRemove = node.parentElement.parentElement;
    menuObj[elForRemove.dataset.category].forEach( item => {
        if(item.name === elForRemove.dataset.name) {
            item.isOrdered = false;
        }
    });
    elForRemove.remove();
    totalPriceCount();
}

function totalPriceCount() {
    let totalPrice = Array.from(document.querySelectorAll('p[data-price="price"]')).reduce( (sum, item) => sum += Number(item.textContent.replace('$', '')), 0);
    if ( discount() ) {
        totalPrice -= totalPrice * 0.2;
        document.getElementById('discount').textContent = '$' + (totalPrice * 0.2).toFixed(2);
        document.getElementById('discount-container').classList.remove('hide');
    }
    document.getElementById('total-price').textContent = `$${totalPrice.toFixed(2)}`;
    if (document.querySelectorAll('.order-item').length === 0) {
        document.getElementById('order').classList.add('hide');
    }
}

function discount() {
    const orderItems = document.querySelectorAll('.order-item');
    let categories = [];
    orderItems.forEach(item => categories.push(item.dataset.category));
    if (categories.includes('beer') && 
        (categories.includes('pizza') || categories.includes('hamburger'))) {
        return true;
    }
    return false;
}

function paymentFormShow() {
    paymentForm.classList.remove('hide');
    paymentForm.scrollIntoView();
}

function completedMessageShow() {
    const paymentFormData = new FormData(paymentForm);
    mainEl.innerHTML += `
        <div class="completed-order">
            <p>Thanks, ${paymentFormData.get('user-name')}! Your order is on its way!</p>
        </div>
    `;
    const completedOrderEl = document.querySelector('.completed-order');
    completedOrderEl.append((document.getElementById('rating-component')).cloneNode(true));
    document.getElementById('rating-component').classList.remove('hide');
    cleanOrderList();
    cleanPaymentForm();
    completedOrderEl.scrollIntoView();   
}

function cleanPaymentForm() {
    paymentForm.classList.add('hide');
    document.querySelector('input[name="user-name"]').value = '';
    document.querySelector('input[name="card-number"]').value = '';
    document.querySelector('input[name="card-cvv"]').value = '';
}

function cleanOrderList() {
    document.getElementById('order').classList.add('hide');
    document.getElementById('discount').textContent = '';
    document.getElementById('discount-container').classList.add('hide');
    const orderItems = document.querySelectorAll('.order-item');
    orderItems.forEach(item => {
        menuObj[item.dataset.category].forEach(innerItem => {
            if (innerItem.name === item.dataset.name) {
                innerItem.isOrdered = false;
            }
        });
        item.remove();
    });
}

function completedMessageRemove() {
    document.querySelector('.completed-order').remove();
}