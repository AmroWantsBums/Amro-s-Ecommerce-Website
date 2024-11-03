const updatedWireframesButton = document.querySelector("#updatedWireframesButton");
const desktopWireframesButton = document.querySelector("#desktopWireframesButton");
const mobileWireframesButton = document.querySelector("#mobileWireframesButton");
const updatedWireframes = document.querySelector("#updatedWireframes");
const desktopWireframes = document.querySelector("#desktopWireframes");
const mobileWireframes = document.querySelector("#mobileWireframes");

updatedWireframesButton.addEventListener("click", function(){
    updatedWireframes.style.opacity = "1";
    desktopWireframes.style.opacity = "0";
    mobileWireframes.style.opacity = "0";
    updatedWireframes.style.zIndex = "1";
    desktopWireframes.style.zIndex = "0";
    mobileWireframes.style.zIndex = "0";
    updatedWireframesButton.style.width = "15rem";
    desktopWireframesButton.style.width = "10rem";
    mobileWireframesButton.style.width = "10rem";
})

desktopWireframesButton.addEventListener("click", function(){
    updatedWireframes.style.opacity = "0";
    desktopWireframes.style.opacity = "1";
    mobileWireframes.style.opacity = "0";
    updatedWireframes.style.zIndex = "0";
    desktopWireframes.style.zIndex = "1";
    mobileWireframes.style.zIndex = "0";
    updatedWireframesButton.style.width = "10rem";
    desktopWireframesButton.style.width = "15rem";
    mobileWireframesButton.style.width = "10rem";
})

mobileWireframesButton.addEventListener("click", function(){
    updatedWireframes.style.opacity = "0";
    desktopWireframes.style.opacity = "0";
    mobileWireframes.style.opacity = "1";
    updatedWireframes.style.zIndex = "0";
    desktopWireframes.style.zIndex = "0";
    mobileWireframes.style.zIndex = "1";
    updatedWireframesButton.style.width = "10rem";
    desktopWireframesButton.style.width = "10rem";
    mobileWireframesButton.style.width = "15rem";
})