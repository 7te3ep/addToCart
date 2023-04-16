import { initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase , ref , push , onValue , remove, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL:"https://playground-6e058-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListToDb = ref(database, "shoppingList")

const front = {
    accountTitle : document.getElementById("accountTitle"),
    usernameInput: document.getElementById("usernameInput"),
    passwordInput: document.getElementById("passwordInput"),
    loginButton: document.getElementById("loginButton"),
    inputField : document.getElementById("inputField"),
    addButton : document.getElementById("addButton"),
    shoppingList : document.getElementById("shoppingList")
}

var currentUser = undefined


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

const createUser = (username,password)=>{
    push(ref(database,`users/${username}`),password)
    accountTitle.innerHTML = username
    currentUser = username
}

async function loginUser(username,password){
    return await new Promise((resolve) => {
        get(ref(database,"users")).then((snapshot) => {
            var loginSuccessfully = false
            var userList = snapshot.val() != null ? Object.entries(snapshot.val()) : []
            const userExist = userList.find((user)=> user[0] == username )
            const correctPassword = userList.find((user)=> Object.values(user[1])[0] == password )
            if ( userExist == undefined){
                createUser(username,password)
                loginSuccessfully = true
            }else if (userExist && correctPassword ){
                accountTitle.innerHTML = username
                currentUser = username
                loginSuccessfully = true
            }
            resolve(loginSuccessfully);
        })
    });
}

const clearShoppingList = ()=> front.shoppingList.innerHTML = ""

front.addButton.addEventListener("click",(e)=>{
    console.log(currentUser);
    let inputValue = front.inputField.value
    clearInputField()
    if (inputValue.trim().length == 0) return
    push( ref(database, `users/${currentUser}/shoppingList`),inputValue)
})

front.loginButton.addEventListener("click",(e)=>{
    const username = front.usernameInput.value
    const password = front.passwordInput.value
    if (username.trim().length == 0 || password.trim().length == 0) return
    const loginResult = loginUser(username,password)
    if (loginResult) showApp(true)
})
var user = currentUser"/shoppingList"
onValue(ref(database, '/users/'+user+'/'),(snapshot)=>{
    console.log('onvalue');
    let itemArray = snapshot.val() != null ? Object.entries(snapshot.val()) : []
    clearShoppingList()
    for (let i = 0; i< itemArray.length; i++){
        let currentItem = itemArray[i]
        addItemToShoppingList(currentItem)
    }
})

showApp(false)


