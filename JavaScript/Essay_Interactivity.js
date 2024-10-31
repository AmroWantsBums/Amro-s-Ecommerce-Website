const essayButtonOne = document.querySelector("#essayButtonOne");
const essayButtonTwo = document.querySelector("#essayButtonTwo");
const essayOneContainer = document.querySelector("#essayOneContainer");
const essayTwoContainer = document.querySelector("#essayTwoContainer");

essayButtonOne.addEventListener("click", function(){
    essayOneContainer.style.maxHeight = "22rem";
    essayOneContainer.style.opacity = "1";
    essayOneContainer.style.overflow = "scroll";
    essayTwoContainer.style.maxHeight = "0rem";
    essayTwoContainer.style.opacity = "0";
    essayTwoContainer.style.overflow = "hidden";
})

essayButtonTwo.addEventListener("click", function(){
    essayTwoContainer.style.maxHeight = "22rem";
    essayTwoContainer.style.opacity = "1";
    essayTwoContainer.style.overflow = "scroll";
    essayOneContainer.style.maxHeight = "0rem";
    essayOneContainer.style.opacity = "0";
    essayOneContainer.style.overflow = "hidden";
})