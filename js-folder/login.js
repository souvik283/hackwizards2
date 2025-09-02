let reg_btn = document.getElementById("register_btn")
let form1 = document.getElementById("login_form")
let form2 = document.getElementById("reg_form")
let text = document.getElementById("reg_text")
reg_btn.addEventListener("click", ()=>{
    form1.classList.toggle("toggle")
    form2.classList.toggle("toggle")
    text.classList.toggle("shift")
})