// Select all buttons and wireframe elements
const buttons = [
    { button: document.querySelector("#updatedWireframesButton"), frame: document.querySelector("#updatedWireframes") },
    { button: document.querySelector("#desktopWireframesButton"), frame: document.querySelector("#desktopWireframes") },
    { button: document.querySelector("#mobileWireframesButton"), frame: document.querySelector("#mobileWireframes") }
];

// Function to handle the button click and toggle the visibility of the wireframes
function handleButtonClick(selectedIndex) {
    buttons.forEach((item, index) => {
        // Reset opacity and zIndex for all wireframes and buttons
        item.frame.style.opacity = (index === selectedIndex) ? "1" : "0";
        item.frame.style.zIndex = (index === selectedIndex) ? "1" : "0";
        item.button.style.width = (index === selectedIndex) ? "15rem" : "10rem";
    });
}

// Attach event listeners to each button
buttons.forEach((item, index) => {
    item.button.addEventListener("click", () => handleButtonClick(index));
});
