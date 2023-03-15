const itemForm = document.getElementById('item-form')
const itemInput = document.getElementById('item-input')
const itemList = document.getElementById('item-list')
const clearBtn = document.getElementById('clear')
const itemFilter = document.getElementById('filter')
let isEditMode = false;
const formBtn = itemForm.querySelector('button')

function displayItems(){
    const itemsFromStorage = getItemFromStorage()
    itemsFromStorage.forEach((item) =>addItemToDOM(item))
    resetUI()
}

function onAddItemSubmit(e){
    e.preventDefault();
    const newItem = itemInput.value

    //validating input
    if(newItem === ''){
        alert('Please add an item')
        return;
    }
    
    //check for edit mode

    if(isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove()
        idEditMode = false;
    }else{
        if(checkIfItemExists(newItem)){
            alert('item already exists')
            return
        }
    }

    addItemToDOM(newItem)
    
    // add item to local storage
    addItemToStorage(newItem)

    resetUI()

    itemInput.value = ''
}

function addItemToDOM(item){
    //Create elements

    const li = document.createElement('li')
    li.appendChild(document.createTextNode(item))

    const button = createButton("remove-item btn-link text-red")
    li.appendChild(button)
    
    //Adding li to DOM
    itemList.appendChild(li)
    
}


function createButton(classes){
    const button = document.createElement('button')
    button.className = classes
    const icon = createIcon('fa-solid fa-xmark')
    button.appendChild(icon)
    return button
}

function createIcon(classes){
    const icon = document.createElement('i')
    icon.className = classes
    return icon
}

function addItemToStorage(item){

    const itemsFromStorage = getItemFromStorage(); // represnts array of items from local storage

    //to add new item to array
    itemsFromStorage.push(item)

    //Convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
    
}

function getItemFromStorage(){
    let itemsFromStorage; // represnts array of items from local storage

    //check to see if there are items already in local storage
    if (localStorage.getItem('items') === null){
        //if there is nothing stored at the start then store an empty array
        itemsFromStorage = []
    }else{
        itemsFromStorage = JSON.parse(localStorage.getItem('items'))
    }

    return itemsFromStorage
}

function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement)
    }else{
        setItemToEdit(e.target)
    }
}

function checkIfItemExists(item){
    const itemsFromStorage = getItemFromStorage();

    return itemsFromStorage.includes(item);
}

function setItemToEdit(item){
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((i)=> i.classList.remove('edit-mode'))

    item.classList.add('edit-mode')
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>Update Item'
    formBtn.style.backgroundColor = '#2e91fc'
    itemInput.value = item.textContent
}

//Remove Item

function removeItem(item){
    if(confirm('Are u sure to delete?')){
        //remove item from DOM
        item.remove()

        //remove item from storage
        removeItemFromStorage(item.textContent)

        resetUI()
    }
    
    
}

function removeItemFromStorage(item){
    let itemsFromStorage = getItemFromStorage()

    itemsFromStorage = itemsFromStorage.filter((i)=> i !== item)
    // so this will return all the elements except the one to be removed( which is i == item)

    //re-set to local storage
    localStorage.setItem('items',JSON.stringify(itemsFromStorage))

}

//Clear all 

function clearItems(e){
    itemList.innerHTML = ''
    resetUI()

    //Cleaf from localStorage
    localStorage.removeItem('ite ms')
}

//filter items

function filterItems(e){
    const items = itemList.querySelectorAll('li')
    const text = e.target.value.toLowerCase()

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase()
        if(itemName.indexOf(text) != -1){
            item.style.display = 'flex'
        }else{
            item.style.display = 'none'
        }
       
    })
}

// Reset UI

function resetUI(){
    itemInput.value = ''

    const items = itemList.querySelectorAll('li')
    
    if(items.length === 0){
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    }else{
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i>Add Item';
    formBtn.style.backgroundColor = '#333'
    
    isEditMode = false;
}


//Initialise App
function init(){
    //Event Listeners

itemForm.addEventListener('submit',onAddItemSubmit)
itemList.addEventListener('click',onClickItem)
clearBtn.addEventListener('click',clearItems)
itemFilter.addEventListener('input',filterItems)
document.addEventListener('DOMContentLoaded',displayItems)
resetUI() 
}

init()

