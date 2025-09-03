let reg1_btn = document.getElementById("register_btn")
let reg2_btn = document.getElementById("register_btn2")
let form1 = document.getElementById("login_form")
let form2 = document.getElementById("reg_form")
let reg_text = document.getElementById("reg_text")
let log_text = document.getElementById("log_text")
let input = document.getElementsByClassName("input1")
let log_btn = document.getElementById("login_btn")

let error_txt = form1.firstElementChild.lastElementChild

console.log(error_txt)
reg1_btn.addEventListener("click", () => {
    form1.classList.toggle("toggle")
    form2.classList.toggle("toggle")
    reg_text.classList.toggle("shift1")
    log_text.classList.toggle("shift2")
})
reg2_btn.addEventListener("click", () => {
    form1.classList.toggle("toggle")
    form2.classList.toggle("toggle")
    reg_text.classList.toggle("shift1")
    log_text.classList.toggle("shift2")
})



log_btn.addEventListener("click", () => {
    if (input[0].value == "souvik" && input[1].value == "111") {
        window.location = "/html-folder/govt.html"
    } else if (input[0].value != "souvik") {
        error_txt.innerHTML = `**Enter a valid username`
    } else {
        error_txt.innerHTML = `**Enter a valid passsword`
    }
})