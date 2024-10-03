const navPages = [
    {name: "Gallery" , href: '/Amro-s-Ecommerce-Website/Gallery/Gallery.html'},
    {name: "Catalogue", href: '/Amro-s-Ecommerce-Website/Catalogue/Catalogue.html'},
    {name: "Cart", href: '/Amro-s-Ecommerce-Website/Cart/Cart.html'},
    {name: "Essay", href: '/Amro-s-Ecommerce-Website/Course Work/Essay.html'},
    {name: "About Me", href: '/Amro-s-Ecommerce-Website/Course Work/About_Me.html'},
    {name: "Design", href: '/Amro-s-Ecommerce-Website/Course Work/Web Design.html'}
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