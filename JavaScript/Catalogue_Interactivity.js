const Hovers = document.querySelectorAll(".product");
const Desc = document.querySelector("#desc");

Hovers.forEach(Hover => {
    Hover.addEventListener('mouseenter', function() {
        let Image = Hover.querySelector(".productImage");
        Image.classList.add("show");

        let deets = Hover.querySelector('.deets');
        deets.style.left = "30rem";
        Desc.style.opacity = "0";
        Hovers.forEach(otherHover => {
            if (otherHover !== Hover) {
                otherHover.style.width = "36rem";
            } else {
                otherHover.style.width = "68rem";
            }
        });
    });

    Hover.addEventListener('mouseleave', function() {
        let Image = Hover.querySelector(".productImage");
        Image.classList.remove("show");

        let deets = Hover.querySelector('.deets');
        deets.style.left = "0rem";
        Desc.style.opacity = "1";
        Hovers.forEach(otherHover => {
            otherHover.style.width = "36rem";
        });
    });
});
