const navPages = [
    {name: "Gallary" , href: '/Amro-s-Ecommerce-Website/Gallary/Gallary.html'},
    {name: "Catalogue", href: '/Amro-s-Ecommerce-Website/Catalogue/Catalogue.html'},
    {name: "Cart", href: '/Amro-s-Ecommerce-Website/Cart/Cart.html'},
    
];

export function loadNavbar(CurrentPageName){
    const nav = document.querySelector("header > nav");
    const ul = document.createElement("ul");
    for(let page of navPages){
        const li = document.createElement("li");
        li.classList.add("navBarOption");
        if (CurrentPageName != page.name){
            const a = document.createElement("a");
            a.innerText = page.name;
            a.setAttribute("href", page.href);
            li.appendChild(a);            
        } 
        else{
            li.innerText = page.name;
            li.style.textDecoration = "underline";
        }
        ul.appendChild(li);        
    }
    nav.appendChild(ul);
}