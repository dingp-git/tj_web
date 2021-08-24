/*
左侧菜单栏
*/

function popUp() {
    newX = window.event.x + document.body.scrollLeft;
    newY = window.event.y + document.body.scrollTop;
    menu = document.all.menutable;
    if (menu.style.display == "") {
        menu.style.display = "none"
    }
    else {
        menu.style.display = "";
    }
    menu.style.pixelLeft = newX - 50;
    menu.style.pixelTop = newY - 50;
}