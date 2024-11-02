const essayButtonOne = document.querySelector("#essayButtonOne");
const essayButtonTwo = document.querySelector("#essayButtonTwo");
const essayOneContainer = document.querySelector("#essayOneContainer");
const essayTwoContainer = document.querySelector("#essayTwoContainer");
const aside = document.querySelector("#aside");
const main = document.querySelector("#main");

essayButtonOne.addEventListener("click", function(){
    essayOneContainer.style.maxHeight = "22rem";
    essayOneContainer.style.opacity = "1";
    essayOneContainer.style.overflow = "scroll";
    essayTwoContainer.style.maxHeight = "0rem";
    essayTwoContainer.style.opacity = "0";
    essayTwoContainer.style.overflow = "hidden";
    aside.style.opacity = "0";
    main.style.left = "20rem";
    essayButtonOne.style.width = "10rem";
    essayButtonTwo.style.width = "6rem";
})

essayButtonTwo.addEventListener("click", function(){
    essayTwoContainer.style.maxHeight = "22rem";
    essayTwoContainer.style.opacity = "1";
    essayTwoContainer.style.overflow = "scroll";
    essayOneContainer.style.maxHeight = "0rem";
    essayOneContainer.style.opacity = "0";
    essayOneContainer.style.overflow = "hidden";
    aside.style.opacity = "0";
    main.style.left = "20rem";
    essayButtonOne.style.width = "6rem";
    essayButtonTwo.style.width = "10rem";
})