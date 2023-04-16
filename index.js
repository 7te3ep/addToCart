import { initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase , ref , push , onValue , remove, get, off } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL:"https://playground-6e058-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
var user = {name:undefined}

const front = {
    accountTitle : document.getElementById("accountTitle"),
    usernameInput: document.getElementById("usernameInput"),
    passwordInput: document.getElementById("passwordInput"),
    loginButton: document.getElementById("loginButton"),
    addItemInput : document.getElementById("addItemInput"),
    addButton : document.getElementById("addButton"),
    shoppingList : document.getElementById("shoppingList"),
    logoutButton: document.getElementById("logoutButton")
}

// TOOLS
function clearInputField(input){
    input.forEach((input)=>input.value = "")
}

function clearShoppingList(){
    front.shoppingList.innerHTML = ""
}

function showLoader(show){
    document.querySelectorAll('.loader').forEach((item)=>{
        item.style.display = show ? "block":"none"
    })
}

function showApp (show,username){
    if (show){
        user.name = username
        onValue(ref(database, '/users/'+username+'/list/'),(snapshot)=>{
            clearShoppingList()
            if (!snapshot.exists()) return
            const itemsInDb = Object.entries(snapshot.val())
            for (let i = 0; i< itemsInDb.length; i++){
                let currentItem = itemsInDb[i]
                addItemToShoppingList(currentItem)
            }
        });
    }

    document.querySelectorAll('.login').forEach((item)=>{
        item.style.display = show ? "none":"flex"
    })
    document.querySelectorAll('.app').forEach((item)=>{
        item.style.display = show ? "flex":"none"
    })
}

function addItemToShoppingList (item) {
    const id = item[0]
    const content = item[1]

    let newEl = document.createElement('li')
    newEl.textContent = content
    front.shoppingList.append(newEl)

    newEl.addEventListener("click",()=>{
        remove(ref(database,`users/`+user.name+`/list/${id}`))
    })
}

function userLogin(username,password){
    return new Promise((resolve)=>{
        get(ref(database,"users/"+username)).then((snapshot) => {
            if (snapshot.exists() == false) resolve("Creating Account")
            else {
                const userData = Object.values(snapshot.val())
                if (userData[0] == password) resolve("Connecting")
                else resolve("Invalid Password")
            }
        })
    })
}

function createAccount(username,password){
    push(ref(database,`users/${username}`),password)
    showApp(true,username)
}

// EVENT

front.addButton.addEventListener("click",(e)=>{
    const inputValue = front.addItemInput.value
    if (inputValue.trim().length == 0) return
    push(ref(database,"users/"+user.name+"/list/"),inputValue)
    clearInputField([front.addItemInput])
})

front.loginButton.addEventListener("click",(e)=>{
    const username = front.usernameInput.value
    const password = front.passwordInput.value
    if (username.trim().length == 0 || password.trim().length == 0) return
    showLoader(true)
    userLogin(username,password).then((result)=>{
        showLoader(false)
        document.getElementById('loginOutput').innerHTML = result
        if (result == "Connecting") showApp(true,username)
        else if (result == "Creating Account") createAccount(username,password)
        clearInputField([usernameInput,passwordInput])
    })
})

// LOGOUT
front.logoutButton.addEventListener("click",(e)=>{
    off(ref(database,'users/'+user.name+'/list/'))
    user.name = undefined
    showApp(false)
})

showLoader(false)
showApp(false)

