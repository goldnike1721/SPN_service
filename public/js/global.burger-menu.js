const body = document.querySelector("body");
const header = document.querySelector(".header");
const btnSub = document.querySelector(".wrapper-menu");
const navLinks = document.querySelector(".header__nav-menu");

function toggleMenu() {
    body.classList.toggle("overflow-hidden");
    header.classList.toggle("nav-visible");
    btnSub.classList.toggle("open");
}

// btnSub.addEventListener("click", toggleMenu);
btnSub.addEventListener("click", (e) => {
    e.preventDefault();
    toggleMenu();
});

navLinks.addEventListener("click", () => {
    body.classList.remove("overflow-hidden");
    header.classList.remove("nav-visible");
    btnSub.classList.remove("open");
});



