
const navMenu=document.getElementById('nav-menu');
const navLink=document.getElementById('nav-link');
const navCross=document.getElementById('nav-cross');

function showMenu(){
    navLink.style.right='0px';
}
function hideMenu(){
    navLink.style.right='-200px';
}
navMenu.addEventListener('click',showMenu);
navCross.addEventListener('click',hideMenu);

