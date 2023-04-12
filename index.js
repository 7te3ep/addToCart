import { initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase , ref , push , onValue} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL:"https://playground-6e058-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListToDb = ref(database, "shoppingList")

const front = {
    inputField : document.getElementById("inputField"),
    addButton : document.getElementById("addButton"),
    shoppingList : document.getElementById("shoppingList")
}

const clearInputField = () => inputField.value = ""
const addItemToShoppingList = (value) => front.shoppingList.innerHTML += `<li>${value}</li>`
const clearShoppingList = ()=> {front.shoppingList.innerHTML = ""}

front.addButton.addEventListener("click",(e)=>{
    let inputValue = front.inputField.value
    clearInputField()
    if (inputValue.length == 0) return
    push(shoppingListToDb,inputValue)
})

onValue(shoppingListToDb,(snapshot)=>{
    let itemArray = snapshot.val() != null ? Object.values(snapshot.val()) : []
    if (itemArray.length == 0) return
    clearShoppingList()
    for (let i = 0; i< itemArray.length; i++){
        let currentItem = itemArray[i]
        addItemToShoppingList(currentItem)
    }
})