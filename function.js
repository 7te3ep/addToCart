function clearInputField(input){
    input.forEach((input)=>input.value = "")
}
function clearShoppingList (){
    front.shoppingList.innerHTML = ""
}
function showApp (show){
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
        remove(ref(database,`shoppingList/${id}`))
    })
}