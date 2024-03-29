//Storage Controller
const StorageCtrl = (function(){

    return{
        storeItem: function(item){
            let items;
            //Check if any items in LS
            if(localStorage.getItem('items') === null){
                items = [];
                //Push new item
                items.push(item);
                //Set LS
                localStorage.setItem('items', JSON.stringify(items));
            }else {
                //Get what is in LS
                items = JSON.parse(localStorage.getItem('items'));
                //Push new item
                items.push(item);
                //Reset LS
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            }else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();
//Item Controller
const ItemCtrl = (function(){
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: function(){
            return data.items;
        },
        addItem: function(name, calories){
            //Create ID
            let ID;
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            }else {
                ID = 0;
            }
            //Calories to number
            calories = parseInt(calories);
            newItem = new Item(ID, name, calories);
            //Add to items array
            data.items.push(newItem);
            return newItem;
        },
        getItemById: function(id){
            let found = null;
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        updatedItem: function(name, calories){
            //Calories to number
            calories = parseInt(calories);
            let found = null;
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id){
            //Get the ids
            const ids = data.items.map(function(item){
                return item.id;
            });
            //Get index
            const index = ids.indexOf(id);
            //Remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function(){
            data.items = [];
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        getTotalCalories: function(){
            let total = 0;

            data.items.forEach(function(item){
                total += item.calories;
            });
            data.totalCalories = total;
            return data.totalCalories;
        },
        logData: function(){
            return data;
        }
    }
})();

//UI Controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backbtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }
    return {
        populateItemList: function(items){
            let html = '';
            items.forEach(function(item){
                html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                </li>
                `;
            });

            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories:document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item){
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //Create li element
            const li = document.createElement('li');
            //Add class
            li.className = 'collection-item';
            //Add id
            li.id = `item-${item.id}`;
            //Add Html
            li.innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            `;
            //Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            //Turn Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');
                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                    `;
                }
            });
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            //Turn Node List into array
            listItems = Array.from(listItems);
            listItems.forEach(function(item){
                item.remove();
            });
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
           document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backbtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backbtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function(){
            return UISelectors;
        }
    }

})();
//App Controller
const App = (function(ItemCtrl,StorageCtrl, UICtrl){
    const loadEventListeners = function(){
        const UISelectors = UICtrl.getSelectors();

        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)
        //Disable submit on enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode == 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        });
        //Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
        //Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
        //Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
        //Back button event
        document.querySelector(UISelectors.backbtn).addEventListener('click', UICtrl.clearEditState);
        //Clear items event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }

    const itemAddSubmit = function(e){
        const input = UICtrl.getItemInput();

        if(input.name !== '' && input.calories !== ''){
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            //Add items to the list
            UICtrl.addListItem(newItem);

            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);
            //Store in localStorage
            StorageCtrl.storeItem(newItem);
            //Clear Fields
            UICtrl.clearInput();
        }
        e.preventDefault();
    }
    //Click edit item 
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            //Get list item id
            const listId = e.target.parentNode.parentNode.id;
            //Break into an array
            const listIdArray = listId.split('-');
            //Get the actual id
            const id = parseInt(listIdArray[1]);
            //Get item
            const itemToEdit = ItemCtrl.getItemById(id);
            //Set current item
            ItemCtrl.setCurrentItem(itemToEdit);    
            //Add item to form
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }
    //Update item submit
    const itemUpdateSubmit = function(e){
        //Get item input
        const input = UICtrl.getItemInput();
        //Update item
        const updatedItem = ItemCtrl.updatedItem(input.name, input.calories);
        //Update UI
        UICtrl.updateListItem(updatedItem);
        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //Update LS
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();
        e.preventDefault();
    }
    //Delete button event
    const itemDeleteSubmit = function(e){
        //Get current item
        const currentItem = ItemCtrl.getCurrentItem();
        //Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        //Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        //Delete from LS
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();
        e.preventDefault();
    }
    //Clear items event
    const clearAllItemsClick = function(){
        //Delete all items from data structure
        ItemCtrl.clearAllItems();
        //Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);
        //Remove from UI
        UICtrl.removeItems();
        //Remove from LS
        StorageCtrl.clearItemFromStorage();
        //Hide ul
        UICtrl.hideList();
    }
    return {
        init: function(){
            //Clear edit state
            UICtrl.clearEditState();
            const items = ItemCtrl.getItems();

            if(items.length === 0){
                UICtrl.hideList();
            }else {
                UICtrl.populateItemList(items);
            }
            //Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            loadEventListeners();
        }
    }

})(ItemCtrl,StorageCtrl, UICtrl);

//Initialize App
App.init();