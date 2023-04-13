import { initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase , ref , push , onValue , remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL:"https://playground-6e058-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListToDb = ref(database, "shoppingList")

const front = {
    usernameInput: document.getElementById("usernameInput"),
    passwordInput: document.getElementById("passwordInpu"),
    loginButton: document.getElementById("loginButton"),
    inputField : document.getElementById("inputField"),
    addButton : document.getElementById("addButton"),
    shoppingList : document.getElementById("shoppingList")
}

const clearInputField = () => inputField.value = ""

const showApp = (show)=>{
    document.querySelectorAll('.login').forEach((item)=>{
        item.style.display = show ? "none":"flex"
    })
    document.querySelectorAll('.app').forEach((item)=>{
        item.style.display = show ? "flex":"none"
    })
}

const addItemToShoppingList = (value) => {
    let newEl = document.createElement('li')
    newEl.textContent = value[1]
    front.shoppingList.append(newEl)
    newEl.addEventListener("click",()=>{
        remove(ref(database,`shoppingList/${value[0]}`))
    })
}
const clearShoppingList = ()=> front.shoppingList.innerHTML = ""

front.addButton.addEventListener("click",(e)=>{
    let inputValue = front.inputField.value
    clearInputField()
    if (inputValue.length == 0) return
    push(shoppingListToDb,inputValue)
})

front.loginButton.addEventListener("click",(e)=>{
    showApp(true)
})

onValue(shoppingListToDb,(snapshot)=>{
    let itemArray = snapshot.val() != null ? Object.entries(snapshot.val()) : []
    clearShoppingList()
    for (let i = 0; i< itemArray.length; i++){
        let currentItem = itemArray[i]
        addItemToShoppingList(currentItem)
    }
})

showApp(false)