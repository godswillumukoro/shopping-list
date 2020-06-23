const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

// Create an array to hold our state, call it items
let items = [];

function handleSubmit(e){
    e.preventDefault();
    const name = e.currentTarget.item.value;
    // if its empty don't submit it
    if (!name) return;
    const item = {
        name: name,
        id: Date.now(),
        complete: false,
    }

    // push the items into our state
    items.push(item);

    // clear the form
    e.target.reset();

    // creating a custom event
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

// we display the items on the page by looping with map() and then add the checkbox and the delete button
function displayItems() {
    const html = items.map(item => `<li class="shopping-item">
        
        <input value="${item.id}" type="checkbox" ${item.complete && 'checked'}>
        <span class="itemName">${item.name}</span>
        <button 
            aria-label="Remove ${item.name}"
            value = "${item.id}"
            style ="font-size: 2.7rem; background-color: #fff; color: red"
        >&times;</button>
        </li>`)
    .join('');
    list.innerHTML = html;
    
}

// Next, we want to save/mirror items to localStorage
function mirrorToLocalStorage(){
    localStorage.setItem('items', JSON.stringify(items));
}

// Pulling items from localStorage
function restoreFromLocalStorage() {
const lsItems = JSON.parse(localStorage.getItem('items'));
    if (lsItems.length){
        items.push(...lsItems);
        list.dispatchEvent(new CustomEvent('itemsUpdated'));
    }
}

function deleteItem(id){
    // console.log('DELETing item', id);
    // updating the items array without this one
    items = items.filter(item => item.id !== id);
    // console.log(items);
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
    
}

function markAsComplete(id){
    // console.log('Marking as complete', id);
    const itemRef = items.find(item => item.id === id);
    itemRef.complete = !itemRef.complete;
    list.dispatchEvent(new CustomEvent('itemsUpdated'));

}

shoppingForm.addEventListener('submit', handleSubmit);
// listening to the custom event
list.addEventListener('itemsUpdated', displayItems)
list.addEventListener('itemsUpdated', mirrorToLocalStorage)

// Event delegation: click on list delegated over to the button that was clicked
list.addEventListener('click', function(e){
    const id = parseInt(e.target.value);
    if (e.target.matches('button')) {
        deleteItem(id);
    }
    if (e.target.matches('input[type = "checkbox"]')){
        markAsComplete(id);
    }
});

restoreFromLocalStorage();
  